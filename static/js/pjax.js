document.addEventListener('pjax:complete', () => {
    yeppioo.fullPage();
    yeppioo.redirect();
    if (document.getElementById('post-comment')) yeppioo.owoBig();
    if (window.location.pathname == '/page/music/') {
        document.body.setAttribute("data-theme", "dark")
        dark(true)
    } else {
        document.body.removeAttribute("data-theme")
    }
    setTimeout(() => {
        document.getElementById('page-header').classList.add("nav-fixed");
        if (window.location.pathname == '/page/link/') {
            yeppioo.pasteLinkTemplate();
        }
    }, 10);
});
