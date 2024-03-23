const number = document.getElementById("number")
const formula = document.getElementById("formula")
const result = document.getElementById("result")
const keys = ["GT", "AC", "C", "◀", "+", "M+", "7", "8", "9", "-", "M-", "4", "5", "6", "×", "MC", "1", "2", "3", "÷", "MR", "00", "0", ".", "="]
const operators = ["+", "-", "×", "÷"]
const olock = { "point": false, "operator": true, "zero": false }
var lock = olock
var keystrokes = document.getElementById("keystrokes").getElementsByTagName("td")
var lastInput = ""
window.onload = () => {
  flush_storage()
  for (var i = 0; i < keystrokes.length; i++) {
    keystrokes[i].textContent = keys[i]
    keystrokes[i].addEventListener("click", input)
  }
  formula.addEventListener("focus", (event) => {
    this.blur()
  })
}
formula.value = ""
result.value = ""
localStorage.setItem("memory", 0)
localStorage.setItem("grand-total", " ")

function input(event) {


  const circle = document.createElement('div')
  circle.classList.add('circle')
  document.body.appendChild(circle)
  circle.style.width = "50px"
  circle.style.height = "50px"
  const rect = circle.getBoundingClientRect()
  const tdrect=this.getBoundingClientRect()

  const x = tdrect.left + tdrect.width / 2 - rect.width / 2
  const y = tdrect.top + tdrect.height / 2 - rect.height / 2
  circle.style.left = x + "px"
  circle.style.top = y + "px"
  circle.style.opacity = 0;
  circle.style.transform = 'scale(1)'

  requestAnimationFrame(() => {
    circle.style.opacity = 1
    circle.style.opacity = 0
    circle.style.width = "80px"
    circle.style.height = "80px"
    circle.style.left = parseInt(circle.style.left) - 15 + "px"
    circle.style.top = parseInt(circle.style.top) - 15 + "px"
  })
  setTimeout(() => {
    document.body.removeChild(circle)
  }, 200)
  switch (this.className) {
    case "number": {
      if (formula.value == "错误") {
        formula.value = ""
      }
      formula.value += this.textContent
      break
    }
    case "operator": {
      if (formula.value == "错误") {
        formula.value = ""
      }
      if (this.textContent == "=") {
        if (formula.value == "") {
          result.value = ""
          break
        }
        result.value = ""
        if (/^(-?\d+(\.\d+)?)([×÷+-](-?\d+(\.\d+)?))*$/.test(formula.value)) {
          try {
            formula.value = count(formula.value)
            if (localStorage.getItem("grand-total") == " ") {
              localStorage.setItem("grand-total", formula.value)
            }
            else {
              localStorage.setItem("grand-total", Number(localStorage.getItem("grand-total")) + Number(formula.value))
            }
          }
          catch (e) {
            formula.value = "错误"
          }
        }
        else {
          formula.value = "错误"
        }
        return
      }
      formula.value += this.textContent
      break
    }
    case "function": {
      switch (this.textContent) {
        case "◀": {
          formula.value = formula.value.slice(0, formula.value.length - 1)
          break
        }
        case "C": {
          formula.value = ""
          break
        }
        case "M+": {
          localStorage.setItem("memory", Number(localStorage.getItem("memory")) + Number(result.value))
          break
        }
        case "M-": {
          localStorage.setItem("memory", Number(localStorage.getItem("memory")) - Number(result.value))
          break
        }
        case "MC": {
          formula.value = localStorage.getItem("memory")
          break
        }
        case "MR": {
          localStorage.setItem("memory", 0)
          break
        }
        case "AC": {
          formula.value = ""
          localStorage.setItem("memory", 0)
          break
        }
        case "GT": {
          if (lastInput == "GT") {
            localStorage.setItem("grand-total", " ")
            break
          }
          else if (localStorage.getItem("grand-total") != " ") {
            formula.value = localStorage.getItem("grand-total")
          }
          break
        }
      }
    }
  }
  if (formula.value == "") {
    result.value = ""
    return
  }
  if (/^(-?\d+(\.\d+)?)([×÷+-](-?\d+(\.\d+)?))*$/.test(formula.value)) {
    try {
      result.value = count(formula.value)
    }
    catch (e) {
      result.value = "错误"
    }
  }
  else {
    result.value = "错误"
  }
  lastInput = this.textContent
  flush_storage()
}

function flush_storage() {
  localStorage.setItem("formula", formula.value)
  localStorage.setItem("result", result.value)
}

function setCharAt(str, index, chr) {
  if (index < 0 || index >= str.length) {
    return str
  }
  return str.slice(0, index) + chr + str.slice(index + 1)
}

function count(formula) {
  formula = formula.replace("×", "*")
  formula = formula.replace("÷", "/")
  return eval(formula)
}