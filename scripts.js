let expression = ""

function insert(entry) {
    if (expression == "0" && entry == "0")
    {
        expression = "0"
        return
    }
    if  (expression.slice(-1) == "+" || expression.slice(-1) == "-" || expression.slice(-1) == "*" || expression.slice(-1) == "/")  
    {
        document.getElementById("display").value = ""
    }
    if (document.getElementById("display").value.includes(".") && entry == ".")
    {
        console.log(expression)
        return
    }
    if (document.getElementById("display").value == "0" && entry != ".")
    {
        document.getElementById("display").value = entry
        expression = expression + document.getElementById("display").value.slice(-1)
        console.log(expression)
        return
    } else 
    {
        document.getElementById("display").value = document.getElementById("display").value + entry
    }

    expression = expression + document.getElementById("display").value.slice(-1)
    console.log(expression)
}

function clearAll() {
    expression = "";
    document.getElementById("display").value = "0"
    console.log(expression)
}

function clearEntry() {
    if (expression == document.getElementById("display").value)
    {
        expression = ""
    }

    expression = expression.substring(0, expression.length - document.getElementById("display").value.length)
    document.getElementById("display").value = "0"
    console.log(expression)
}

function equal() {
    expression = eval(expression).toString()
    document.getElementById("display").value = expression
    console.log(expression)
}

function operation(type) {
    if (expression.slice(-1) == "+" || expression.slice(-1) == "-" || expression.slice(-1) == "*" || expression.slice(-1) == "/") 
    {
        expression = expression.substring(0, expression.length - 1)
    }

    if (expression.includes("+") || expression.includes("-") || expression.includes("*") || expression.includes("/"))
    {
        equal()
    }
    
    expression = expression + type
    console.log(expression)
}