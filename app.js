// app.js — 个人成长操作系统 V0.1
// 状态管理 + 路由 + 5页面渲染 + 课程引擎(简介页/六组件/双时段/成果待补) + 任务操作面板
// 对齐：01-PRD §7 §8 §9 / 02-开发实施规格 / 04-验收测试清单

/* ===== Icon Library (Lucide inline SVG) ===== */
const ICONS={
  home:'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  'book-open':'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'trending-up':'<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'chevron-left':'<polyline points="15 18 9 12 15 6"/>',
  'chevron-right':'<polyline points="9 18 15 12 9 6"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  play:'<polygon points="6 3 20 12 6 21 6 3"/>',
  pause:'<rect x="6" y="4" width="3" height="16" rx="1"/><rect x="15" y="4" width="3" height="16" rx="1"/>',
  'rotate-ccw':'<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  info:'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2.09 9.27 8.91 8.26 12 2"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  'trash-2':'<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'alert-triangle':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  dumbbell:'<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.829l1.414-1.414a2 2 0 1 1 2.829 2.829z"/><path d="M21.485 5.343a2 2 0 1 0-2.829-2.829l-1.414 1.414a2 2 0 1 0 2.829 2.829z"/><path d="M3.515 18.657a2 2 0 1 1-2.829-2.829l1.414-1.414a2 2 0 1 1 2.829 2.829z"/><path d="M5.343 2.515a2 2 0 1 0-2.829 2.829l1.414 1.414a2 2 0 1 0 2.829-2.829z"/>',
  clapperboard:'<path d="M20.2 6H3.8a1.8 1.8 0 0 0-1.8 1.8v12.4a1.8 1.8 0 0 0 1.8 1.8h16.4a1.8 1.8 0 0 0 1.8-1.8V7.8a1.8 1.8 0 0 0-1.8-1.8z"/><path d="M7 2v4"/><path d="M11 2v4"/><path d="M15 2v4"/>',
  'utensils-crossed':'<path d="M16 2l-1.5 3.5L17 8l3-1.5L16 2z"/><path d="M14.5 14.5L3 21l6.5-11.5"/><path d="M14.5 14.5L21 3l-11.5 6.5"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  'chart-column':'<path d="M3 3v18h18"/><rect x="7" y="10" width="3" height="8" rx="1"/><rect x="12" y="6" width="3" height="12" rx="1"/><rect x="17" y="13" width="3" height="5" rx="1"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.14-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  video:'<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
  image:'<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  'check-circle':'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'more-horizontal':'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'skip-forward':'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" x2="19" y1="5" y2="19"/>',
  'shield':'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.04 7-3 2.5 1.96 5 3 7 3a1 1 0 0 1 1 1z"/>',
  palette:'<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.14 2 11.25c0 .96.46 2.03 1.68 2.7l1.4.83c.53.32.92 1.04.92 1.66v1.56c0 1.14.93 2.07 2.07 2.07.57 0 1.08-.23 1.46-.61l.96-.96c.32-.32.75-.5 1.2-.5H19c2.76 0 5-2.24 5-5 0-6.34-4.84-10-12-10z"/>',
  'arrow-right':'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'
};

function ic(name,cls){
  var c=cls||'';
  var path=ICONS[name]||'';
  return '<span class="icon '+c+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg></span>';
}

/* ===== 常量 ===== */
var DAY_NAMES=['','周一','周二','周三','周四','周五','周六','周日'];
var EXERCISES={chest:'坐姿推胸',pulldown:'高位下拉',row:'坐姿划船',legpress:'腿举',shoulder:'坐姿推肩'};
var EX_PREFIX_MAP={chest1:'chest',chest:'chest',pull1:'pulldown',pull:'pulldown',row1:'row',row:'row',leg1:'legpress',leg:'legpress',sho1:'shoulder',sho:'shoulder'};
var EX_FIELDS=['weight','reps','diff','mastery','feel','pain'];

/* ===== 状态管理 ===== */
var state={};
var currentPage='today';
var planView='week';
var currentCourse=null;
var currentTaskId=null;
var currentStepIdx=0;
var courseView='intro';   // 'intro' | 'steps'
var sheetSel={};          // 底部弹窗的临时选择状态

function loadState(){
  try{
    var saved=localStorage.getItem('pgos_state');
    if(saved){
      var parsed=JSON.parse(saved);
      if(parsed&&parsed.schemaVersion===1&&parsed.tasks){
        state=parsed;
        var defaults=getDefaults();
        if(!state.profile) state.profile=defaults.profile;
        if(!state.growth) state.growth=defaults.growth;
        if(!state.skills) state.skills=defaults.skills;
        if(!state.settings) state.settings=defaults.settings;
        // v1.1 迁移：提醒设置整体 + 提醒时间默认值
        if(state.settings&&!state.settings.reminders) state.settings.reminders=defaults.settings.reminders;
        if(state.settings&&state.settings.reminders){
          var rd=state.settings.reminders;
          var rdDef=defaults.settings.reminders;
          ['daily','taskStart','weeklyReview','sleep'].forEach(function(k){
            if(rd[k]===undefined) rd[k]=rdDef[k];
          });
          if(rd.dailyTime===undefined) rd.dailyTime=rdDef.dailyTime;
          if(rd.weeklyTime===undefined) rd.weeklyTime=rdDef.weeklyTime;
          if(rd.sleepTime===undefined) rd.sleepTime=rdDef.sleepTime;
        }
        if(!state.courseProgress) state.courseProgress={};
        if(!state.evidence) state.evidence=[];
        if(!state.timeline) state.timeline=[];
        if(!state.weeklyReports) state.weeklyReports=[];
        if(!state.rescheduleEvents) state.rescheduleEvents=[];
        if(!state.lastValues) state.lastValues={};
        if(!state.version) state.version=defaults.version;
        return;
      }
    }
    state=getDefaults();
  }catch(e){
    state=getDefaults();
  }
}

function saveState(){
  try{ localStorage.setItem('pgos_state',JSON.stringify(state)); }catch(e){}
}

/* ===== 工具函数 ===== */
function esc(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function getGreeting(){
  var h=new Date().getHours();
  if(h<6) return '夜深了';
  if(h<12) return '早上好';
  if(h<18) return '下午好';
  return '晚上好';
}

function getDateStr(){
  var d=new Date();
  return (d.getMonth()+1)+'月'+d.getDate()+'日 '+DAY_NAMES[d.getDay()===0?7:d.getDay()];
}

function getTodayDayNum(){
  var d=new Date().getDay();
  return d===0?7:d;
}

function toMin(t){
  var p=String(t||'0:0').split(':');
  return parseInt(p[0],10)*60+parseInt(p[1],10);
}

function nowMinutes(){
  var d=new Date();
  return d.getHours()*60+d.getMinutes();
}

function fmtDur(min){
  if(min<60) return min+'分钟';
  var h=Math.floor(min/60),m=min%60;
  if(m===0) return h+'小时';
  return h+'小时'+m+'分钟';
}

function fmtDate(d){
  return (d.getMonth()+1)+'月'+d.getDate()+'日';
}

/* 任务有效时间（调整后） */
function effDay(t){ return t.newDay||t.day; }
function effTime(t){ return t.newTime||t.time; }

function taskTimeLabel(t){
  if(t.segments&&t.segments.length){
    return t.segments.map(function(s){return s.time;}).join(' / ');
  }
  return effTime(t);
}

function taskDurationLabel(t){
  if(t.segments&&t.segments.length){
    return t.segments.map(function(s){return s.label+' '+s.duration+'分钟';}).join(' · ');
  }
  return t.duration+'分钟';
}

/* 任务徽章（PRD §8.1 全局唯一口径 + 成果待补） */
function getTaskBadge(t){
  var st=STATUS_MAP[t.status]||STATUS_MAP.pending;
  if(t.status==='in_progress'&&currentCourse===null){
    var cp=t.courseId?state.courseProgress[t.courseId]:null;
    if(cp&&cp.completed&&!cp.evidenceDone&&t.courseId&&COURSES[t.courseId]&&COURSES[t.courseId].requiredEvidence){
      return {label:'成果待补',cls:'st-evidence'};
    }
  }
  return {label:st.label,cls:st.cls};
}

/* 统一取徽章（独立于当前打开的课程） */
function taskBadge(t){
  var st=STATUS_MAP[t.status]||STATUS_MAP.pending;
  if(t.status==='in_progress'){
    var cp=t.courseId?state.courseProgress[t.courseId]:null;
    if(cp&&cp.completed&&!cp.evidenceDone&&t.courseId&&COURSES[t.courseId]&&COURSES[t.courseId].requiredEvidence){
      return {label:'成果待补',cls:'st-evidence'};
    }
  }
  return {label:st.label,cls:st.cls};
}

function getCompletedCount(){
  return state.tasks.filter(function(t){return t.status==='completed';}).length;
}
function getTotalCount(){
  return state.tasks.length;
}

function getModuleColor(mod){ return MODULES[mod]?MODULES[mod].color:'#007AFF'; }
function getModuleIcon(mod){ return MODULES[mod]?MODULES[mod].icon:'target'; }
function getModuleCls(mod){ return MODULES[mod]?MODULES[mod].cls:''; }
function getModuleName(mod){ return MODULES[mod]?MODULES[mod].name:''; }

function applyTheme(){
  var theme=state.settings.theme||'system';
  if(theme==='dark') document.documentElement.setAttribute('data-theme','dark');
  else if(theme==='light') document.documentElement.setAttribute('data-theme','light');
  else document.documentElement.removeAttribute('data-theme');
}

/* ===== 路由 ===== */
function navigate(page){
  currentPage=page;
  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){ t.classList.toggle('active',t.dataset.page===page); });
  var pages=document.querySelectorAll('.page');
  pages.forEach(function(p){ p.classList.remove('active'); });
  var target=document.getElementById('page-'+page);
  if(target){
    target.classList.add('active');
    window.scrollTo(0,0);
  }
  var renderFn={
    today:renderToday, plan:renderPlan, learn:renderLearn,
    growth:renderGrowth, profile:renderProfile
  };
  if(renderFn[page]) renderFn[page]();
}

