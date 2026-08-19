// mock.js — 单一数据源（Single source of truth）
// 对齐：00-项目总览 / 01-PRD §9 / 02-开发实施规格 §5 §11 / 03-Week1课程内容

/* ===== 模块信息 ===== */
var MODULES={
  fitness:{name:'健身',icon:'dumbbell',cls:'mi-fitness',color:'#FF3B30'},
  film:{name:'拍摄剪辑',icon:'clapperboard',cls:'mi-film',color:'#5856D6'},
  cooking:{name:'烹饪',icon:'utensils-crossed',cls:'mi-cooking',color:'#FF9500'},
  violin:{name:'小提琴',icon:'music',cls:'mi-violin',color:'#5AC8FA'},
  review:{name:'周复盘',icon:'chart-column',cls:'mi-review',color:'#007AFF'}
};

/* ===== 任务状态（PRD §8.1，全局唯一口径）===== */
var STATUS_MAP={
  pending:{label:'未开始',cls:'st-pending'},
  in_progress:{label:'进行中',cls:'st-progress'},
  paused:{label:'已暂停',cls:'st-paused'},
  completed:{label:'已完成',cls:'st-done'},
  rescheduled:{label:'已调整',cls:'st-adjusted'},
  skipped:{label:'已跳过',cls:'st-skipped'}
};

/* ===== 调整原因（PRD §7.2）===== */
var RESCHEDULE_REASONS=['加班','太累','临时有事','课程太长','时间不合理','不想做','其他'];

/* ===== Week 1 初始化日程（PRD §9 + 03文档§2）===== */
var TASKS=[
  {id:'t1',day:1,dayName:'周一',time:'19:30',module:'fitness',title:'第一次走进健身房',courseId:'FIT-W1-01',duration:60,status:'pending'},
  {id:'t2',day:2,dayName:'周二',time:'19:30',module:'film',title:'认识四种景别',courseId:'FILM-W1-01',duration:90,status:'pending'},
  {id:'t3',day:2,dayName:'周二',time:'21:20',module:'violin',title:'认识琴 + 第一次持琴',courseId:'VIO-W1-01',duration:30,status:'pending'},
  {id:'t4',day:3,dayName:'周三',time:'19:30',module:'fitness',title:'第一次认真学习动作',courseId:'FIT-W1-02',duration:70,status:'pending'},
  {id:'t5',day:4,dayName:'周四',time:'18:30',module:'cooking',title:'西红柿炒鸡蛋',courseId:'COOK-W1-01',duration:90,status:'pending'},
  {id:'t6',day:4,dayName:'周四',time:'20:30',module:'violin',title:'第一次学习持弓',courseId:'VIO-W1-02',duration:30,status:'pending'},
  {id:'t7',day:5,dayName:'周五',time:'19:30',module:'fitness',title:'找到初始训练重量',courseId:'FIT-W1-03',duration:70,status:'pending'},
  {id:'t8',day:6,dayName:'周六',time:'09:30',module:'film',title:'第一次用镜头讲一件事',courseId:'FILM-W1-02',duration:210,status:'pending',
    segments:[{label:'上午·拍摄',time:'09:30',duration:90},{label:'下午·剪辑',time:'14:00',duration:120}]},
  {id:'t9',day:6,dayName:'周六',time:'19:30',module:'violin',title:'第一次让琴发声',courseId:'VIO-W1-03',duration:40,status:'pending'},
  {id:'t10',day:7,dayName:'周日',time:'11:00',module:'cooking',title:'青椒炒肉',courseId:'COOK-W1-02',duration:90,status:'pending'},
  {id:'t11',day:7,dayName:'周日',time:'16:00',module:'violin',title:'第一次慢弓 + 毕业练习',courseId:'VIO-W1-04',duration:40,status:'pending'},
  {id:'t12',day:7,dayName:'周日',time:'20:00',module:'review',title:'Week 1 成长周报',courseId:'REVIEW-W1',duration:30,status:'pending'}
];

/* ===== 固定生活框架（不计入成长完成率）===== */
var ROUTINE={
  weekday:[{time:'07:30',label:'起床'},{time:'08:30-18:00',label:'工作'},{time:'00:00',label:'睡觉'}],
  weekend:[{time:'08:30',label:'起床'},{time:'00:00',label:'睡觉'}]
};

