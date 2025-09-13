// Tab 切换功能
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // 更新活动 tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 显示对应的 tab 内容
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                    // 如果切换到时间戳 tab，更新默认时间戳
                    if (tabName === 'timestamp') {
                        // 确保时间戳模块已加载
                        if (typeof updateAllInputs === 'function') {
                            updateAllInputs();
                        }
                    }
                }
            });
        });
    });
});