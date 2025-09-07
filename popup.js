document.addEventListener('DOMContentLoaded', () => {
    const parseBtn = document.getElementById('parseBtn');
    const jsonInput = document.getElementById('jsonInput');
    const resultDiv = document.getElementById('result');

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
            resultDiv.textContent = '反序列化成功：';
            resultDiv.style.color = 'green';
            const pre = document.createElement('pre');
            pre.textContent = JSON.stringify(parsed, null, 2);
            resultDiv.appendChild(pre);
        } catch (error) {
            const isEscaped = document.getElementById('isEscaped').checked;
            const errorMsg = isEscaped ? `转义处理或反序列化失败：${error.message}` : `反序列化失败：${error.message}`;
            resultDiv.textContent = errorMsg;
            resultDiv.style.color = 'red';
        }
    });
});