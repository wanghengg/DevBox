// JSON 处理功能
document.addEventListener('DOMContentLoaded', () => {
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
});