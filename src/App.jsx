import { useEffect, useState } from 'react'
import './App.css'

const operators = ['+', '-', '*', '/']

function App() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const calculate = (first, operator, second) => {
    const a = Number(first)
    const b = Number(second)
    if (operator === '+') return a + b
    if (operator === '-') return a - b
    if (operator === '*') return a * b
    if (operator === '/') return b === 0 ? 'Error' : a / b
  }

  const formatResult = (value) => {
    if (value === 'Error') return value
    const rounded = Math.round((Number(value) + Number.EPSILON) * 1e10) / 1e10
    return String(rounded)
  }

  const inputDigit = (digit) => {
    if (display === 'Error') {
      setDisplay(digit)
      setExpression('')
      setWaitingForOperand(false)
      return
    }
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand || display === 'Error') {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') return

    const symbol = nextOperator === '*' ? '×' : nextOperator === '/' ? '÷' : nextOperator

    if (!expression) {
      setExpression(`${display} ${symbol}`)
    } else if (waitingForOperand) {
      setExpression(expression.slice(0, -1).trim() + ` ${symbol}`)
    } else {
      const operator = expression.trim().slice(-1)
      const operatorKey = operator === '×' ? '*' : operator === '÷' ? '/' : operator
      const first = expression.trim().slice(0, -1).trim()
      const result = calculate(first, operatorKey, display)
      const formatted = formatResult(result)
      setDisplay(formatted)
      setExpression(formatted === 'Error' ? '' : `${formatted} ${symbol}`)
    }
    setWaitingForOperand(true)
  }

  const equals = () => {
    if (!expression || waitingForOperand || display === 'Error') return
    const operator = expression.trim().slice(-1)
    const operatorKey = operator === '×' ? '*' : operator === '÷' ? '/' : operator
    const first = expression.trim().slice(0, -1).trim()
    const result = formatResult(calculate(first, operatorKey, display))
    setDisplay(result)
    setExpression('')
    setWaitingForOperand(true)
  }

  const clear = () => {
    setDisplay('0')
    setExpression('')
    setWaitingForOperand(false)
  }

  const backspace = () => {
    if (waitingForOperand || display === 'Error') return
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0')
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (/^[0-9]$/.test(event.key)) inputDigit(event.key)
      else if (event.key === '.') inputDecimal()
      else if (operators.includes(event.key)) chooseOperator(event.key)
      else if (event.key === 'Enter' || event.key === '=') equals()
      else if (event.key === 'Escape') clear()
      else if (event.key === 'Backspace') backspace()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const buttons = [
    ['', 'spacer', ''], ['⌫', 'backspace', 'utility'], ['÷', 'operator', '/'], ['AC', 'clear', 'clear'],
    ['7', 'digit', '7'], ['8', 'digit', '8'], ['9', 'digit', '9'], ['×', 'operator', '*'],
    ['4', 'digit', '4'], ['5', 'digit', '5'], ['6', 'digit', '6'], ['−', 'operator', '-'],
    ['1', 'digit', '1'], ['2', 'digit', '2'], ['3', 'digit', '3'], ['+', 'operator', '+'],
    ['0', 'digit zero', '0'], ['.', 'decimal', '.'], ['=', 'equals', '='],
  ]

  return (
    <main className="calculator-page">
      <div className="calculator">
        <div className="display" aria-live="polite">
          <div className="expression">{expression}</div>
          <div className="display-value">{display}</div>
        </div>

        <div className="keypad">
          {buttons.map(([label, className, value]) => (
            <button
              key={label}
              className={`key ${className}`}
              type="button"
              onClick={() => {
                if (value === 'clear') clear()
                else if (value === 'backspace') backspace()
                else if (value === '.') inputDecimal()
                else if (value === '=') equals()
                else if (operators.includes(value)) chooseOperator(value)
                else inputDigit(value)
              }}
              aria-label={label}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
