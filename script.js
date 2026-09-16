/**
 * AuraCalc — Modern Calculator Logic & State Management
 */

class Calculator {
  constructor(previousDisplayElement, currentDisplayElement, activeOperatorBadge) {
    this.previousDisplayElement = previousDisplayElement;
    this.currentDisplayElement = currentDisplayElement;
    this.activeOperatorBadge = activeOperatorBadge;
    this.history = this.loadHistory();
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.shouldResetScreen = false;
    this.isErrorState = false;
    this.updateDisplay();
  }

  delete() {
    if (this.isErrorState) {
      this.clear();
      return;
    }
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
      this.updateDisplay();
      return;
    }
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.isErrorState) {
      this.clear();
    }
    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      // Avoid excessive length
      if (this.currentOperand.replace(/[^0-9]/g, '').length >= 15) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
    this.updateDisplay();
  }

  appendDecimal() {
    if (this.isErrorState) {
      this.clear();
    }
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
    }
    if (!this.currentOperand.includes('.')) {
      this.currentOperand = (this.currentOperand === '' ? '0' : this.currentOperand) + '.';
    }
    this.updateDisplay();
  }

  toggleSign() {
    if (this.isErrorState || this.currentOperand === '0' || this.currentOperand === '') return;
    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.substring(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
    this.updateDisplay();
  }

  applyPercent() {
    if (this.isErrorState || this.currentOperand === '') return;
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    if (this.operation && this.previousOperand !== '') {
      const prev = parseFloat(this.previousOperand);
      // If + or -, calculate percentage of previous number (standard calculator behavior)
      if (this.operation === '+' || this.operation === '−') {
        const percentVal = prev * (current / 100);
        this.currentOperand = this.formatSafeNumber(percentVal);
      } else {
        this.currentOperand = this.formatSafeNumber(current / 100);
      }
    } else {
      this.currentOperand = this.formatSafeNumber(current / 100);
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.isErrorState) this.clear();

    if (this.currentOperand === '' && this.previousOperand === '') return;

    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.compute(false);
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  compute(isFinal = true) {
    if (this.isErrorState) return;
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '−':
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.currentOperand = 'Cannot divide by 0';
          this.previousOperand = '';
          this.operation = undefined;
          this.isErrorState = true;
          this.updateDisplay();
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    const expression = `${this.formatDisplayNumber(this.previousOperand)} ${this.operation} ${this.formatDisplayNumber(this.currentOperand)}`;
    const formattedResult = this.formatSafeNumber(computation);

    if (isFinal) {
      this.saveHistoryEntry(expression, formattedResult);
      this.previousOperand = `${expression} =`;
      this.operation = undefined;
    } else {
      this.previousOperand = formattedResult;
    }

    this.currentOperand = formattedResult;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  formatSafeNumber(num) {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return 'Infinity';

    // Fix typical binary float issues (0.1 + 0.2)
    const rounded = parseFloat(num.toFixed(10));
    return rounded.toString();
  }

  formatDisplayNumber(numberStr) {
    if (!numberStr) return '';
    if (numberStr === 'Cannot divide by 0' || numberStr === 'Error' || numberStr === 'Infinity') {
      return numberStr;
    }

    const stringNumber = numberStr.toString();
    const isNegative = stringNumber.startsWith('-');
    const cleanNumber = isNegative ? stringNumber.substring(1) : stringNumber;

    const integerDigits = parseFloat(cleanNumber.split('.')[0]);
    const decimalDigits = cleanNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    let result = '';
    if (decimalDigits != null) {
      result = `${integerDisplay}.${decimalDigits}`;
    } else {
      result = integerDisplay;
    }

    return isNegative ? `-${result}` : result;
  }

  updateDisplay() {
    if (this.isErrorState) {
      this.currentDisplayElement.innerText = this.currentOperand;
      this.currentDisplayElement.style.fontSize = '1.25rem';
      this.previousDisplayElement.innerText = '';
      this.activeOperatorBadge.innerText = '';
      this.updateActiveOperatorButtons();
      return;
    }

    const formatted = this.formatDisplayNumber(this.currentOperand);
    this.currentDisplayElement.innerText = formatted || '0';

    // Adjust font size dynamically for long numbers
    const charCount = (formatted || '0').length;
    if (charCount > 12) {
      this.currentDisplayElement.style.fontSize = '1.35rem';
    } else if (charCount > 9) {
      this.currentDisplayElement.style.fontSize = '1.75rem';
    } else {
      this.currentDisplayElement.style.fontSize = '2.2rem';
    }

    if (this.previousOperand.includes('=')) {
      this.previousDisplayElement.innerText = this.previousOperand;
      this.activeOperatorBadge.innerText = '';
    } else if (this.operation != null && this.previousOperand !== '') {
      this.previousDisplayElement.innerText = `${this.formatDisplayNumber(this.previousOperand)}`;
      this.activeOperatorBadge.innerText = this.operation;
    } else {
      this.previousDisplayElement.innerText = '';
      this.activeOperatorBadge.innerText = '';
    }

    this.updateActiveOperatorButtons();
  }

  updateActiveOperatorButtons() {
    document.querySelectorAll('.btn-operator').forEach(btn => {
      if (this.operation && btn.dataset.operator === this.operation && this.shouldResetScreen) {
        btn.classList.add('active-op');
      } else {
        btn.classList.remove('active-op');
      }
    });
  }

  // History Management
  loadHistory() {
    try {
      const stored = localStorage.getItem('auracalc_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveHistoryEntry(expression, result) {
    const entry = { expression, result, timestamp: Date.now() };
    this.history.unshift(entry);
    if (this.history.length > 25) {
      this.history.pop();
    }
    try {
      localStorage.setItem('auracalc_history', JSON.stringify(this.history));
    } catch {
      // Ignore storage errors in restricted contexts
    }
    renderHistory();
  }

  clearHistory() {
    this.history = [];
    try {
      localStorage.removeItem('auracalc_history');
    } catch {
      // Ignore
    }
    renderHistory();
  }

  restoreHistoryValue(val) {
    this.currentOperand = val.toString();
    this.shouldResetScreen = false;
    this.isErrorState = false;
    this.updateDisplay();
  }
}

/* ==========================================================================
   DOM Elements & Event Wiring
   ========================================================================== */

const previousDisplayElement = document.getElementById('previous-expression');
const currentDisplayElement = document.getElementById('current-operand');
const activeOperatorBadge = document.getElementById('active-operator');

const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const historyToggleBtn = document.getElementById('btn-history-toggle');
const clearHistoryBtn = document.getElementById('btn-clear-history');

const calculator = new Calculator(
  previousDisplayElement,
  currentDisplayElement,
  activeOperatorBadge
);

// Number buttons
document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.dataset.number);
    triggerButtonPulse(button);
  });
});