/* 任务卡 HTML（今日/计划共用） */
function taskItemHtml(t,opts){
  var o=opts||{};
  var badge=taskBadge(t);
  var mod=MODULES[t.module]||MODULES.review;
  var html='';
  html+='<div class="task-item" data-action="open-course" data-course="'+esc(t.courseId)+'" data-task="'+esc(t.id)+'">';
  html+='<div class="ti-icon '+mod.cls+'">'+ic(mod.icon)+'</div>';
  html+='<div class="ti-info">';
  html+='<div class="ti-time">'+esc(taskTimeLabel(t))+' · '+esc(mod.name)+' · '+esc(taskDurationLabel(t))+'</div>';
  html+='<div class="ti-title">'+esc(t.title)+'</div>';
  if(t.status==='rescheduled'&&t.day){
    html+='<div class="ti-note">原 '+esc(DAY_NAMES[t.day])+' '+esc(t.time)+'</div>';
  }
  if(t.status==='skipped'&&t.skipReason){
    html+='<div class="ti-note">原因：'+esc(t.skipReason)+'</div>';
  }
  html+='</div>';
  if(!o.noMore&&t.status!=='completed'){
    html+='<button class="more-btn" data-action="task-more" data-task="'+esc(t.id)+'" aria-label="任务操作">'+ic('more-horizontal','icon-sm')+'</button>';
  }else{
    html+='<span class="ti-status '+badge.cls+'">'+esc(badge.label)+'</span>';
  }
  html+='</div>';
  return html;
}

/* ===== 页面：今日 ===== */
function renderToday(){
  var html='';
  var p=state.profile;

  html+='<div class="today-header">';
  html+='<div class="today-date">'+esc(getDateStr())+'</div>';
  html+='<div class="today-greeting">'+esc(getGreeting())+'，'+esc(p.name)+'</div>';
  html+='</div>';

  // “接下来”任务卡（P2-004~P2-010）
  var next=getNextTaskForToday();
  if(next){
    html+=renderNextCard(next);
  }else{
    html+='<div class="free-time-card">';
    html+=ic('check-circle','icon-xl');
    html+='<div style="font-size:17px;font-weight:600;margin-top:8px">今日成长任务已全部完成</div>';
    html+='<div style="font-size:14px;color:var(--c-text-sub);margin-top:4px">享受自由时光吧</div>';
    html+='</div>';
  }

  // 今日成长进度（只统计成长任务，固定安排不进入）
  var todayNum=getTodayDayNum();
  var todayTasks=state.tasks.filter(function(t){return effDay(t)===todayNum;});
  var todayGrowth=todayTasks.filter(function(t){return t.module!=='review';});
  var doneGrowth=todayGrowth.filter(function(t){return t.status==='completed';}).length;
  var gpct=todayGrowth.length>0?Math.round(doneGrowth/todayGrowth.length*100):0;
  html+='<div class="card">';
  html+='<div class="card-title">今日成长进度</div>';
  html+='<div class="flex-row" style="justify-content:space-between;margin-bottom:4px">';
  html+='<span style="font-size:28px;font-weight:700">'+doneGrowth+'<span style="font-size:15px;color:var(--c-text-sub);font-weight:500">/'+todayGrowth.length+'</span></span>';
  html+='<span style="font-size:15px;color:var(--c-text-sub)">'+gpct+'%</span>';
  html+='</div>';
  html+='<div class="progress-bar"><div class="progress-fill" style="width:'+gpct+'%"></div></div>';
  html+='<div style="font-size:12px;color:var(--c-text-sub);margin-top:6px">固定安排（工作 · 吃饭 · 睡觉）不计入完成率</div>';
  html+='</div>';

  // 今日任务列表
  html+='<div class="section-title">今日任务</div>';
  if(todayTasks.length===0){
    html+='<div class="empty-state">'+ic('calendar','icon-xl')+'<div class="es-text">今天没有安排成长任务</div></div>';
  }else{
    todayTasks.slice().sort(function(a,b){return toMin(effTime(a))-toMin(effTime(b));}).forEach(function(t){
      html+=taskItemHtml(t);
    });
  }

  // 固定生活框架
  var routine=(todayNum>=6)?ROUTINE.weekend:ROUTINE.weekday;
  html+='<div class="section-title">固定安排</div>';
  html+='<div class="routine-row">';
  routine.forEach(function(r){
    html+='<span class="routine-chip">'+esc(r.time)+' '+esc(r.label)+'</span>';
  });
  html+='</div>';

  document.getElementById('page-today').innerHTML=html;
}

function getNextTaskForToday(){
  var today=getTodayDayNum();
  var active=state.tasks.filter(function(t){
    return ['pending','in_progress','paused'].indexOf(t.status)>=0;
  });
  var todays=active.filter(function(t){return effDay(t)===today;})
    .sort(function(a,b){return toMin(effTime(a))-toMin(effTime(b));});
  if(todays.length>0) return todays[0];
  var future=active.slice().sort(function(a,b){
    return effDay(a)!==effDay(b)?effDay(a)-effDay(b):toMin(effTime(a))-toMin(effTime(b));
  });
  return future[0]||null;
}

/* “接下来”卡片内容（含倒计时状态 P2-005~P2-008） */
function countdownText(t){
  if(t.status!=='pending') return '';
  var d=effDay(t),today=getTodayDayNum();
  var startM=toMin(t.segments?t.segments[0].time:effTime(t));
  var nowM=nowMinutes();
  if(d===today){
    if(nowM<startM) return '还有 '+fmtDur(startM-nowM)+' 开始';
    if(nowM<=startM+(t.duration||60)) return '可以开始啦';
    return '';
  }
  if(d===today+1) return '明天 '+(t.segments?t.segments[0].time:effTime(t))+' 开始';
  if(d>today) return DAY_NAMES[d]+' '+(t.segments?t.segments[0].time:effTime(t))+' 开始';
  return '';
}

function renderNextCard(t){
  var mod=MODULES[t.module]||MODULES.review;
  var course=COURSES[t.courseId];
  var cp=state.courseProgress[t.courseId];
  var html='';
  html+='<div class="next-task-card">';
  html+='<div class="nt-label">'+ic(mod.icon,'icon-sm')+' 接下来</div>';
  html+='<div class="nt-time">'+esc(taskTimeLabel(t))+'</div>';
  html+='<div class="nt-title">'+esc(t.title)+'</div>';
  html+='<div class="nt-meta">'+esc(mod.name)+' · '+esc(taskDurationLabel(t))+'</div>';

  var sub='',btn='开始任务';
  if(t.status==='pending'){
    sub=countdownText(t);
    btn='开始任务';
  }else if(t.status==='in_progress'){
    if(cp&&cp.completed&&!cp.evidenceDone&&course&&course.requiredEvidence){
      sub='成果待补 · 请上传「'+course.evidenceLabel+'」';
      btn='补传成果';
    }else if(cp&&course){
      sub='已完成 '+Math.min(cp.stepIdx,course.steps.length)+'/'+course.steps.length+' 步';
      btn='继续课程';
    }else{
      sub='进行中';
      btn='继续课程';
    }
  }else if(t.status==='paused'){
    sub='已暂停 · 进度已保留';
    btn='继续课程';
  }
  if(sub) html+='<div class="nt-sub" id="next-countdown" data-task="'+esc(t.id)+'">'+esc(sub)+'</div>';

  html+='<button class="nt-btn" data-action="open-course" data-course="'+esc(t.courseId)+'" data-task="'+esc(t.id)+'">'+ic('play','icon-sm')+' '+esc(btn)+'</button>';
  html+='</div>';
  return html;
}

/* 倒计时刷新（30秒） */
function refreshCountdown(){
  var el=document.getElementById('next-countdown');
  if(!el) return;
  var t=state.tasks.find(function(x){return x.id===el.dataset.task;});
  if(!t) return;
  var txt=countdownText(t);
  if(txt) el.textContent=txt;
}

/* ===== 页面：计划 ===== */
function renderPlan(){
  var html='';
  var todayNum=getTodayDayNum();

  html+='<div class="plan-week-header">';
  html+='<div><div style="font-size:22px;font-weight:700">Week 1 计划</div><div style="font-size:14px;color:var(--c-text-sub)">今天是第 '+todayNum+' 天 / 7 天</div></div>';
  html+='<div class="plan-toggle">';
  html+='<button class="'+(planView==='week'?'active':'')+'" data-action="plan-view" data-view="week">周</button>';
  html+='<button class="'+(planView==='month'?'active':'')+'" data-action="plan-view" data-view="month">月</button>';
  html+='</div>';
  html+='</div>';

  if(planView==='week'){
    html+=renderPlanWeek(todayNum);
  }else{
    html+=renderPlanMonth(todayNum);
  }

  // 缓冲位
  html+='<div class="section-title">缓冲位</div>';
  html+='<div class="buffer-slot">';
  html+='<div class="bs-label">'+ic('shield','icon-sm')+' 每周 2 个弹性时段</div>';
  html+='<div style="font-size:13px;color:var(--c-text-sub);margin-top:4px">跳过或未完成的任务可补做，不挤占下周计划</div>';
  html+='</div>';

  // Week 2-4 预告（按原路线图：Week 1 跑通后再开课）
  if(typeof WEEKS_PREVIEW!=='undefined'){
    html+='<div class="section-title">后续安排（预告）</div>';
    WEEKS_PREVIEW.forEach(function(w){
      html+='<div class="week-preview">';
      html+='<div class="wp-head">';
      html+='<div class="wp-title">Week '+w.week+' · '+esc(w.theme)+'</div>';
      html+='<span class="wp-badge">'+ic('lock','icon-sm')+' 未开课</span>';
      html+='</div>';
      html+='<div class="wp-items">'+w.items.map(function(s){ return '· '+esc(s); }).join('<br>')+'</div>';
      html+='</div>';
    });
    html+='<div style="font-size:12px;color:var(--c-text-tert);padding:0 4px">先完成 Week 1，毕业周报生成后再解锁后续课程</div>';
  }

  // 冲突检测
  html+='<div class="section-title">智能提醒</div>';
  var conflicts=checkConflicts();
  if(conflicts.length>0){
    conflicts.forEach(function(c){
      html+='<div class="conflict-warning">'+ic('alert-triangle','icon-sm')+' '+esc(c)+'</div>';
    });
  }else{
    html+='<div class="card" style="text-align:center;color:var(--c-text-sub)">';
    html+=ic('check-circle','icon-lg');
    html+='<div style="font-size:14px;margin-top:4px">本周无时间冲突</div>';
    html+='</div>';
  }

  document.getElementById('page-plan').innerHTML=html;
}

