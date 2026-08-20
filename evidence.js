/* evidence.js — 成果证据真实存储引擎
 * IndexedDB 存原图/视频 Blob + canvas 生成压缩缩略图
 * 无后端、无第三方库，全部本地完成
 */
var EvidenceDB=(function(){
  'use strict';

  var DB_NAME='pgos_evidence';
  var STORE='files';
  var DB_VER=1;
  var db=null;
  var urlCache={};   // id -> objectURL（查看时创建，复用）

  /* ---------- IndexedDB 基础 ---------- */
  function open(){
    if(db) return Promise.resolve(db);
    return new Promise(function(resolve,reject){
      if(!('indexedDB' in window)) return reject(new Error('浏览器不支持 IndexedDB'));
      var req=indexedDB.open(DB_NAME,DB_VER);
      req.onupgradeneeded=function(e){
        var d=e.target.result;
        if(!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE,{keyPath:'id'});
      };
      req.onsuccess=function(e){ db=e.target.result; resolve(db); };
      req.onerror=function(){ reject(req.error||new Error('IndexedDB 打开失败')); };
    });
  }

  function withStore(mode,fn){
    return open().then(function(d){
      return new Promise(function(resolve,reject){
        var t=d.transaction(STORE,mode);
        var store=t.objectStore(STORE);
        var result;
        try{ result=fn(store); }catch(e){ reject(e); return; }
        t.oncomplete=function(){ resolve(result&&result._pgosVal!==undefined?result._pgosVal:result); };
        t.onerror=function(){ reject(t.error); };
        t.onabort=function(){ reject(t.error||new Error('事务中止')); };
      });
    });
  }

  function wrapReq(req){
    req._pgosVal=null;
    req.onsuccess=function(){ req._pgosVal=req.result; };
    return req;
  }

  function put(rec){
    return withStore('readwrite',function(s){ wrapReq(s.put(rec)); });
  }
  function get(id){
    return open().then(function(d){
      return new Promise(function(resolve,reject){
        var t=d.transaction(STORE,'readonly');
        var r=t.objectStore(STORE).get(id);
        r.onsuccess=function(){ resolve(r.result||null); };
        r.onerror=function(){ reject(r.error); };
      });
    });
  }
  function del(id){
    return withStore('readwrite',function(s){ wrapReq(s.delete(id)); })
      .then(function(){ if(urlCache[id]){ try{ URL.revokeObjectURL(urlCache[id]); }catch(e){} delete urlCache[id]; } });
  }
  function list(){
    return open().then(function(d){
      return new Promise(function(resolve,reject){
        var t=d.transaction(STORE,'readonly');
        var r=t.objectStore(STORE).getAll();
        r.onsuccess=function(){ resolve(r.result||[]); };
        r.onerror=function(){ reject(r.error); };
      });
    });
  }
  function clearAll(){
    return withStore('readwrite',function(s){ wrapReq(s.clear()); });
  }

  /* ---------- 图片压缩 ---------- */
  /* 最长边 maxSide，质量递降直到 < targetKB 或到达下限 */
  function compressImage(file,maxSide,quality,targetKB){
    targetKB=targetKB||300;
    return new Promise(function(resolve,reject){
      var url=URL.createObjectURL(file);
      var img=new Image();
      img.onload=function(){
        try{
          var w=img.naturalWidth,h=img.naturalHeight;
          if(!w||!h){ URL.revokeObjectURL(url); return reject(new Error('图片尺寸无效')); }
          var side=Math.max(w,h);
          var scale=side>maxSide?maxSide/side:1;
          var cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));
          var c=document.createElement('canvas');
          c.width=cw; c.height=ch;
          c.getContext('2d').drawImage(img,0,0,cw,ch);
          URL.revokeObjectURL(url);
          c.toBlob(function(blob){
            if(!blob) return reject(new Error('图片处理失败'));
            if(blob.size>targetKB*1024&&(quality>0.5||maxSide>800)){
              // 仍偏大：降一档继续压
              compressImage(file,Math.round(maxSide*0.8/100)*100,Math.max(0.45,quality-0.12),targetKB)
                .then(resolve).catch(reject);
            }else{
              resolve(blob);
            }
          },'image/jpeg',quality);
        }catch(e){ reject(e); }
      };
      img.onerror=function(){ URL.revokeObjectURL(url); reject(new Error('图片无法读取')); };
      img.src=url;
    });
  }

  /* 缩略图 dataURL（小图，存 localStorage 供列表渲染） */
  function makeThumb(source,maxSide){
    return new Promise(function(resolve){
      var resolveNull=function(){ resolve(null); };
      try{
        var url=(source instanceof Blob)?URL.createObjectURL(source):source;
        var isVideo=(source instanceof Blob)&&(source.type||'').indexOf('video')===0;
        var el=isVideo?document.createElement('video'):new Image();
        if(isVideo){
          el.muted=true; el.playsInline=true;
          el.onloadeddata=function(){ try{ el.currentTime=Math.min(0.5,(el.duration||1)/4); }catch(e){} };
          el.onseeked=draw;
          el.onerror=resolveNull;
        }else{
          el.onload=draw;
          el.onerror=resolveNull;
        }
        function draw(){
          try{
            var w=isVideo?el.videoWidth:el.naturalWidth;
            var h=isVideo?el.videoHeight:el.naturalHeight;
            if(!w||!h) return resolveNull();
            var side=Math.max(w,h);
            var scale=side>maxSide?maxSide/side:1;
            var c=document.createElement('canvas');
            c.width=Math.max(1,Math.round(w*scale));
            c.height=Math.max(1,Math.round(h*scale));
            c.getContext('2d').drawImage(el,0,0,c.width,c.height);
            if(source instanceof Blob) URL.revokeObjectURL(url);
            resolve(c.toDataURL('image/jpeg',0.72));
          }catch(e){ resolveNull(); }
        }
        el.src=url;
      }catch(e){ resolveNull(); }
    });
  }

  /* ---------- 对外：保存上传的成果文件 ---------- */
  /* meta: {id, courseId, step, module, title, date, kind}
   * 返回 Promise<{thumb, size, mime}> */
  function saveEvidence(file,meta){
    var mime=file.type||'';
    var isImg=mime.indexOf('image')===0;
    var isVideo=mime.indexOf('video')===0;
    var MAX_VIDEO=200*1024*1024;

    var p;
    if(isImg){
      p=compressImage(file,1600,0.82,300);
    }else if(isVideo){
      if(file.size>MAX_VIDEO){
        return Promise.reject(new Error('视频过大（'+Math.round(file.size/1024/1024)+'MB），请录制不超过 200MB 的短片'));
      }
      p=Promise.resolve(file);
    }else{
      return Promise.reject(new Error('不支持的文件类型：'+(mime||'未知')));
    }

    return p.then(function(blob){
      return makeThumb(blob,240).then(function(thumb){
        var rec={
          id:meta.id,
          courseId:meta.courseId,
          step:meta.step,
          module:meta.module,
          title:meta.title,
          date:meta.date,
          kind:isVideo?'video':'image',
          mime:blob.type,
          size:blob.size,
          ts:Date.now(),
          thumb:thumb,
          blob:blob
        };
        return put(rec).then(function(){ return {thumb:thumb,size:blob.size,mime:blob.type}; });
      });
    });
  }

  /* ---------- 查看器 ---------- */
  function getUrl(id){
    if(urlCache[id]) return urlCache[id];
    return get(id).then(function(rec){
      if(!rec||!rec.blob) return null;
      urlCache[id]=URL.createObjectURL(rec.blob);
      return urlCache[id];
    });
  }

  function ensureViewerDom(){
    var v=document.getElementById('ev-viewer');
    if(v) return v;
    v=document.createElement('div');
    v.id='ev-viewer';
    v.className='ev-viewer';
    document.body.appendChild(v);
    return v;
  }

  /* 显示成果：id 存在则展示原图/视频，否则展示 meta 信息 */
  function showViewer(id,meta){
    var v=ensureViewerDom();
    v.innerHTML=
      '<div class="evv-backdrop" data-evv="close"></div>'+
      '<div class="evv-body">'+
        '<div class="evv-head">'+
          '<div class="evv-title">'+esc(meta?meta.title:'成果')+'</div>'+
          '<button class="evv-close" data-evv="close">✕</button>'+
        '</div>'+
        '<div class="evv-media" id="evv-media">加载中…</div>'+
        '<div class="evv-meta">'+
          '<span>'+(meta?esc(meta.date):'')+'</span>'+
          (meta&&meta.size?('<span>'+Math.round(meta.size/1024)+'KB</span>'):'')+
        '</div>'+
        '<button class="evv-save" data-evv="save">保存原片</button>'+
        '<button class="evv-delete" data-evv="delete">删除此成果</button>'+
      '</div>';

    function close(){ v.classList.remove('active'); v.innerHTML=''; }
    v._close=close;

    v.onclick=function(e){
      var t=e.target.closest('[data-evv]');
      if(!t) return;
      var act=t.dataset.evv;
      if(act==='close') close();
      if(act==='save'){
        saveOriginal(id,meta).catch(function(){ alert('原片不在本机（可能来自旧数据或导入的缩略图记录），无法保存'); });
      }
      if(act==='delete'){
        if(!confirm('确定删除这个成果吗？删除后该课程步骤需重新上传。')) return;
        del(id).then(function(){
          // 同步清理 state（由 app.js 提供回调钩子）
          if(typeof window.onEvidenceDeleted==='function') window.onEvidenceDeleted(id,meta);
          close();
        }).catch(function(){ alert('删除失败，请重试'); });
      }
    };

    v.classList.add('active');

    get(id).then(function(rec){
      var media=document.getElementById('evv-media');
      if(!media) return;
      if(!rec||!rec.blob){
        media.innerHTML='<div class="evv-empty">原图已不在本机（可能来自导入的备份或旧数据）<br>仅保留缩略图记录</div>';
        return;
      }
      var url=getUrl(id).then(function(u){
        if(!media.isConnected) return;
        var isV=rec.mime&&rec.mime.indexOf('video')===0;
        media.innerHTML=isV
          ?'<video controls playsinline src="'+u+'"></video>'
          :'<img src="'+u+'" alt="成果图片">';
      });
    }).catch(function(){
      var media=document.getElementById('evv-media');
      if(media) media.innerHTML='<div class="evv-empty">加载失败</div>';
    });
  }

  /* ---------- 备份：Blob ↔ base64 ---------- */
  function blobToDataURL(blob){
    return new Promise(function(resolve,reject){
      var fr=new FileReader();
      fr.onload=function(){ resolve(fr.result); };
      fr.onerror=function(){ reject(fr.error||new Error('读取失败')); };
      fr.readAsDataURL(blob);
    });
  }
  function dataURLtoBlob(dataURL){
    try{
      var p=String(dataURL||'').split(',');
      var mime=(p[0].match(/data:([^;]+)/)||[])[1]||'application/octet-stream';
      var bin=atob(p[1]||'');
      var arr=new Uint8Array(bin.length);
      for(var i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
      return new Blob([arr],{type:mime});
    }catch(e){ return null; }
  }

  /* 导出全部图片原片（视频过大不打包，可在查看器单独保存原片）
   * 返回 [{id,courseId,step,module,title,date,kind,mime,size,ts,data}] */
  function exportImages(maxEachKB,totalKB){
    maxEachKB=maxEachKB||8*1024;
    totalKB=totalKB||30*1024;
    return list().then(function(recs){
      var used=0;
      var picked=recs.filter(function(rec){
        if(!rec||!rec.blob) return false;
        if((rec.mime||'').indexOf('video')===0) return false;   // 视频不打包
        if(rec.size>maxEachKB*1024) return false;
        if(used+rec.size>totalKB*1024) return false;
        used+=rec.size;
        return true;
      }).sort(function(a,b){ return (b.ts||0)-(a.ts||0); });    // 新的优先
      return Promise.all(picked.map(function(rec){
        return blobToDataURL(rec.blob).then(function(data){
          return {id:rec.id,courseId:rec.courseId,step:rec.step,module:rec.module,
            title:rec.title,date:rec.date,kind:'image',mime:rec.mime,size:rec.size,ts:rec.ts,data:data};
        });
      }));
    });
  }

  /* 导入备份：回填原片到 IndexedDB（同 id 覆盖；缩略图重新生成） */
  function restoreFiles(files){
    files=(files||[]).filter(function(f){ return f&&f.id&&f.data; });
    return Promise.all(files.map(function(f){
      var blob=dataURLtoBlob(f.data);
      if(!blob) return Promise.resolve();
      return makeThumb(blob,240).then(function(thumb){
        return put({id:f.id,courseId:f.courseId,step:f.step,module:f.module,title:f.title,
          date:f.date,kind:f.kind||'image',mime:blob.type,size:blob.size,
          ts:f.ts||Date.now(),thumb:thumb,blob:blob});
      }).catch(function(){ return; });
    }));
  }

  /* 保存原片到本地（相册 / 文件 App） */
  function saveOriginal(id,meta){
    return get(id).then(function(rec){
      if(!rec||!rec.blob) return Promise.reject(new Error('原片不在本机'));
      var url=URL.createObjectURL(rec.blob);
      var a=document.createElement('a');
      var ext=((rec.mime||'').split('/')[1]||'bin').split(';')[0];
      var base=(meta&&meta.title?meta.title:'growth-evidence').replace(/[\\/:*?"<>|]/g,'');
      a.href=url;
      a.download=base+'-'+id+'.'+ext;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} },2000);
      return true;
    });
  }

  return {
    saveEvidence:saveEvidence,
    get:get,
    del:del,
    list:list,
    clearAll:clearAll,
    getUrl:getUrl,
    showViewer:showViewer,
    compressImage:compressImage,
    exportImages:exportImages,
    restoreFiles:restoreFiles,
    saveOriginal:saveOriginal
  };

  function esc(s){
    return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
})();