/* ===== 课程定义（03-Week1课程内容 结构化）===== */
var COURSES={

/* ---------- 健身 ---------- */
'FIT-W1-01':{title:'第一次走进健身房',module:'fitness',goal:'认识环境 → 认识器械 → 敢自己操作。',estimated:'50–60 分钟',outcome:'五台器械认识与操作记录',requiredEvidence:false,unlockSkills:['器械认知'],steps:[
  {title:'环境与求助',required:true,components:[
    {type:'teaching',title:'第一次来，先认识环境',text:'今天不追求训练量，只做三件事：认识环境、认识五台基础器械、每台轻轻操作一组。\n\n如果不知道器械在哪，建议直接向工作人员说明：\n\n“我是第一次来健身房，之前完全没练过。请帮我指出推胸、高位下拉、坐姿划船、腿举和推肩，再告诉我座椅和重量怎么调。”',tip:'求助不丢人，第一次就把动作位置问清楚，比自己在场馆里乱转高效得多。'},
    {type:'checklist',items:['更衣并放好物品','找到饮水处','找到有氧区','找到力量器械区','找到拉伸或自由训练区']},
    {type:'record',label:'器械位置记录',fields:[
      {key:'found_all',label:'五台器械是否都已找到',type:'select',options:['全部找到','部分找到','还没找到']},
      {key:'not_adjustable',label:'哪台还不会调（没有可留空）',type:'text'}
    ]}
  ]},
  {title:'跑步机热身',required:true,components:[
    {type:'teaching',title:'只快走，不跑步',text:'时间 8–10 分钟。\n\n要点：\n1. 先站在跑步机两侧，低速启动后再踩上跑带\n2. 逐步调至“能正常讲话、身体开始变暖”的速度\n3. 只快走，今天不跑步',tip:'上下跑步机时先扶扶手，安全第一。'},
    {type:'timer',seconds:540,label:'快走热身（9分钟）'},
    {type:'record',label:'热身记录',fields:[
      {key:'warmup_min',label:'实际快走时间',type:'number',unit:'分钟'},
      {key:'warmup_feel',label:'体感',type:'select',options:['很轻松','正好','有点累']}
    ]}
  ]},
  {title:'坐姿推胸',required:true,components:[
    {type:'teaching',title:'坐姿推胸',text:'识别：机器常标注 Chest Press；坐下后把手向前推，主要训练胸部。\n\n动作要点：\n1. 使用很轻的重量\n2. 把手约在胸部中间高度\n3. 后背靠稳、双脚踩稳\n4. 肩膀不耸起\n5. 推出后缓慢回到起点'},
    {type:'checklist',items:['重量很轻','把手在胸部中间高度','后背靠稳双脚踩稳','肩膀没有耸起','推出后缓慢回位']},
    {type:'record',label:'坐姿推胸记录',fields:[
      {key:'chest1_weight',label:'重量',type:'number',unit:'kg',useLast:'chest'},
      {key:'chest1_reps',label:'次数 × 组数',type:'text',def:'10 × 1'},
      {key:'chest1_mastery',label:'掌握度',type:'select',options:['完全不会','大概明白','基本会了']}
    ]}
  ]},
  {title:'高位下拉',required:true,components:[
    {type:'teaching',title:'高位下拉',text:'识别：头顶有长杆，向上胸附近下拉，主要训练背部。\n\n动作要点：\n1. 调整腿垫压住大腿\n2. 双手握杆，胸部稍微抬起\n3. 杆拉向上胸附近\n4. 不向脑后拉\n5. 身体不大幅后仰'},
    {type:'checklist',items:['腿垫压住大腿','胸部稍微抬起','杆拉向上胸附近','没有向脑后拉','身体没有大幅后仰']},
    {type:'record',label:'高位下拉记录',fields:[
      {key:'pull1_weight',label:'重量',type:'number',unit:'kg',useLast:'pulldown'},
      {key:'pull1_reps',label:'次数 × 组数',type:'text',def:'10 × 1'},
      {key:'pull1_mastery',label:'掌握度',type:'select',options:['完全不会','大概明白','基本会了']}
    ]}
  ]},
  {title:'坐姿划船',required:true,components:[
    {type:'teaching',title:'坐姿划船',text:'识别：手柄在身体前方，向腹部附近拉。\n\n动作要点：坐稳、脚踩稳、胸部抬起、肩膀不耸、身体不前后摆动。'},
    {type:'checklist',items:['坐稳脚踩稳','胸部抬起','把手拉向腹部','肩膀不耸','身体不前后摆动']},
    {type:'record',label:'坐姿划船记录',fields:[
      {key:'row1_weight',label:'重量',type:'number',unit:'kg',useLast:'row'},
      {key:'row1_reps',label:'次数 × 组数',type:'text',def:'10 × 1'},
      {key:'row1_mastery',label:'掌握度',type:'select',options:['完全不会','大概明白','基本会了']}
    ]}
  ]},
  {title:'腿举',required:true,components:[
    {type:'teaching',title:'腿举',text:'识别：坐着或半躺，用双腿推动大踏板。\n\n动作要点：\n1. 重量轻\n2. 双脚放踏板中间，约与肩同宽\n3. 膝盖方向与脚尖基本一致\n4. 腰背靠稳\n5. 推起时不猛锁膝'},
    {type:'checklist',items:['重量轻','双脚与肩同宽','膝盖方向与脚尖一致','腰背靠稳','不猛锁膝盖']},
    {type:'record',label:'腿举记录',fields:[
      {key:'leg1_weight',label:'重量',type:'number',unit:'kg',useLast:'legpress'},
      {key:'leg1_reps',label:'次数 × 组数',type:'text',def:'10 × 1'},
      {key:'leg1_mastery',label:'掌握度',type:'select',options:['完全不会','大概明白','基本会了']}
    ]}
  ]},
  {title:'坐姿推肩',required:true,components:[
    {type:'teaching',title:'坐姿推肩',text:'识别：手柄在肩膀两侧，向上推，主要训练肩部。\n\n动作要点：重量轻、后背靠稳、肩膀不耸、身体不左右扭。'},
    {type:'checklist',items:['重量轻','后背靠稳','肩膀不耸','身体不左右扭']},
    {type:'record',label:'坐姿推肩记录',fields:[
      {key:'sho1_weight',label:'重量',type:'number',unit:'kg',useLast:'shoulder'},
      {key:'sho1_reps',label:'次数 × 组数',type:'text',def:'10 × 1'},
      {key:'sho1_mastery',label:'掌握度',type:'select',options:['完全不会','大概明白','基本会了']}
    ]}
  ]},
  {title:'结束与打卡',required:true,components:[
    {type:'teaching',title:'慢走放松',text:'训练结束，慢走约 5 分钟并补水，让心率慢慢降下来。'},
    {type:'timer',seconds:300,label:'放松慢走（5分钟）'},
    {type:'record',label:'今日打卡',fields:[
      {key:'body_state',label:'身体状态',type:'select',options:['没什么感觉','微微疲劳','有点酸','很累']},
      {key:'strangest',label:'今日最陌生的器械',type:'select',options:['坐姿推胸','高位下拉','坐姿划船','腿举','坐姿推肩']}
    ]}
  ]}
]},

'FIT-W1-02':{title:'第一次认真学习动作',module:'fitness',goal:'从“知道这是什么”变成“知道该怎么做”。',estimated:'60–70 分钟',outcome:'五动作训练与自检记录',requiredEvidence:false,unlockSkills:['坐姿推胸','高位下拉','坐姿划船','腿举','推肩'],steps:[
  {title:'热身',required:true,components:[
    {type:'teaching',title:'跑步机快走',text:'第二次训练，热身不能省。快走 10 分钟，让身体进入状态。'},
    {type:'timer',seconds:600,label:'快走热身（10分钟）'},
    {type:'record',label:'热身记录',fields:[
      {key:'warmup_min',label:'实际快走时间',type:'number',unit:'分钟'},
      {key:'warmup_feel',label:'体感',type:'select',options:['很轻松','正好','有点累']}
    ]}
  ]},
  {title:'坐姿推胸 · 2组',required:true,components:[
    {type:'teaching',title:'推胸检查项',text:'训练量：2 组 × 约 10 次，组间休息 60–90 秒。\n\n检查：后背贴着靠背 / 双脚踩稳 / 把手高度在胸部附近 / 肩膀没有耸起 / 重量不会让身体乱扭。',tip:'下面可以“沿用上次”的重量。'},
    {type:'checklist',items:['后背贴靠背','双脚踩稳','把手在胸部附近','肩膀没有耸起','重量合适身体不乱扭']},
    {type:'record',label:'坐姿推胸记录',fields:[
      {key:'chest_weight',label:'重量',type:'number',unit:'kg',useLast:'chest'},
      {key:'chest_reps',label:'次数 × 组数',type:'text',def:'10 × 2'},
      {key:'chest_diff',label:'主观难度',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'chest_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']}
    ]},
    {type:'timer',seconds:75,label:'组间休息（约75秒）'}
  ]},
  {title:'高位下拉 · 2组',required:true,components:[
    {type:'teaching',title:'下拉检查项',text:'检查：大腿被腿垫压住 / 胸部稍微抬起 / 杆拉到上胸附近 / 没有向脑后拉 / 身体没有大幅后仰。'},
    {type:'checklist',items:['腿垫压住大腿','胸部稍微抬起','杆拉到上胸附近','没有向脑后拉','身体没有大幅后仰']},
    {type:'record',label:'高位下拉记录',fields:[
      {key:'pull_weight',label:'重量',type:'number',unit:'kg',useLast:'pulldown'},
      {key:'pull_reps',label:'次数 × 组数',type:'text',def:'10 × 2'},
      {key:'pull_diff',label:'主观难度',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'pull_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']}
    ]},
    {type:'timer',seconds:75,label:'组间休息（约75秒）'}
  ]},
  {title:'坐姿划船 · 2组',required:true,components:[
    {type:'teaching',title:'划船检查项',text:'检查：脚踩稳 / 胸部抬起 / 把手拉向腹部 / 肩膀不耸 / 身体没有来回晃。'},
    {type:'checklist',items:['脚踩稳','胸部抬起','把手拉向腹部','肩膀不耸','身体没有来回晃']},
    {type:'record',label:'坐姿划船记录',fields:[
      {key:'row_weight',label:'重量',type:'number',unit:'kg',useLast:'row'},
      {key:'row_reps',label:'次数 × 组数',type:'text',def:'10 × 2'},
      {key:'row_diff',label:'主观难度',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'row_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']}
    ]},
    {type:'timer',seconds:75,label:'组间休息（约75秒）'}
  ]},
  {title:'腿举 · 2组',required:true,components:[
    {type:'teaching',title:'腿举检查项',text:'检查：双脚踩稳 / 膝盖方向与脚尖一致 / 没有猛地完全锁死膝盖 / 腰背稳定贴住靠垫。'},
    {type:'checklist',items:['双脚踩稳','膝盖与脚尖一致','没有猛锁膝盖','腰背贴住靠垫']},
    {type:'record',label:'腿举记录',fields:[
      {key:'leg_weight',label:'重量',type:'number',unit:'kg',useLast:'legpress'},
      {key:'leg_reps',label:'次数 × 组数',type:'text',def:'10 × 2'},
      {key:'leg_diff',label:'主观难度',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'leg_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']}
    ]},
    {type:'timer',seconds:75,label:'组间休息（约75秒）'}
  ]},
  {title:'坐姿推肩 · 2组',required:true,components:[
    {type:'teaching',title:'推肩检查项',text:'检查：后背靠稳 / 使用较轻重量 / 手柄从肩部附近向上 / 没有耸肩硬推 / 身体没有左右扭。'},
    {type:'checklist',items:['后背靠稳','较轻重量','手柄从肩部向上','没有耸肩硬推','身体没有左右扭']},
    {type:'record',label:'坐姿推肩记录',fields:[
      {key:'sho_weight',label:'重量',type:'number',unit:'kg',useLast:'shoulder'},
      {key:'sho_reps',label:'次数 × 组数',type:'text',def:'10 × 2'},
      {key:'sho_diff',label:'主观难度',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'sho_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']}
    ]},
    {type:'timer',seconds:75,label:'组间休息（约75秒）'}
  ]},
  {title:'课程复盘',required:true,components:[
    {type:'record',label:'五动作复盘',fields:[
      {key:'m_chest',label:'坐姿推胸掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'m_pull',label:'高位下拉掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'m_row',label:'坐姿划船掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'m_leg',label:'腿举掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'m_sho',label:'坐姿推肩掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'relearn',label:'最需要重新学习的一项',type:'select',options:['坐姿推胸','高位下拉','坐姿划船','腿举','坐姿推肩']},
      {key:'discomfort',label:'是否有不适',type:'select',options:['没有','有，轻微','有，明显']}
    ]}
  ]}
]},

