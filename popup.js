document.addEventListener('DOMContentLoaded', () => {
    // Tab 切换功能
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
                        updateAllInputs();
                    }
                }
            });
        });
    });
    
    // JSON 处理功能
    const parseBtn = document.getElementById('parseBtn');
    const jsonInput = document.getElementById('jsonInput');
    const resultDiv = document.getElementById('result');
    const clearBtn = document.getElementById('clearBtn');
    
    // 获取已存在的输出容器
    const outputsContainer = document.getElementById('outputs-container');
    
    parseBtn.addEventListener('click', () => {
        const jsonStr = jsonInput.value.trim();
        if (!jsonStr) {
            resultDiv.textContent = '请输入需要反序列化的JSON字符串';
            resultDiv.style.color = 'red';
            return;
        }
        
        try {
            const isEscaped = document.getElementById('isEscaped').checked;
            let processedStr = jsonStr;
            if (isEscaped) {
                processedStr = JSON.parse(`"${jsonStr}"`); // 处理转义字符串
            }
            
            // 递归深度限制（防止无限循环）
            const deepParse = (value, depth = 0) => {
                const MAX_DEPTH = 10;
                if (depth > MAX_DEPTH) return value;
                
                if (typeof value === 'string') {
                    try {
                        const parsed = JSON.parse(value);
                        return deepParse(parsed, depth + 1);
                    } catch (e) {
                        return value;
                    }
                }
                
                if (Array.isArray(value)) {
                    return value.map(item => deepParse(item, depth + 1));
                }
                
                if (typeof value === 'object' && value !== null) {
                    const result = {};
                    for (const key in value) {
                        result[key] = deepParse(value[key], depth + 1);
                    }
                    return result;
                }
                
                return value;
            };
            
            const parsed = deepParse(processedStr);
            const formattedResult = JSON.stringify(parsed, null, 2);
            
            // 显示成功信息
            resultDiv.textContent = '反序列化成功：';
            resultDiv.style.color = 'green';
            
            // 创建新的输出框并添加到容器中
            createOutputBox(formattedResult);
        } catch (error) {
            const isEscaped = document.getElementById('isEscaped').checked;
            const errorMsg = isEscaped ? `转义处理或反序列化失败：${error.message}` : `反序列化失败：${error.message}`;
            resultDiv.textContent = errorMsg;
            resultDiv.style.color = 'red';
        }
    });
    
    // 创建新的输出框函数
    function createOutputBox(content) {
        const outputBox = document.createElement('div');
        outputBox.className = 'output-box';
        
        // 添加标题栏（包含折叠按钮）
        const titleBar = document.createElement('div');
        titleBar.className = 'title-bar';
        
        // 添加折叠/展开按钮
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '▼';
        toggleButton.className = 'toggle-btn';
        
        // 添加标题
        const title = document.createElement('span');
        title.textContent = 'JSON 输出';
        title.className = 'output-title';
        
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.className = 'copy-btn';
        copyButton.onclick = function() {
            copyToClipboard(content, copyButton);
        };
        
        // 添加删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function() {
            outputBox.remove();
        };
        
        // 组装标题栏
        titleBar.appendChild(toggleButton);
        titleBar.appendChild(title);
        titleBar.appendChild(copyButton);
        titleBar.appendChild(deleteButton);
        
        // 添加文本域
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.readOnly = true;
        textarea.className = 'output-textarea';
        
        // 添加折叠功能
        toggleButton.addEventListener('click', function() {
            if (textarea.style.display === 'none') {
                textarea.style.display = 'block';
                toggleButton.textContent = '▼';
            } else {
                textarea.style.display = 'none';
                toggleButton.textContent = '▶';
            }
        });
        
        // 组装输出框
        outputBox.appendChild(titleBar);
        outputBox.appendChild(textarea);
        
        // 添加到输出容器
        outputsContainer.appendChild(outputBox);
    }
    
    // 复制到剪贴板函数
    function copyToClipboard(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            // 显示成功反馈
            const originalText = button.textContent;
            button.textContent = '已复制！';
            button.style.background = '#4CAF50';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 1500);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        } finally {
            document.body.removeChild(textarea);
        }
    }
    
    // 清空按钮事件
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        resultDiv.textContent = '';
        outputsContainer.innerHTML = ''; // 清空所有输出框
        document.getElementById('isEscaped').checked = false;
    });
    
    // URLEncode 功能
    const urlInput = document.getElementById('urlInput');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const urlResult = document.getElementById('urlResult');
    const urlClearBtn = document.getElementById('urlClearBtn');
    
    // URLEncode 功能
    encodeBtn.addEventListener('click', () => {
        const input = urlInput.value.trim();
        if (!input) {
            urlResult.textContent = '请输入需要编码的字符串';
            urlResult.style.color = 'red';
            return;
        }
        
        try {
            const encoded = encodeURIComponent(input);
            urlResult.textContent = encoded;
            urlResult.style.color = 'green';
        } catch (error) {
            urlResult.textContent = `编码失败：${error.message}`;
            urlResult.style.color = 'red';
        }
    });
    
    // URLDecode 功能
    decodeBtn.addEventListener('click', () => {
        const input = urlInput.value.trim();
        if (!input) {
            urlResult.textContent = '请输入需要解码的字符串';
            urlResult.style.color = 'red';
            return;
        }
        
        try {
            const decoded = decodeURIComponent(input);
            urlResult.textContent = decoded;
            urlResult.style.color = 'green';
        } catch (error) {
            urlResult.textContent = `解码失败：${error.message}`;
            urlResult.style.color = 'red';
        }
    });
    
    // URLEncode 清空按钮事件
    urlClearBtn.addEventListener('click', () => {
        urlInput.value = '';
        urlResult.textContent = '';
    });
    
    // 时间戳转换功能
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
    tabs.forEach(tab => {
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
    
    // 格式转换功能
    const formatInputTop = document.getElementById('formatInputTop');
    const formatInputBottom = document.getElementById('formatInputBottom');
    const formatTypeTop = document.getElementById('formatTypeTop');
    const formatTypeBottom = document.getElementById('formatTypeBottom');
    const formatClearBtn = document.getElementById('formatClearBtn');
    // 箭头按钮
    const arrowLeftBtn = document.getElementById('arrowLeftBtn');
    const arrowRightBtn = document.getElementById('arrowRightBtn');
    
    // 左侧箭头按钮事件 - 将上面的内容转换为下面的格式
    arrowLeftBtn.addEventListener('click', () => {
        const input = formatInputTop.value.trim();
        if (!input) {
            alert('请输入需要转换的内容');
            return;
        }
        
        const sourceType = formatTypeTop.value;
        const targetType = formatTypeBottom.value;
        
        console.log('转换参数:', { input, sourceType, targetType });
        
        try {
            const result = convertFormat(input, sourceType, targetType);
            formatInputBottom.value = result;
            console.log('转换成功:', result);
        } catch (error) {
            console.error('转换失败:', error);
            alert('转换失败: ' + error.message);
        }
    });
    
    // 右侧箭头按钮事件 - 将下面的内容转换为上面的格式
    arrowRightBtn.addEventListener('click', () => {
        const input = formatInputBottom.value.trim();
        if (!input) {
            alert('请输入需要转换的内容');
            return;
        }
        
        const sourceType = formatTypeBottom.value;
        const targetType = formatTypeTop.value;
        
        console.log('转换参数:', { input, sourceType, targetType });
        
        try {
            const result = convertFormat(input, sourceType, targetType);
            formatInputTop.value = result;
            console.log('转换成功:', result);
        } catch (error) {
            console.error('转换失败:', error);
            alert('转换失败: ' + error.message);
        }
    });
    
    // 格式转换清空按钮事件
    formatClearBtn.addEventListener('click', () => {
        formatInputTop.value = '';
        formatInputBottom.value = '';
    });
    
    // 格式转换核心函数
    function convertFormat(input, sourceType, targetType) {
        console.log('开始转换:', { input, sourceType, targetType });
        
        // 如果源类型和目标类型相同，直接返回输入内容
        if (sourceType === targetType) {
            console.log('源类型和目标类型相同，直接返回输入内容');
            return input;
        }
        
        // 检查所需的库是否已加载
        if (sourceType === 'yaml' || targetType === 'yaml') {
            if (typeof jsyaml === 'undefined') {
                throw new Error('js-yaml库未加载');
            }
            // 检查js-yaml的load方法是否存在
            if (typeof jsyaml.load !== 'function') {
                throw new Error('js-yaml库加载不完整');
            }
        }
        
        if (sourceType === 'toml' || targetType === 'toml') {
            if (typeof TOML === 'undefined') {
                throw new Error('@iarna/toml库未加载');
            }
        }
        
        if (sourceType === 'xml' || targetType === 'xml') {
            if (typeof X2JS === 'undefined') {
                throw new Error('x2js库未加载');
            }
        }
        
        // 解析输入内容为 JavaScript 对象
        let obj;
        try {
            switch (sourceType) {
                case 'json':
                    obj = JSON.parse(input);
                    break;
                case 'yaml':
                    // 使用 js-yaml 库解析 YAML
                    console.log('使用js-yaml解析YAML:', input);
                    console.log('jsyaml全局变量:', window.jsyaml);
                    // 检查js-yaml库是否正确加载
                    if (typeof window.jsyaml === 'undefined') {
                        throw new Error('js-yaml库未正确加载');
                    }
                    obj = window.jsyaml.load(input);
                    console.log('YAML解析结果:', obj);
                    break;
                case 'toml':
                    // 使用 @iarna/toml 库解析 TOML
                    console.log('使用TOML库解析:', input);
                    console.log('检查TOML库:', typeof window.TOML, window.TOML);
                    // 检查TOML库是否正确加载
                    if (typeof window.TOML === 'undefined') {
                        throw new Error('@iarna/toml库未正确加载');
                    }
                    // 检查parse方法是否存在
                    if (typeof window.TOML.parse !== 'function') {
                        console.log('TOML对象属性:', Object.keys(window.TOML));
                        throw new Error('@iarna/toml库缺少parse方法');
                    }
                    obj = window.TOML.parse(input);
                    console.log('TOML解析结果:', obj);
                    break;
                case 'xml':
                    // 使用 x2js 库解析 XML
                    console.log('使用x2js解析XML:', input);
                    console.log('X2JS全局变量:', window.X2JS);
                    // 检查x2js库是否正确加载
                    if (typeof window.X2JS === 'undefined') {
                        throw new Error('x2js库未正确加载');
                    }
                    const x2js = new window.X2JS();
                    console.log('x2js实例:', x2js);
                    obj = x2js.xml2js(input);
                    console.log('XML解析结果:', obj);
                    break;
                default:
                    throw new Error('不支持的源格式: ' + sourceType);
            }
        } catch (error) {
            throw new Error('解析源格式失败: ' + error.message);
        }
        
        // 将 JavaScript 对象转换为目标格式
        try {
            switch (targetType) {
                case 'json':
                    return JSON.stringify(obj, null, 2);
                case 'yaml':
                    // 使用 js-yaml 库序列化为 YAML
                    console.log('使用js-yaml序列化为YAML:', obj);
                    return window.jsyaml.dump(obj);
                case 'toml':
                    // 使用 @iarna/toml 库序列化为 TOML
                    console.log('使用TOML库序列化:', obj);
                    // 检查TOML库是否正确加载
                    if (typeof window.TOML === 'undefined') {
                        throw new Error('@iarna/toml库未正确加载');
                    }
                    // 检查stringify方法是否存在
                    if (typeof window.TOML.stringify !== 'function') {
                        console.log('TOML对象属性:', Object.keys(window.TOML));
                        throw new Error('@iarna/toml库缺少stringify方法');
                    }
                    return window.TOML.stringify(obj);
                case 'xml':
                    // 使用 x2js 库序列化为 XML
                    console.log('使用x2js序列化为XML:', obj);
                    // 检查x2js库是否正确加载
                    if (typeof window.X2JS === 'undefined') {
                        throw new Error('x2js库未正确加载');
                    }
                    const x2js = new window.X2JS();
                    console.log('x2js实例:', x2js);
                    // 检查js2xml方法是否存在
                    if (typeof x2js.js2xml !== 'function') {
                        console.log('x2js可用方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(x2js)));
                        throw new Error('x2js.js2xml方法不存在');
                    }
                    return x2js.js2xml(obj);
                default:
                    throw new Error('不支持的目标格式: ' + targetType);
            }
        } catch (error) {
            throw new Error('序列化为目标格式失败: ' + error.message);
        }
    }
});