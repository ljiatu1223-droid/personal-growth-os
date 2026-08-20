/* app2.js — v1.2 覆盖补丁（P0/P1 修复）
 * 在 app.js 之后加载：重定义本轮修复涉及的函数 + 捕获阶段接管事件分发
 * 内容与本地 v1.2 源码对应函数逐字节一致（由构建脚本抽取）
 */
try{ ICONS.plus='<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>'; }catch(e){}

/* P0-1 存储超限降级 + 轻提示 */
function saveState(){
  try{
    localStorage.setItem('pgos_state',JSON.stringify(state));
  }catch(e){
    /* 存储超限降级：先只保留最近 40 条缩略图 → 再全部剥离（原片在 IndexedDB，不受影响） */
    if(trimThumbs(40)||trimThumbs(0)){
      try{ localStorage.setItem('pgos_state',JSON.stringify(state)); return; }catch(e2){}
    }
    var now=Date.now();
    if(now-(saveState._warn||0)>60000){
      saveState._warn=now;
      toast('本机存储空间不足，最新修改可能没有保存。建议：我的 → 导出数据备份，并删除部分旧成果。');
    }
  }
}

function trimThumbs(keep){
  var changed=false;
  if(!state.evidence||!state.evidence.length) return false;
  for(var i=state.evidence.length-1;i>=0;i--){
    var ev=state.evidence[i];
    if(ev.thumb&&state.evidence.length-1-i>=keep){ ev.thumb=null; changed=true; }
  }
  return changed;
}

