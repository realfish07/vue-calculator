<template>
  <div
    ref="refBtn"
    :class="{ operator: /\+|\-|\×|\÷|\=/.test(btn), equal: btn === '=', zero: btn === '0', symbol: /[^+\-×÷=\d\.]/.test(btn) }"
    class="btn"
    @pointerdown="addPressAnimation"
    @transitionend="removePressAnimation"
  >
    <div
      class="btn-content"
      :class="{ backspace: btn === 'backspace' }"
    >
      {{ btn === 'backspace' ? '' : btn }}
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  btn: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['pressBtn'])
const refBtn = ref(null)

onMounted(() => {
  window.addEventListener('keydown', detectInput)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', detectInput)
})

/**
 * detect keyboard input
 */
function detectInput(e) {
  const key = e.key.toLowerCase()
  if (props.btn === key) addPressAnimation()

  switch (key) {
    case '*':
      if (props.btn === '×') addPressAnimation()
      break
    case '/':
      if (props.btn === '÷') addPressAnimation()
      break
    case 'enter':
      if (props.btn === '=') addPressAnimation()
      break
    case 'escape':
      if (props.btn === 'AC') addPressAnimation()
      break
  }
}

/**
 * remove button press animation
 */
function removePressAnimation(e) {
  if (!e.target.classList.contains('animate')) return
  e.target.classList.remove('animate')
}

/**
 * add button press animation
 */
function addPressAnimation() {
  emit('pressBtn', props.btn)
  refBtn.value.classList.add('animate')
}
</script>

<style lang="scss" scoped>
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
