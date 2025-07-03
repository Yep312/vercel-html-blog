var data = undefined

fetch('https://fetch.api.yeppioo.vip/api/static/data/friend.json')
    .then(response => response.json())
    .then(res => {
        data = res
        handle()
    })
    .catch(error => {
        document.getElementById('lc-spinner').style.display = 'none';
        document.getElementById('lc-text').innerHTML = '获取友链数据失败<br>' + error;
    });

function createCard(friend) {
    let errorInfo = '';
    if (friend.errorCodes) {
        errorInfo = `<div class="lc-card-error">错误信息: ${Array.isArray(friend.errorCodes) ? friend.errorCodes.join(', ') : friend.errorCodes}</div>`;
    }
    let oldDomainInfo = '';
    if (friend.detectedOldDomain) {
        oldDomainInfo = `<div class="lc-card-old-domain">旧域名: ${friend.detectedOldDomain}</div>`;
    }
    return `<a class="lc-card" href="${friend.url}" target="_blank" rel="noopener noreferrer">
        <img class="lc-card-avatar" src="${friend.avatar}" alt="${friend.name}" loading="lazy" onerror="this.onerror=null;this.src='/static/img/erravatar.png';" />
        <div class="lc-card-info">
            <div class="lc-card-name">${friend.name}</div>
            <div class="lc-card-url">${friend.url}</div>
            ${oldDomainInfo}
            ${errorInfo}
        </div>
    </a>`;
}

function renderCards(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!list || list.length === 0) {
        container.innerHTML = '<div style="color:#aaa;text-align:center;padding:12px 0;">暂无数据</div>';
        return;
    }
    container.innerHTML = `<div class="lc-card-list">${list.map(createCard).join('')}</div>`;
}

function handle() {
    console.log(data)
    document.getElementById('lc-loader').style.display = 'none';
    document.getElementById('lc-result').style.display = 'block';
    const localTime = new Date(data.updateTime).toLocaleString();
    document.getElementById('lc-result-title').innerHTML = `成功获取 ${data.old.length + data.success.length + data.fail.length + data.notFound.length} 条数据, 更新时间: ${localTime}`;
    renderCards(data.success, 'lc-result-success');
    renderCards(data.old, 'lc-result-old');
    renderCards(data.notFound, 'lc-result-notFound');
    renderCards(data.fail, 'lc-result-fail');
}