(function () {
  'use strict';

  const currentEl = document.getElementById('current');
  const historyEl = document.getElementById('history');
  const buttons = document.querySelectorAll('.btn');

  let currentValue = '0';
  let previousValue = null;
  let operator = null;
  let waitingForNewValue = false;
  let justEvaluated = false;

  const MAX_DIGITS = 15;

  function updateDisplay() {
    currentEl.textContent = formatForDisplay(currentValue);
    if (operator && previousValue !== null) {
      historyEl.textContent = `${formatForDisplay(previousValue)} ${operator}`;
    } else {
      historyEl.textContent = '';
    }
  }

  function formatForDisplay(value) {
    if (value === 'Error') return 'Error';
    const num = String(value);
    if (num.length > MAX_DIGITS) {
      const parsed = parseFloat(num);
      if (!isFinite(parsed)) return 'Error';
      return parsed.toExponential(6);
    }
    return num;
  }

  function inputNumber(digit) {
    if (justEvaluated) {
      currentValue = digit;
      justEvaluated = false;
      waitingForNewValue = false;
      updateDisplay();
      return;
    }
    if (waitingForNewValue) {
      currentValue = digit;
      waitingForNewValue = false;
    } else {
      if (currentValue === '0') {
        currentValue = digit;
      } else if (currentValue.replace('-', '').replace('.', '').length < MAX_DIGITS) {
        currentValue += digit;
      }
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (justEvaluated) {
      currentValue = '0.';
      justEvaluated = false;
      waitingForNewValue = false;
      updateDisplay();
      return;
    }
    if (waitingForNewValue) {
      currentValue = '0.';
      waitingForNewValue = false;
      updateDisplay();
      return;
    }
    if (!currentValue.includes('.')) {
      currentValue += '.';
      updateDisplay();
    }
  }

  function clearAll() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    waitingForNewValue = false;
    justEvaluated = false;
    clearActiveOperator();
    updateDisplay();
  }

  function deleteLast() {
    if (justEvaluated) {
      clearAll();
      return;
    }
    if (currentValue.length > 1) {
      currentValue = currentValue.slice(0, -1);
    } else {
      currentValue = '0';
    }
    updateDisplay();
  }

  function chooseOperator(op) {
    if (currentValue === 'Error') return;

    if (op === '%') {
      const num = parseFloat(currentValue);
      if (!isNaN(num)) {
        currentValue = String(applyPercent(num));
        updateDisplay();
      }
      return;
    }

    if (operator !== null && !waitingForNewValue && !justEvaluated) {
      const result = compute();
      if (result === null) return;
      currentValue = String(result);
      previousValue = result;
    } else {
      previousValue = parseFloat(currentValue);
    }

    operator = op;
    waitingForNewValue = true;
    justEvaluated = false;
    setActiveOperator(op);
    updateDisplay();
  }

  function applyPercent(num) {
    if (previousValue !== null && operator) {
      const base = parseFloat(previousValue);
      if (operator === '+' || operator === '-') {
        return (base * num) / 100;
      }
      return num / 100;
    }
    return num / 100;
  }

  function compute() {
    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    if (isNaN(prev) || isNaN(curr)) return null;

    let result;
    switch (operator) {
      case '+':
        result = prev + curr;
        break;
      case '-':
        result = prev - curr;
        break;
      case '×':
        result = prev * curr;
        break;
      case '÷':
        if (curr === 0) {
          currentValue = 'Error';
          previousValue = null;
          operator = null;
          clearActiveOperator();
          updateDisplay();
          return null;
        }
        result = prev / curr;
        break;
      default:
        return null;
    }

    result = roundResult(result);
    return result;
  }

  function roundResult(num) {
    if (!isFinite(num)) return num;
    const rounded = Math.round((num + Number.EPSILON) * 1e10) / 1e10;
    return rounded;
  }

  function evaluate() {
    if (operator === null || currentValue === 'Error') return;
    const result = compute();
    clearActiveOperator();
    if (result === null) {
      updateDisplay();
      return;
    }
    historyEl.textContent = `${formatForDisplay(previousValue)} ${operator} ${formatForDisplay(currentValue)} =`;
    currentValue = String(result);
    previousValue = null;
    operator = null;
    waitingForNewValue = false;
    justEvaluated = true;
    currentEl.textContent = formatForDisplay(currentValue);
  }

  function setActiveOperator(op) {
    clearActiveOperator();
    buttons.forEach((btn) => {
      if (btn.dataset.action === 'operator' && btn.dataset.value === op) {
        btn.classList.add('active');
      }
    });
  }

  function clearActiveOperator() {
    buttons.forEach((btn) => btn.classList.remove('active'));
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;

      switch (action) {
        case 'number':
          inputNumber(value);
          break;
        case 'decimal':
          inputDecimal();
          break;
        case 'operator':
          chooseOperator(value);
          break;
        case 'clear':
          clearAll();
          break;
        case 'delete':
          deleteLast();
          break;
        case 'equals':
          evaluate();
          break;
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      inputNumber(e.key);
    } else if (e.key === '.') {
      inputDecimal();
    } else if (e.key === '+' || e.key === '-') {
      chooseOperator(e.key);
    } else if (e.key === '*') {
      chooseOperator('×');
    } else if (e.key === '/') {
      e.preventDefault();
      chooseOperator('÷');
    } else if (e.key === '%') {
      chooseOperator('%');
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluate();
    } else if (e.key === 'Backspace') {
      deleteLast();
    } else if (e.key === 'Escape') {
      clearAll();
    }
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    });
  }

  updateDisplay();
})();
