// URLEncode 功能
document.addEventListener('DOMContentLoaded', () => {
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
});