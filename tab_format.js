// 格式转换功能
document.addEventListener('DOMContentLoaded', () => {
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
                default:
                    throw new Error('不支持的目标格式: ' + targetType);
            }
        } catch (error) {
            throw new Error('序列化为目标格式失败: ' + error.message);
        }
    }
});