/* 轻提示（不打断操作） */
var _toastTimer=null;
function toast(msg){
  var t=document.getElementById('app-toast');
  if(!t){
    t=document.createElement('div');
    t.id='app-toast';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.classList.add('show');
  if(_toastTimer) clearTimeout(_toastTimer);
  _toastTimer=setTimeout(function(){ t.classList.remove('show'); },5000);
}

/* P0-2 完整备份（含图片原片）与导入回填 */
function renderProfile(){
  var html='';
  var p=state.profile;

  var initial=p.name?p.name.charAt(0):'?';
  html+='<div class="profile-header">';
  html+='<div class="profile-avatar">'+esc(initial)+'</div>';
  html+='<div class="profile-name">'+esc(p.name)+'</div>';
  html+='<div class="profile-sub">'+p.height+'cm · '+p.weight+'kg → '+p.targetWeight+'kg · '+esc(p.fitnessGoal)+'</div>';
  html+='</div>';

  // 目标设定
  html+='<div class="section-title">目标设定</div>';
  html+='<div class="settings-group">';
  html+='<div class="settings-item" data-action="edit-profile" data-field="height">';
  html+='<div class="si-icon">'+ic('target')+'</div>';
  html+='<div class="si-label">身高</div><div class="si-value">'+p.height+' cm</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='<div class="settings-item" data-action="edit-profile" data-field="weight">';
  html+='<div class="si-icon">'+ic('trending-up')+'</div>';
  html+='<div class="si-label">当前体重</div><div class="si-value">'+p.weight+' kg</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='<div class="settings-item" data-action="edit-profile" data-field="targetWeight">';
  html+='<div class="si-icon">'+ic('target')+'</div>';
  html+='<div class="si-label">目标体重</div><div class="si-value">'+p.targetWeight+' kg</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='</div>';

  // 作息时间（固定框架，来自 ROUTINE）
  html+='<div class="section-title">作息时间</div>';
  html+='<div class="settings-group">';
  html+='<div class="settings-item"><div class="si-icon">'+ic('sun')+'</div><div class="si-label">工作日</div><div class="si-value">07:30 起床 · 08:30-18:00 工作</div></div>';
  html+='<div class="settings-item"><div class="si-icon">'+ic('moon')+'</div><div class="si-label">入睡</div><div class="si-value">00:00</div></div>';
  html+='<div class="settings-item"><div class="si-icon">'+ic('clock')+'</div><div class="si-label">周末</div><div class="si-value">08:30 起床 · 无固定工作</div></div>';
  html+='</div>';

  // 成长模块
  html+='<div class="section-title">成长模块</div>';
  html+='<div class="settings-group">';
  ['fitness','film','cooking','violin'].forEach(function(mod){
    var m=MODULES[mod];
    var enabled=p.modules[mod];
    html+='<div class="settings-item toggle" data-action="toggle-module" data-module="'+mod+'">';
    html+='<div class="si-icon"><span class="module-color mc-'+mod+'"></span></div>';
    html+='<div class="si-label">'+esc(m.name)+'</div>';
    html+='<div class="si-switch '+(enabled?'on':'')+'"></div>';
    html+='</div>';
  });
  html+='</div>';

  // 提醒设置
  html+='<div class="section-title">提醒设置</div>';
  html+='<div class="settings-group">';
  var rem=state.settings.reminders;
  var permStatus=Reminders.permission();
  if(!Reminders.supported()){
    html+='<div class="settings-note">'+ic('alert-triangle','icon-sm')+' 当前浏览器不支持系统通知，提醒功能不可用</div>';
  }else if(permStatus==='denied'){
    html+='<div class="settings-note warn">'+ic('alert-triangle','icon-sm')+' 通知权限已被拒绝。请到浏览器「设置 → 通知」允许本站通知，提醒才能生效</div>';
  }else if(permStatus==='default'){
    html+='<div class="settings-note">'+ic('bell','icon-sm')+' 打开任一提醒开关时会申请通知权限</div>';
  }
  html+='<div class="settings-item toggle" data-action="toggle-reminder" data-key="daily">';
  html+='<div class="si-icon">'+ic('bell')+'</div><div class="si-label">每日提醒</div>';
  html+='<input type="time" class="si-time" value="'+esc(rem.dailyTime||'09:00')+'" data-rem-time="dailyTime" onclick="event.stopPropagation()" onchange="setReminderTime(this.dataset.remTime,this.value)">';
  html+='<div class="si-switch '+(rem.daily?'on':'')+'"></div></div>';
  html+='<div class="settings-item toggle" data-action="toggle-reminder" data-key="taskStart">';
  html+='<div class="si-icon">'+ic('clock')+'</div><div class="si-label">任务开始提醒</div>';
  html+='<div class="si-switch '+(rem.taskStart?'on':'')+'"></div></div>';
  html+='<div class="settings-item toggle" data-action="toggle-reminder" data-key="weeklyReview">';
  html+='<div class="si-icon">'+ic('chart-column')+'</div><div class="si-label">周复盘提醒</div>';
  html+='<input type="time" class="si-time" value="'+esc(rem.weeklyTime||'20:00')+'" data-rem-time="weeklyTime" onclick="event.stopPropagation()" onchange="setReminderTime(this.dataset.remTime,this.value)">';
  html+='<div class="si-switch '+(rem.weeklyReview?'on':'')+'"></div></div>';
  html+='<div class="settings-item toggle" data-action="toggle-reminder" data-key="sleep">';
  html+='<div class="si-icon">'+ic('moon')+'</div><div class="si-label">入睡提醒</div>';
  html+='<input type="time" class="si-time" value="'+esc(rem.sleepTime||'23:00')+'" data-rem-time="sleepTime" onclick="event.stopPropagation()" onchange="setReminderTime(this.dataset.remTime,this.value)">';
  html+='<div class="si-switch '+(rem.sleep?'on':'')+'"></div></div>';
  html+='</div>';
  html+='<div class="settings-note" style="margin:8px 16px 0">'+ic('info','icon-sm')+' 本地提醒：应用运行时到点弹出通知（本工具无服务器，不支持息屏推送）。建议安装到主屏幕日常常驻</div>';

  // 外观
  html+='<div class="section-title">外观</div>';
  html+='<div class="settings-group">';
  var theme=state.settings.theme||'system';
  var themes=[['light','浅色模式','sun'],['dark','深色模式','moon'],['system','跟随系统','palette']];
  themes.forEach(function(t){
    html+='<div class="settings-item" data-action="set-theme" data-theme="'+t[0]+'">';
    html+='<div class="si-icon">'+ic(t[2])+'</div>';
    html+='<div class="si-label">'+t[1]+'</div>';
    if(theme===t[0]) html+='<div class="si-value" style="color:var(--c-primary)">'+ic('check','icon-sm')+'</div>';
    html+='</div>';
  });
  html+='</div>';

  // 数据管理
  html+='<div class="section-title">数据管理</div>';
  html+='<div class="settings-group">';
  html+='<div class="settings-item" data-action="export-data">';
  html+='<div class="si-icon">'+ic('download')+'</div>';
  html+='<div class="si-label">导出完整备份（含图片原片）</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='<div class="settings-item" data-action="import-data">';
  html+='<div class="si-icon">'+ic('upload')+'</div>';
  html+='<div class="si-label">导入数据</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='<div class="settings-item" data-action="reset-data">';
  html+='<div class="si-icon" style="color:var(--c-danger)">'+ic('trash-2')+'</div>';
  html+='<div class="si-label" style="color:var(--c-danger)">重置所有数据</div>';
  html+='<div class="si-arrow">'+ic('chevron-right','icon-sm')+'</div></div>';
  html+='</div>';
  html+='<input type="file" id="import-file" accept="application/json" class="hidden">';

  html+='<div style="text-align:center;padding:20px;color:var(--c-text-tert);font-size:12px">个人成长操作系统 V'+esc(state.version||'0.1')+'</div>';

  document.getElementById('page-profile').innerHTML=html;
}

function importData(){
  var input=document.getElementById('import-file');
  if(!input) return;
  input.onchange=function(){
    var file=input.files[0];
    if(!file) return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var data=JSON.parse(reader.result);
        if(data&&data.tasks&&data.courseProgress&&data.profile){
          var files=data.evidenceFiles||[];
          delete data.evidenceFiles;
          delete data.pgosFullBackup;
          delete data.exportedAt;
          state=data;
          saveState();
          applyTheme();
          if(files.length&&typeof EvidenceDB!=='undefined'){
            toast('正在回填 '+files.length+' 张原片…');
            EvidenceDB.restoreFiles(files).then(function(){
              toast('导入成功（含 '+files.length+' 张原片）');
              navigate('today');
            });
          }else{
            toast('导入成功');
            navigate('today');
          }
        }else{
          alert('文件格式不正确：缺少必要字段');
        }
      }catch(e){ alert('导入失败：'+e.message); }
    };
    reader.readAsText(file);
  };
  input.click();
}

