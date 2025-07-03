setTimeout(() => {
  document.getElementById('page-header').classList.add("nav-fixed");
  yeppioo.fullPage()
  yeppioo.redirect()
  if (window.location.pathname == '/page/music/') {
    document.body.setAttribute("data-theme", "dark")
    dark(true)
  } else {
    document.body.removeAttribute("data-theme")
  }
  if (window.location.pathname == '/page/link/') {
    yeppioo.pasteLinkTemplate();
  }
}, 10);

const handleThemeChange = mode => {
  const globalFn = window.globalFn || {}
  const themeChange = globalFn.themeChange || {}
  if (!themeChange) {
    return
  }

  Object.keys(themeChange).forEach(key => {
    const themeChangeFn = themeChange[key]
    if (['disqus', 'disqusjs'].includes(key)) {
      setTimeout(() => themeChangeFn(mode), 300)
    } else {
      themeChangeFn(mode)
    }
  })
}

var anzhiyu_musicPlaying = false;
var anzhiyu_musicFirst = false;

document.querySelector("#tp-weather-widget").addEventListener("click", function () {
  if (window.innerWidth <= 600)
    setTimeout(() => {
      document.querySelector("#tp-weather-widget > div > div.sc-gisBJw.jEbFAF").style = 'height: 100vh !important;'
    }, 10);
});

const fullPageStyle = `
#page .page-title {
  display: none;
}

#body-wrap {
  background: var(--global-bg) !important;
}
#page,
#page:hover {
  -webkit-box-shadow: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
}
#footer-wrap,
#footer-wrap a {
  color: var(--font-color);
}
h1.page-title + .tag-cloud-list {
  display: flex;
  justify-content: center;
}
.layout.hide-aside {
  max-width: unset;
}
div#page {
  background: transparent !important;
}
#aside-content {
  display: none;
}
.layout > div:first-child {
  width: 100%;
  background: transparent !important;
  border: none;
  box-shadow: none !important;
}
#page-header {
  height: unset !important;
}
#page-site-info {
  display: none;
}
`