/* reminders.js — 本地提醒引擎
 * 真实 Notification API：到点触发（应用运行中生效，本地工具无服务器推送）
 * 每日提醒 / 任务开始提醒 / 周复盘提醒 / 入睡提醒
 */
var Reminders=(function(){
  'use strict';

  var fired={};   // 'date|key' → 1，防止同一触发点重复通知
  var CHECK_MS=20000;

  function supported(){ return 'Notification' in window; }
  function permission(){ return supported()?Notification.permission:'unsupported'; }

  function pad(n){ return (n<10?'0':'')+n; }
  function hhmm(d){ return pad(d.getHours())+':'+pad(d.getMinutes()); }
  function minutesOf(t){
    var p=String(t||'').split(':');
    return (parseInt(p[0],10)||0)*60+(parseInt(p[1],10)||0);
  }
  function nowMinutes(d){ return d.getHours()*60+d.getMinutes(); }
  function dateKey(d){ return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }

  /* 到点判定：允许 ±2 分钟窗口，抵御后台标签页定时器节流 */
  function due(nowMin,target){
    var t=minutesOf(target);
    return nowMin>=t&&nowMin<t+3;
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
      var nm=nowMinutes(now);

      /* 每日提醒：汇总今日待办 */
      if(r.daily&&due(nm,r.dailyTime)&&!fired[dk+'|daily']){
        fired[dk+'|daily']=1;
        var dayNum=getTodayDayNum();
        var pend=(state.tasks||[]).filter(function(t){
          return effDay(t)===dayNum&&t.status!=='completed'&&t.status!=='skipped';
        });
        if(pend.length>0){
          notify('今日还有 '+pend.length+' 个成长任务',
            pend.map(function(t){return t.title;}).join(' · '),'daily');
        }
      }

      /* 任务开始提醒：到点的今日任务 */
      if(r.taskStart){
        var dayNum2=getTodayDayNum();
        (state.tasks||[]).forEach(function(t){
          if(effDay(t)!==dayNum2) return;
          if(t.status==='completed'||t.status==='skipped') return;
          var k=dk+'|task|'+t.id;
          if(fired[k]) return;
          var tm=minutesOf(effTime(t));
          if(nm>=tm&&nm<tm+3){
            fired[k]=1;
            notify('「'+t.title+'」时间到','预计 '+t.duration+' 分钟，现在开始','task-'+t.id);
          }
        });
      }

      /* 周复盘提醒：周日 */
      if(r.weeklyReview&&now.getDay()===0&&due(nm,r.weeklyTime)&&!fired[dk+'|weekly']){
        fired[dk+'|weekly']=1;
        notify('周复盘时间到','回顾本周成长，生成你的成长周报','weekly');
      }

      /* 入睡提醒 */
      if(r.sleep&&due(nm,r.sleepTime)&&!fired[dk+'|sleep']){
        fired[dk+'|sleep']=1;
        notify('该准备休息了','今天的成长到此为止，晚安','sleep');
      }
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
    ensurePermission:ensurePermission
  };
})();
