/* reminders.js — 本地提醒引擎
 * 真实 Notification API：到点触发（应用运行中生效，本地工具无服务器推送）
 * 每日提醒 / 任务开始提醒 / 周复盘提醒 / 入睡提醒
 *
 * v1.2 设计：
 *  - 已发记录持久化到 localStorage（pgos_fired），当天/当周只发一次
 *  - 全天窗口：到点后任意时刻打开应用都会补发（不再错过后静默丢失）
 *  - 周复盘支持跨周补发：周日错过，周一~周六首次打开仍会提醒
 */
var Reminders=(function(){
  'use strict';

  var FIRED_KEY='pgos_fired';
  var fired={};   // key → 1
  var CHECK_MS=20000;

  function supported(){ return 'Notification' in window; }
  function permission(){ return supported()?Notification.permission:'unsupported'; }

  function pad(n){ return (n<10?'0':'')+n; }
  function minutesOf(t){
    var p=String(t||'').split(':');
    return (parseInt(p[0],10)||0)*60+(parseInt(p[1],10)||0);
  }
  function nowMinutes(d){ return d.getHours()*60+d.getMinutes(); }
  function dateKey(d){ return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

  /* 该日期所在周的周日作为周标识（周日制周首） */
  function weekKey(d){
    var t=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    t.setDate(t.getDate()-t.getDay());
    var jan1=new Date(t.getFullYear(),0,1);
    var wk=Math.ceil((((t-jan1)/86400000)+jan1.getDay()+1)/7);
    return t.getFullYear()+'w'+wk;
  }

  /* ---------- 已发记录持久化 ---------- */
  function loadFired(){
    try{ fired=JSON.parse(localStorage.getItem(FIRED_KEY)||'{}')||{}; }catch(e){ fired={}; }
  }
  function pruneFired(dk,wk){
    Object.keys(fired).forEach(function(k){
      var keep=(k.indexOf(dk+'|')===0)||k==='weekly|'+wk;
      if(!keep) delete fired[k];
    });
  }
  function saveFired(){
    try{ localStorage.setItem(FIRED_KEY,JSON.stringify(fired)); }catch(e){}
  }

  /* ---------- 发通知（优先走 Service Worker，装到主屏后更可靠）---------- */
  function notify(title,body,tag){
    if(permission()!=='granted') return;
    var opts={body:body,tag:tag||'pgos',icon:'icon-192.png',badge:'favicon.png'};
    if(navigator.serviceWorker&&navigator.serviceWorker.ready){
      navigator.serviceWorker.ready.then(function(reg){
        reg.showNotification(title,opts);
      }).catch(function(){
        try{ new Notification(title,opts); }catch(e){}
      });
    }else{
      try{ new Notification(title,opts); }catch(e){}
    }
  }

  /* ---------- 每轮检查 ---------- */
  function check(){
    try{
      if(permission()!=='granted') return;
      if(typeof state==='undefined'||!state.settings||!state.settings.reminders) return;
      var r=state.settings.reminders;
      var now=new Date();
      var dk=dateKey(now);
      var wk=weekKey(now);
      var nm=nowMinutes(now);
      var dirty=false;
      pruneFired(dk,wk);

      /* 每日提醒：汇总今日待办（到点后全天补发，每天一次） */
      if(r.daily&&!fired[dk+'|daily']&&nm>=minutesOf(r.dailyTime)){
        fired[dk+'|daily']=1; dirty=true;
        var dayNum=getTodayDayNum();
        var pend=(state.tasks||[]).filter(function(t){
          return effDay(t)===dayNum&&t.status!=='completed'&&t.status!=='skipped';
        });
        if(pend.length>0){
          notify('今日还有 '+pend.length+' 个成长任务',
            pend.map(function(t){return t.title;}).join(' · '),'daily');
        }
      }

      /* 任务开始提醒：到点后全天补发（未完成的今日任务） */
      if(r.taskStart){
        var dayNum2=getTodayDayNum();
        (state.tasks||[]).forEach(function(t){
          if(effDay(t)!==dayNum2) return;
          if(t.status==='completed'||t.status==='skipped') return;
          var k=dk+'|task|'+t.id;
          if(fired[k]) return;
          if(nm>=minutesOf(effTime(t))){
            fired[k]=1; dirty=true;
            notify('「'+t.title+'」时间到','预计 '+t.duration+' 分钟，现在开始','task-'+t.id);
          }
        });
      }

      /* 周复盘提醒：周日到点发；错过则本周（周一~周六）首次打开补发 */
      if(r.weeklyReview){
        var wkKey='weekly|'+wk;
        if(!fired[wkKey]){
          var sundayPassed=(now.getDay()===0)?(nm>=minutesOf(r.weeklyTime)):true;
          if(sundayPassed){
            fired[wkKey]=1; dirty=true;
            if(now.getDay()===0){
              notify('周复盘时间到','回顾本周成长，生成你的成长周报','weekly');
            }else{
              notify('上周的成长还没复盘','打开计划页，补一份上周的成长周报','weekly');
            }
          }
        }
      }

      /* 入睡提醒（到点后全天一次） */
      if(r.sleep&&!fired[dk+'|sleep']&&nm>=minutesOf(r.sleepTime)){
        fired[dk+'|sleep']=1; dirty=true;
        notify('该准备休息了','今天的成长到此为止，晚安','sleep');
      }

      if(dirty) saveFired();
    }catch(e){ /* 静默失败，不影响使用 */ }
  }

  /* ---------- 权限申请流 ---------- */
  /* want=true 且需要权限时申请；返回 Promise<'granted'|'denied'|'unneeded'> */
  function ensurePermission(want){
    if(!want) return Promise.resolve('unneeded');
    if(!supported()) return Promise.resolve('unsupported');
    if(Notification.permission==='granted') return Promise.resolve('granted');
    if(Notification.permission==='denied') return Promise.resolve('denied');
    return Notification.requestPermission().then(function(p){ return p; });
  }

  function init(){
    loadFired();
    if(!supported()) return;
    setInterval(check,CHECK_MS);
    check();
  }

  return {
    init:init,
    check:check,
    notify:notify,
    permission:permission,
    supported:supported,
    ensurePermission:ensurePermission,
    _fired:function(){ return fired; }   // 测试用
  };
})();