function renderPlanWeek(todayNum){
  var html='';
  for(var d=1;d<=7;d++){
    var dayTasks=state.tasks.filter(function(t){return effDay(t)===d;});
    if(dayTasks.length===0) continue;
    dayTasks.sort(function(a,b){return toMin(effTime(a))-toMin(effTime(b));});
    var isToday=d===todayNum;

    html+='<div class="day-group">';
    html+='<div class="day-header">'+esc(DAY_NAMES[d]);
    if(isToday) html+=' <span class="today-tag">今天</span>';
    html+='<span class="day-count">'+dayTasks.length+' 项</span></div>';
    dayTasks.forEach(function(t){ html+=taskItemHtml(t); });
    html+='</div>';
  }
  return html;
}

/* 月视图：本周7天映射到当月日历 */
function mondayOfCurrentWeek(){
  var now=new Date();
  var day=now.getDay()===0?7:now.getDay();
  var d=new Date(now.getFullYear(),now.getMonth(),now.getDate()-(day-1));
  return d;
}

function renderPlanMonth(todayNum){
  var html='';
  var now=new Date();
  var y=now.getFullYear(),m=now.getMonth();
  var first=new Date(y,m,1);
  var startOffset=first.getDay(); // 0=周日
  var daysInMonth=new Date(y,m+1,0).getDate();
  var monday=mondayOfCurrentWeek();
  var dateByDay={};
  for(var i=1;i<=7;i++){
    var dd=new Date(monday.getFullYear(),monday.getMonth(),monday.getDate()+(i-1));
    dateByDay[i]=dd;
  }

  html+='<div class="month-title">'+y+'年'+(m+1)+'月</div>';
  html+='<div class="mg-head">';
  ['日','一','二','三','四','五','六'].forEach(function(w){ html+='<div>'+w+'</div>'; });
  html+='</div>';
  html+='<div class="mg-grid">';
  for(var b=0;b<startOffset;b++) html+='<div class="mg-cell empty"></div>';
  for(var dm=1;dm<=daysInMonth;dm++){
    var cellDate=new Date(y,m,dm);
    var dayNum=null;
    for(var k=1;k<=7;k++){
      if(dateByDay[k].getDate()===dm&&dateByDay[k].getMonth()===m){ dayNum=k; break; }
    }
    var isTodayCell=(now.getDate()===dm&&now.getMonth()===m);
    var cls='mg-cell'+(isTodayCell?' today':'')+(dayNum?' has':'');
    html+='<div class="'+cls+'"><div class="mg-num">'+dm+'</div>';
    if(dayNum){
      html+='<div class="mg-dots">';
      var mods={};
      state.tasks.forEach(function(t){ if(effDay(t)===dayNum) mods[t.module]=1; });
      Object.keys(mods).forEach(function(mod){
        html+='<span class="mg-dot" style="background:'+getModuleColor(mod)+'"></span>';
      });
      html+='</div>';
    }
    html+='</div>';
  }
  html+='</div>';

  // 本周逐日列表
  html+='<div class="section-title">本周日程</div>';
  for(var d2=1;d2<=7;d2++){
    var dayTasks=state.tasks.filter(function(t){return effDay(t)===d2;});
    if(dayTasks.length===0) continue;
    dayTasks.sort(function(a,b){return toMin(effTime(a))-toMin(effTime(b));});
    html+='<div class="day-group">';
    html+='<div class="day-header">'+esc(fmtDate(dateByDay[d2]))+' '+esc(DAY_NAMES[d2]);
    if(d2===todayNum) html+=' <span class="today-tag">今天</span>';
    html+='</div>';
    dayTasks.forEach(function(t){ html+=taskItemHtml(t); });
    html+='</div>';
  }
  return html;
}

function checkConflicts(){
  var conflicts=[];
  var byDay={};
  state.tasks.forEach(function(t){
    var d=effDay(t);
    if(!byDay[d]) byDay[d]=[];
    byDay[d].push(t);
  });
  Object.keys(byDay).forEach(function(d){
    var tasks=byDay[d].sort(function(a,b){return toMin(effTime(a))-toMin(effTime(b));});
    for(var i=0;i<tasks.length-1;i++){
      var t1=tasks[i],t2=tasks[i+1];
      var t1End=toMin(effTime(t1))+(t1.duration||60);
      if(t1End>toMin(effTime(t2))){
        conflicts.push(DAY_NAMES[d]+' '+effTime(t1)+'「'+t1.title+'」与 '+effTime(t2)+'「'+t2.title+'」时间重叠');
      }
    }
  });
  return conflicts;
}

/* ===== 页面：学习 ===== */
function renderLearn(){
  var html='';

  // 进行中的课程
  var inProgress=Object.keys(state.courseProgress).filter(function(cid){
    var cp=state.courseProgress[cid];
    return COURSES[cid]&&!cp.completed;
  });

  html+='<div class="section-title">进行中</div>';
  if(inProgress.length===0){
    html+='<div class="empty-state">'+ic('book-open','icon-xl')+'<div class="es-text">还没有进行中的课程</div></div>';
  }else{
    inProgress.forEach(function(cid){
      var course=COURSES[cid];
      var cp=state.courseProgress[cid];
      var mod=MODULES[course.module];
      var pct=Math.round(cp.stepIdx/course.steps.length*100);
      html+='<div class="card card-tap" data-action="open-course" data-course="'+esc(cid)+'">';
      html+='<div class="flex-row" style="justify-content:space-between">';
      html+='<div class="flex-row" style="gap:10px"><div class="ti-icon '+mod.cls+'" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px">'+ic(mod.icon)+'</div>';
      html+='<div><div style="font-size:16px;font-weight:600">'+esc(course.title)+'</div>';
      html+='<div style="font-size:13px;color:var(--c-text-sub)">'+esc(mod.name)+' · 已完成 '+cp.stepIdx+'/'+course.steps.length+' 步</div></div></div>';
      html+=ic('chevron-right');
      html+='</div>';
      html+='<div class="progress-bar" style="margin-top:10px"><div class="progress-fill" style="width:'+pct+'%;background:var(--c-primary)"></div></div>';
      html+='</div>';
    });
  }

  // 今日课程
  html+='<div class="section-title">今日课程</div>';
  var todayNum=getTodayDayNum();
  var todayTasks=state.tasks.filter(function(t){return effDay(t)===todayNum;});
  if(todayTasks.length===0){
    html+='<div class="empty-state">'+ic('calendar','icon-xl')+'<div class="es-text">今天没有学习任务</div></div>';
  }else{
    todayTasks.forEach(function(t){
      var course=COURSES[t.courseId];
      if(!course) return;
      var mod=MODULES[t.module];
      var badge=taskBadge(t);
      html+='<div class="card card-tap" data-action="open-course" data-course="'+esc(t.courseId)+'" data-task="'+esc(t.id)+'">';
      html+='<div class="flex-row" style="justify-content:space-between">';
      html+='<div class="flex-row" style="gap:10px"><div class="ti-icon '+mod.cls+'" style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px">'+ic(mod.icon)+'</div>';
      html+='<div><div style="font-size:16px;font-weight:600">'+esc(course.title)+'</div>';
      html+='<div style="font-size:13px;color:var(--c-text-sub)">'+esc(taskTimeLabel(t))+' · '+course.steps.length+' 步</div></div></div>';
      html+='<span class="ti-status '+badge.cls+'">'+esc(badge.label)+'</span>';
      html+='</div>';
      html+='</div>';
    });
  }

  // 全部课程（按模块）
  html+='<div class="section-title">Week 1 全部课程</div>';
  var moduleOrder=['fitness','film','cooking','violin','review'];
  moduleOrder.forEach(function(mod){
    var modCourses=Object.keys(COURSES).filter(function(cid){return COURSES[cid].module===mod;});
    if(modCourses.length===0) return;
    var m=MODULES[mod];
    html+='<div class="module-block">';
    html+='<div class="module-block-title">'+ic(m.icon,'icon-sm')+' '+esc(m.name)+'<span>'+modCourses.length+' 课</span></div>';
    modCourses.forEach(function(cid){
      var course=COURSES[cid];
      var cp=state.courseProgress[cid];
      var status='未开始';
      if(cp){
        status=cp.completed?(cp.evidenceDone||!course.requiredEvidence?'已完成':'成果待补'):(cp.stepIdx+'/'+course.steps.length+' 步');
      }
      html+='<div class="task-item" data-action="open-course" data-course="'+esc(cid)+'">';
      html+='<div class="ti-icon '+m.cls+'" style="width:32px;height:32px">'+ic(m.icon,'icon-sm')+'</div>';
      html+='<div class="ti-info"><div class="ti-title" style="font-size:14px">'+esc(course.title)+'</div>';
      html+='<div class="ti-time">'+course.steps.length+' 步 · '+esc(course.estimated)+'</div></div>';
      html+='<span class="ti-status st-pending">'+esc(status)+'</span>';
      html+='</div>';
    });
    html+='</div>';
  });

  document.getElementById('page-learn').innerHTML=html;
}

/* ===== 页面：成长 ===== */
function buildStrengthArchive(){
  var rec={};
  state.growth.fitness.sessions.forEach(function(s){
    Object.keys(s.exercises||{}).forEach(function(k){
      var ex=s.exercises[k];
      if(ex.weight===undefined||ex.weight===null||ex.weight==='') return;
      var w=parseFloat(ex.weight);
      if(isNaN(w)) return;
      if(!rec[k]) rec[k]={initial:w,current:w};
      else rec[k].current=w;
    });
  });
  return ['chest','pulldown','row','legpress','shoulder'].filter(function(k){return rec[k];})
    .map(function(k){return {key:k,name:EXERCISES[k],initial:rec[k].initial,current:rec[k].current};});
}

