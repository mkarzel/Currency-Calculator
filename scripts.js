let expression = ''
let currentNumber = ''
const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const operators = ['+', '-', '*', '/']
let lastOperatorIndex = -1

const insert = (entry) => {
    // indexing operators in expression
    for (let i = 0; i < operators.length; i++) {
        if (expression.lastIndexOf(operators[i]) > lastOperatorIndex) {
            lastOperatorIndex = expression.lastIndexOf(operators[i])
        }
    }
    // displaying '0.' instead of '.' after clearing and pressing '.'
    if (entry === '.' && expression === '') {
        expression = '0'
    }
    // disabling multiple operators and changing if clicked after each other
    if (operators.includes(entry) && operators.includes(expression.slice(-1))) {
        expression = expression.slice(0, -1)
    }
    // reset after dividing by 0
    if (expression === "nie dzielimy przez 0") {
        expression = ''
    }
    // disabling '.' next to operator
    if ((operators.includes(entry) || entry === '.') && (operators.includes(expression.slice(-1)) || expression.slice(-1) === '.')) {
        return
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
    // only operator can be used after ')' or another ')' !!!!!!!!!!
    if (expression.slice(-1) === ')' && !operators.includes(entry)) {
        if (entry !== ')') {
            return
        }
    }
    // only digits after '(' can be used or another '('
    if (expression.slice(-1) === '(' && (!digits.includes(entry))){
        if (entry !== '('){
            return
        }
    }
    
    currentNumber = currentNumber + entry
    expression = expression + entry
}

const clearAll = () => {
    expression = ''
    currentNumber = ''
    lastOperatorIndex = -1
}

const clearEntry = () => {
    // clear entry unless it displays error
    if (expression !== "nie dzielimy przez 0") {
        expression = expression.slice(0, -1)
        currentNumber = currentNumber.slice(0, -1)
        lastOperatorIndex = -1
    }
}

const equal = () => {
    // '=' right after operator will not do anything
    if (operators.includes(expression.slice(-1))) {
        return
    }
    // if too many '(' in expression, it will not be evaluated
    if ((expression.match(/\(/g) || []).length > (expression.match(/\)/g) || []).length) {
        return
    }
    // string in if can not be calculated
    if (expression !== "nie dzielimy przez 0") {
        expression = eval(expression).toString()
    }
    // dividing by 0 error
    if (expression === "Infinity" || expression === "-Infinity" || expression === "nie dzielimy przez 0") {
        expression = "nie dzielimy przez 0"
        return
    }

    currentNumber = expression
}

document.addEventListener('click', () => {
    document.querySelector("#display").value = expression
    // display 0 after clearing
    if (expression === '') {
        document.querySelector("#display").value = '0'
    }
    // console.log(expression)
    // console.log('current number', currentNumber)
    // console.log('lastoperatorindex', lastOperatorIndex)
    // console.log('lastindex .', expression.lastIndexOf('.'))
})