'FIT-W1-03':{title:'找到初始训练重量',module:'fitness',goal:'建立第一份真实力量档案，不测试最大重量。',estimated:'60–70 分钟',outcome:'五动作初始力量档案',requiredEvidence:false,unlockSkills:[],steps:[
  {title:'理解“合适重量”',required:true,components:[
    {type:'teaching',title:'什么算合适',text:'目标区间约 10–12 次：\n\n1. 前几次稳定\n2. 后几次明显吃力\n3. 动作仍然没有乱\n4. 做完大约还可以勉强再做 1–3 次\n\n太轻则下一组小幅增加；不到目标次数动作已明显变形则降低重量。\n\n难度含义：1 太轻 / 2 偏轻 / 3 正好 / 4 偏重 / 5 无法保持动作完成。',tip:'今天不测最大重量，找“能标准完成 10–12 次”的重量。'}
  ]},
  {title:'热身',required:true,components:[
    {type:'timer',seconds:540,label:'快走热身（9分钟）'},
    {type:'record',label:'热身记录',fields:[
      {key:'warmup_min',label:'实际快走时间',type:'number',unit:'分钟'},
      {key:'warmup_feel',label:'体感',type:'select',options:['很轻松','正好','有点累']}
    ]}
  ]},
  {title:'坐姿推胸 · 建档',required:true,components:[
    {type:'teaching',title:'逐组小幅试重',text:'沿用上一课的动作检查，允许逐组小幅试重，找到 10–12 次目标区间的重量。'},
    {type:'checklist',items:['动作检查全部通过','找到了目标区间重量']},
    {type:'record',label:'推胸初始档案',fields:[
      {key:'chest_weight',label:'初始重量',type:'number',unit:'kg',useLast:'chest'},
      {key:'chest_reps',label:'次数',type:'number',def:10},
      {key:'chest_diff',label:'难度 1–5',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'chest_mastery',label:'掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'chest_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']},
      {key:'chest_pain',label:'是否不适',type:'select',options:['没有','有']}
    ]}
  ]},
  {title:'高位下拉 · 建档',required:true,components:[
    {type:'checklist',items:['动作检查全部通过','找到了目标区间重量']},
    {type:'record',label:'下拉初始档案',fields:[
      {key:'pull_weight',label:'初始重量',type:'number',unit:'kg',useLast:'pulldown'},
      {key:'pull_reps',label:'次数',type:'number',def:10},
      {key:'pull_diff',label:'难度 1–5',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'pull_mastery',label:'掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'pull_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']},
      {key:'pull_pain',label:'是否不适',type:'select',options:['没有','有']}
    ]}
  ]},
  {title:'坐姿划船 · 建档',required:true,components:[
    {type:'checklist',items:['动作检查全部通过','找到了目标区间重量']},
    {type:'record',label:'划船初始档案',fields:[
      {key:'row_weight',label:'初始重量',type:'number',unit:'kg',useLast:'row'},
      {key:'row_reps',label:'次数',type:'number',def:10},
      {key:'row_diff',label:'难度 1–5',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'row_mastery',label:'掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'row_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']},
      {key:'row_pain',label:'是否不适',type:'select',options:['没有','有']}
    ]}
  ]},
  {title:'腿举 · 建档',required:true,components:[
    {type:'checklist',items:['动作检查全部通过','找到了目标区间重量']},
    {type:'record',label:'腿举初始档案',fields:[
      {key:'leg_weight',label:'初始重量',type:'number',unit:'kg',useLast:'legpress'},
      {key:'leg_reps',label:'次数',type:'number',def:10},
      {key:'leg_diff',label:'难度 1–5',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'leg_mastery',label:'掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'leg_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']},
      {key:'leg_pain',label:'是否不适',type:'select',options:['没有','有']}
    ]}
  ]},
  {title:'坐姿推肩 · 建档',required:true,components:[
    {type:'checklist',items:['动作检查全部通过','找到了目标区间重量']},
    {type:'record',label:'推肩初始档案',fields:[
      {key:'sho_weight',label:'初始重量',type:'number',unit:'kg',useLast:'shoulder'},
      {key:'sho_reps',label:'次数',type:'number',def:10},
      {key:'sho_diff',label:'难度 1–5',type:'rating',hint:'1太轻 3正好 5无法完成'},
      {key:'sho_mastery',label:'掌握度',type:'select',options:['不会','大概会','基本会']},
      {key:'sho_feel',label:'发力感',type:'select',options:['目标部位明显','目标部位+手臂','只有手臂','肩膀特别明显','不知道哪里发力']},
      {key:'sho_pain',label:'是否不适',type:'select',options:['没有','有']}
    ]}
  ]},
  {title:'完成确认',required:true,components:[
    {type:'selfcheck',title:'毕业自检（03文档）',items:[
      '五个动作均有一条可用初始记录',
      '知道下次进入健身房该去哪里、做什么、如何记录',
      '没有明显疼痛或关节不适'
    ]},
    {type:'teaching',title:'完成结果',text:'健身 Week 1 进度 3/3。系统已生成初始力量档案，下次训练可“沿用上次”。',tip:'若出现明显尖锐疼痛、头晕、胸部不适，停止训练并寻求专业意见。'}
  ]}
]},

/* ---------- 拍摄剪辑 ---------- */
'FILM-W1-01':{title:'认识四种景别',module:'film',goal:'用四种距离拍摄同一主体，完成 15–30 秒作品 001《四种景别练习》。',estimated:'90 分钟',outcome:'作品 001',requiredEvidence:true,evidenceLabel:'作品 001 文件或链接',unlockSkills:['景别','基础剪辑'],steps:[
  {title:'拍摄准备',required:true,components:[
    {type:'teaching',title:'开拍前的准备',text:'1. 建议 1080P / 30fps\n2. 手机竖屏\n3. 擦拭摄像头\n4. 尽量使用 1× 主摄\n5. 不随意数码变焦\n6. 每个原始镜头至少拍 5 秒',tip:'建议主体：水杯。找一个光线好的桌面。'},
    {type:'checklist',items:['设置 1080P / 30fps','竖屏拍摄','擦拭摄像头','使用 1× 主摄','不使用数码变焦']}
  ]},
  {title:'认识景别',required:true,components:[
    {type:'teaching',title:'四种基本景别',text:'- 全景：主体与环境；说明“在哪里”\n- 中景：人物约腰部以上或主体与动作；说明“在做什么”\n- 近景：人物约胸部以上或主体占画面较大；突出状态\n- 特写：手、眼睛、杯沿、水珠等细节；强调信息',tip:'拍之前先想：这个镜头要让观众看懂什么？'}
  ]},
  {title:'拍摄四个镜头',required:true,components:[
    {type:'teaching',title:'拍摄任务',text:'1. 全景：桌子、杯子和一部分环境，5–8 秒\n2. 中景：桌面与杯子，环境减少，5–8 秒\n3. 近景：杯子占画面较大，5–8 秒\n4. 特写：杯沿、Logo、水珠或手握处，5–8 秒'},
    {type:'checklist',items:['全景 5–8 秒','中景 5–8 秒','近景 5–8 秒','特写 5–8 秒']}
  ]},
  {title:'素材自检',required:true,components:[
    {type:'selfcheck',title:'素材自检',items:['没有明显晃动','主体清楚','四个镜头远近区别明显']},
    {type:'teaching',title:'差别太小怎么办',text:'若四个镜头差别很小，回到上一步补拍。景别练习的核心就是“远近差别明显”。'}
  ]},
  {title:'第一次剪辑',required:true,components:[
    {type:'teaching',title:'剪辑清单',text:'1. 导入四个镜头\n2. 按“全景 → 中景 → 近景 → 特写”排列\n3. 裁掉开头按键晃动和结尾收手机的废片\n4. 每个镜头保留约 2–4 秒\n5. 不加花哨转场，使用直接切换\n6. 添加一行标题，例如“一个杯子的四种景别”\n7. 选择不抢画面的 BGM\n8. 以 1080P 导出'},
    {type:'checklist',items:['导入四个镜头','按全景→中景→近景→特写排列','裁掉废片','每镜头 2–4 秒','直接切换不加转场','添加标题','添加 BGM','以 1080P 导出']}
  ]},
  {title:'作品 001',required:true,components:[
    {type:'evidence',label:'作品 001 文件或链接',kinds:['video','link']},
    {type:'record',label:'作品 001 登记',fields:[
      {key:'title',label:'作品名',type:'text',def:'《四种景别练习》'},
      {key:'duration',label:'时长',type:'number',unit:'秒'},
      {key:'clips',label:'素材数量',type:'number',def:4}
    ]}
  ]},
  {title:'复盘',required:true,components:[
    {type:'record',label:'课程复盘',fields:[
      {key:'can_distinguish',label:'能否分清四种景别',type:'select',options:['完全不会','大概明白','可以分清']},
      {key:'confuse',label:'最容易混淆的景别',type:'select',options:['全景和中景','中景和近景','近景和特写','没有混淆']},
      {key:'main_problem',label:'最大问题',type:'select',options:['抖','光线','构图','区别不明显','剪辑不流畅','其他']},
      {key:'satisfaction',label:'满意度',type:'rating'},
      {key:'improve',label:'下次最想改进的一点',type:'text'}
    ]}
  ]}
]},

'FILM-W1-02':{title:'第一次用镜头讲一件事',module:'film',goal:'拍摄“冲一杯饮品”，用多镜头完成 20–45 秒作品 002《生活动作短片》。',estimated:'上午90 + 下午120 分钟',outcome:'作品 002',requiredEvidence:true,evidenceLabel:'作品 002 文件或链接',unlockSkills:['镜头组合','素材筛选','镜头排序'],segments:[{label:'上午·拍摄',time:'09:30',duration:90},{label:'下午·剪辑',time:'14:00',duration:120}],steps:[
  {title:'镜头清单（上午）',required:true,segment:0,components:[
    {type:'teaching',title:'今日挑战',text:'拍摄“冲一杯饮品”。咖啡、豆浆、牛奶或茶均可。\n\n九个镜头：\n1. 环境：桌面、厨房或房间，全景\n2. 拿杯子：人物伸手拿杯子，中景\n3. 拿原料：咖啡粉、茶叶或其他，近景\n4. 原料细节：倒入杯子，特写\n5. 倒水：水流进入杯子，特写\n6. 搅拌：勺子与液体，特写或近景\n7. 端起来：人物拿起杯子，中景\n8. 成品：杯子近景\n9. 喝一口：中景或近景（可选）'},
    {type:'checklist',items:[
      {text:'环境·全景',required:true},{text:'拿杯子·中景',required:true},{text:'拿原料·近景',required:true},
      {text:'原料细节·特写',required:true},{text:'倒水·特写',required:true},{text:'搅拌·特写/近景',required:true},
      {text:'端起来·中景',required:true},{text:'成品·近景',required:true},{text:'喝一口·中/近景',required:false}
    ]}
  ]},
  {title:'拍摄规则（上午）',required:true,segment:0,components:[
    {type:'teaching',title:'拍摄规则',text:'1. 每个镜头至少 5–8 秒\n2. 先开始录制，等约 1 秒再让动作进入\n3. 动作结束后再等约 1 秒停止\n4. 动作要完整\n5. 给剪辑留下前后余量',tip:'余量是剪辑的呼吸空间，宁多勿少。'},
    {type:'selfcheck',title:'拍摄自检',items:['每个镜头 5 秒以上','动作前后留了余量','动作完整']},
    {type:'record',label:'拍摄记录',fields:[
      {key:'clip_count',label:'拍摄素材数量',type:'number'},
      {key:'reshoot',label:'需要补拍的镜头（没有可留空）',type:'text'}
    ]}
  ]},
  {title:'筛选素材（下午）',required:true,segment:1,components:[
    {type:'teaching',title:'筛选规则',text:'删除或排除：明显拍糊、严重抖动、动作失败的素材。'},
    {type:'record',label:'筛选记录',fields:[
      {key:'usable_count',label:'可用素材数量',type:'number'}
    ]}
  ]},
  {title:'按动作顺序排列',required:true,segment:1,components:[
    {type:'teaching',title:'建议顺序',text:'环境 → 拿杯子 → 拿原料 → 倒原料 → 倒水 → 搅拌 → 成品 → 喝一口\n\n在没有字幕和音乐时，观众也应能看懂发生了什么。'},
    {type:'selfcheck',title:'排列自检',items:['按动作顺序排列','不用字幕也能看懂发生了什么']}
  ]},
  {title:'节奏与远近变化',required:true,segment:1,components:[
    {type:'teaching',title:'节奏要点',text:'1. 大部分成片镜头约 1.5–3 秒\n2. 信息看明白后切换\n3. 避免连续全景或连续特写\n4. 尝试“全 → 中 → 近 → 特 → 近 → 中”'}
  ]},
  {title:'音乐、标题与轻微调整',required:true,segment:1,components:[
    {type:'teaching',title:'收尾清单',text:'1. 音乐与画面气质不明显冲突\n2. 字幕只需一个标题\n3. 可轻微调整亮度、对比度和饱和度\n4. 不把调色变成课程重点\n5. 导出 1080P / 30fps'},
    {type:'checklist',items:['音乐气质匹配','只加一个标题','轻微调色','导出 1080P / 30fps']}
  ]},
  {title:'作品 002',required:true,segment:1,components:[
    {type:'evidence',label:'作品 002 文件或链接',kinds:['video','link']},
    {type:'record',label:'作品 002 登记',fields:[
      {key:'title',label:'作品名',type:'text',def:'《生活动作短片》'},
      {key:'theme',label:'主题',type:'text',def:'冲一杯饮品'},
      {key:'clips',label:'素材数量',type:'number'},
      {key:'used_clips',label:'最终使用镜头数量',type:'number'},
      {key:'duration',label:'成片时长（建议 20–45 秒）',type:'number',unit:'秒'}
    ]}
  ]},
  {title:'复盘',required:true,segment:1,components:[
    {type:'record',label:'作品 002 复盘',fields:[
      {key:'r_stability',label:'稳定性',type:'rating'},
      {key:'r_variety',label:'景别丰富度',type:'rating'},
      {key:'r_linkage',label:'镜头衔接',type:'rating'},
      {key:'r_rhythm',label:'节奏',type:'rating'},
      {key:'r_complete',label:'完整度',type:'rating'},
      {key:'best_shot',label:'最喜欢哪个镜头？',type:'text'},
      {key:'worst_shot',label:'哪个镜头最失败？',type:'text'},
      {key:'retry',label:'如果重新拍一次，最想改什么？',type:'text'}
    ]}
  ]}
]},

/* ---------- 烹饪 ---------- */
'COOK-W1-01':{title:'西红柿炒鸡蛋',module:'cooking',goal:'第一次走完“备菜 → 热锅 → 下油 → 炒制 → 调味 → 出锅”。',estimated:'90 分钟',outcome:'菜品 001 照片与评分',requiredEvidence:true,evidenceLabel:'菜品 001 成品照片',unlockSkills:['打蛋','切块','基础炒蛋','基础调味'],steps:[
  {title:'工具检查',required:true,components:[
    {type:'teaching',title:'厨房安全卡',text:'- 刀工不追求快，非持刀手手指向内收\n- 不用手直接触摸热锅\n- 开火前完成备菜并准备好装盘器皿',tip:'生熟食材分开处理，及时清洁接触面。'},
    {type:'checklist',items:['菜刀','砧板','炒锅','锅铲','碗','盘子','筷子','勺子']}
  ]},
  {title:'食材准备',required:true,components:[
    {type:'teaching',title:'一人份食材',text:'- 西红柿 2 个\n- 鸡蛋 2–3 个\n- 盐\n- 食用油\n- 葱和少量糖（可选）\n\n第一课不叠加大量调料。'},
    {type:'checklist',items:['西红柿 2 个','鸡蛋 2–3 个','盐','食用油','葱和糖（可选）']}
  ]},
  {title:'打蛋',required:true,components:[
    {type:'teaching',title:'打蛋',text:'把鸡蛋打入碗中，用筷子搅至蛋黄和蛋清基本成为均匀黄色液体。'},
    {type:'checklist',items:['蛋黄蛋清基本均匀']},
    {type:'record',label:'打蛋记录',fields:[
      {key:'even',label:'是否均匀',type:'select',options:['基本均匀','还差一点']}
    ]}
  ]},
  {title:'切西红柿',required:true,components:[
    {type:'teaching',title:'切西红柿',text:'1. 洗净后放稳\n2. 慢慢切成一口大小、尽量接近的小块\n3. 不追求复杂刀法或速度'},
    {type:'selfcheck',title:'切块自检',items:['非持刀手手指内收','西红柿放稳再切']},
    {type:'record',label:'切块记录',fields:[
      {key:'size',label:'块大小',type:'select',options:['大小差很多','基本接近','比较均匀']}
    ]}
  ]},
  {title:'开火前检查',required:true,components:[
    {type:'checklist',items:['鸡蛋已打好','西红柿已切好','盐已就位','油已就位','盘子已准备好']},
    {type:'teaching',title:'为什么开火前检查',text:'鸡蛋、西红柿、盐、油和盘子都已就位，才可继续。开火后再找东西会手忙脚乱。'}
  ]},
  {title:'热锅与下油',required:true,components:[
    {type:'teaching',title:'热锅下油',text:'1. 空锅中火加热\n2. 用锅上方的热气感受温度，不触摸锅\n3. 第一周不烧到冒烟\n4. 加入能覆盖大部分锅底的一层油并晃匀',tip:'用手在锅上方感受热气，永远不要摸锅体。'}
  ]},
  {title:'炒鸡蛋',required:true,components:[
    {type:'teaching',title:'炒蛋要点',text:'1. 倒入蛋液\n2. 等边缘开始凝固后再轻推翻动\n3. 鸡蛋基本成块但仍略嫩时先盛出\n4. 理解余温：不等完全干透才离火',tip:'宁嫩勿老，鸡蛋回锅还会继续加热。'},
    {type:'selfcheck',title:'炒蛋自检',items:['边缘凝固后才翻动','略嫩时就盛出']},
    {type:'record',label:'炒蛋记录',fields:[
      {key:'egg_state',label:'鸡蛋状态',type:'select',options:['嫩','正好','偏老']}
    ]}
  ]},
  {title:'炒西红柿与调味',required:true,components:[
    {type:'teaching',title:'炒西红柿',text:'1. 中火翻炒\n2. 观察从硬块到变软、出汁\n3. 少量加盐\n4. 可按口味加少量糖\n5. 宁少勿多，尝味后再补'},
    {type:'selfcheck',title:'调味自检',items:['西红柿变软出汁','调味宁少勿多','尝味后再补']}
  ]},
  {title:'合炒与出锅',required:true,components:[
    {type:'teaching',title:'合炒出锅',text:'鸡蛋回锅，翻炒至沾上汤汁，尝味，必要时少量补盐，关火装盘。'}
  ]},
  {title:'菜品 001',required:true,components:[
    {type:'evidence',label:'菜品 001 成品照片',kinds:['image']},
    {type:'record',label:'菜品 001 评分',fields:[
      {key:'taste',label:'味道',type:'rating'},
      {key:'egg',label:'鸡蛋嫩度',type:'rating'},
      {key:'tomato',label:'西红柿软硬',type:'rating'},
      {key:'salt',label:'咸淡',type:'select',options:['太淡','正好','太咸']},
      {key:'look',label:'卖相',type:'rating'}
    ]},
    {type:'record',label:'必做复盘',fields:[
      {key:'egg_review',label:'鸡蛋',type:'select',options:['太嫩','正好','有点老']},
      {key:'tomato_review',label:'西红柿',type:'select',options:['太硬','正好','太软']},
      {key:'main_problem',label:'最大问题',type:'text'},
      {key:'next_change',label:'下次只改一个地方，改什么',type:'text'}
    ]}
  ]}
]},

'COOK-W1-02':{title:'青椒炒肉',module:'cooking',goal:'理解不同食材所需时间不同，完成切肉、腌肉、分开炒再合炒。',estimated:'90 分钟',outcome:'菜品 002 照片与评分',requiredEvidence:true,evidenceLabel:'菜品 002 成品照片',unlockSkills:['切肉','基础炒肉'],steps:[
  {title:'食材与工具',required:true,components:[
    {type:'teaching',title:'食材清单',text:'- 猪瘦肉一小份\n- 青椒 2–3 个\n- 食用油、盐、生抽\n- 少量淀粉\n- 可选：腌肉时少量食用油'},
    {type:'checklist',items:['猪瘦肉','青椒 2–3 个','食用油','盐','生抽','淀粉','刀和砧板可用','锅铲和盘子可用']}
  ]},
  {title:'生熟处理',required:true,components:[
    {type:'teaching',title:'生熟分开',text:'- 确认处理生肉的区域\n- 切完生肉后及时清洗手、刀、砧板和台面\n- 后续不让即食食物接触未清洁区域\n\n肉类应充分炒熟；无法判断时继续确认，不用“差不多”冒险。',tip:'生肉与即食食物避免交叉污染。'},
    {type:'checklist',items:['确认生肉处理区','切完生肉及时清洗','即食食物不接触未清洁区']}
  ]},
  {title:'切肉',required:true,components:[
    {type:'teaching',title:'切肉',text:'慢慢切成厚薄相近的肉丝或薄片。目标是均匀，不要求速度或复杂纹理知识。'},
    {type:'selfcheck',title:'切肉自检',items:['非持刀手手指内收','砧板稳定']},
    {type:'record',label:'切肉记录',fields:[
      {key:'size',label:'厚薄',type:'select',options:['差很多','基本接近','比较均匀']}
    ]}
  ]},
  {title:'腌肉与计时',required:true,components:[
    {type:'teaching',title:'腌肉',text:'1. 加少量生抽并抓匀\n2. 加少量淀粉并抓匀\n3. 可加一点食用油\n4. 放置腌制\n\n教学重点：腌制是在提前处理食材，帮助入味和保持口感。'},
    {type:'checklist',items:['加生抽抓匀','加淀粉抓匀','开始腌制']},
    {type:'timer',seconds:600,label:'腌制等待（10分钟）'}
  ]},
  {title:'处理青椒',required:true,components:[
    {type:'teaching',title:'处理青椒',text:'洗净，去蒂和明显的籽，切成大小接近的条或块。'},
    {type:'checklist',items:['青椒洗净','去蒂去籽','切成大小接近的条或块']}
  ]},
  {title:'开火前检查',required:true,components:[
    {type:'checklist',items:['肉已切并腌好','青椒已切好','盐、生抽、油已准备','盘子已准备','生肉接触区已处理']}
  ]},
  {title:'炒肉',required:true,components:[
    {type:'teaching',title:'炒肉要点',text:'1. 热锅后加油\n2. 肉入锅，观察颜色和状态变化\n3. 翻炒至基本成熟并确认熟度\n4. 不无限翻炒至发柴\n5. 先盛出',tip:'教学重点：肉基本变色成熟就盛出，余温会继续作用。'},
    {type:'selfcheck',title:'炒肉自检',items:['肉已确认熟透','没有炒到发柴']},
    {type:'record',label:'炒肉记录',fields:[
      {key:'meat_state',label:'肉的状态',type:'select',options:['偏嫩','正好','有点老','很柴']}
    ]}
  ]},
  {title:'炒青椒',required:true,components:[
    {type:'teaching',title:'炒青椒',text:'锅中留少量油，放入青椒翻炒，观察由生硬到变软、香味出现。'},
    {type:'record',label:'青椒记录',fields:[
      {key:'pepper_state',label:'青椒状态',type:'select',options:['太生','正好','太软']}
    ]}
  ]},
  {title:'合炒与调味',required:true,components:[
    {type:'teaching',title:'合炒出锅',text:'肉回锅，快速合炒，少量加盐；按味道决定是否补少量生抽。尝味合适后关火装盘。\n\n教学重点：不同食材进入和离开锅的时机不同。'}
  ]},
  {title:'菜品 002',required:true,components:[
    {type:'evidence',label:'菜品 002 成品照片',kinds:['image']},
    {type:'record',label:'菜品 002 评分',fields:[
      {key:'taste',label:'味道',type:'rating'},
      {key:'meat',label:'肉的嫩度',type:'rating'},
      {key:'pepper',label:'青椒口感',type:'rating'},
      {key:'salt',label:'咸淡',type:'select',options:['太淡','正好','太咸']},
      {key:'look',label:'卖相',type:'rating'}
    ]},
    {type:'record',label:'必做复盘',fields:[
      {key:'main_problem',label:'最大失败点',type:'text'},
      {key:'next_change',label:'下次改进',type:'text'}
    ]}
  ]}
]},

/* ---------- 小提琴 ---------- */
'VIO-W1-01':{title:'认识琴 + 第一次持琴',module:'violin',goal:'不拉琴，先把琴舒服、稳定地架起来。',estimated:'30 分钟',outcome:'第一次持琴录像',requiredEvidence:true,evidenceLabel:'第一次持琴录像',unlockSkills:['基础站姿','持琴'],steps:[
  {title:'认识结构',required:true,components:[
    {type:'teaching',title:'琴的基本结构',text:'认识：琴头、琴弦、琴桥、指板、腮托、琴弓。\n\n四根弦从粗到细：G → D → A → E；先记 G 最粗、E 最细。',tip:'本周不按弦、不学曲子。'},
    {type:'checklist',items:['琴头','琴弦','琴桥','指板','腮托','琴弓','记住 G 最粗 E 最细']}
  ]},
  {title:'自然站姿',required:true,components:[
    {type:'teaching',title:'站姿要点',text:'1. 找一面镜子\n2. 双脚约与肩同宽\n3. 身体自然、稳定\n4. 不僵硬挺胸、不耸肩、不刻意夹紧身体',tip:'自学固定三件套：镜子 + 录像 + 逐项自检。'},
    {type:'selfcheck',title:'站姿自检',items:['双脚与肩同宽','身体自然稳定','没有僵硬挺胸','没有耸肩']}
  ]},
  {title:'第一次持琴',required:true,components:[
    {type:'teaching',title:'持琴要点',text:'1. 琴放在左侧肩膀附近\n2. 下巴轻放在腮托附近\n3. 关键词是“放”，不是用肩、脖子和下巴死夹\n4. 第一周不要求做到完全不用左手支撑\n5. 优先舒服和稳定',tip:'若出现明显疼痛，停止并重新检查姿势，不硬练。'}
  ]},
  {title:'镜子自检与重复',required:true,components:[
    {type:'selfcheck',title:'镜子自检',items:['身体基本站直','左肩没有明显耸起','右肩自然','头没有夸张向左歪','下巴没有死命压琴','身体没有明显扭曲','没有明显疼痛']},
    {type:'teaching',title:'重复练习',text:'保持约 10 秒，放下休息，重复 5 次。'},
    {type:'timer',seconds:10,label:'持琴保持（10秒 × 5次）'}
  ]},
  {title:'成长录像',required:true,components:[
    {type:'teaching',title:'录制要求',text:'录制 10–15 秒：自然站姿 → 架琴 → 保持。\n\n标题固定为“Violin W1-D1｜第一次持琴”。'},
    {type:'evidence',label:'第一次持琴录像（10–15秒）',kinds:['video']}
  ]},
  {title:'复盘',required:true,components:[
    {type:'record',label:'持琴复盘',fields:[
      {key:'comfort',label:'持琴舒适度',type:'rating'},
      {key:'main_problem',label:'最明显的问题',type:'select',options:['容易耸肩','琴不稳定','脖子紧','姿势奇怪','不知道位置','暂时没有']},
      {key:'pain',label:'疼痛情况',type:'select',options:['没有','有一点不舒服','明显疼痛']}
    ]}
  ]}
]},

'VIO-W1-02':{title:'第一次学习持弓',module:'violin',goal:'让右手认识琴弓；可以暂时不真正拉琴。',estimated:'30 分钟',outcome:'第一次持弓录像',requiredEvidence:true,evidenceLabel:'第一次持弓录像',unlockSkills:['持弓'],steps:[
  {title:'认识琴弓',required:true,components:[
    {type:'teaching',title:'弓的组成',text:'认识弓尖、弓根、弓毛。'},
    {type:'checklist',items:['弓尖','弓根','弓毛']}
  ]},
  {title:'持弓原则',required:true,components:[
    {type:'teaching',title:'持弓不是抓棍子',text:'右手应自然、放松、有支撑，不把手指捏得发白。',tip:'放松大于“标准”，先找到自然的手型。'}
  ]},
  {title:'铅笔练习',required:true,components:[
    {type:'teaching',title:'铅笔模拟持弓',text:'1. 右手自然下垂，保留手指自然弯曲\n2. 用普通铅笔模拟\n3. 拇指弯曲，不僵直顶住\n4. 其他手指自然弯曲落下\n5. 小指轻放上方帮助平衡\n\n保持 15–20 秒，放松后重新拿，共 5 次。'},
    {type:'selfcheck',title:'持弓自检',items:['拇指弯曲不僵直','手指自然弯曲','手腕自然','用力适度']},
    {type:'timer',seconds:18,label:'铅笔保持（约18秒 × 5次）'}
  ]},
  {title:'换真正琴弓',required:true,components:[
    {type:'teaching',title:'拿起 → 检查 → 放下',text:'拿起 → 检查 → 放下，重复 5–10 次；不要求拉琴。'},
    {type:'record',label:'琴弓练习记录',fields:[
      {key:'reps',label:'完成次数',type:'number',def:5}
    ]}
  ]},
  {title:'成长录像',required:true,components:[
    {type:'teaching',title:'录制要求',text:'拍右手近景约 10 秒，建议右前方角度。\n\n标题固定为“Violin W1-D2｜第一次持弓”。'},
    {type:'evidence',label:'第一次持弓录像（约10秒）',kinds:['video']}
  ]},
  {title:'复盘',required:true,components:[
    {type:'record',label:'持弓复盘',fields:[
      {key:'natural',label:'持弓自然程度',type:'rating'},
      {key:'main_problem',label:'最大问题',type:'text'}
    ]},
    {type:'selfcheck',title:'完成确认',items:['铅笔练习已完成','真实琴弓练习已完成','录像已保存']}
  ]}
]},

'VIO-W1-03':{title:'第一次让琴发声',module:'violin',goal:'让弓与琴弦建立正确接触；不按弦、不拉曲子、不追求好听。',estimated:'40 分钟',outcome:'第一次空弦录像',requiredEvidence:true,evidenceLabel:'第一次空弦录像',unlockSkills:['空弦'],steps:[
  {title:'复习',required:true,components:[
    {type:'teaching',title:'复习持琴持弓',text:'持琴、持弓、镜子检查，共约 5 分钟。若明显不舒服，先调整。'},
    {type:'checklist',items:['持琴检查','持弓检查','明显不舒服已调整']}
  ]},
  {title:'弓与琴弦',required:true,components:[
    {type:'teaching',title:'弓的位置',text:'1. 弓放在琴桥和指板之间\n2. 尽量与琴桥大致平行\n3. 先练中间的 A 弦和 D 弦\n4. 暂时少碰最粗的 G 弦和最细的 E 弦'}
  ]},
  {title:'A 弦短弓',required:true,components:[
    {type:'teaching',title:'A 弦短弓三轮',text:'1. 弓轻放在 A 弦\n2. 使用弓中间附近的一小段\n3. 每次移动 2–3 秒，然后停\n4. 第一轮只关注有没有声音\n5. 第二轮关注是否碰到其他弦\n6. 第三轮关注弓是否逐渐走斜\n7. 完成 10 次'},
    {type:'checklist',items:['第一轮：有声音','第二轮：没有碰其他弦','第三轮：弓没有明显走斜','完成 10 次']},
    {type:'record',label:'A 弦记录',fields:[
      {key:'a_done',label:'A 弦完成次数',type:'number',def:10}
    ]}
  ]},
  {title:'D 弦短弓',required:true,components:[
    {type:'teaching',title:'D 弦同样 10 次',text:'同样完成 10 次，逐轮检查声音、碰弦和走斜。'},
    {type:'checklist',items:['第一轮：有声音','第二轮：没有碰其他弦','第三轮：弓没有明显走斜','完成 10 次']},
    {type:'record',label:'D 弦记录',fields:[
      {key:'d_done',label:'D 弦完成次数',type:'number',def:10}
    ]}
  ]},
  {title:'声音帮助',required:false,components:[
    {type:'help',title:'声音问题排查',items:[
      {q:'刺耳',a:'先检查是否压得太重，适度放松右手。'},
      {q:'很虚',a:'检查弓与弦是否缺少稳定接触。'},
      {q:'总碰两根弦',a:'检查弓的角度。'},
      {q:'忽好忽坏',a:'看镜子检查弓路是否一直变化。'}
    ]}
  ]},
  {title:'成长录像',required:true,components:[
    {type:'teaching',title:'录制要求',text:'录制 15–20 秒 A 弦空弦，正面或稍右前方。\n\n标题固定为“Violin W1-D3｜第一次空弦”。'},
    {type:'evidence',label:'第一次空弦录像（15–20秒）',kinds:['video']}
  ]},
  {title:'复盘',required:true,components:[
    {type:'record',label:'空弦复盘',fields:[
      {key:'find_string',label:'能否稳定找到 A/D 弦',type:'select',options:['还不能','大概可以','比较稳定']},
      {key:'bow_path',label:'弓路',type:'rating'},
      {key:'sound_stable',label:'声音稳定度',type:'rating'},
      {key:'main_problem',label:'最大问题',type:'text'},
      {key:'discomfort',label:'是否有不适',type:'select',options:['没有','有一点','明显']}
    ]}
  ]}
]},

'VIO-W1-04':{title:'第一次慢弓 + 毕业练习',module:'violin',goal:'不学新动作，把持琴、持弓、A/D 空弦串起来。',estimated:'30–40 分钟',outcome:'Week 1 毕业录像',requiredEvidence:true,evidenceLabel:'Week 1 毕业录像',unlockSkills:['慢弓'],steps:[
  {title:'复习持琴',required:true,components:[
    {type:'teaching',title:'持琴复习',text:'约 5 分钟，自检：不耸肩 / 身体放松 / 琴相对稳定。'},
    {type:'selfcheck',title:'持琴自检',items:['不耸肩','身体放松','琴相对稳定']}
  ]},
  {title:'复习持弓',required:true,components:[
    {type:'selfcheck',title:'持弓自检',items:['拇指没有僵直','手指没有死抓','手腕相对自然']}
  ]},
  {title:'A 弦慢弓',required:true,components:[
    {type:'teaching',title:'A 弦慢弓',text:'1. 比前一课稍微扩大用弓范围，但不追求全弓\n2. 每次 3–5 秒\n3. 练习来回两个方向\n4. 完成 5 次往返'},
    {type:'timer',seconds:240,label:'A 弦慢弓练习（约4分钟）'}
  ]},
  {title:'D 弦慢弓',required:true,components:[
    {type:'teaching',title:'D 弦慢弓',text:'同样完成 5 次往返。'},
    {type:'timer',seconds:240,label:'D 弦慢弓练习（约4分钟）'}
  ]},
  {title:'镜子自检',required:true,components:[
    {type:'teaching',title:'重点观察',text:'重点观察弓是否逐渐更直。'},
    {type:'record',label:'镜子评分',fields:[
      {key:'bow_path',label:'运弓路线',type:'rating'},
      {key:'sound_stable',label:'声音稳定',type:'rating'},
      {key:'relax',label:'身体放松',type:'rating'}
    ]}
  ]},
  {title:'Week 1 毕业录像',required:true,components:[
    {type:'teaching',title:'录制要求',text:'录制约 30 秒：\n\n架琴 → 持弓 → A 弦慢弓 → D 弦慢弓\n\n标题固定为“Violin Week 1｜毕业记录”。'},
    {type:'evidence',label:'Week 1 毕业录像（约30秒）',kinds:['video']}
  ]},
  {title:'毕业复盘',required:true,components:[
    {type:'selfcheck',title:'毕业判断',items:['能自己站好并架琴','能拿弓并找到 A/D 弦','能拉出连续空弦声音','能通过镜子大致发现弓路是否走歪']},
    {type:'record',label:'毕业复盘',fields:[
      {key:'main_problem',label:'当前最大问题',type:'text'},
      {key:'next_improve',label:'下一次改进',type:'text'}
    ]}
  ]}
]},

/* ---------- 周复盘 ---------- */
'REVIEW-W1':{title:'Week 1 成长周报',module:'review',goal:'基于本周真实记录完成复盘，回答四个必答问题。',estimated:'约 30 分钟',outcome:'四个复盘回答',requiredEvidence:false,unlockSkills:[],steps:[
  {title:'自动统计',required:true,components:[
    {type:'teaching',title:'本周数据',text:'以下统计全部来自本周真实记录，不能用预设目标冒充结果。'},
    {type:'stats'}
  ]},
  {title:'本周成果',required:true,components:[
    {type:'teaching',title:'按实际数据展示',text:'缺失成果显示“待补”或“未完成”，不生成虚假示例数据。'},
    {type:'stats',mode:'outcome'}
  ]},
  {title:'复盘四问',required:true,components:[
    {type:'record',label:'四个必答问题',fields:[
      {key:'q1',label:'本周最有成就感的事情是什么？',type:'textarea'},
      {key:'q2',label:'哪个模块执行最困难？',type:'select',options:['健身','拍摄剪辑','烹饪','小提琴']},
      {key:'q3',label:'为什么困难？',type:'textarea'},
      {key:'q4',label:'下周应该怎么调整？',type:'textarea'}
    ]}
  ]}
]}
};

/* ===== 技能初始化（02文档 §11.3）===== */
var SKILLS_INIT={
  fitness:[{n:'器械认知',l:0},{n:'坐姿推胸',l:0},{n:'高位下拉',l:0},{n:'坐姿划船',l:0},{n:'腿举',l:0},{n:'推肩',l:0}],
  film:[{n:'景别',l:0},{n:'镜头组合',l:0},{n:'素材筛选',l:0},{n:'镜头排序',l:0},{n:'基础剪辑',l:0}],
  cooking:[{n:'打蛋',l:0},{n:'切块',l:0},{n:'切肉',l:0},{n:'基础炒蛋',l:0},{n:'基础炒肉',l:0},{n:'基础调味',l:0}],
  violin:[{n:'基础站姿',l:0},{n:'持琴',l:0},{n:'持弓',l:0},{n:'空弦',l:0},{n:'慢弓',l:0}]
};

/* ===== 默认状态 ===== */
function getDefaults(){
  return{
    schemaVersion:1,
    version:'0.1',
    profile:{
      name:'嘉图',height:175,weight:60,targetWeight:65,fitnessGoal:'增肌塑形',
      modules:{fitness:true,film:true,cooking:true,violin:true}
    },
    tasks:JSON.parse(JSON.stringify(TASKS)),
    courseProgress:{},   // courseId -> {stepIdx, completed, resultState, evidenceDone, stepData:{}, timer:{}}
    growth:{
      fitness:{sessions:[]},     // [{courseId,date,exercises:{chest:{weight,reps,diff,mastery,feel,pain}}}]
      film:{works:[]},           // [{serial,title,duration,clips,usedClips,ratings,createdAt}]
      cooking:{recipes:[],attempts:[]},
      violin:{recordings:[]}     // [{title,courseId,createdAt}]
    },
    skills:JSON.parse(JSON.stringify(SKILLS_INIT)),
    evidence:[],                 // 证据记录 [{id,courseId,module,title,createdAt}]
    timeline:[],                 // [{date,text}]
    weeklyReports:[],
    rescheduleEvents:[],         // [{taskId,time,from,to,reason}]
    settings:{theme:'system',reminders:{daily:true,taskStart:true,weeklyReview:true,sleep:true}}
  };
}
