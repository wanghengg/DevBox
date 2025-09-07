document.addEventListener('DOMContentLoaded', () => {
    const parseBtn = document.getElementById('parseBtn');
    const jsonInput = document.getElementById('jsonInput');
    const resultDiv = document.getElementById('result');
    const outputContainer = document.getElementById('output-container');
    const outputTextarea = document.getElementById('outputTextarea');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');

    parseBtn.addEventListener('click', () => {
        const jsonStr = jsonInput.value.trim();
        if (!jsonStr) {
            resultDiv.textContent = '请输入需要反序列化的JSON字符串';
            resultDiv.style.color = 'red';
            outputContainer.style.display = 'none';
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
            
            // 显示输出容器并填充结果
            outputContainer.style.display = 'block';
            outputTextarea.value = formattedResult;
        } catch (error) {
            const isEscaped = document.getElementById('isEscaped').checked;
            const errorMsg = isEscaped ? `转义处理或反序列化失败：${error.message}` : `反序列化失败：${error.message}`;
            resultDiv.textContent = errorMsg;
            resultDiv.style.color = 'red';
            
            // 隐藏输出容器
            outputContainer.style.display = 'none';
        }
    });

    // 复制按钮事件
    copyBtn.addEventListener('click', () => {
        outputTextarea.select();
        outputTextarea.setSelectionRange(0, 99999); // 移动设备兼容性
        
        try {
            document.execCommand('copy');
            // 显示成功反馈
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '已复制！';
            copyBtn.style.background = '#4CAF50';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '#2196F3';
            }, 1500);
        } catch (err) {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        }
    });

    // 清空按钮事件
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        outputTextarea.value = '';
        resultDiv.textContent = '';
        outputContainer.style.display = 'none';
        document.getElementById('isEscaped').checked = false;
    });
});