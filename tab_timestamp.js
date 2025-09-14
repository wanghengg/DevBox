// 时间戳转换功能
document.addEventListener('DOMContentLoaded', () => {
    const timestampInput = document.getElementById('timestampInput');
    const unitSelect = document.getElementById('unitSelect');
    const beijingTimeInput = document.getElementById('beijingTimeInput');
    const easternTimeInput = document.getElementById('easternTimeInput');
    const pacificTimeInput = document.getElementById('pacificTimeInput');
    const timestampConvertBtn = document.getElementById('timestampConvertBtn');
    const beijingConvertBtn = document.getElementById('beijingConvertBtn');
    const easternConvertBtn = document.getElementById('easternConvertBtn');
    const pacificConvertBtn = document.getElementById('pacificConvertBtn');
    const timestampClearBtn = document.getElementById('timestampClearBtn');
    
    // 初始化时设置默认值
    updateAllInputs();
    
    // Tab 切换到时间戳时更新默认值
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            if (tabName === 'timestamp') {
                updateAllInputs();
            }
        });
    });
    
    // 更新所有输入框的默认值（基于北京时间）
    function updateAllInputs() {
        // 创建一个表示当前时间的 Date 对象
        const now = new Date();
        
        // 检查本地时间是否已经是北京时间
        const isBeijingTime = now.toString().includes('GMT+0800') || now.toString().includes('中国标准时间');
        
        let beijingTimestamp;
        if (isBeijingTime) {
            // 本地时间已经是北京时间，直接使用
            beijingTimestamp = now.getTime();
        } else {
            // 本地时间不是北京时间，需要转换
            const beijingTimeString = new Intl.DateTimeFormat('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Shanghai'
            }).format(now);
            
            // 将字符串转换回 Date 对象（注意：需要添加毫秒部分）
            const beijingDate = new Date(beijingTimeString + '.000');
            beijingTimestamp = beijingDate.getTime();
        }
        
        // 只在初始化时设置时间戳输入框的值，单位切换时不自动更新
        if (!timestampInput.value) {
            const unit = unitSelect.value;
            if (unit === 'sec') {
                timestampInput.value = Math.floor(beijingTimestamp / 1000);
            } else {
                timestampInput.value = beijingTimestamp;
            }
        }
        
        // 设置北京时间输入框的值
        const beijingTimeStr = new Date(beijingTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Shanghai'
        });
        beijingTimeInput.value = beijingTimeStr;
        
        // 设置美东时间输入框的值
        const easternTimeStr = new Date(beijingTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/New_York'
        });
        easternTimeInput.value = easternTimeStr;
        
        // 设置美西时间输入框的值
        const pacificTimeStr = new Date(beijingTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Los_Angeles'
        });
        pacificTimeInput.value = pacificTimeStr;
    }
    
    // 时间戳转换为时区时间
    timestampConvertBtn.addEventListener('click', () => {
        const input = timestampInput.value.trim();
        if (!input) {
            alert('请输入时间戳');
            return;
        }
        
        // 验证输入是否为数字
        const timestamp = Number(input);
        if (isNaN(timestamp)) {
            alert('请输入有效的时间戳');
            return;
        }
        
        // 根据选择的单位转换为毫秒
        const unit = unitSelect.value;
        let msTimestamp = timestamp;
        if (unit === 'sec') {
            msTimestamp = timestamp * 1000;
        }
        
        // 设置北京时间输入框的值
        const beijingTimeStr = new Date(msTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Shanghai'
        });
        beijingTimeInput.value = beijingTimeStr;
        
        // 设置美东时间输入框的值
        const easternTimeStr = new Date(msTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/New_York'
        });
        easternTimeInput.value = easternTimeStr;
        
        // 设置美西时间输入框的值
        const pacificTimeStr = new Date(msTimestamp).toLocaleString('sv-SE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'America/Los_Angeles'
        });
        pacificTimeInput.value = pacificTimeStr;
    });
    
    // 北京时间转换为其他时区和时间戳
    beijingConvertBtn.addEventListener('click', () => {
        const input = beijingTimeInput.value.trim();
        if (!input) {
            alert('请输入北京时间');
            return;
        }
        
        try {
            // 创建北京时间的 Date 对象
            const beijingDate = new Date(input);
            // 确保时区为北京时间
            const beijingTimeStr = beijingDate.toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' });
            const dateWithBeijingZone = new Date(beijingTimeStr);
            const beijingTimestamp = dateWithBeijingZone.getTime();
            
            // 设置时间戳输入框的值
            const unit = unitSelect.value;
            if (unit === 'sec') {
                timestampInput.value = Math.floor(beijingTimestamp / 1000);
            } else {
                timestampInput.value = beijingTimestamp;
            }
            
            // 设置美东时间输入框的值
            const easternTimeStr = new Date(beijingTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/New_York'
            });
            easternTimeInput.value = easternTimeStr;
            
            // 设置美西时间输入框的值
            const pacificTimeStr = new Date(beijingTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Los_Angeles'
            });
            pacificTimeInput.value = pacificTimeStr;
        } catch (error) {
            alert('请输入正确格式的北京时间: ' + error.message);
        }
    });
    
    // 美东时间转换为其他时区和时间戳
    easternConvertBtn.addEventListener('click', () => {
        const input = easternTimeInput.value.trim();
        if (!input) {
            alert('请输入美东时间');
            return;
        }
        
        try {
            // 创建美东时间的 Date 对象
            const easternDate = new Date(input);
            // 确保时区为美东时间
            const easternTimeStr = easternDate.toLocaleString('sv-SE', { timeZone: 'America/New_York' });
            const dateWithEasternZone = new Date(easternTimeStr);
            const easternTimestamp = dateWithEasternZone.getTime();
            
            // 设置时间戳输入框的值
            const unit = unitSelect.value;
            if (unit === 'sec') {
                timestampInput.value = Math.floor(easternTimestamp / 1000);
            } else {
                timestampInput.value = easternTimestamp;
            }
            
            // 设置北京时间输入框的值
            const beijingTimeStr = new Date(easternTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Shanghai'
            });
            beijingTimeInput.value = beijingTimeStr;
            
            // 设置美西时间输入框的值
            const pacificTimeStr = new Date(easternTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/Los_Angeles'
            });
            pacificTimeInput.value = pacificTimeStr;
        } catch (error) {
            alert('请输入正确格式的美东时间: ' + error.message);
        }
    });
    
    // 美西时间转换为其他时区和时间戳
    pacificConvertBtn.addEventListener('click', () => {
        const input = pacificTimeInput.value.trim();
        if (!input) {
            alert('请输入美西时间');
            return;
        }
        
        try {
            // 创建美西时间的 Date 对象
            const pacificDate = new Date(input);
            // 确保时区为美西时间
            const pacificTimeStr = pacificDate.toLocaleString('sv-SE', { timeZone: 'America/Los_Angeles' });
            const dateWithPacificZone = new Date(pacificTimeStr);
            const pacificTimestamp = dateWithPacificZone.getTime();
            
            // 设置时间戳输入框的值
            const unit = unitSelect.value;
            if (unit === 'sec') {
                timestampInput.value = Math.floor(pacificTimestamp / 1000);
            } else {
                timestampInput.value = pacificTimestamp;
            }
            
            // 设置北京时间输入框的值
            const beijingTimeStr = new Date(pacificTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'Asia/Shanghai'
            });
            beijingTimeInput.value = beijingTimeStr;
            
            // 设置美东时间输入框的值
            const easternTimeStr = new Date(pacificTimestamp).toLocaleString('sv-SE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZone: 'America/New_York'
            });
            easternTimeInput.value = easternTimeStr;
        } catch (error) {
            alert('请输入正确格式的美西时间: ' + error.message);
        }
    });
    
    // 时间戳清空按钮事件
    timestampClearBtn.addEventListener('click', () => {
        timestampInput.value = '';
        beijingTimeInput.value = '';
        easternTimeInput.value = '';
        pacificTimeInput.value = '';
    });
});