function exportData(){
  toast('正在打包备份…');
  var prep=(typeof EvidenceDB!=='undefined')
    ?EvidenceDB.exportImages().catch(function(){ return []; })
    :Promise.resolve([]);
  prep.then(function(files){
    var payload=JSON.parse(JSON.stringify(state));
    payload.pgosFullBackup=true;
    payload.exportedAt=new Date().toISOString();
    payload.evidenceFiles=files;
    var blob=new Blob([JSON.stringify(payload)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;
    a.download='personal-growth-backup-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} },3000);
    toast(files.length
      ?('备份完成：含 '+files.length+' 张图片原片（视频请在查看器里单独"保存原片"）')
      :'备份完成（暂无图片原片）');
  });
}

/* P1-2 多文件上传：步骤内成果网格渲染 */
function renderComponent(comp,stepIdx,compIdx){
  var html='';
  switch(comp.type){

    case 'teaching':
      html+='<div class="comp comp-teaching">';
      if(comp.title) html+='<h3>'+esc(comp.title)+'</h3>';
      html+='<p>'+esc(comp.text)+'</p>';
      if(comp.tip) html+='<div class="tip">'+ic('zap','icon-sm')+' '+esc(comp.tip)+'</div>';
      html+='</div>';
      break;

    case 'checklist':
      html+='<div class="comp"><div class="comp-checklist">';
      var cp=state.courseProgress[currentCourse];
      var sd=cp.stepData[stepIdx]||{};
      var checks=sd.checklist||{};
      (comp.items||[]).forEach(function(item,i){
        var txt=typeof item==='string'?item:item.text;
        var req=typeof item==='string'?true:(item.required!==false);
        var done=checks[i];
        html+='<div class="checklist-item '+(done?'done':'')+'" data-action="toggle-check" data-step="'+stepIdx+'" data-item="'+i+'">';
        html+='<div class="ci-check">'+(done?svgIcon('check'):'')+'</div>';
        html+='<div class="ci-text">'+esc(txt)+(req?'':'（选做）')+'</div>';
        html+='</div>';
      });
      html+='</div></div>';
      break;

    case 'record':
      html+='<div class="comp">';
      if(comp.label) html+='<div class="card-title" style="margin-bottom:12px">'+esc(comp.label)+'</div>';
      var cp2=state.courseProgress[currentCourse];
      var sd2=cp2.stepData[stepIdx]||{};
      var recData=sd2.record||{};
      (comp.fields||[]).forEach(function(f){
        var val=recData[f.key]!==undefined&&recData[f.key]!==null&&recData[f.key]!==''?recData[f.key]:(f.def!==undefined?f.def:'');
        var labelText=f.label+(f.unit?'（'+f.unit+'）':'');
        html+='<div class="record-field">';
        html+='<label>'+esc(labelText)+'</label>';

        if(f.type==='rating'){
          html+='<div class="rating-stars" id="rating_'+f.key+'">';
          for(var r=1;r<=5;r++){
            html+='<button class="'+(r<=val?'active':'')+'" data-action="set-rating" data-key="'+esc(f.key)+'" data-val="'+r+'" data-step="'+stepIdx+'">'+svgIcon('star')+'</button>';
          }
          html+='</div>';
          if(f.hint) html+='<div class="rating-hint">'+esc(f.hint)+'</div>';

        }else if(f.type==='textarea'){
          html+='<textarea placeholder="'+esc(f.label)+'" onchange="setRecordField(\''+f.key+'\',this.value,'+stepIdx+')">'+esc(val)+'</textarea>';

        }else if(f.type==='select'){
          html+='<select onchange="setRecordField(\''+f.key+'\',this.value,'+stepIdx+')">';
          var hasVal=(f.options||[]).indexOf(val)>=0;
          if(!hasVal) html+='<option value="">请选择</option>';
          (f.options||[]).forEach(function(opt){
            html+='<option value="'+esc(opt)+'" '+(opt===val?'selected':'')+'>'+esc(opt)+'</option>';
          });
          html+='</select>';

        }else{
          html+='<input type="'+esc(f.type==='number'?'number':'text')+'" value="'+esc(val)+'" placeholder="'+esc(f.label)+'" onchange="setRecordField(\''+f.key+'\',this.value,'+stepIdx+')">';
        }

        // 沿用上次（02文档 §11.2）
        if(f.useLast&&val===''){
          var last=state.lastValues[f.useLast];
          if(last!==undefined&&last!==null&&last!==''){
            html+='<button class="use-last-btn" data-action="use-last" data-key="'+esc(f.key)+'" data-step="'+stepIdx+'" data-use="'+esc(f.useLast)+'">'+ic('rotate-ccw','icon-sm')+' 沿用上次：'+last+f.unit+'</button>';
          }
        }
        html+='</div>';
      });
      html+='</div>';
      break;

    case 'timer':
      var timerVal=comp.seconds||0;
      html+='<div class="comp comp-timer">';
      html+='<div style="font-size:14px;color:var(--c-text-sub)">'+esc(comp.label||'计时器')+'</div>';
      html+='<div class="timer-display" id="timer-display">'+formatTime(timerVal)+'</div>';
      html+='<div class="timer-controls">';
      html+='<button class="btn-timer-start" id="timer-start" onclick="startTimerBtn()">'+ic('play','icon-sm')+' 开始</button>';
      html+='<button class="btn-timer-pause hidden" id="timer-pause" onclick="pauseTimer()">'+ic('pause','icon-sm')+' 暂停</button>';
      html+='<button class="btn-timer-reset" onclick="resetTimerBtn()">'+ic('rotate-ccw','icon-sm')+' 重置</button>';
      html+='</div>';
      html+='</div>';
      break;

    case 'evidence':
      var cpE=state.courseProgress[currentCourse];
      var sdE=cpE.stepData[stepIdx]||{};
      var evList=state.evidence.filter(function(ev){ return ev.courseId===currentCourse&&ev.step===stepIdx; });
      html+='<div class="comp">';
      if(comp.label) html+='<div class="card-title" style="margin-bottom:8px">'+esc(comp.label)+'</div>';
      if(sdE.evidence){
        /* 链接型：单条展示 */
        if(sdE.linkValue){
          html+='<div class="evidence-uploaded" data-action="view-evidence" data-id="'+esc(evRecordId(currentCourse,stepIdx))+'">';
          html+='<div class="evu-row">'+ic('link','icon-sm')+'<span class="evu-link">'+esc(sdE.linkValue)+'</span></div>';
          html+='<div class="evu-hint">点击查看 / 删除</div>';
          html+='</div>';
        }
        /* 文件型：多缩略图网格 + 追加 */
        if(evList.length){
          html+='<div class="ev-thumbs">';
          evList.forEach(function(ev){
            var vid=ev.id||evRecordId(currentCourse,stepIdx);
            html+='<div class="ev-th" data-action="view-evidence" data-id="'+esc(vid)+'">';
            if(ev.thumb){
              html+='<img src="'+ev.thumb+'" alt="'+esc(ev.title||'成果')+'">';
            }else{
              html+='<div class="ev-th-ph">'+ic(ev.kind==='video'?'video':'camera','icon-sm')+'</div>';
            }
            if(ev.kind==='video') html+='<div class="ev-th-play">'+ic('play','icon-xs')+'</div>';
            html+='</div>';
          });
          if(evList.length<9){
            html+='<div class="ev-th ev-th-add" data-action="upload-evidence" data-step="'+stepIdx+'">';
            html+=ic('plus','icon-sm')+'<span>追加</span>';
            html+='</div>';
          }
          html+='</div>';
          html+='<div class="evu-hint">点击缩略图查看 / 删除 · 可追加多张</div>';
        }
        /* 异常兜底：标记已上传但记录丢失 → 给出重新上传入口 */
        if(!sdE.linkValue&&!evList.length){
          html+='<div class="evidence-area" data-action="upload-evidence" data-step="'+stepIdx+'">';
          html+=ic('camera','icon-lg');
          html+='<div>点击上传</div>';
          html+='</div>';
        }
      }else{
        var kinds=(comp.kinds||[]).join(' / ');
        var kindText=kinds||'文件';
        html+='<div class="evidence-area" data-action="upload-evidence" data-step="'+stepIdx+'">';
        html+=ic('camera','icon-lg');
        html+='<div>点击上传（'+esc(kindText)+'）· 支持多选</div>';
        html+='<div style="font-size:12px">支持拍照或从相册选择 · 原图保存在本机</div>';
        html+='</div>';
      }
      html+='</div>';
      break;

    case 'selfcheck':
      var cpS=state.courseProgress[currentCourse];
      var sdS=cpS.stepData[stepIdx]||{};
      var scChecks=sdS.selfcheck||{};
      html+='<div class="comp">';
      if(comp.title) html+='<div class="card-title" style="margin-bottom:8px">'+esc(comp.title)+'</div>';
      (comp.items||[]).forEach(function(item,i){
        var v=scChecks[i];
        var stateCls=v===true?'on':(v===false?'off':'');
        html+='<div class="selfcheck-row">';
        html+='<div class="selfcheck-state '+stateCls+'">'+(v===true?'是':(v===false?'否':'待确认'))+'</div>';
        html+='<div class="sc-text '+(v===false?'fail':'')+'">'+esc(item)+'</div>';
        html+='<button class="sc-cycle" data-action="toggle-selfcheck" data-step="'+stepIdx+'" data-item="'+i+'">'+svgIcon('check')+'</button>';
        html+='</div>';
      });
      html+='</div>';
      break;

    case 'help':
      html+='<div class="comp comp-help">';
      if(comp.title) html+='<div class="card-title" style="margin-bottom:8px">'+esc(comp.title)+'</div>';
      (comp.items||[]).forEach(function(qa){
        html+='<div class="help-qa">';
        html+='<div class="help-q">'+esc(qa.q)+'</div>';
        html+='<div class="help-a">'+esc(qa.a)+'</div>';
        html+='</div>';
      });
      html+='</div>';
      break;

    case 'stats':
      html+='<div class="comp">';
      html+=renderStatsComponent(comp);
      html+='</div>';
      break;

    default:
      html+='<div class="comp">未知组件：'+esc(comp.type)+'</div>';
  }
  return html;
}

/* P1-2 多文件：id 分配 + 上传 + 状态更新 + 删除 */
function nextEvId(courseId,stepIdx){
  var seq=0;
  var prefix=courseId+'_'+stepIdx+'_';
  while(state.evidence.some(function(ev){ return ev.id===prefix+seq; })) seq++;
  return prefix+seq;
}

function uploadEvidence(stepIdx){
  var course=COURSES[currentCourse];
  var cp=state.courseProgress[currentCourse];
  if(!cp.stepData[stepIdx]) cp.stepData[stepIdx]={};
  var comp=findEvidenceComp(course,stepIdx);
  var kinds=(comp&&comp.kinds)||['image'];

  // 纯链接类成果：走输入框
  var needFile=kinds.indexOf('image')>=0||kinds.indexOf('video')>=0;
  if(!needFile){
    showInputModal('提交成果链接','粘贴链接（网盘/视频地址等）','text',cp.stepData[stepIdx].linkValue||'',function(v){
      if(!v||!v.trim()) return;
      cp.stepData[stepIdx].linkValue=v.trim();
      completeUpload(course,stepIdx,{kind:'link',link:v.trim()});
    });
    return;
  }

  // 文件选择（图片/视频，支持多选，每步最多 9 个）
  var accept=[];
  if(kinds.indexOf('image')>=0) accept.push('image/*');
  if(kinds.indexOf('video')>=0) accept.push('video/*');
  var input=document.createElement('input');
  input.type='file';
  input.multiple=true;
  input.accept=accept.join(',');
  input.onchange=function(){
    var files=Array.prototype.slice.call(input.files||[]).slice(0,9);
    if(!files.length) return;
    var area=document.querySelector('.evidence-area');
    if(area){ area.innerHTML='<div style="padding:18px;font-size:14px;color:var(--c-text-sub)">处理中，请稍候…</div>'; }
    var done=0,fail=0;
    var chain=Promise.resolve();
    files.forEach(function(file){
      chain=chain.then(function(){
        var id=nextEvId(currentCourse,stepIdx);
        var meta={
          id:id,
          courseId:currentCourse,
          step:stepIdx,
          module:course.module,
          title:comp.label||course.evidenceLabel||course.outcome||course.title,
          date:fmtDate(new Date())
        };
        return EvidenceDB.saveEvidence(file,meta).then(function(r){
          completeUpload(course,stepIdx,{id:id,kind:(r.mime||'').indexOf('video')===0?'video':'image',thumb:r.thumb,size:r.size});
          done++;
        }).catch(function(err){
          fail++;
          if(files.length===1) alert('上传失败：'+(err&&err.message?err.message:'未知错误'));
        });
      });
    });
    chain.then(function(){
      if(files.length>1) toast('已上传 '+done+' 个文件'+(fail?('，'+fail+' 个失败'):''));
      renderCourseStep();
    });
  };
  input.click();
}

function completeUpload(course,stepIdx,info){
  var cp=state.courseProgress[currentCourse];
  if(!cp.stepData[stepIdx]) cp.stepData[stepIdx]={};
  cp.stepData[stepIdx].evidence=true;

  if(info.kind==='link'){
    /* 链接型：同一步骤只保留一条 */
    var exists=state.evidence.find(function(ev){
      return ev.courseId===currentCourse&&ev.step===stepIdx&&ev.kind==='link';
    });
    if(!exists){
      state.evidence.push({
        id:evRecordId(currentCourse,stepIdx),
        courseId:currentCourse,
        step:stepIdx,
        module:course.module,
        title:course.evidenceLabel||course.outcome||course.title,
        date:fmtDate(new Date()),
        kind:'link',
        thumb:null,
        size:0,
        link:info.link||null
      });
    }else{
      exists.link=info.link||exists.link||null;
      exists.date=fmtDate(new Date());
    }
  }else if(info.id){
    /* 文件类：追加（同 id 幂等） */
    var dup=state.evidence.find(function(ev){ return ev.id===info.id; });
    if(!dup){
      state.evidence.push({
        id:info.id,
        courseId:currentCourse,
        step:stepIdx,
        module:course.module,
        title:course.evidenceLabel||course.outcome||course.title,
        date:fmtDate(new Date()),
        kind:info.kind||'image',
        thumb:info.thumb||null,
        size:info.size||0,
        link:null
      });
    }
  }

  // 若课程已完成且此前成果待补 → 补交后任务完成
  var wasPending=cp.completed&&!cp.evidenceDone;
  if(cp.completed){
    cp.evidenceDone=allEvidenceUploaded(course,cp);
    cp.resultState=cp.evidenceDone?'done':'evidence_pending';
    if(wasPending&&cp.evidenceDone&&currentTaskId){
      var t=state.tasks.find(function(x){return x.id===currentTaskId;});
      if(t&&t.status==='in_progress'){
        t.status='completed';
        state.timeline.push({date:fmtDate(new Date()),text:'补交成果：'+(course.evidenceLabel||course.title)});
      }
    }
  }
  saveState();
  renderCourseStep();
}

window.onEvidenceDeleted=function(id,meta){
  var m=meta||{};
  var courseId=m.courseId,step=m.step;
  // 旧数据兼容：从 id 解析（courseId 不含下划线，p[0]=课程，p[1]=步骤）
  if(courseId===undefined&&typeof id==='string'){
    var p=id.split('_');
    if(p.length>=2){ courseId=p[0]; step=parseInt(p[1],10); }
  }
  var idx=state.evidence.findIndex(function(ev){
    if(ev.id&&ev.id===id) return true;
    if(!ev.id&&courseId!==undefined&&ev.courseId===courseId&&ev.step===step) return true;
    return false;
  });
  if(idx>=0) state.evidence.splice(idx,1);

  if(courseId&&COURSES[courseId]){
    var cp=state.courseProgress[courseId];
    var course=COURSES[courseId];
    var remain=state.evidence.filter(function(ev){ return ev.courseId===courseId&&ev.step===step; });
    if(cp&&cp.stepData&&cp.stepData[step]&&remain.length===0){
      delete cp.stepData[step].evidence;
      delete cp.stepData[step].linkValue;
    }
    if(cp&&cp.completed){
      cp.evidenceDone=allEvidenceUploaded(course,cp);
      cp.resultState=cp.evidenceDone?'done':'evidence_pending';
    }
  }
  saveState();
  // 刷新当前视图
  if(currentCourse&&!document.getElementById('course-overlay').classList.contains('hidden')){
    renderCourseStep();
  }else{
    navigate(currentPage);
  }
};

/* 捕获阶段接管事件分发（拦截 app.js 旧监听器，避免双重处理/旧解析逻辑） */
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-action]');
  if(!el) return;
  if(e.stopImmediatePropagation)e.stopImmediatePropagation();
  if(e.stopPropagation)e.stopPropagation();
  var a=el.dataset.action;

  switch(a){
    case 'nav':
      navigate(el.dataset.page);
      break;
    case 'open-course':
      openCourse(el.dataset.course,el.dataset.task);
      break;
    case 'task-more':
      openTaskSheet(el.dataset.task);
      break;
    case 'close-sheet':
      closeSheet();
      break;
    case 'sheet-start':
      closeSheet();
      openCourse(el.dataset.courseId||taskCourseId(el.dataset.task),el.dataset.task);
      break;
    case 'sheet-adjust':
      openAdjustSheet(el.dataset.task);
      break;
    case 'sheet-pause':
      applyPause(el.dataset.task);
      break;
    case 'sheet-skip':
      openSkipSheet(el.dataset.task);
      break;
    case 'adjust-day':
      sheetSel.day=parseInt(el.dataset.day,10);
      renderAdjustSheet();
      break;
    case 'adjust-reason':
      sheetSel.reason=el.dataset.reason;
      renderAdjustSheet();
      break;
    case 'adjust-confirm':
      applyReschedule();
      break;
    case 'skip-reason':
      sheetSel.reason=el.dataset.reason;
      {
        var chips=document.querySelectorAll('#sheet-content .chip');
        chips.forEach(function(c){ c.classList.toggle('active',c.dataset.reason===sheetSel.reason); });
      }
      break;
    case 'skip-confirm':
      applySkip();
      break;
    case 'toggle-check':
      toggleCheck(parseInt(el.dataset.step,10),parseInt(el.dataset.item,10));
      break;
    case 'set-rating':
      setRating(el.dataset.key,parseInt(el.dataset.val,10),parseInt(el.dataset.step,10));
      break;
    case 'use-last':
      useLastValue(el.dataset.key,parseInt(el.dataset.step,10),el.dataset.use);
      break;
    case 'toggle-selfcheck':
      toggleSelfcheck(parseInt(el.dataset.step,10),parseInt(el.dataset.item,10));
      break;
    case 'upload-evidence':
      uploadEvidence(parseInt(el.dataset.step,10));
      break;
    case 'view-evidence':{
      var vId=el.dataset.id;
      var vMeta=null;
      // 从 state.evidence 找元数据（含旧数据兼容）
      var vIdx=state.evidence.findIndex(function(ev){ return (ev.id||evRecordId(ev.courseId,ev.step))===vId; });
      if(vIdx>=0) vMeta=state.evidence[vIdx];
      else{
        var vp=vId.split('_');
        if(vp.length>=2){
          var vC=vp[0],vS=parseInt(vp[1],10);
          vMeta=state.evidence.find(function(ev){ return ev.courseId===vC&&ev.step===vS; })||null;
        }
      }
      if(vMeta&&vMeta.kind==='link'&&vMeta.link&&!vMeta.thumb){
        // 纯链接：直接打开
        if(confirm('在浏览器中打开这个链接？\n\n'+vMeta.link)){ window.open(vMeta.link,'_blank'); }
      }else{
        EvidenceDB.showViewer(vId,vMeta||{title:'成果'});
      }
      break;
    }
    case 'course-start-steps':
      startCourseSteps();
      break;
    case 'course-restart':
      restartCourse();
      break;
    case 'course-goto-evidence':
      gotoEvidenceStep();
      break;
    case 'plan-view':
      planView=el.dataset.view;
      renderPlan();
      break;
    case 'toggle-module':
      state.profile.modules[el.dataset.module]=!state.profile.modules[el.dataset.module];
      saveState();
      renderProfile();
      break;
    case 'toggle-reminder':{
      var rk=el.dataset.key;
      var rWant=!state.settings.reminders[rk];
      if(rWant&&Reminders.supported()){
        Reminders.ensurePermission(true).then(function(p){
          if(p==='granted'){
            state.settings.reminders[rk]=true;
            Reminders.notify('提醒已开启','到点会在这里通知你','enabled');
          }else if(p==='denied'){
            alert('通知权限被拒绝，无法开启提醒。\n\n请在浏览器「设置 → 通知」中允许本站通知后重试。');
          }else if(p==='unsupported'){
            state.settings.reminders[rk]=true;
          }else{
            // 用户关闭了权限弹窗，保持开关不变
          }
          saveState();
          renderProfile();
        });
      }else{
        state.settings.reminders[rk]=rWant;
        saveState();
        renderProfile();
      }
      break;
    }
    case 'set-theme':
      state.settings.theme=el.dataset.theme;
      saveState();
      applyTheme();
      renderProfile();
      break;
    case 'edit-profile':
      editProfileField(el.dataset.field);
      break;
    case 'export-data':
      exportData();
      break;
    case 'import-data':
      importData();
      break;
    case 'reset-data':
      resetData();
      break;
    case 'close-input-modal':
      closeInputModal();
      break;
    case 'submit-input-modal':
      submitInputModal();
      break;
  }
},true);

/* 首屏用新版渲染器重绘当前页 */
if(typeof navigate==='function'){ try{ navigate(typeof currentPage!=='undefined'?currentPage:'today'); }catch(e){} }
