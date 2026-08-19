/* install-guide.js — PWA 安装引导：自动识别浏览器，给出对应的「添加到主屏幕」步骤 */
(function () {
  'use strict';

  /* ---------- 环境检测 ---------- */
  var UA = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(UA) || (/Macintosh/.test(UA) && 'ontouchend' in document);
  var isAndroid = /Android/.test(UA);
  var isWeChat = /MicroMessenger/i.test(UA);
  var isQQApp = /QQ\/|QQ%2f/i.test(UA) && !/MQQBrowser/i.test(UA);
  var isQQBrowser = /MQQBrowser/i.test(UA);
  var isUC = /UBrowser|UCBrowser/i.test(UA);
  var isBaidu = /baidubrowser|BaiduHD/i.test(UA);
  var isEdge = /Edg\//.test(UA);
  var isChrome = /Chrome\/|Chromium\//.test(UA) && !isEdge && !isUC && !isQQBrowser && !isBaidu;
  var isSafari = /Safari/.test(UA) && /Version\//.test(UA) && !isChrome && !isEdge;
  var isXiaomi = /MiuiBrowser|XiaoMi/i.test(UA);
  var isHuawei = /HuaweiBrowser|HUAWEI/i.test(UA);
  var isVivo = /VivoBrowser/i.test(UA);
  var isOppo = /HeyTapBrowser|OppoBrowser/i.test(UA);

  /* 已安装（standalone 模式）则不显示 */
  var isStandalone =
    window.matchMedia && (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches
    ) || window.navigator.standalone === true;

  /* 7 天内点过关闭则不再打扰 */
  var DISMISS_KEY = 'growth_os_install_dismissed_at';
  function isDismissed() {
    try {
      var t = parseInt(localStorage.getItem(DISMISS_KEY) || '0', 10);
      return t && (Date.now() - t) < 7 * 24 * 3600 * 1000;
    } catch (e) { return false; }
  }

  if (isStandalone || isDismissed()) return;

  /* ---------- 浏览器定制文案 ---------- */
  function detectBrowser() {
    if (isWeChat) return 'wechat';
    if (isQQApp) return 'qqapp';
    if (isQQBrowser) return 'qqbrowser';
    if (isUC) return 'uc';
    if (isBaidu) return 'baidu';
    if (isIOS && isSafari) return 'ios-safari';
    if (isIOS && !isSafari) return 'ios-other';
    if (isXiaomi) return 'xiaomi';
    if (isHuawei) return 'huawei';
    if (isVivo) return 'vivo';
    if (isOppo) return 'oppo';
    if (isChrome) return 'chrome';
    if (isEdge) return 'edge';
    if (isAndroid) return 'android-other';
    return 'other';
  }

  var BROWSER_NAME = {
    'wechat': '微信内置浏览器',
    'qqapp': 'QQ 内置浏览器',
    'qqbrowser': 'QQ 浏览器',
    'uc': 'UC 浏览器',
    'baidu': '百度浏览器',
    'ios-safari': 'iPhone Safari',
    'ios-other': 'iPhone 浏览器',
    'xiaomi': '小米浏览器',
    'huawei': '华为浏览器',
    'vivo': 'vivo 浏览器',
    'oppo': 'OPPO 浏览器',
    'chrome': 'Chrome 浏览器',
    'edge': 'Edge 浏览器',
    'android-other': '安卓浏览器',
    'other': '当前浏览器'
  };

  /* 每种浏览器的安装步骤（步骤数组：[emoji, 文字]） */
  var GUIDE = {
    'wechat': [
      ['1️⃣', '点击右上角「···」（三个点）'],
      ['2️⃣', '选择「在浏览器打开」或「在 Safari 中打开」'],
      ['3️⃣', '在打开的浏览器里，按对应浏览器的步骤添加到主屏幕']
    ],
    'qqapp': [
      ['1️⃣', '点击右上角「☰」或「···」'],
      ['2️⃣', '选择「用浏览器打开」'],
      ['3️⃣', '在浏览器里按提示添加到主屏幕']
    ],
    'ios-safari': [
      ['1️⃣', '点击底部工具栏中央的「分享」按钮（方框带↑）'],
      ['2️⃣', '下滑列表，找到并点击「添加到主屏幕」'],
      ['3️⃣', '点右上角「添加」完成']
    ],
    'ios-other': [
      ['1️⃣', '在 Safari 中打开本页面（若当前是其他浏览器，请先复制链接到 Safari）'],
      ['2️⃣', '点击底部「分享」按钮（方框带↑）'],
      ['3️⃣', '选择「添加到主屏幕」→「添加」']
    ],
    'chrome': [
      ['1️⃣', '点击右上角「⋮」（三个竖点）'],
      ['2️⃣', '点击「添加到主屏幕」或「安装应用」'],
      ['3️⃣', '确认「安装」即可']
    ],
    'edge': [
      ['1️⃣', '点击底部「···」菜单'],
      ['2️⃣', '选择「添加到手机」→「安装」']
    ],
    'xiaomi': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「添加到桌面」'],
      ['3️⃣', '确认添加即可']
    ],
    'huawei': [
      ['1️⃣', '点击底部「⋮」或「···」菜单'],
      ['2️⃣', '选择「添加到桌面」→「添加」']
    ],
    'vivo': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「桌面书签」或「添加到桌面」']
    ],
    'oppo': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「添加到桌面」或「添加书签」']
    ],
    'qqbrowser': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「添加书签」→「添加到桌面」']
    ],
    'uc': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「添加书签」→「发送到桌面」']
    ],
    'baidu': [
      ['1️⃣', '点击底部「☰」菜单'],
      ['2️⃣', '选择「添加到桌面」']
    ],
    'android-other': [
      ['1️⃣', '打开浏览器菜单（通常是「☰」或「⋮」）'],
      ['2️⃣', '寻找「添加到桌面」「添加到主屏幕」或「桌面快捷方式」']
    ],
    'other': [
      ['1️⃣', '打开浏览器菜单'],
      ['2️⃣', '寻找「添加到桌面」或「添加到主屏幕」选项']
    ]
  };

  /* ---------- Chrome 原生安装横幅 ---------- */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    /* 有原生安装能力时，横幅按钮直接触发安装 */
    var btn = document.getElementById('ig-btn');
    if (btn) btn.textContent = '立即安装';
  });

  /* ---------- 注入样式 ---------- */
  var css = [
    '.ig-banner{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(64px + env(safe-area-inset-bottom));',
    'width:calc(100% - 32px);max-width:398px;z-index:120;background:var(--c-surface);',
    'border:.5px solid var(--c-border);border-radius:var(--r-md);box-shadow:var(--sh-lg);',
    'padding:12px 14px;display:flex;align-items:center;gap:10px;',
    'animation:igUp .35s var(--ease);}',
    '.ig-icon{width:38px;height:38px;border-radius:9px;flex:none;',
    'background:linear-gradient(135deg,#007AFF,#5856D6);display:flex;align-items:center;justify-content:center;',
    'font-size:20px;color:#fff;}',
    '.ig-text{flex:1;min-width:0;}',
    '.ig-title{font-size:14px;font-weight:600;color:var(--c-text);line-height:1.3;}',
    '.ig-sub{font-size:12px;color:var(--c-text-sub);margin-top:2px;line-height:1.3;}',
    '.ig-btn{flex:none;background:var(--c-primary);color:#fff;border:none;border-radius:16px;',
    'padding:8px 14px;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;}',
    '.ig-close{flex:none;background:none;border:none;color:var(--c-text-tert);font-size:16px;',
    'padding:6px;cursor:pointer;line-height:1;font-family:inherit;}',
    '.ig-sheet{position:fixed;inset:0;z-index:300;display:none;align-items:flex-end;justify-content:center;}',
    '.ig-sheet.active{display:flex;}',
    '.ig-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.4);animation:igFade .2s var(--ease);}',
    '.ig-content{position:relative;width:100%;max-width:var(--maxw);background:var(--c-surface);',
    'border-radius:var(--r-lg) var(--r-lg) 0 0;padding:20px 20px calc(24px + env(safe-area-inset-bottom));',
    'animation:igSlide .3s var(--ease);max-height:82dvh;overflow-y:auto;box-shadow:var(--sh-lg);}',
    '.ig-handle{width:36px;height:4px;border-radius:2px;background:var(--c-text-tert);opacity:.5;margin:0 auto 14px;}',
    '.ig-h2{font-size:17px;font-weight:700;color:var(--c-text);text-align:center;margin-bottom:4px;}',
    '.ig-browser{font-size:12px;color:var(--c-primary);text-align:center;font-weight:600;margin-bottom:16px;}',
    '.ig-step{display:flex;gap:12px;align-items:flex-start;padding:11px 12px;border-radius:var(--r-sm);',
    'background:var(--c-surface-2);margin-bottom:8px;}',
    '.ig-step-emoji{font-size:18px;flex:none;line-height:1.4;}',
    '.ig-step-text{font-size:14px;color:var(--c-text);line-height:1.55;}',
    '.ig-note{font-size:12px;color:var(--c-text-sub);line-height:1.6;margin-top:12px;',
    'padding:10px 12px;background:rgba(0,122,255,.06);border-radius:var(--r-sm);}',
    '.ig-native-btn{width:100%;margin-top:14px;background:var(--c-primary);color:#fff;border:none;',
    'border-radius:16px;padding:13px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;}',
    '@keyframes igUp{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}',
    '@keyframes igFade{from{opacity:0}to{opacity:1}}',
    '@keyframes igSlide{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}'
  ].join('');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- 构建横幅 ---------- */
  var browserKey = detectBrowser();
  var banner = document.createElement('div');
  banner.className = 'ig-banner';
  banner.id = 'ig-banner';
  banner.innerHTML =
    '<div class="ig-icon">📲</div>' +
    '<div class="ig-text">' +
      '<div class="ig-title">安装到手机主屏幕</div>' +
      '<div class="ig-sub">像 App 一样全屏使用 · 支持离线</div>' +
    '</div>' +
    '<button class="ig-btn" id="ig-btn">查看步骤</button>' +
    '<button class="ig-close" id="ig-close" aria-label="关闭">✕</button>';

  /* ---------- 构建引导面板 ---------- */
  var steps = GUIDE[browserKey] || GUIDE['other'];
  var stepsHtml = steps.map(function (s) {
    return '<div class="ig-step"><span class="ig-step-emoji">' + s[0] + '</span>' +
      '<span class="ig-step-text">' + s[1] + '</span></div>';
  }).join('');

  var sheet = document.createElement('div');
  sheet.className = 'ig-sheet';
  sheet.id = 'ig-sheet';
  sheet.innerHTML =
    '<div class="ig-backdrop" id="ig-backdrop"></div>' +
    '<div class="ig-content">' +
      '<div class="ig-handle"></div>' +
      '<div class="ig-h2">添加到主屏幕</div>' +
      '<div class="ig-browser">当前环境：' + (BROWSER_NAME[browserKey] || '当前浏览器') + '</div>' +
      stepsHtml +
      (deferredPrompt ? '<button class="ig-native-btn" id="ig-native">一键安装</button>' : '') +
      '<div class="ig-note">💡 安装后图标出现在主屏幕，打开即全屏运行，无地址栏；内容数据保存在本机浏览器中，卸载或清除浏览器数据会一起清除，重要数据请定期在「我的」页导出备份。</div>' +
    '</div>';

  /* ---------- 事件 ---------- */
  function showSheet() { sheet.classList.add('active'); }
  function hideSheet() { sheet.classList.remove('active'); }

  function onInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        hideSheet();
        dismiss();
      });
    } else {
      showSheet();
    }
  }

  function dismiss() {
    banner.remove();
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
  }

  /* 延迟 1.2s 出现，避免干扰首屏 */
  setTimeout(function () {
    document.body.appendChild(banner);
    document.body.appendChild(sheet);

    document.getElementById('ig-btn').addEventListener('click', onInstallClick);
    document.getElementById('ig-close').addEventListener('click', dismiss);
    document.getElementById('ig-backdrop').addEventListener('click', hideSheet);

    var nativeBtn = document.getElementById('ig-native');
    if (nativeBtn) nativeBtn.addEventListener('click', onInstallClick);
  }, 1200);
})();
