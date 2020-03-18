const display = document.querySelector("#display");
let expression = ''
let currentNumber = ''
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const operators = ['+', '-', '*', '/', '^', 'r']
let lastOperatorIndex = -1
let currencies = []
let rates = []

const insert = (entry) => {
    if (validateInsert(entry)){
        currentNumber = currentNumber + entry
        expression = expression + entry
    }
}

const validateInsert = (entry) => {
    // indexing operators in expression
    for (let i = 0; i < operators.length; i++) {
        if (expression.lastIndexOf(operators[i]) > lastOperatorIndex) {
            lastOperatorIndex = expression.lastIndexOf(operators[i])
        }
    }
    // displaying '0.' instead of '.' after clearing and pressing '.'
    if (entry === '.' && (expression === '' || expression === '.')) {
        expression = '0'
    }
    // leave expression as '' when 0 clicked after clearing
    if (entry === '0' && expression === '') {
        return
    }
    // reset after dividing by 0
    if (expression === "nie dzielimy przez 0") {
        expression = ''
    }
    // disabling '.' next to operator or operator next to operator unless - after r or ^
    if ((operators.includes(entry) || entry === '.') && (operators.includes(expression.slice(-1)) || expression.slice(-1) === '.')) {
        // allow - after ^ or r
        if (entry !== '-' && (expression.slice(-1) !== '^' || expression.slice(-1) !== 'r')) {
            return
        }
        // disable - after -
        if (entry === '-' && expression.slice(-1) === '-') {
            return
        }
    }

    // only one '.' between operators
    if (entry === '.' && expression.lastIndexOf('.') > lastOperatorIndex) {
        return
    }
    // operator can not be first unless it is '-'
    if (expression.length === 0 && operators.includes(entry) && entry !== "-") {
        return
    }
    // disabling numbers after 0 like 014 or 0002
    if (operators.includes(entry) || operators.includes(expression.slice(-1)) || entry === '(' || entry === ')' || expression.slice(-1) === '(' || expression.slice(-1) === ')') {
        currentNumber = ''
    }
    if (currentNumber === '0' && expression === '0') {
        currentNumber = ''
        expression = ''
    }
    if (currentNumber === '0' && entry !== '.') {
        return
    }
    // '(' can not be used right after number or '.'
    if (entry === '(' && (digits.includes(expression.slice(-1)) || expression.slice(-1) === '.')) {
        return
    }
    // '()' use ')' only to match '('
    if (entry === ')' && (expression.match(/\(/g) || []).length <= (expression.match(/\)/g) || []).length) {
        return
    }
    // ')' can not be used right after '(' or operator
    if (entry === ')' && ((operators.includes(expression.slice(-1))) || (expression.slice(-1) === '('))) {
        return
    }
    // only operator can be used after ')' or another ')'
    if (expression.slice(-1) === ')' && (!operators.includes(entry))) {
        if (entry !== ')') {
            return
        }
    }
    // no ^ or r after ')'
    if (expression.slice(-1) === ')' && (entry.includes('^') || entry === 'r')) {
        return
    }
    //no ^ or r after ^ or r
    if ((expression.lastIndexOf('^') !== -1 || expression.lastIndexOf('r') !== -1) && (entry.includes('^') || entry.includes('r')) && (lastOperatorIndex === expression.lastIndexOf('^') || lastOperatorIndex === expression.lastIndexOf('r'))) {
        return
    }
    //no ( after ^ or r
    if (entry === '(' && (expression.slice(-1) === '^' || expression.slice(-1) === 'r')) {
        return
    }
    // only digits after '(' can be used or another '('
    if (expression.slice(-1) === '(' && (!digits.includes(entry))) {
        if (entry !== '(') {
            if (entry !== '-') {
                return
            }
        }
    }
    // currency only after digit
    if (currencies.includes(entry) && !digits.includes(expression.slice(-1))) {
        return
    }
    // only '+' '-' '*' '/' ')' after currency
    if (currencies.includes(expression.slice(-3)) && !(entry.includes('+') || entry.includes('-') || entry.includes('*') || entry.includes('/') || entry.includes(')'))) {
        return
    }
    // no currency if last operator was r, ^, /
    if (currencies.includes(entry) && lastOperatorIndex !== -1 && (lastOperatorIndex === expression.lastIndexOf('r') || lastOperatorIndex === expression.lastIndexOf('^') || lastOperatorIndex === expression.lastIndexOf('/'))) {
        return
    }
    return true
}

const clearAll = () => {
    expression = ''
    currentNumber = ''
    lastOperatorIndex = -1
}

const clearEntry = () => {
    // clear last 3 characters if currency
    if (currencies.includes(expression.slice(-3))) {
        expression = expression.slice(0, -3)
        currentNumber = currentNumber.slice(0, -3)
        return
    }
    // clear entry unless it displays error
    if (expression !== "nie dzielimy przez 0") {
        expression = expression.slice(0, -1)
        currentNumber = currentNumber.slice(0, -1)
        lastOperatorIndex = -1
    }
}

const equal = () => {
    // if too many '(' in expression, it will not be evaluated
    if ((expression.match(/\(/g) || []).length > (expression.match(/\)/g) || []).length) {
        return
    }
    // replace currency with * rate
    for (let i = 0; i < currencies.length; i++) {
        expression = expression.split(currencies[i]).join('*' + rates[i]);
    }
    // '=' right after operator will not do anything
    if (operators.includes(expression.slice(-1))) {
        return
    }

    // changing ^ to Math.pow (x,y)
    expression = expression.replace(/(\d+\.?\d*)\s*\^\s*(-*\d+\.?\d*)/g, 'Math.pow($1, $2)')
    // changing rt to Math.pow (x,1/r)
    expression = expression.replace(/(\d+\.?\d*)\s*r\s*(-*\d+\.?\d*)/g, 'Math.pow($1, 1/$2)')

    // calculate expression unless it displays dividing by 0 error
    if (expression !== ""){
        if (expression !== "nie dzielimy przez 0") {
            expression = eval(expression).toString()
        }
    }

    // dividing by 0 error
    if (expression === "Infinity" || expression === "-Infinity" || expression === "nie dzielimy przez 0") {
        expression = "nie dzielimy przez 0"
        return
    }
    // leave expression empty when 0
    if (expression === '0') {
        expression = ''
    }
    // round result if too many numbers after .
    if (expression.length > 8 && expression.includes('.')) {
        expression = eval(expression).toFixed(4).toString()
    }
    currentNumber = expression
}

document.addEventListener('click', () => {
    display.value = expression
    // display 0 after clearing
    if (expression === '') {
        display.value = '0'
    }
})

const getRates = async () => {
    try {
        const response = await fetch("http://api.nbp.pl/api/exchangerates/tables/a")
        const currenciesData = await response.json()

        for (let i = 0; i < currenciesData[0].rates.length; i++) {
            currencies.push(currenciesData[0].rates[i].code)
            rates.push(currenciesData[0].rates[i].mid)
            document.querySelector(".dropdown-menu").innerHTML += '<button class="dropdown-item" onclick="insert(\'' + currencies[i] + '\')">' + currencies[i] + '</button>'
        }
    }
    catch (error) {
        console.error('Currencies are not loaded', error);
    }
}

window.onload = getRates