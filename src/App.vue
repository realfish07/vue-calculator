<template>
  <div
    class="app-container"
    :class="{ 'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme }"
  >
    <div class="calculator">
      <Switch
        :is-dark-theme="isDarkTheme"
        @changeTheme="bool => isDarkTheme = bool"
      />
      <Input
        :show-animation="showAnimation"
        :show-result="showResult"
        :expression="expression"
        :result="result"
      />
      <Button
        v-for="btn in btnList"
        :key="btn"
        :btn="btn"
        @pressBtn="pressBtn"
      />
    </div>
  </div>
</template>

<script>
import Switch from '@/components/Switch.vue'
import Input from '@/components/Input.vue'
import Button from '@/components/Button.vue'

const scientificNotationRegex = /\d(\.\d+)?[Ee][+-]\d+/g
export default {
  name: 'App',
  components: { Switch, Input, Button },
  data: () => ({
    btnList: ['AC', '±', '%', '÷', '(', ')', 'backspace', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'],
    expression: '',
    prevExpression: '', // the expression except current operand or operator
    operand: '',
    operator: '',
    result: 0,
    showResult: false,
    showAnimation: false, // show animation of expression and result or not
    isDarkTheme: false
  }),
  mounted() {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) this.isDarkTheme = true

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.changeTheme)
    }
  },
  beforeUnmount() {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.changeTheme)
    }
  },
  methods: {
    /**
     * change dark/light theme
     */
    changeTheme(e) {
      this.isDarkTheme = e.matches
    },
    /**
     * Press btns handler
     *
     * @param {String} btn
     */
    pressBtn(btn) {
      const showResult = this.showResult
      if (this.showResult) {
        if (btn === '=') {
          this.animate()
          return
        }
        if (this.result.toString() && isFinite(this.result)) this.expression = this.result.toString()
        else this.expression = ''
        this.prevExpression = this.operand = this.operator = ''
        this.result = 0
        this.showResult = false
      }

      if (btn === 'AC') {
        this.prevExpression = this.operand = this.operator = this.expression = ''
        this.result = 0
        return
      }

      if (btn === '±') {
        if (showResult) this.operand = this.expression
        this.negate()
        return
      }

      if (btn === '%') {
        if (showResult) this.operand = this.expression
        if (!this.operand) return

        this.operand = `${this.precise(+this.operand * 0.01)}`
        this.expression = this.prevExpression + this.operand
        return
      }

      if (btn === 'backspace') {
        if (!this.expression) return
        this.backspace()
        return
      }

      if (btn === '=') {
        if (!this.expression) this.expression = '0'

        // add ) if parentheses are not in pairs
        if (this.expression && this.expression.match(/\(/g)) {
          const length1 = this.expression.match(/\(/g).length
          const length2 = this.expression.match(/\)/g) && this.expression.match(/\)/g).length
          for (let i = 0; i < length1 - length2; i++) {
            this.expression += ')'
          }
        }
        this.result = this.compute(this.splitTokens())
        if (!this.result && this.result !== 0) this.result = 'Error'
        this.showResult = true
        this.animate()
        return
      }

      if (/\d|\./.test(btn)) {
        this.appendOperand(btn)
      } else if (/\(|\)/.test(btn)) {
        this.appendParentheses(btn)
      } else {
        this.appendOperator(btn)
      }
    },
    /**
     * Show animation
     */
    animate() {
      this.showAnimation = true
      setTimeout(() => {
        this.showAnimation = false
      }, 0)
    },
    /**
     * Add or remove negative sign
     */
    negate() {
      if (this.operator === '+' || this.operator === '-') {
        this.operator = this.operator === '+' ? '-' : '+'
        if (this.operand) this.prevExpression = this.prevExpression.slice(0, -1) + this.operator
      } else {
        if (!(+this.operand || /^(-?0)$/.test(this.operand))) return
        this.operand = `${-this.operand}`
      }
      this.expression = this.prevExpression + (this.operand ? this.operand : this.operator)
    },
    /**
     * delete(←)
     */
    backspace() {
      let match, item, lastIndex
      while ((match = scientificNotationRegex.exec(this.expression)) !== null) {
        item = match[0]
        lastIndex = scientificNotationRegex.lastIndex
      }

      // delete scientific notation
      if (lastIndex === this.expression.length) {
        this.operand = ''
        this.expression = this.expression.slice(0, 0 - item.length)
      } else {
        this.operand = this.operand.slice(0, -1)
        this.expression = this.expression.slice(0, -1)
      }

      if (/\(|\)/.test(this.expression.slice(-1))) {
        this.prevExpression = this.expression
      } else if (/[^\d.]/.test(this.expression.slice(-1))) {
        this.prevExpression = this.expression.slice(0, -1)
      } else {
        // is scientific notation or not
        if (lastIndex === this.expression.length) this.operand = item
        else this.operand = this.expression.split(/[^\d.]/g).filter(item => item).slice(-1)[0] || ''

        this.prevExpression = this.expression.slice(0, this.operand ? 0 - this.operand.length : 0)
        if (this.prevExpression.slice(-1) === '-' && /[^\d.]/.test(this.prevExpression.slice(-2, -1))) {
          this.operand = `-${this.operand}`
          this.prevExpression = this.prevExpression.slice(0, -1)
        }
      }
      this.operator = this.operand ? this.prevExpression.slice(-1) : this.expression.slice(-1)
      if (/\(|\)/.test(this.operator)) this.operator = ''
    },
    /**
     * Append Parentheses
     *
     * @param {String} btn parenthesis
     */
    appendParentheses(btn) {
      if (btn === ')') {
        if (this.expression && this.expression.match(/\(/g)) {
          const length1 = this.expression.match(/\(/g).length
          const length2 = this.expression.match(/\)/g) && this.expression.match(/\)/g).length
          if (length1 > length2) this.expression = this.expression + btn
        }
      } else {
        if (/\d|\)/.test(this.expression.slice(-1))) {
          this.expression += '×'
        }
        this.expression = this.expression + btn
      }
      this.prevExpression = this.expression
      this.operand = this.operator = ''
    },
    /**
     * Append an operand
     *
     * @param {String} btn operand
     */
    appendOperand(btn) {
      if (scientificNotationRegex.test(this.operand)) {
        this.operand = ''
      }
      if (/\d|\)/.test(this.prevExpression.slice(-1))) {
        this.prevExpression = this.expression
      }
      if (this.prevExpression.slice(-1) === ')') {
        this.prevExpression += '×'
      }

      if (/\d/.test(btn)) { // input number
        this.operand = `${+this.operand || /\.|^-$/.test(this.operand) ? this.operand : (this.operand === '-0' ? '-' : '')}${btn}`
      } else { // input dot
        if (/\./.test(this.operand)) return

        this.operand = `${/^(-|-0)$/.test(this.operand) ? '-0' : +this.operand}${btn}`
      }
      this.expression = this.prevExpression + this.operand
    },
    /**
     * Append an operator
     *
     * @param {String} btn operator
     */
    appendOperator(btn) {
      // first input
      if (!this.expression) {
        this.prevExpression = '0'
      }

      if (!this.prevExpression || /[^\d.)]/.test(this.prevExpression.slice(-1))) {
        if (!this.operand && !this.prevExpression) this.prevExpression = this.expression
        else if (Number.isNaN(+this.operand)) this.prevExpression = this.prevExpression.slice(0, -1)
        else this.prevExpression = this.prevExpression + `${+this.operand}`
      }
      this.operand = ''
      this.operator = btn
      this.expression = this.prevExpression + this.operator
    },
    /**
     * Split expression to tokens
     * ex: 9×-6 -> ['9', '×', '-6']
     */
    splitTokens() {
      const tokens = []
      // scientific notation, integer, float, (, )
      const regexp = /(\d(\.\d+)?[Ee][+-]\d+)|(([1-9]+\d*)|0)(\.\d+)?|\(|\)/g
      let match
      let lastIndex = 0
      let minusIndex = -1
      while ((match = regexp.exec(this.expression)) !== null) {
        if (minusIndex !== -1) {
          tokens.push(this.expression.slice(minusIndex, lastIndex))
          minusIndex = -1
        }

        if ((!(match.index - 1) || /[^\d)]/.test(this.expression[match.index - 2])) && this.expression[match.index - 1] === '-') {
          minusIndex = match.index - 1
        } else {
          if (lastIndex !== match.index) tokens.push(this.expression.slice(lastIndex, match.index))
          tokens.push(this.expression.slice(match.index, regexp.lastIndex))
        }

        if (minusIndex !== -1 && lastIndex !== minusIndex) tokens.push(this.expression.slice(lastIndex, minusIndex))
        lastIndex = regexp.lastIndex
      }
      const num = this.expression.slice(minusIndex !== -1 ? minusIndex : lastIndex)
      if (num) tokens.push(num)
      if (!regexp.test(tokens[tokens.length - 1])) tokens.pop()

      return tokens
    },
    /**
     * Compute result(Binary expression tree)
     *
     * @param {Array} tokens The tokens to compute
     */
    compute(tokens) {
      if (tokens.length === 1) return +tokens[0]

      // Returns true if 'op2' has higher or same precedence as 'op1', otherwise returns false.
      const hasPrecedence = (op1, op2) => {
        if (/\(|\)/.test(op2)) return false
        if (/÷|×/.test(op1) && /\+|-/.test(op2)) return false
        return true
      }
      const values = []
      const ops = []

      for (const token of tokens) {
        if (/[\d]/.test(token)) {
          values.push(+token)
          continue
        }

        if (token === '(') {
          ops.push(token)
          continue
        }

        if (token === ')') {
          while (ops[ops.length - 1] !== '(') {
            values.push(this.applyOp(ops.pop(), values.pop(), values.pop()))
          }
          ops.pop()
          continue
        }

        // current token is an operator, check if top of 'ops' has same or greater precedence to current token
        while (ops.length > 0 && hasPrecedence(token, ops[ops.length - 1])) {
          values.push(this.applyOp(ops.pop(), values.pop(), values.pop()))
        }
        ops.push(token)
      }

      while (ops.length > 0) {
        values.push(this.applyOp(ops.pop(), values.pop(), values.pop()))
      }

      return values.pop()
    },
    /**
     * To apply an operator on operands
     *
     * @param {String} op operator
     * @param {Number} b operand
     * @param {Number} a operand
     */
    applyOp(op, b, a) {
      a = +a
      b = +b
      switch (op) {
        case '+':
          return this.precise(a + b)
        case '-':
          return this.precise(a - b)
        case '×':
          return this.precise(a * b)
        case '÷':
          return this.precise(a / b)
      }
      return 0
    },
    /**
     * Set number to the max precision, to fix 0.1 + 0.2 !== 0.3
     *
     * @param {Number} x number
     */
    precise(x) {
      const result = +(x.toPrecision(8))
      if (`${result}`.length >= 8) return result.toExponential()
      return result
    }
  }
}
</script>

<style lang="scss">
.app-container {
  padding: 20px;
  font-family: "Karla", sans-serif;
  @include themify("fontColor", "primaryColor") using ($lists) {
    color: nth($lists, 1);
    background-color: nth($lists, 2);
  }
}

.calculator {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 600px;
  padding: 0 $padding $padding;
  border-radius: 12px;
  font-size: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(9, 1fr);
  grid-gap: 2% 4%;
  @include themify("primaryLight", "primaryDark") using ($lists) {
    box-shadow: -7px -7px 20px nth($lists, 1), -4px -4px 5px nth($lists, 1),
      7px 7px 20px nth($lists, 2), 4px 4px 5px nth($lists, 2);
    border: 1px solid scale-color(nth($lists, 1), $alpha: -50%);
  }
  @media only screen and (max-width: 450px) {
    width: 100%;
    height: 100%;
    padding: 0 6vw 6vw;
    font-size: 7vw;
  }
}
</style>