function renderGrowth(){
  var html='';
  var completed=getCompletedCount();
  var total=getTotalCount();
  var pct=total>0?Math.round(completed/total*100):0;

  html+='<div class="growth-summary">';
  html+='<div class="gs-week">Week 1 完成度</div>';
  html+='<div class="gs-count">'+pct+'<span style="font-size:20px;color:var(--c-text-sub)">%</span></div>';
  html+='<div class="gs-bar"><div class="progress-fill" style="width:'+pct+'%;background:linear-gradient(90deg,var(--c-primary),var(--c-film))"></div></div>';
  html+='<div style="font-size:13px;color:var(--c-text-sub);margin-top:8px">'+completed+'/'+total+' 任务完成 · 全部记录来自真实课程数据</div>';
  html+='</div>';

  // 四大模块
  html+='<div class="section-title">四大模块成果</div>';
  var moduleOrder=['fitness','film','cooking','violin'];
  moduleOrder.forEach(function(mod){
    var m=MODULES[mod];
    var modTasks=state.tasks.filter(function(t){return t.module===mod;});
    var modDone=modTasks.filter(function(t){return t.status==='completed';}).length;
    var extra='';
    if(mod==='fitness'){
      var archive=buildStrengthArchive();
      extra=state.growth.fitness.sessions.length+' 次训练 · '+archive.length+' 项力量档案';
    }else if(mod==='film'){
      extra=state.growth.film.works.length+' 部作品';
    }else if(mod==='cooking'){
      extra=state.growth.cooking.recipes.length+' 道菜品';
    }else if(mod==='violin'){
      extra=state.growth.violin.recordings.length+' 段录像';
    }
    html+='<div class="module-card" data-action="nav" data-page="learn">';
    html+='<div class="mc-header">';
    html+='<div class="ti-icon '+m.cls+'">'+ic(m.icon)+'</div>';
    html+='<div class="mc-name">'+esc(m.name)+'</div>';
    html+='<div class="mc-done" style="color:'+m.color+'">'+modDone+'/'+modTasks.length+'</div>';
    html+='</div>';
    html+='<div class="mc-sub">'+esc(extra)+'</div>';
    html+='</div>';
  });

  // 力量档案
  var archive=buildStrengthArchive();
  if(archive.length>0){
    html+='<div class="section-title">力量档案</div>';
    html+='<div class="card"><table class="strength-table">';
    html+='<tr><th style="text-align:left">动作</th><th>初始重量</th><th>当前重量</th></tr>';
    archive.forEach(function(s){
      html+='<tr><td style="text-align:left">'+esc(s.name)+'</td>';
      html+='<td>'+s.initial+'kg</td>';
      html+='<td>'+(s.current===s.initial?'—':s.current+'kg')+'</td></tr>';
    });
    html+='</table></div>';
  }

  // 作品墙
  if(state.growth.film.works.length>0){
    html+='<div class="section-title">作品墙</div>';
    state.growth.film.works.forEach(function(w){
      html+='<div class="work-card">';
      html+='<div class="wc-num">作品 '+String(w.serial).padStart(3,'0')+'</div>';
      html+='<div class="wc-title">'+esc(w.title||'未命名')+'</div>';
      var meta=[];
      if(w.duration) meta.push(w.duration+'秒');
      if(w.usedClips) meta.push(w.usedClips+'个镜头');
      if(meta.length) html+='<div style="font-size:13px;color:var(--c-text-sub)">'+esc(meta.join(' · '))+'</div>';
      html+='</div>';
    });
  }

  // 菜谱
  if(state.growth.cooking.recipes.length>0){
    html+='<div class="section-title">已学菜谱</div>';
    state.growth.cooking.recipes.forEach(function(r){
      var taste=r.ratings&&r.ratings.taste?r.ratings.taste+'/5':'';
      html+='<div class="recipe-card">';
      html+='<div style="font-size:15px;font-weight:600">'+esc(r.title)+'</div>';
      if(taste) html+='<div style="font-size:13px;color:var(--c-text-sub);margin-top:2px">味道评分 '+taste+'</div>';
      html+='</div>';
    });
  }

  // 录像
  if(state.growth.violin.recordings.length>0){
    html+='<div class="section-title">练习录像</div>';
    state.growth.violin.recordings.forEach(function(r){
      html+='<div class="recording-card">'+ic('video','icon-sm')+' '+esc(r.title)+'</div>';
    });
  }

  // 成果库（证据）
  html+='<div class="section-title">成果库 <span class="st-count" id="ev-count">'+state.evidence.length+'</span></div>';
  if(state.evidence.length===0){
    html+='<div class="empty-state">'+ic('camera','icon-xl')+'<div class="es-text">完成课程后上传的成果会显示在这里</div></div>';
  }else{
    html+='<div class="ev-grid">';
    state.evidence.slice().reverse().forEach(function(ev){
      var mod=MODULES[ev.module]||MODULES.review;
      var evId=ev.id||evRecordId(ev.courseId,ev.step);
      html+='<div class="ev-card" data-action="view-evidence" data-id="'+esc(evId)+'">';
      if(ev.thumb){
        html+='<img class="ev-card-img" src="'+ev.thumb+'" alt="'+esc(ev.title)+'">';
      }else if(ev.kind==='link'&&ev.link){
        html+='<div class="ev-card-ph">'+ic('link','icon-lg')+'<span>链接</span></div>';
      }else if(ev.kind==='video'){
        html+='<div class="ev-card-ph">'+ic('video','icon-lg')+'<span>视频</span></div>';
      }else{
        html+='<div class="ev-card-ph">'+ic(mod.icon,'icon-lg')+'<span>'+esc(mod.name)+'</span></div>';
      }
      if(ev.kind==='video'&&ev.thumb) html+='<div class="ev-card-play">'+ic('play','icon-sm')+'</div>';
      html+='<div class="ev-card-title">'+esc(ev.title)+'</div>';
      html+='<div class="ev-card-date">'+esc(ev.date)+'</div>';
      html+='</div>';
    });
    html+='</div>';
  }

  // 技能树
  html+='<div class="section-title">技能树</div>';
  html+='<div class="card">';
  Object.keys(state.skills).forEach(function(mod){
    var m=MODULES[mod];
    if(!m) return;
    html+='<div class="skill-module-title">'+ic(m.icon,'icon-sm')+' '+esc(m.name)+'</div>';
    state.skills[mod].forEach(function(s){
      var dots='';
      for(var i=0;i<3;i++) dots+='<div class="skill-dot '+(i<s.l?'on':'')+'"></div>';
      html+='<div class="skill-row">';
      html+='<span class="skill-name">'+esc(s.n)+'</span>';
      if(s.l===0) html+='<span class="skill-lock">'+ic('lock','icon-sm')+' 未解锁</span>';
      else html+='<div class="skill-dots">'+dots+'</div>';
      html+='</div>';
    });
  });
  html+='</div>';

  // 时间线
  if(state.timeline.length>0){
    html+='<div class="section-title">成长时间线</div>';
    html+='<div class="card">';
    state.timeline.slice().reverse().forEach(function(tl){
      html+='<div class="timeline-item">';
      html+='<div class="timeline-date">'+esc(tl.date)+'</div>';
      html+='<div class="timeline-content">'+esc(tl.text)+'</div>';
      html+='</div>';
    });
    html+='</div>';
  }

  // 周报
  html+='<div class="section-title">成长周报</div>';
  if(state.weeklyReports.length>0){
    state.weeklyReports.forEach(function(wr){
      html+='<div class="weekly-report">';
      html+='<div style="font-size:17px;font-weight:700;margin-bottom:8px">Week '+wr.week+' · '+esc(wr.date||'')+'</div>';
      html+='<div class="wr-stat"><span>完成率</span><span>'+wr.completionRate+'%（'+wr.completedTasks+'/'+wr.totalTasks+'）</span></div>';
      html+='<div class="wr-stat"><span>成果数</span><span>'+wr.evidenceCount+'</span></div>';
      if(wr.q1) html+='<div class="wr-q"><span class="wr-q-label">最有成就感的事</span><span>'+esc(wr.q1)+'</span></div>';
      if(wr.q2) html+='<div class="wr-q"><span class="wr-q-label">最困难模块</span><span>'+esc(wr.q2)+'</span></div>';
      if(wr.q3) html+='<div class="wr-q"><span class="wr-q-label">为什么困难</span><span>'+esc(wr.q3)+'</span></div>';
      if(wr.q4) html+='<div class="wr-q"><span class="wr-q-label">下周调整</span><span>'+esc(wr.q4)+'</span></div>';
      html+='</div>';
    });
  }else{
    html+='<div class="empty-state">'+ic('chart-column','icon-xl')+'<div class="es-text">周日完成「Week 1 成长周报」后生成</div></div>';
  }

  document.getElementById('page-growth').innerHTML=html;
}

/* ===== 页面：我的 ===== */
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
  html+='<div class="si-label">导出数据（JSON 备份）</div>';
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

