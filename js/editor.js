/**
 * CyberCodeEditor
 * High-performance, lightweight cyberpunk SQL code editor
 * Provides syntax highlighting, line numbers, tab-indentation, auto-pairing, and execution shortcuts.
 */
class CyberCodeEditor {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.options = Object.assign({
            initialValue: '',
            readOnly: false,
            onRun: () => {},
            onChange: () => {}
        }, options);

        this.keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
            'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'CROSS', 'ON',
            'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
            'DISTINCT', 'AS', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            'OVER', 'PARTITION', 'ROWS', 'RANGE', 'BETWEEN', 'PRECEDING', 'FOLLOWING',
            'CURRENT', 'ROW', 'UNBOUNDED', 'WITH', 'RECURSIVE', 'EXISTS', 'LIKE'
        ];

        this.functions = [
            'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'ROUND', 'COALESCE',
            'DENSE_RANK', 'RANK', 'ROW_NUMBER', 'LAG', 'LEAD', 'NTILE',
            'LOWER', 'UPPER', 'SUBSTR', 'LENGTH', 'STRFTIME'
        ];

        this.init();
    }

    init() {
        this.container.classList.add('cyber-code-editor-container');
        this.container.innerHTML = `
            <div class="cyber-editor-wrapper">
                <div class="cyber-line-numbers"></div>
                <div class="cyber-editor-viewport">
                    <pre class="cyber-highlight-layer" aria-hidden="true"><code></code></pre>
                    <textarea class="cyber-editor-input" spellcheck="false" autocomplete="off" autocapitalize="off" placeholder="-- Write SQL statement here..."></textarea>
                </div>
            </div>
        `;

        this.lineNumbers = this.container.querySelector('.cyber-line-numbers');
        this.highlightLayer = this.container.querySelector('.cyber-highlight-layer code');
        this.textarea = this.container.querySelector('.cyber-editor-input');

        this.setValue(this.options.initialValue);

        // Bind events
        this.textarea.addEventListener('input', () => this.handleInput());
        this.textarea.addEventListener('scroll', () => this.syncScroll());
        this.textarea.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    setValue(code) {
        if (!this.textarea) return;
        this.textarea.value = code || '';
        this.handleInput();
    }

    getValue() {
        return this.textarea ? this.textarea.value : '';
    }

    handleInput() {
        const text = this.textarea.value;
        this.updateLineNumbers(text);
        this.highlightCode(text);
        if (this.options.onChange) {
            this.options.onChange(text);
        }
    }

    syncScroll() {
        const top = this.textarea.scrollTop;
        const left = this.textarea.scrollLeft;
        this.highlightLayer.parentElement.scrollTop = top;
        this.highlightLayer.parentElement.scrollLeft = left;
        this.lineNumbers.scrollTop = top;
    }

    updateLineNumbers(text) {
        const lines = (text || '').split('\n').length;
        let numHtml = '';
        for (let i = 1; i <= Math.max(1, lines); i++) {
            numHtml += `<span>${i}</span>`;
        }
        this.lineNumbers.innerHTML = numHtml;
    }

    highlightCode(code) {
        if (!this.highlightLayer) return;

        // Escape HTML
        let escaped = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Highlight single line comments (-- comment)
        escaped = escaped.replace(/(--.*$)/gm, '<span class="hl-comment">$1</span>');

        // Highlight string literals ('string')
        escaped = escaped.replace(/('([^'\\]|\\.)*')/g, '<span class="hl-string">$1</span>');

        // Highlight numbers
        escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="hl-number">$1</span>');

        // Highlight SQL functions
        const funcRegex = new RegExp(`\\b(${this.functions.join('|')})\\b(?=\\s*\\()`, 'gi');
        escaped = escaped.replace(funcRegex, '<span class="hl-func">$1</span>');

        // Highlight SQL keywords
        const kwRegex = new RegExp(`\\b(${this.keywords.join('|')})\\b`, 'gi');
        escaped = escaped.replace(kwRegex, (match) => {
            return `<span class="hl-keyword">${match.toUpperCase()}</span>`;
        });

        // Add trailing newline placeholder so bottom lines align
        if (code.endsWith('\n')) {
            escaped += ' ';
        }

        this.highlightLayer.innerHTML = escaped;
    }

    handleKeyDown(e) {
        // Tab key handles 4 spaces indentation
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            const val = this.textarea.value;
            this.textarea.value = val.substring(0, start) + '    ' + val.substring(end);
            this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
            this.handleInput();
            return;
        }

        // Ctrl + Enter or Cmd + Enter to execute query
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (this.options.onRun) {
                this.options.onRun(this.getValue());
            }
            return;
        }

        // Auto close quotes and brackets
        const pairs = {
            "'": "'",
            '"': '"',
            '(': ')',
            '[': ']'
        };

        if (pairs[e.key]) {
            const start = this.textarea.selectionStart;
            const end = this.textarea.selectionEnd;
            if (start === end) {
                const val = this.textarea.value;
                const closeChar = pairs[e.key];
                this.textarea.value = val.substring(0, start) + e.key + closeChar + val.substring(end);
                this.textarea.selectionStart = this.textarea.selectionEnd = start + 1;
                this.handleInput();
                e.preventDefault();
            }
        }
    }

    formatSQL() {
        let code = this.getValue();
        if (!code.trim()) return;

        // Beautify query: capitalize SQL keywords and align lines
        this.keywords.concat(this.functions).forEach((kw) => {
            const reg = new RegExp(`\\b${kw}\\b`, 'gi');
            code = code.replace(reg, kw);
        });

        this.setValue(code);
    }
}