// Operator buttons
document.querySelectorAll('[data-operator]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.operator);
    triggerButtonPulse(button);
  });
});

// Action buttons
document.querySelectorAll('[data-action]').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    switch (action) {
      case 'clear':
        calculator.clear();
        break;
      case 'delete':
        calculator.delete();
        break;
      case 'equals':
        calculator.compute(true);
        break;
      case 'decimal':
        calculator.appendDecimal();
        break;
      case 'toggle-sign':
        calculator.toggleSign();
        break;
      case 'percent':
        calculator.applyPercent();
        break;
    }
    triggerButtonPulse(button);
  });
});

// Button visual feedback helper
function triggerButtonPulse(button) {
  button.classList.add('pressed');
  setTimeout(() => button.classList.remove('pressed'), 120);
}

// History Panel Toggle & Rendering
function toggleHistory(open) {
  const isOpening = open !== undefined ? open : !historyPanel.classList.contains('open');
  historyPanel.classList.toggle('open', isOpening);
  historyToggleBtn.classList.toggle('active', isOpening);
  historyToggleBtn.setAttribute('aria-expanded', isOpening);
  historyPanel.setAttribute('aria-hidden', !isOpening);
}

historyToggleBtn.addEventListener('click', () => toggleHistory());

clearHistoryBtn.addEventListener('click', () => {
  calculator.clearHistory();
});

function renderHistory() {
  historyList.innerHTML = '';
  if (calculator.history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
    return;
  }

  calculator.history.forEach(item => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.setAttribute('role', 'button');
    historyItem.setAttribute('tabindex', '0');
    historyItem.innerHTML = `
      <div class="history-expr">${item.expression} =</div>
      <div class="history-result">${item.result}</div>
    `;

    const selectItem = () => {
      calculator.restoreHistoryValue(item.result);
      toggleHistory(false);
    };

    historyItem.addEventListener('click', selectItem);
    historyItem.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectItem();
      }
    });

    historyList.appendChild(historyItem);
  });
}

// Initial history render
renderHistory();

// Keyboard support
window.addEventListener('keydown', (e) => {
  // Ignore if user is focusing inside an input (none in this app, but good practice)
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const key = e.key;

  // Digits
  if (/^[0-9]$/.test(key)) {
    const btn = document.querySelector(`[data-number="${key}"]`);
    if (btn) triggerButtonPulse(btn);
    calculator.appendNumber(key);
    return;
  }

  // Operators
  if (key === '+') {
    const btn = document.getElementById('btn-add');
    if (btn) triggerButtonPulse(btn);
    calculator.chooseOperation('+');
    return;
  }
  if (key === '-') {
    const btn = document.getElementById('btn-subtract');
    if (btn) triggerButtonPulse(btn);
    calculator.chooseOperation('−');
    return;
  }
  if (key === '*' || key === 'x' || key === 'X') {
    const btn = document.getElementById('btn-multiply');
    if (btn) triggerButtonPulse(btn);
    calculator.chooseOperation('×');
    return;
  }
  if (key === '/') {
    e.preventDefault(); // Prevent Firefox quick search
    const btn = document.getElementById('btn-divide');
    if (btn) triggerButtonPulse(btn);
    calculator.chooseOperation('÷');
    return;
  }

  // Decimal
  if (key === '.' || key === ',') {
    const btn = document.getElementById('btn-decimal');
    if (btn) triggerButtonPulse(btn);
    calculator.appendDecimal();
    return;
  }

  // Equals / Enter
  if (key === 'Enter' || key === '=') {
    e.preventDefault();
    const btn = document.getElementById('btn-equals');
    if (btn) triggerButtonPulse(btn);
    calculator.compute(true);
    return;
  }

  // Backspace / Delete
  if (key === 'Backspace') {
    const btn = document.getElementById('btn-delete');
    if (btn) triggerButtonPulse(btn);
    calculator.delete();
    return;
  }

  // Escape
  if (key === 'Escape') {
    if (historyPanel.classList.contains('open')) {
      toggleHistory(false);
      return;
    }
    const btn = document.getElementById('btn-clear');
    if (btn) triggerButtonPulse(btn);
    calculator.clear();
    return;
  }

  // Percent
  if (key === '%') {
    const btn = document.getElementById('btn-percent');
    if (btn) triggerButtonPulse(btn);
    calculator.applyPercent();
    return;
  }

  // History Toggle Shortcut ('h' or 'H')
  if (key === 'h' || key === 'H') {
    toggleHistory();
  }
});
