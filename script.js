const calculator = {
    displayValue: '0', // Start with '0' instead of "I miss you :("
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    // If waiting for second operand, replace content with new digit
    // Otherwise, append digit (or replace '0' with digit)
    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    // If waiting for second operand, start new number with "0."
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    // Only add decimal if it's not already there
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    // If an operator is already set and we're waiting for a second operand,
    // it means the user is changing the operator, so update it.
    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        return;
    }

    // If firstOperand is null, this is the first number
    if (firstOperand === null) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // Perform calculation if an operator exists
        const result = operate(firstOperand, inputValue, operator);
        calculator.displayValue = String(result);
        calculator.firstOperand = result; // Store result for chained operations
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function operate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }
    return secondOperand; // Should not be reached if operator is valid
}

function resetCalculator() {
    calculator.displayValue = '0'; // Reset to '0' on clear
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    // Handle operator buttons
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    // Handle decimal button
    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    // Handle clear button
    if (target.classList.contains('clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    // --- CRUCIAL CHANGE FOR "I MISS YOU :(" ON EQUALS ONLY ---
    if (target.value === '=') {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        // Perform the calculation first
        if (operator && firstOperand !== null) {
            let result = operate(firstOperand, inputValue, operator);
            // After calculation, override the display to "I miss you :("
            calculator.displayValue = 'Can u be mine?:)';
        } else {
            // If there's no ongoing calculation, still show "I miss you :("
            calculator.displayValue = 'Can u be mine?:)';
        }

        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    // --- END CRUCIAL CHANGE ---

    // If it's none of the above, it must be a digit
    inputDigit(target.value);
    updateDisplay();
});

// Initial display setup (to show '0')
updateDisplay();

