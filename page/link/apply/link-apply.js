function initFriendApply(isLoaded = false) {
    const API_BASE = 'https://api.yeppioo.vip/api';
    const form = document.getElementById('la-apply-form');
    const msg = document.getElementById('la-form-msg');
    const loader = document.getElementById('la-loader');
    const table = document.getElementById('la-table');
    const tbody = document.getElementById('la-table-body');
    const empty = document.getElementById('la-empty');
    const submitBtn = form ? form.querySelector('.la-btn') : null;

    if (!form || !submitBtn) return;

    // 加载申请列表
    function loadList() {
        loader.style.display = 'flex';
        table.style.display = 'none';
        empty.style.display = 'none';
        fetch(API_BASE + '/friend/list')
            .then(res => res.json())
            .then(data => {
                loader.style.display = 'none';
                if (data.success && Array.isArray(data.list) && data.list.length > 0) {
                    tbody.innerHTML = '';
                    data.list.forEach(item => {
                        const tr = document.createElement('tr');
                        // 添加状态列
                        const state = item.state || '待审核';
                        // 根据状态设置不同的样式
                        const stateClass = getStateClass(state);
                        tr.innerHTML = `
                  <td>${item.name}</td>
                  <td><a href="${item.link}" target="_blank">${item.link}</a></td>
                  <td><img src="${item.avatarLink}" alt="avatar" onerror="this.onerror=null;this.src='/static/img/erravatar.png';"></td>
                  <td>${item.descr}</td>
                  <td><span class="la-state ${stateClass}">${state}</span></td>
                  <td>${formatTime(item.createdAt)}</td>
                `;
                        tbody.appendChild(tr);
                    });
                    table.style.display = '';
                } else {
                    empty.style.display = '';
                }
            })
            .catch(() => {
                loader.style.display = 'none';
                empty.style.display = '';
            });
    }

    // 根据状态返回对应的CSS类名
    function getStateClass(state) {
        switch (state) {
            case '已通过':
            case '已批准':
            case '通过':
                return 'la-state-success';
            case '待审核':
            case '审核中':
                return 'la-state-pending';
            case '已拒绝':
            case '拒绝':
                return 'la-state-rejected';
            default:
                return 'la-state-other';
        }
    }

    if (!isLoaded) {
        // 表单提交
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            msg.textContent = '';
            const formData = new FormData(form);

            // 获取表单数据，包含邮箱字段
            const data = {
                name: formData.get('name'),
                link: formData.get('link'),
                avatarLink: formData.get('avatarLink'),
                email: formData.get('email'), // 新增邮箱字段
                descr: formData.get('descr')
            };

            // 简单校验，确保所有字段都已填写
            if (!data.name || !data.link || !data.avatarLink || !data.email || !data.descr) {
                msg.textContent = '请填写完整信息';
                return;
            }

            // 验证邮箱格式
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                msg.textContent = '请输入有效的邮箱地址';
                return;
            }

            msg.textContent = '正在提交...';
            submitBtn.disabled = true;
            fetch(API_BASE + '/friend/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => {
                    if (!res.ok) throw new Error('网络错误');
                    return res.json();
                })
                .then(() => {
                    msg.style.color = '#27ae60';
                    msg.textContent = '申请成功，等待审核！';
                    form.reset();
                    submitBtn.disabled = false;
                    loadList();
                })
                .catch(() => {
                    msg.style.color = '#e74c3c';
                    msg.textContent = '提交失败，请稍后重试';
                    submitBtn.disabled = false;
                });
        });
    }

    // 时间格式化
    function formatTime(str) {
        if (!str) return '';
        const d = new Date(str);
        return d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0') + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    loadList();
}

initFriendApply()

document.addEventListener('pjax:complete', () => {
    setTimeout(() => {
        initFriendApply(true);
    }, 0);
});
