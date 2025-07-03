const yeppioo = {
    openSearch: function () {
        const $searchMask = document.getElementById('search-mask')
        const $searchDialog = document.querySelector('#local-search .search-dialog')
        btf.overflowPaddingR.add()
        btf.animateIn($searchMask, 'to_show 0.5s')
        btf.animateIn($searchDialog, 'titleScale 0.5s')
        setTimeout(() => { input.focus() }, 300)
        document.addEventListener('keydown', function f(event) {
            if (event.code === 'Escape') {
                closeSearch()
                document.removeEventListener('keydown', f)
            }
        })

        fixSafariHeight()
        window.addEventListener('resize', fixSafariHeight)
    },
    switchTheme: function () {
        const willChangeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        if (willChangeMode === 'dark') {
            btf.activateDarkMode()
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
        } else {
            btf.activateLightMode()
            GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
        }
        btf.saveToLocal.set('theme', willChangeMode, 2)
        handleThemeChange(willChangeMode)
    },
    fullPage: function () {
        var urls = ["/page/tags", "/page/link", "/page/essay", "/page/about", "/page/archives", "/page/fcircle", "/page/link-check"];
        var regex = new RegExp(urls.join("|"), "g");
        var existingFullPageStyle = document.getElementById('full-page-styles');
        if (regex.test(window.location.pathname)) {
            document.getElementById('page-header').classList.add("nav-fixed");
            setTimeout(() => {
                if (!existingFullPageStyle) {
                    var newElement = document.createElement('style');
                    newElement.id = 'full-page-styles';
                    newElement.textContent = fullPageStyle;
                    document.head.appendChild(newElement);
                }
            }, 1);
        } else {
            setTimeout(() => {
                if (existingFullPageStyle) {
                    existingFullPageStyle.remove();
                }
            }, 1);
        }
    },
    pasteLinkTemplate: function () {
        return;
        document.querySelector(".el-textarea__inner").value = "```yml \n  - name: 显示昵称 (请勿包含博客等字样）\n    link: 站点链接 (要求博客地址，请勿提交个人主页）\n    avatar: 站点头像\n    descr: 站点描述\n```";
        // document.querySelector(".el-textarea__inner").focus();
        setTimeout(() => {
            document.querySelector(".el-textarea__inner").style.height = "173px";
        }, 100);
    },
    copySongName: function () {
        let txa = document.createElement("textarea");
        txa.value = anzhiyu.musicGetName();
        document.body.appendChild(txa)
        txa.select();
        document.execCommand("Copy");
        document.body.removeChild(txa);
        btf.snackbarShow(`复制成功 : ${anzhiyu.musicGetName()}`)
    },
    updatePageStyle: function (urls, style, id) {
        var regex = new RegExp(urls.join("|"), "g");
        var styleElement = document.getElementById(id);
        if (regex.test(window.location.pathname)) {
            setTimeout(() => {
                if (!styleElement) {

                    var newElement = document.createElement('style');
                    newElement.id = id;
                    newElement.textContent = style;
                    document.head.appendChild(newElement);
                }
            }, 10);
        } else {
            setTimeout(() => {
                if (styleElement) {
                    styleElement.remove();
                }
            }, 10);
        }
    },
    redirect: function () {
        const host = window.location.hostname;
        if (host == "blog.yep.vin") {
            btf.snackbarShow("blog.yep.vin 已迁移至 blog.yeppioo.vip ，请更新链接", false, 10000)
        }
    },
    owoBig: function () {
        let flag = 1, // 设置节流阀
            owo_time = '', // 设置计时器
            m = 3; // 设置放大倍数
        // 创建盒子
        let div = document.createElement('div'),
            body = document.querySelector('body');
        // 设置ID
        div.id = 'owo-big';
        // 插入盒子
        body.appendChild(div)

        // 构造observer
        let observer = new MutationObserver(mutations => {

            for (let i = 0; i < mutations.length; i++) {
                let dom = mutations[i].addedNodes,
                    owo_body = '';
                if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
                // 如果需要在评论内容中启用此功能请解除下面的注释
                // else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
                else continue;

                // 禁用右键（手机端长按会出现右键菜单，为了体验给禁用掉）
                if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault());
                // 鼠标移入
                owo_body.onmouseover = (e) => {
                    if (flag && e.target.tagName == 'IMG') {
                        flag = 0;
                        // 移入300毫秒后显示盒子
                        owo_time = setTimeout(() => {
                            let height = e.path[0].clientHeight * m, // 盒子高
                                width = e.path[0].clientWidth * m, // 盒子宽
                                left = (e.x - e.offsetX) - (width - e.path[0].clientWidth) / 2, // 盒子与屏幕左边距离
                                top = e.y - e.offsetY; // 盒子与屏幕顶部距离

                            if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10); // 右边缘检测，防止超出屏幕
                            if (left < 0) left = 10; // 左边缘检测，防止超出屏幕
                            // 设置盒子样式
                            div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
                            // 在盒子中插入图片
                            div.innerHTML = `<img src="${e.target.src}">`
                        }, 300);
                    }
                };
                // 鼠标移出隐藏盒子
                owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
            }

        })
        observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // 监听的 元素 和 配置项
    },
    getRandomFishArticle: function () {
        // 获取鱼塘文章缓存
        const cacheKey = "friend-circle-lite-cache";
        const cacheTimeKey = "friend-circle-lite-cache-time";
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const currentTime = new Date().getTime();

        // 检查缓存是否有效（10分钟内）
        if (cachedTime && currentTime - cachedTime < 600000 && cachedData) {
            try {
                const articleData = JSON.parse(cachedData).article_data;
                if (articleData && articleData.length > 0) {
                    // 随机选择一篇文章
                    const randomArticle = articleData[Math.floor(Math.random() * articleData.length)];
                    return {
                        success: true,
                        data: randomArticle
                    };
                }
            } catch (error) {
                console.error("解析鱼塘缓存数据失败", error);
                return {
                    success: false,
                    message: "解析鱼塘缓存数据失败"
                };
            }
        }

        // 如果缓存无效或没有数据，尝试获取数据
        return this.fetchFishData().then(result => {
            if (result.success && result.data.article_data && result.data.article_data.length > 0) {
                const articleData = result.data.article_data;
                const randomArticle = articleData[Math.floor(Math.random() * articleData.length)];
                return {
                    success: true,
                    data: randomArticle
                };
            } else {
                return {
                    success: false,
                    message: "获取鱼塘数据失败"
                };
            }
        });
    },
    getAllFishArticles: function () {
        // 获取鱼塘所有文章数据
        const cacheKey = "friend-circle-lite-cache";
        const cacheTimeKey = "friend-circle-lite-cache-time";
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        const currentTime = new Date().getTime();

        if (cachedTime && currentTime - cachedTime < 600000 && cachedData) {
            try {
                const parsedData = JSON.parse(cachedData);
                return {
                    success: true,
                    data: parsedData.article_data || [],
                    stats: parsedData.statistical_data || {}
                };
            } catch (error) {
                console.error("解析鱼塘缓存数据失败", error);
                return {
                    success: false,
                    message: "解析鱼塘缓存数据失败"
                };
            }
        }

        // 如果缓存无效或没有数据，尝试获取数据
        return this.fetchFishData().then(result => {
            if (result.success) {
                return {
                    success: true,
                    data: result.data.article_data || [],
                    stats: result.data.statistical_data || {}
                };
            } else {
                return {
                    success: false,
                    message: "获取鱼塘数据失败"
                };
            }
        });
    },
    fetchFishData: function () {
        if (typeof UserConfig === 'undefined') {
            var UserConfig = {
                // 填写你的fc Lite地址
                private_api_url: 'https://fcircle.api.yeppioo.vip/',
                // 点击加载更多时，一次最多加载几篇文章，默认20
                page_turning_number: 24,
                // 头像加载失败时，默认头像地址
                error_img: '/static/img/erravatar.png',
            }
        }
        // 确保UserConfig已定义
        if (typeof UserConfig === 'undefined' || !UserConfig.private_api_url) {
            console.error("UserConfig未定义或API地址为空");
            return Promise.resolve({
                success: false,
                message: "UserConfig未定义或API地址为空"
            });
        }

        const cacheKey = "friend-circle-lite-cache";
        const cacheTimeKey = "friend-circle-lite-cache-time";
        const currentTime = new Date().getTime();

        return fetch(`${UserConfig.private_api_url}all.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("网络请求失败");
                }
                return response.json();
            })
            .then(data => {
                // 保存到缓存
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheTimeKey, currentTime.toString());

                return {
                    success: true,
                    data: data
                };
            })
            .catch(error => {
                console.error("获取鱼塘数据失败", error);
                return {
                    success: false,
                    message: error.message || "获取鱼塘数据失败"
                };
            });
    }
}