/* ===== 我的：操作 ===== */
function editProfileField(field){
  var p=state.profile;
  var conf={height:{title:'修改身高',label:'身高（cm）',val:p.height},weight:{title:'修改体重',label:'当前体重（kg）',val:p.weight},targetWeight:{title:'修改目标体重',label:'目标体重（kg）',val:p.targetWeight}}[field];
  if(!conf) return;
  showInputModal(conf.title,conf.label,'number',conf.val,function(v){
    var n=parseFloat(v);
    if(isNaN(n)){ alert('请输入数字'); return; }
    state.profile[field]=n;
    saveState();
    navigate('profile');
  });
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
          state=data;
          saveState();
          applyTheme();
          alert('导入成功');
          navigate('today');
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
  var data=JSON.stringify(state,null,2);
  var blob=new Blob([data],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;
  a.download='personal-growth-backup-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
  URL.revokeObjectURL(url);
}

function resetData(){
  if(confirm('确定重置所有数据？此操作不可恢复。\n\n（包括任务进度与已上传的成果照片/视频）')){
    localStorage.removeItem('pgos_state');
    state=getDefaults();
    saveState();
    applyTheme();
    // 同步清空 IndexedDB 里的成果文件
    if(typeof EvidenceDB!=='undefined'){
      EvidenceDB.clearAll().catch(function(){});
    }
    navigate('today');
  }
}

/* ===== 输入弹窗 ===== */
function showInputModal(title,placeholder,type,defVal,callback){
  var modal=document.getElementById('input-modal');
  var content=document.getElementById('input-modal-content');
  var html='';
  html+='<div class="input-modal-title">'+esc(title)+'</div>';
  html+='<label>'+esc(placeholder)+'</label>';
  html+='<input type="number" id="modal-input" value="'+esc(defVal)+'" placeholder="'+esc(placeholder)+'">';
  html+='<div class="input-modal-btns">';
  html+='<button class="btn btn-secondary" style="flex:1" data-action="close-input-modal">取消</button>';
  html+='<button class="btn btn-primary" style="flex:1" data-action="submit-input-modal">确定</button>';
  html+='</div>';
  content.innerHTML=html;
  modal.classList.add('active');
  modal._callback=callback;
  var input=document.getElementById('modal-input');
  if(input){ input.focus(); if(input.select) input.select(); }
}

function closeInputModal(){
  var modal=document.getElementById('input-modal');
  modal.classList.remove('active');
  modal._callback=null;
}

function submitInputModal(){
  var input=document.getElementById('modal-input');
  var modal=document.getElementById('input-modal');
  var val=input?input.value:'';
  var cb=modal._callback;
  closeInputModal();
  if(cb&&val!=='') cb(val);
}

/* ===== 底部操作面板（任务操作/调整/跳过） ===== */
function openSheet(html){
  var modal=document.getElementById('sheet-modal');
  document.getElementById('sheet-content').innerHTML=html;
  modal.classList.add('active');
}

function closeSheet(){
  document.getElementById('sheet-modal').classList.remove('active');
  sheetSel={};
}

/* 任务操作面板（PRD §7.2） */
function openTaskSheet(taskId){
  var t=state.tasks.find(function(x){return x.id===taskId;});
  if(!t) return;
  var mod=MODULES[t.module];
  var badge=taskBadge(t);
  var course=COURSES[t.courseId];
  var cp=state.courseProgress[t.courseId];

  var html='';
  html+='<div class="sheet-task-info">';
  html+='<div class="ti-icon '+mod.cls+'">'+ic(mod.icon)+'</div>';
  html+='<div style="flex:1;min-width:0">';
  html+='<div style="font-size:16px;font-weight:600">'+esc(t.title)+'</div>';
  html+='<div style="font-size:13px;color:var(--c-text-sub)">'+esc(DAY_NAMES[effDay(t)])+' '+esc(taskTimeLabel(t))+' · '+esc(taskDurationLabel(t))+'</div>';
  html+='</div>';
  html+='<span class="ti-status '+badge.cls+'">'+esc(badge.label)+'</span>';
  html+='</div>';

  var cta='开始课程';
  if(t.status==='in_progress') cta=cp&&cp.completed?'补传成果':'继续课程';
  if(t.status==='paused') cta='继续课程';
  html+='<button class="as-btn primary" data-action="sheet-start" data-task="'+esc(t.id)+'">'+ic('play','icon-sm')+' '+cta+'</button>';

  if(t.status!=='completed'&&t.status!=='skipped'){
    html+='<button class="as-btn" data-action="sheet-adjust" data-task="'+esc(t.id)+'">'+ic('clock','icon-sm')+' 调整时间（保留原安排）</button>';
  }
  if(t.status==='in_progress'){
    html+='<button class="as-btn" data-action="sheet-pause" data-task="'+esc(t.id)+'">'+ic('pause','icon-sm')+' 暂停任务（进度保留）</button>';
  }
  if(t.status!=='completed'&&t.status!=='skipped'){
    html+='<button class="as-btn danger" data-action="sheet-skip" data-task="'+esc(t.id)+'">'+ic('skip-forward','icon-sm')+' 跳过本周任务</button>';
  }
  html+='<button class="as-btn cancel" data-action="close-sheet">取消</button>';

  openSheet(html);
}

/* 调整时间弹窗（原因 + 冲突检测） */
function openAdjustSheet(taskId){
  var t=state.tasks.find(function(x){return x.id===taskId;});
  if(!t) return;
  sheetSel={taskId:taskId,day:effDay(t),time:effTime(t),reason:''};
  renderAdjustSheet();
}

function renderAdjustSheet(){
  var t=state.tasks.find(function(x){return x.id===sheetSel.taskId;});
  if(!t) return;
  var html='';
  html+='<div class="input-modal-title">调整「'+esc(t.title)+'」</div>';

  html+='<div class="sheet-label">调整到哪一天</div>';
  html+='<div class="day-picker">';
  for(var d=1;d<=7;d++){
    html+='<button class="'+(sheetSel.day===d?'active':'')+'" data-action="adjust-day" data-day="'+d+'">'+DAY_NAMES[d]+'</button>';
  }
  html+='</div>';

  html+='<div class="sheet-label">开始时间</div>';
  html+='<input type="time" class="sheet-time" value="'+esc(sheetSel.time)+'" oninput="onAdjustTime(this.value)">';

  html+='<div class="sheet-label">调整原因（必选）</div>';
  html+='<div class="chip-row">';
  RESCHEDULE_REASONS.forEach(function(r){
    html+='<button class="chip '+(sheetSel.reason===r?'active':'')+'" data-action="adjust-reason" data-reason="'+esc(r)+'">'+esc(r)+'</button>';
  });
  html+='</div>';

  var conflict=adjustConflict(sheetSel.day,sheetSel.time);
  if(conflict){
    html+='<div class="conflict-warning">'+ic('alert-triangle','icon-sm')+' '+esc(conflict)+'</div>';
  }
  if(t.status==='in_progress'||t.status==='paused'){
    html+='<div class="sheet-note">'+ic('alert-triangle','icon-sm')+' 任务进行中，调整后进度会保留</div>';
  }

  html+='<div class="input-modal-btns">';
  html+='<button class="btn btn-secondary" style="flex:1" data-action="close-sheet">取消</button>';
  html+='<button class="btn btn-primary" style="flex:1" data-action="adjust-confirm">确认调整</button>';
  html+='</div>';

  openSheet(html);
}

function onAdjustTime(v){
  sheetSel.time=v;
  var conflict=adjustConflict(sheetSel.day,sheetSel.time);
  var existing=document.querySelector('#sheet-content .conflict-warning');
  if(conflict&&!existing){
    var btns=document.querySelector('#sheet-content .input-modal-btns');
    if(btns){
      var div=document.createElement('div');
      div.className='conflict-warning';
      div.innerHTML=ic('alert-triangle','icon-sm')+' '+esc(conflict);
      btns.parentNode.insertBefore(div,btns);
    }
  }else if(!conflict&&existing){
    existing.remove();
  }
}

function adjustConflict(day,time){
  var t=state.tasks.find(function(x){return x.id===sheetSel.taskId;});
  if(!t) return null;
  var start=toMin(time),end=start+(t.duration||60);
  var hit=state.tasks.find(function(x){
    if(x.id===t.id) return false;
    if(effDay(x)!==day) return false;
    if(['completed','skipped'].indexOf(x.status)>=0) return false;
    var s=toMin(effTime(x));
    return start<s+(x.duration||60)&&s<end;
  });
  if(hit) return DAY_NAMES[day]+' '+effTime(hit)+' 已安排「'+hit.title+'」，时间重叠';
  return null;
}

function applyReschedule(){
  var t=state.tasks.find(function(x){return x.id===sheetSel.taskId;});
  if(!t) return;
  if(!sheetSel.reason){ alert('请选择调整原因'); return; }
  var oldDay=effDay(t),oldTime=effTime(t);
  t.newDay=sheetSel.day;
  t.newTime=sheetSel.time;
  t.status='rescheduled';
  t.rescheduleReason=sheetSel.reason;
  state.rescheduleEvents.push({
    taskId:t.id,
    from:DAY_NAMES[oldDay]+' '+oldTime,
    to:DAY_NAMES[sheetSel.day]+' '+sheetSel.time,
    reason:sheetSel.reason,
    at:Date.now()
  });
  state.timeline.push({date:fmtDate(new Date()),text:'调整了「'+t.title+'」：'+DAY_NAMES[oldDay]+' '+oldTime+' → '+DAY_NAMES[sheetSel.day]+' '+sheetSel.time+'（'+sheetSel.reason+'）'});
  saveState();
  closeSheet();
  navigate(currentPage);
}

/* 跳过弹窗（记录原因） */
function openSkipSheet(taskId){
  var t=state.tasks.find(function(x){return x.id===taskId;});
  if(!t) return;
  sheetSel={taskId:taskId,reason:''};
  var html='';
  html+='<div class="input-modal-title">跳过「'+esc(t.title)+'」</div>';
  html+='<div style="font-size:13px;color:var(--c-text-sub);margin-bottom:12px;text-align:center">跳过仅对本周生效，课程内容仍可在「学习」页随时查看</div>';
  html+='<div class="sheet-label">跳过原因（必选）</div>';
  html+='<div class="chip-row">';
  RESCHEDULE_REASONS.forEach(function(r){
    html+='<button class="chip '+(sheetSel.reason===r?'active':'')+'" data-action="skip-reason" data-reason="'+esc(r)+'">'+esc(r)+'</button>';
  });
  html+='</div>';
  html+='<div class="input-modal-btns">';
  html+='<button class="btn btn-secondary" style="flex:1" data-action="close-sheet">取消</button>';
  html+='<button class="btn btn-danger" style="flex:1" data-action="skip-confirm">确认跳过</button>';
  html+='</div>';
  openSheet(html);
}

function applySkip(){
  var t=state.tasks.find(function(x){return x.id===sheetSel.taskId;});
  if(!t) return;
  if(!sheetSel.reason){ alert('请选择跳过原因'); return; }
  t.status='skipped';
  t.skipReason=sheetSel.reason;
  state.timeline.push({date:fmtDate(new Date()),text:'跳过了「'+t.title+'」（'+sheetSel.reason+'）'});
  saveState();
  closeSheet();
  navigate(currentPage);
}

function applyPause(taskId){
  var t=state.tasks.find(function(x){return x.id===taskId;});
  if(!t) return;
  t.status='paused';
  saveState();
  closeSheet();
  navigate(currentPage);
}

/* ===== 课程引擎 ===== */
function openCourse(courseId,taskId){
  var course=COURSES[courseId];
  if(!course) return;
  currentCourse=courseId;
  currentTaskId=taskId||null;
  if(!state.courseProgress[courseId]){
    state.courseProgress[courseId]={stepIdx:0,completed:false,evidenceDone:false,stepData:{}};
    saveState();
  }
  courseView='intro';
  var overlay=document.getElementById('course-overlay');
  overlay.classList.add('active');
  document.getElementById('course-title').textContent=course.title;
  document.getElementById('icon-back').innerHTML=svgIcon('chevron-left');
  renderCourseOverlay();
}

function renderCourseOverlay(){
  var overlay=document.getElementById('course-overlay');
  overlay.classList.toggle('intro-mode',courseView==='intro');
  var course=COURSES[currentCourse];
  document.getElementById('course-title').textContent=course.title;
  if(courseView==='intro'){
    document.getElementById('course-body').innerHTML=renderCourseIntro(course);
  }else{
    renderCourseStep();
  }
}

function svgIcon(name){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>';
}

/* 课程简介页 */
function renderCourseIntro(course){
  var cp=state.courseProgress[currentCourse];
  var mod=MODULES[course.module];
  var html='';

  html+='<div class="intro-hero">';
  html+='<div class="intro-mod '+mod.cls+'">'+ic(mod.icon)+' '+esc(mod.name)+'</div>';
  html+='<div class="intro-title">'+esc(course.title)+'</div>';
  html+='<div class="intro-est">'+esc(course.estimated)+'</div>';
  html+='</div>';

  html+='<div class="card">';
  html+='<div class="card-title">今日目标</div>';
  html+='<div class="intro-goal">'+esc(course.goal)+'</div>';
  html+='</div>';

  if(course.segments&&course.segments.length){
    html+='<div class="card">';
    html+='<div class="card-title">今日分两段</div>';
    course.segments.forEach(function(s){
      html+='<div class="seg-row">';
      html+='<span class="seg-label">'+esc(s.label)+'</span>';
      html+='<span class="seg-time">'+esc(s.time)+'</span>';
      html+='<span class="seg-dur">'+s.duration+' 分钟</span>';
      html+='</div>';
    });
    html+='</div>';
  }

  html+='<div class="card">';
  html+='<div class="card-title">今日成果</div>';
  html+='<div class="intro-goal">'+esc(course.outcome)+'</div>';
  if(course.requiredEvidence){
    html+='<div class="evidence-req">'+ic('camera','icon-sm')+' 必需上传成果：'+esc(course.evidenceLabel||'成品记录')+'</div>';
  }else{
    html+='<div class="evidence-req optional">'+ic('check-circle','icon-sm')+' 本课无需上传成果</div>';
  }
  if(course.unlockSkills&&course.unlockSkills.length){
    html+='<div class="skill-unlock">'+ic('zap','icon-sm')+' 完成解锁技能：'+esc(course.unlockSkills.join('、'))+'</div>';
  }
  html+='</div>';

  html+='<div class="card">';
  html+='<div class="card-title">步骤预览（'+course.steps.length+' 步）</div>';
  course.steps.forEach(function(s,i){
    var segLabel='';
    if(course.segments&&s.segment!==undefined&&course.segments[s.segment]){
      segLabel=course.segments[s.segment].label;
    }
    html+='<div class="intro-step">';
    html+='<span class="is-num">'+(i+1)+'</span>';
    html+='<span class="is-title">'+esc(s.title)+'</span>';
    if(segLabel) html+='<span class="seg-chip">'+esc(segLabel)+'</span>';
    html+='<span class="is-tag '+(s.required===false?'opt':'req')+'">'+(s.required===false?'选做':'必做')+'</span>';
    html+='</div>';
  });
  html+='</div>';

  // CTA
  if(cp.completed){
    if(!cp.evidenceDone&&course.requiredEvidence){
      html+='<button class="btn btn-primary intro-cta" data-action="course-goto-evidence">'+ic('camera','icon-sm')+' 补传成果</button>';
    }
    html+='<div class="intro-done">'+ic('check-circle','icon-sm')+' 已完成'+(cp.evidenceDone||!course.requiredEvidence?'':'（成果待补）')+'</div>';
    html+='<button class="btn btn-secondary intro-cta" data-action="course-restart">'+ic('rotate-ccw','icon-sm')+' 重新学习</button>';
  }else if(cp.stepIdx>0){
    html+='<button class="btn btn-primary intro-cta" data-action="course-start-steps">'+ic('play','icon-sm')+' 继续学习 · 已完成 '+cp.stepIdx+'/'+course.steps.length+' 步</button>';
  }else{
    html+='<button class="btn btn-primary intro-cta" data-action="course-start-steps">'+ic('play','icon-sm')+' 开始学习</button>';
  }

  return html;
}

function startCourseSteps(){
  var course=COURSES[currentCourse];
  if(!course) return;
  if(currentTaskId){
    var t=state.tasks.find(function(x){return x.id===currentTaskId;});
    if(t&&(t.status==='pending'||t.status==='paused'||t.status==='rescheduled')){
      t.status='in_progress';
    }
  }
  courseView='steps';
  currentStepIdx=state.courseProgress[currentCourse].stepIdx||0;
  saveState();
  renderCourseOverlay();
}

function restartCourse(){
  var cp=state.courseProgress[currentCourse];
  cp.stepIdx=0;
  cp.completed=false;
  cp.resultState=null;
  currentStepIdx=0;
  saveState();
  startCourseSteps();
}

function gotoEvidenceStep(){
  var course=COURSES[currentCourse];
  var cp=state.courseProgress[currentCourse];
  for(var i=0;i<course.steps.length;i++){
    var hasEv=(course.steps[i].components||[]).some(function(c){return c.type==='evidence';});
    var sd=cp.stepData[i]||{};
    if(hasEv&&!sd.evidence){
      cp.stepIdx=i;
      currentStepIdx=i;
      saveState();
      courseView='steps';
      renderCourseOverlay();
      return;
    }
  }
  courseView='steps';
  currentStepIdx=cp.stepIdx||0;
  renderCourseOverlay();
}

/* 课程步骤渲染 */
function renderCourseStep(){
  var course=COURSES[currentCourse];
  if(!course) return;
  var cp=state.courseProgress[currentCourse];
  currentStepIdx=Math.min(currentStepIdx,course.steps.length-1);
  var step=course.steps[currentStepIdx];
  if(!step) return;

  // 进度点
  var dotsHtml='';
  course.steps.forEach(function(s,i){
    var cls='course-dot';
    if(i<cp.stepIdx) cls+=' done';
    else if(i===cp.stepIdx) cls+=' current';
    dotsHtml+='<div class="'+cls+'"></div>';
  });
  document.getElementById('course-progress').innerHTML=dotsHtml;

  var html='';
  html+='<div class="step-head">';
  html+='<div class="step-count">第 '+(currentStepIdx+1)+' / '+course.steps.length+' 步</div>';
  html+='<div class="step-title">'+esc(step.title)+'</div>';
  if(step.required===false) html+='<span class="is-tag opt step-tag">选做</span>';
  if(course.segments&&step.segment!==undefined&&course.segments[step.segment]){
    html+='<span class="seg-chip">'+esc(course.segments[step.segment].label)+'</span>';
  }
  html+='</div>';

  step.components.forEach(function(comp,idx){
    html+=renderComponent(comp,currentStepIdx,idx);
  });

  document.getElementById('course-body').innerHTML=html;

  var prevBtn=document.getElementById('course-prev');
  prevBtn.style.visibility=currentStepIdx>0?'visible':'hidden';
  document.getElementById('next-label').textContent=currentStepIdx>=course.steps.length-1?'完成课程':'下一步';
  document.getElementById('icon-prev').innerHTML=svgIcon('chevron-left');
  document.getElementById('icon-next').innerHTML=svgIcon('chevron-right');
}

/* ===== 六种课程组件渲染 ===== */
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
      html+='<div class="comp">';
      if(comp.label) html+='<div class="card-title" style="margin-bottom:8px">'+esc(comp.label)+'</div>';
      if(sdE.evidence){
        var evMeta=findEvidenceMeta(currentCourse,stepIdx);
        var evId=evRecordId(currentCourse,stepIdx);
        html+='<div class="evidence-uploaded" data-action="view-evidence" data-id="'+esc(evId)+'">';
        if(sdE.linkValue){
          html+='<div class="evu-row">'+ic('link','icon-sm')+'<span class="evu-link">'+esc(sdE.linkValue)+'</span></div>';
        }else if(evMeta&&evMeta.thumb){
          html+='<img class="evu-thumb" src="'+evMeta.thumb+'" alt="成果预览">';
        }else{
          html+='<div class="evu-row">'+ic('check-circle','icon-sm')+' '+(evMeta&&evMeta.kind==='video'?'视频已上传':'成果已上传')+'</div>';
        }
        html+='<div class="evu-hint">点击查看 / 删除</div>';
        html+='</div>';
      }else{
        var kinds=(comp.kinds||[]).join(' / ');
        var kindText=kinds||'文件';
        html+='<div class="evidence-area" data-action="upload-evidence" data-step="'+stepIdx+'">';
        html+=ic('camera','icon-lg');
        html+='<div>点击上传（'+esc(kindText)+'）</div>';
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

/* 统计组件（REVIEW-W1，只读真实数据） */
function renderStatsComponent(comp){
  var html='';
  if(comp.mode==='outcome'){
    html+='<div class="card-title" style="margin-bottom:12px">本周成果（真实记录）</div>';
    var rows=[
      {mod:'fitness',name:'健身',val:state.growth.fitness.sessions.length>0?state.growth.fitness.sessions.length+' 次训练 · '+buildStrengthArchive().length+' 项力量档案':null},
      {mod:'film',name:'拍摄剪辑',val:state.growth.film.works.length>0?state.growth.film.works.map(function(w){return '作品 '+String(w.serial).padStart(3,'0')+'《'+w.title+'》';}).join('；'):null},
      {mod:'cooking',name:'烹饪',val:state.growth.cooking.recipes.length>0?state.growth.cooking.recipes.map(function(r){return r.title;}).join('、'):null},
      {mod:'violin',name:'小提琴',val:state.growth.violin.recordings.length>0?state.growth.violin.recordings.length+' 段成长录像':null}
    ];
    rows.forEach(function(r){
      var m=MODULES[r.mod];
      html+='<div class="outcome-row">';
      html+='<span class="ti-icon '+m.cls+'" style="width:28px;height:28px">'+ic(m.icon,'icon-sm')+'</span>';
      html+='<span class="or-name">'+esc(r.name)+'</span>';
      if(r.val){
        html+='<span class="or-val">'+esc(r.val)+'</span>';
      }else{
        html+='<span class="or-val pending">待补</span>';
      }
      html+='</div>';
    });
    return html;
  }

  // 总览统计
  var completed=getCompletedCount();
  var total=getTotalCount();
  var skipped=state.tasks.filter(function(t){return t.status==='skipped';}).length;
  var mins=state.tasks.filter(function(t){return t.status==='completed';})
    .reduce(function(s,t){return s+(t.duration||0);},0);

  html+='<div class="card-title" style="margin-bottom:12px">本周统计（真实记录）</div>';
  html+='<div class="stats-grid">';
  html+='<div class="stat-cell"><div class="stat-val">'+completed+'/'+total+'</div><div class="stat-label">任务完成</div></div>';
  html+='<div class="stat-cell"><div class="stat-val">'+fmtDur(mins)+'</div><div class="stat-label">成长时长</div></div>';
  html+='<div class="stat-cell"><div class="stat-val">'+state.evidence.length+'</div><div class="stat-label">已传成果</div></div>';
  html+='<div class="stat-cell"><div class="stat-val">'+skipped+'</div><div class="stat-label">已跳过</div></div>';
  html+='</div>';

  html+='<div class="stats-modules">';
  ['fitness','film','cooking','violin'].forEach(function(mod){
    var m=MODULES[mod];
    var modTasks=state.tasks.filter(function(t){return t.module===mod;});
    var done=modTasks.filter(function(t){return t.status==='completed';}).length;
    var pct=modTasks.length>0?Math.round(done/modTasks.length*100):0;
    html+='<div class="stats-mod-row">';
    html+='<span class="ti-icon '+m.cls+'" style="width:26px;height:26px">'+ic(m.icon,'icon-sm')+'</span>';
    html+='<span class="sm-name">'+esc(m.name)+'</span>';
    html+='<div class="progress-bar" style="flex:1;margin:0"><div class="progress-fill" style="width:'+pct+'%;background:'+m.color+'"></div></div>';
    html+='<span class="sm-pct">'+done+'/'+modTasks.length+'</span>';
    html+='</div>';
  });
  html+='</div>';
  return html;
}

/* ===== 组件交互 ===== */
function toggleCheck(stepIdx,itemIdx){
  var cp=state.courseProgress[currentCourse];
  if(!cp.stepData[stepIdx]) cp.stepData[stepIdx]={};
  if(!cp.stepData[stepIdx].checklist) cp.stepData[stepIdx].checklist={};
  cp.stepData[stepIdx].checklist[itemIdx]=!cp.stepData[stepIdx].checklist[itemIdx];
  saveState();
  renderCourseStep();
}

function setRecordField(key,value,stepIdx){
  var cp=state.courseProgress[currentCourse];
  if(!cp.stepData[stepIdx]) cp.stepData[stepIdx]={};
  if(!cp.stepData[stepIdx].record) cp.stepData[stepIdx].record={};
  cp.stepData[stepIdx].record[key]=value;
  // 更新"沿用上次"档案
  var course=COURSES[currentCourse];
  if(course){
    course.steps[stepIdx].components.forEach(function(comp){
      if(comp.type==='record'){
        (comp.fields||[]).forEach(function(f){
          if(f.key===key&&f.useLast&&value!==''&&!isNaN(parseFloat(value))){
            state.lastValues[f.useLast]=parseFloat(value);
          }
        });
      }
    });
  }
  saveState();
}

function setRating(key,value,stepIdx){
  setRecordField(key,value,stepIdx);
  var btns=document.querySelectorAll('#rating_'+key+' button');
  btns.forEach(function(b,i){
    b.classList.toggle('active',i<value);
  });
}

function useLastValue(key,stepIdx,useKey){
  var last=state.lastValues[useKey];
  if(last===undefined) return;
  setRecordField(key,String(last),stepIdx);
  renderCourseStep();
}

function toggleSelfcheck(stepIdx,itemIdx){
  var cp=state.courseProgress[currentCourse];
  if(!cp.stepData[stepIdx]) cp.stepData[stepIdx]={};
  if(!cp.stepData[stepIdx].selfcheck) cp.stepData[stepIdx].selfcheck={};
  var cur=cp.stepData[stepIdx].selfcheck[itemIdx];
  // 循环：未确认 → 是 → 否 → 未确认
  if(cur===undefined||cur===null) cp.stepData[stepIdx].selfcheck[itemIdx]=true;
  else if(cur===true) cp.stepData[stepIdx].selfcheck[itemIdx]=false;
  else delete cp.stepData[stepIdx].selfcheck[itemIdx];
  saveState();
  renderCourseStep();
}

function simulateUpload(stepIdx){
  // 真实上传入口：选择文件 → 压缩存储 → 更新状态
  uploadEvidence(stepIdx);
}

/* 找到某步骤里的 evidence 组件定义 */
function findEvidenceComp(course,stepIdx){
  var step=course.steps[stepIdx];
  if(!step) return null;
  for(var i=0;i<(step.components||[]).length;i++){
    if(step.components[i].type==='evidence') return step.components[i];
  }
  return null;
}

function evRecordId(courseId,stepIdx){ return courseId+'_'+stepIdx; }

/* 从 state.evidence 找记录（兼容无 id 的旧数据） */
function findEvidenceMeta(courseId,stepIdx){
  var id=evRecordId(courseId,stepIdx);
  return state.evidence.find(function(ev){ return ev.id===id||(ev.courseId===courseId&&ev.step===stepIdx); })||null;
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

  // 文件选择（图片/视频）
  var accept=[];
  if(kinds.indexOf('image')>=0) accept.push('image/*');
  if(kinds.indexOf('video')>=0) accept.push('video/*');
  var input=document.createElement('input');
  input.type='file';
  input.accept=accept.join(',');
  input.onchange=function(){
    if(!input.files||!input.files[0]) return;
    var file=input.files[0];
    var id=evRecordId(currentCourse,stepIdx);
    var meta={
      id:id,
      courseId:currentCourse,
      step:stepIdx,
      module:course.module,
      title:comp.label||course.evidenceLabel||course.outcome||course.title,
      date:fmtDate(new Date())
    };
    // 处理中提示
    var area=document.querySelector('.evidence-area');
    if(area){ area.innerHTML='<div style="padding:18px;font-size:14px;color:var(--c-text-sub)">处理中，请稍候…</div>'; }
    EvidenceDB.saveEvidence(file,meta).then(function(r){
      completeUpload(course,stepIdx,{kind:(r.mime||'').indexOf('video')===0?'video':'image',thumb:r.thumb,size:r.size});
    }).catch(function(err){
      alert('上传失败：'+(err&&err.message?err.message:'未知错误'));
      renderCourseStep();
    });
  };
  input.click();
}

/* 上传完成后的状态更新（图片/视频/链接共用） */
function completeUpload(course,stepIdx,info){
  var cp=state.courseProgress[currentCourse];
  cp.stepData[stepIdx].evidence=true;

  var id=evRecordId(currentCourse,stepIdx);
  var exists=state.evidence.find(function(ev){ return ev.id===id||(ev.courseId===currentCourse&&ev.step===stepIdx); });
  if(!exists){
    state.evidence.push({
      id:id,
      courseId:currentCourse,
      step:stepIdx,
      module:course.module,
      title:course.evidenceLabel||course.outcome||course.title,
      date:fmtDate(new Date()),
      kind:info.kind||'image',
      thumb:info.thumb||null,
      size:info.size||0,
      link:info.link||null
    });
  }else{
    exists.thumb=info.thumb||exists.thumb||null;
    exists.kind=info.kind||exists.kind;
    exists.size=info.size||exists.size||0;
    exists.link=info.link||exists.link||null;
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

/* 删除成果（查看器回调）：清 IndexedDB + state，课程步骤回到待上传 */
window.onEvidenceDeleted=function(id,meta){
  var m=meta||{};
  var courseId=m.courseId,step=m.step;
  // 旧数据兼容：从 id 解析
  if(courseId===undefined&&typeof id==='string'){
    var p=id.lastIndexOf('_');
    if(p>0){ courseId=id.slice(0,p); step=parseInt(id.slice(p+1),10); }
  }
  var idx=state.evidence.findIndex(function(ev){ return ev.id===id||(ev.courseId===courseId&&ev.step===step); });
  if(idx>=0) state.evidence.splice(idx,1);

  if(courseId&&COURSES[courseId]){
    var cp=state.courseProgress[courseId];
    var course=COURSES[courseId];
    if(cp&&cp.stepData&&cp.stepData[step]){
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

function allEvidenceUploaded(course,cp){
  var ok=true;
  course.steps.forEach(function(s,i){
    var hasEv=(s.components||[]).some(function(c){return c.type==='evidence';});
    if(hasEv){
      var sd=cp.stepData[i]||{};
      if(!sd.evidence) ok=false;
    }
  });
  return ok;
}

/* ===== 计时器 ===== */
var timerInterval=null;
var timerSeconds=0;
var timerRunning=false;
var timerTotal=0;
var timerStartedOnce=false;

function formatTime(sec){
  var m=Math.floor(sec/60),s=sec%60;
  return (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
}

function startTimerBtn(){
  if(timerRunning) return;
  var display=document.getElementById('timer-display');
  timerTotal=display?parseDisplay(display.textContent):timerTotal;
  timerRunning=true;
  if(!timerStartedOnce||timerSeconds<=0){
    timerSeconds=timerTotal;
    timerStartedOnce=true;
  }
  document.getElementById('timer-start').classList.add('hidden');
  document.getElementById('timer-pause').classList.remove('hidden');
  timerInterval=setInterval(function(){
    timerSeconds--;
    var d=document.getElementById('timer-display');
    if(d){
      d.textContent=formatTime(timerSeconds);
      if(timerSeconds<=10) d.classList.add('warning');
    }
    if(timerSeconds<=0){
      clearInterval(timerInterval);
      timerRunning=false;
      alert('时间到！');
      resetTimerBtn();
    }
  },1000);
}

function parseDisplay(txt){
  var p=String(txt||'').split(':');
  var v=parseInt(p[0],10)*60+parseInt(p[1]||0,10);
  return isNaN(v)||v<=0?0:v;
}

function pauseTimer(){
  clearInterval(timerInterval);
  timerRunning=false;
  document.getElementById('timer-pause').classList.add('hidden');
  var startBtn=document.getElementById('timer-start');
  startBtn.classList.remove('hidden');
  startBtn.innerHTML=ic('play','icon-sm')+' 继续';
}

function resetTimerBtn(){
  clearInterval(timerInterval);
  timerRunning=false;
  timerSeconds=timerTotal;
  timerStartedOnce=false;
  var d=document.getElementById('timer-display');
  if(d){
    d.textContent=formatTime(timerTotal);
    d.classList.remove('warning');
  }
  var startBtn=document.getElementById('timer-start');
  var pauseBtn=document.getElementById('timer-pause');
  if(startBtn){
    startBtn.classList.remove('hidden');
    startBtn.innerHTML=ic('play','icon-sm')+' 开始';
  }
  if(pauseBtn) pauseBtn.classList.add('hidden');
}

/* ===== 步骤完成校验与推进 ===== */
function stepSatisfied(course,stepIdx){
  var step=course.steps[stepIdx];
  var cp=state.courseProgress[currentCourse];
  var sd=cp.stepData[stepIdx]||{};
  var hasInteractive=false;
  var ok=true;
  (step.components||[]).forEach(function(comp){
    if(comp.type==='checklist'){
      hasInteractive=true;
      var items=comp.items||[];
      for(var i=0;i<items.length;i++){
        var req=typeof items[i]==='string'?true:(items[i].required!==false);
        if(req&&!sd.checklist) { ok=false; break; }
        if(req&&!sd.checklist[i]) ok=false;
      }
    }else if(comp.type==='record'){
      hasInteractive=true;
      var filled=false;
      (comp.fields||[]).forEach(function(f){
        var v=sd.record?sd.record[f.key]:undefined;
        if(v!==undefined&&v!==null&&v!=='') filled=true;
      });
      if(!filled) ok=false;
    }else if(comp.type==='evidence'){
      hasInteractive=true;
      if(!sd.evidence) ok=false;
    }else if(comp.type==='selfcheck'){
      hasInteractive=true;
      var any=false;
      (comp.items||[]).forEach(function(it,i){
        if(sd.selfcheck&&sd.selfcheck[i]!==undefined) any=true;
      });
      if(!any) ok=false;
    }else if(comp.type==='timer'){
      hasInteractive=true;
    }
  });
  if(!hasInteractive) return true;
  return ok;
}

function nextStep(){
  var course=COURSES[currentCourse];
  if(!course) return;
  var cp=state.courseProgress[currentCourse];
  var step=course.steps[currentStepIdx];

  if(step&&step.required!==false&&!stepSatisfied(course,currentStepIdx)){
    if(!confirm('这一步还有未完成的必做项，确定要继续吗？')) return;
  }

  if(currentStepIdx>=course.steps.length-1){
    completeCourse();
    return;
  }
  currentStepIdx++;
  cp.stepIdx=currentStepIdx;
  saveState();
  renderCourseStep();
}

function prevStep(){
  if(currentStepIdx<=0) return;
  currentStepIdx--;
  state.courseProgress[currentCourse].stepIdx=currentStepIdx;
  saveState();
  renderCourseStep();
}

function completeCourse(){
  var course=COURSES[currentCourse];
  var cp=state.courseProgress[currentCourse];
  var evDone=allEvidenceUploaded(course,cp);
  cp.stepIdx=course.steps.length;
  cp.completed=true;
  cp.evidenceDone=evDone;
  cp.resultState=(!evDone&&course.requiredEvidence)?'evidence_pending':'done';

  // 任务状态：成果未补齐则保持"进行中"（成果待补）
  if(currentTaskId){
    var t=state.tasks.find(function(x){return x.id===currentTaskId;});
    if(t){
      if(!course.requiredEvidence||evDone){
        t.status='completed';
      }else{
        t.status='in_progress';
      }
    }
  }

  processCourseData(course);
  state.timeline.push({date:fmtDate(new Date()),text:'完成课程「'+course.title+'」'});
  saveState();
  closeCourse();
  navigate(currentPage);
}

/* 课程完成 → 生成成长记录（02文档 §11） */
function processCourseData(course){
  var cp=state.courseProgress[course.courseId||currentCourse]||state.courseProgress[currentCourse];
  if(cp.processed) return; // 防止重新学习时重复生成
  cp.processed=true;

  var mod=course.module;

  if(mod==='fitness'){
    var session={courseId:currentCourse,date:fmtDate(new Date()),exercises:{}};
    course.steps.forEach(function(step,sIdx){
      var sd=cp.stepData[sIdx]||{};
      var rec=sd.record||{};
      Object.keys(rec).forEach(function(k){
        var parts=k.split('_');
        var field=parts[parts.length-1];
        if(EX_FIELDS.indexOf(field)<0) return;
        var prefix=parts.slice(0,-1).join('_');
        var exKey=EX_PREFIX_MAP[prefix];
        if(!exKey) return;
        if(!session.exercises[exKey]) session.exercises[exKey]={};
        session.exercises[exKey][field]=rec[k];
      });
    });
    if(Object.keys(session.exercises).length>0){
      state.growth.fitness.sessions.push(session);
    }
  }

  if(mod==='film'){
    var work=null;
    var ratings={};
    course.steps.forEach(function(step,sIdx){
      var sd=cp.stepData[sIdx]||{};
      var rec=sd.record||{};
      if(rec.title&&!work){
        work={
          serial:state.growth.film.works.length+1,
          title:rec.title,
          duration:rec.duration?parseFloat(rec.duration):null,
          clips:rec.clips?parseInt(rec.clips,10):null,
          usedClips:rec.used_clips?parseInt(rec.used_clips,10):null,
          createdAt:Date.now()
        };
      }
      Object.keys(rec).forEach(function(k){
        if(k.indexOf('r_')===0&&rec[k]!=='') ratings[k.slice(2)]=rec[k];
      });
    });
    if(work){
      work.ratings=ratings;
      state.growth.film.works.push(work);
    }
  }

  if(mod==='cooking'){
    course.steps.forEach(function(step,sIdx){
      var sd=cp.stepData[sIdx]||{};
      var rec=sd.record||{};
      if(rec.taste){
        state.growth.cooking.recipes.push({title:course.title,ratings:rec,attemptedAt:Date.now()});
        state.growth.cooking.attempts.push({courseId:currentCourse,date:fmtDate(new Date()),data:rec});
      }
    });
  }

  if(mod==='violin'){
    var existsRec=state.growth.violin.recordings.some(function(r){return r.courseId===currentCourse;});
    if(!existsRec){
      state.growth.violin.recordings.push({
        title:course.evidenceLabel||course.title,
        courseId:currentCourse,
        createdAt:Date.now()
      });
    }
  }

  if(mod==='review'){
    var answers={};
    course.steps.forEach(function(step,sIdx){
      var sd=cp.stepData[sIdx]||{};
      var rec=sd.record||{};
      Object.keys(rec).forEach(function(k){ answers[k]=rec[k]; });
    });
    var completed=getCompletedCount();
    var total=getTotalCount();
    state.weeklyReports.push({
      week:1,
      date:new Date().toLocaleDateString('zh-CN'),
      completionRate:total>0?Math.round(completed/total*100):0,
      completedTasks:completed,
      totalTasks:total,
      evidenceCount:state.evidence.length,
      q1:answers.q1||'',
      q2:answers.q2||'',
      q3:answers.q3||'',
      q4:answers.q4||''
    });
  }

  // 解锁技能
  if(course.unlockSkills&&course.unlockSkills.length&&state.skills[mod]){
    course.unlockSkills.forEach(function(sn){
      var s=state.skills[mod].find(function(x){return x.n===sn;});
      if(s&&s.l<1) s.l=1;
    });
  }

  saveState();
}

function closeCourse(){
  document.getElementById('course-overlay').classList.remove('active');
  currentCourse=null;
  currentTaskId=null;
  courseView='intro';
  if(timerInterval){ clearInterval(timerInterval); timerRunning=false; }
}

/* ===== 事件委托 ===== */
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-action]');
  if(!el) return;
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
      simulateUpload(parseInt(el.dataset.step,10));
      break;
    case 'view-evidence':{
      var vId=el.dataset.id;
      var vMeta=null;
      // 从 state.evidence 找元数据（含旧数据兼容）
      var vIdx=state.evidence.findIndex(function(ev){ return (ev.id||evRecordId(ev.courseId,ev.step))===vId; });
      if(vIdx>=0) vMeta=state.evidence[vIdx];
      else{
        var vp=vId.lastIndexOf('_');
        if(vp>0){
          var vC=vId.slice(0,vp),vS=parseInt(vId.slice(vp+1),10);
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
});

function taskCourseId(taskId){
  var t=state.tasks.find(function(x){return x.id===taskId;});
  return t?t.courseId:null;
}

/* ===== 提醒时间设置（设置页时间选择器）===== */
function setReminderTime(key,val){
  if(!val||!state.settings.reminders) return;
  state.settings.reminders[key]=val;
  saveState();
}

/* ===== 初始化 ===== */
function init(){
  loadState();
  applyTheme();

  document.getElementById('icon-tab-today').innerHTML=svgIcon('home');
  document.getElementById('icon-tab-plan').innerHTML=svgIcon('calendar');
  document.getElementById('icon-tab-learn').innerHTML=svgIcon('book-open');
  document.getElementById('icon-tab-growth').innerHTML=svgIcon('trending-up');
  document.getElementById('icon-tab-profile').innerHTML=svgIcon('user');

  navigate('today');

  // 本地提醒引擎
  if(typeof Reminders!=='undefined') Reminders.init();

  // 倒计时每30秒刷新
  setInterval(function(){
    if(currentPage==='today'&&!currentCourse) refreshCountdown();
  },30000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}
