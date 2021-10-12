<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkTheme, 'light-theme': !isDarkTheme }">
    <div class="calculator">
      <div class="switch-wrap">
        <div
          class="switch"
          :class="{ active: isDarkTheme, inactive: !isDarkTheme }"
          @click="isDarkTheme = !isDarkTheme"
        />
      </div>
      <div class="input">
        <div ref="refExpression" class="expression" :class="{ animate: showAnimation }">
          <span>{{ showResult ? expression : '' }}</span>
        </div>
        <div ref="refResult" class="result" :class="{ animate: showAnimation }">
          <span>{{ showResult || !expression ? result : expression }}</span>
        </div>
      </div>
      <div
        v-for="btn in btnList"
        :key="btn"
        :ref="btn"
        :class="{ operator: /\+|\-|\×|\÷|\=/.test(btn), equal: btn === '=', zero: btn === '0', symbol: /[^+\-×÷=\d\.]/.test(btn) }"
        class="btn"
        @pointerdown="pressBtn(btn)"
        @transitionend="removePressAnimation"
      >
        <div class="btn-content" :class="{ backspace: btn === 'backspace' }">
          {{ btn === 'backspace' ? '' : btn }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue'

const scientificNotationRegex = /\d(\.\d+)?[Ee][+-]\d+/g
export default {
  name: 'App',
  setup() {
    const expression = ref('')
    const showResult = ref(false)
    const refResult = ref(null)
    const refExpression = ref(null)

    watch(expression, async () => {
      const el = refResult.value
      await nextTick()
      if (el && el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth - el.clientWidth
      }
    })

    watch(showResult, async () => {
      const el = refExpression.value
      await nextTick()
      if (el && el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth - el.clientWidth
      }
    })

    return {
      expression,
      showResult,
      refResult,
      refExpression
    }
  },
  data: () => ({
    btnList: ['AC', '±', '%', '÷', '(', ')', 'backspace', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'],
    prevExpression: '', // the expression except current operand or operator
    operand: '',
    operator: '',
    result: 0,
    showAnimation: false, // show animation of expression and result or not
    isDarkTheme: false
  }),
  mounted() {
    window.addEventListener('keydown', this.detectInput)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.detectInput)
  },
  methods: {
    /**
     * remove button press animation
     */
    removePressAnimation(e) {
      if (!e.target.classList.contains('animate')) return
      e.target.classList.remove('animate')
    },
    /**
     * detect keyboard input
     */
    detectInput(e) {
      const key = e.key.toLowerCase()
      if (this.btnList.includes(key)) {
        this.pressBtn(key)
        return
      }

      switch (key) {
        case '*':
          this.pressBtn('×')
          break
        case '/':
          this.pressBtn('÷')
          break
        case 'enter':
          this.pressBtn('=')
          break
        case 'escape':
          this.pressBtn('AC')
          break
      }
    },
    /**
     * Press btns handler
     *
     * @param {String} btn
     */
    pressBtn(btn) {
      if (this.$refs[btn]) {
        for (const el of this.btnList) {
          if (this.$refs[el]) this.$refs[el].classList.remove('animate')
        }
        this.$refs[btn].classList.add('animate')
      }

      const result = this.showResult
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
        if (result) this.operand = this.expression
        this.negate()
        return
      }

      if (btn === '%') {
        if (result) this.operand = this.expression
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
        if (!(+this.operand || /^(-0|0)$/.test(this.operand))) return
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
      } else if (/[^\d\.]/.test(this.expression.slice(-1))) {
        this.prevExpression = this.expression.slice(0, -1)
      } else {
        // is scientific notation or not
        if (lastIndex === this.expression.length) this.operand = item
        else this.operand = this.expression.split(/[^\d\.]/g).filter(item => item).slice(-1)[0] || ''

        this.prevExpression = this.expression.slice(0, this.operand ? 0 - this.operand.length : 0)
        if (this.prevExpression.slice(-1) === '-' && /[^\d\.]/.test(this.prevExpression.slice(-2, -1))) {
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

      if (!this.prevExpression || /[^\d\.\)]/.test(this.prevExpression.slice(-1))) {
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

        if ((!(match.index - 1) || /[^\d]/.test(this.expression[match.index - 2])) && this.expression[match.index - 1] === '-') {
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
        if (/\÷|\×/.test(op1) && /\+|\-/.test(op2)) return false
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
$padding: 25px;
$switchColor: #d1d5db;
$lightColor: #eff6ff;
$darkColor: #111827;
$themes: (
  light: (
    primaryColor: $lightColor,
    primaryLight: lighten($lightColor, 5%),
    primaryDark: darken($lightColor, 10%),
    fontColor: #374151,
    hoverColor: #fbbf24,
  ),
  dark: (
    primaryColor: $darkColor,
    primaryLight: lighten($darkColor, 5%),
    primaryDark: darken($darkColor, 10%),
    fontColor: #bfdbfe,
    hoverColor: #b91c1c,
  ),
);

@mixin themify($colors...) {
  @each $theme, $map in $themes {
    .#{$theme}-theme &,
    &.#{$theme}-theme {
      $lists: ();
      @each $color in $colors {
        $value: map-get(map-get($themes, $theme), "#{$color}");
        $lists: append($lists, $value);
      }
      @content ($lists);
    }
  }
}

* {
  margin: 0;
  box-sizing: border-box;
  user-select: none;
}

html,
body,
#app,
.app-container {
  height: 100%;
  width: 100%;
}

.app-container {
  padding: 20px;
  font-family: "Karla", sans-serif;
  min-width: 320px;
  min-height: 600px;
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
  font-size: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(9, 1fr);
  grid-gap: 2% 4%;
  @include themify("primaryLight", "primaryDark") using ($lists) {
    box-shadow: -7px -7px 20px nth($lists, 1), -4px -4px 5px nth($lists, 1),
      7px 7px 20px nth($lists, 2), 4px 4px 5px nth($lists, 2);
    border: 1px solid scale-color(nth($lists, 1), $alpha: -50%);
  }
}

.input {
  & * {
    user-select: text;
  }
  position: relative;
  grid-column: 1 / 5;
  grid-row: 2 / 4;
  padding: $padding;
  letter-spacing: 0.15px;
  transition: color 0.25s ease;
  border-radius: 8px;
  font-size: 30px;
  overflow: hidden;
  @include themify("primaryLight", "primaryDark") using ($lists) {
    box-shadow: inset 2px 2px 4px nth($lists, 2),
      inset -2px -2px 4px nth($lists, 1);
  }
  .expression,
  .result {
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  .expression {
    position: absolute;
    top: 15%;
    width: calc(100% - 50px);
    font-size: 16px;
    transform-origin: right;
    transition: 0.3s ease;
    transition-property: transform, top;
    &.animate {
      top: 50%;
      transform: scale(2);
      transition-duration: 0s;
    }
  }
  .result {
    position: relative;
    top: 15%;
    transition: top 0.3s ease;
    width: 100%;
    &.animate {
      top: 150%;
      transition-duration: 0s;
    }
  }
  span {
    width: 100%;
    text-align: right;
    display: inline-block;
    white-space: nowrap;
  }
}

.switch-wrap {
  grid-row: 1 / 2;
  grid-column: 1 / 5;
  position: relative;
  top: 50%;
  width: 15%;
  height: 50%;
  margin-left: auto;
  .switch {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    background: $switchColor;
    border: 1px solid scale-color($switchColor, $alpha: -50%);
    &.inactive {
      box-shadow: inset 2px 2px 4px darken($switchColor, 20%),
        inset -2px -2px 4px lighten($switchColor, 12%);
      &:after {
        left: 5%;
      }
    }
    &.active {
      box-shadow: inset -2px -2px 3px darken($switchColor, 20%),
        inset 2px 2px 5px lighten($switchColor, 12%);
      &:after {
        left: 100%;
        margin-left: -48%;
      }
    }
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      width: 43%;
      height: 0;
      padding-top: 43%;
      background: map-get(map-get($themes, "light"), "primaryLight");
      box-shadow: 0 0 5px rgb(0 0 0 / 25%);
      border-radius: 50%;
      transform: translateY(-50%);
      transition: left 0.3s, margin-left 0.3s;
    }
  }
}

.btn {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
  border-radius: 50%;
  font-weight: bold;
  transition: box-shadow 0.1s ease-in-out;
  transition-property: none;
  &.operator {
    color: #f87171;
  }
  &.symbol {
    color: #34d399;
    .backspace {
      background-color: #34d399;
    }
  }
  @include themify("primaryLight", "primaryDark") using ($lists) {
    box-shadow: inset 0 0 0 nth($lists, 2), inset 0 0 0 nth($lists, 1),
      3px 3px 6px nth($lists, 2), -2px -2px 5px nth($lists, 1);
    &:active {
      transition-property: box-shadow;
      box-shadow: inset 2px 2px 4px nth($lists, 2),
        inset -2px -2px 4px nth($lists, 1), 0 0 0 nth($lists, 2),
        0 0 0 nth($lists, 1);
    }
  }
  @media (hover: hover) {
    &:hover {
      @include themify("hoverColor") using ($lists) {
        color: nth($lists, 1);
        .backspace {
          background-color: nth($lists, 1);
        }
      }
    }
  }
  &.animate {
    transition-property: box-shadow;
    @include themify("primaryLight", "primaryDark", "hoverColor") using ($lists) {
      box-shadow: inset 2px 2px 4px nth($lists, 2),
        inset -2px -2px 4px nth($lists, 1), 0 0 0 nth($lists, 2),
        0 0 0 nth($lists, 1);
    }
  }
}

.btn-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: color 0.25s ease, background-color 0.25s ease;
}

.equal {
  grid-row: 8 / 10;
  grid-column: 4 / 5;
  padding-top: 220%;
  border-radius: 50px;
}

.zero {
  grid-column: 1 / 3;
  padding-top: 45%;
  border-radius: 50px;
}

.backspace {
  position: absolute;
  width: 18px;
  height: 12px;
  background-color: #34d399;
  border-radius: 3px;
  clip-path: polygon(30% 0, 100% 0, 100% 100%, 30% 100%, 0 50%);
  @include themify("primaryColor") using ($lists) {
    &:before,
    &:after {
      background-color: nth($lists, 1);
    }
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 60%;
    top: 50%;
    height: 10px;
    width: 2px;
    border-radius: 5px;
  }
  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}
</style>
