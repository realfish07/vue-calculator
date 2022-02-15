<template>
  <div class="input">
    <div
      ref="refExpression"
      class="expression"
      :class="{ animate: showAnimation }"
    >
      <span>{{ showResult ? expression : '' }}</span>
    </div>
    <div
      ref="refResult"
      class="result"
      :class="{ animate: showAnimation }"
    >
      <span>{{ showResult || !expression ? result : expression }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, nextTick, toRefs } from 'vue'

const props = defineProps({
  showAnimation: {
    type: Boolean,
    required: true
  },
  showResult: {
    type: Boolean,
    required: true
  },
  expression: {
    type: String,
    required: true
  },
  result: {
    type: [Number, String],
    required: true
  }
})
const refResult = ref(null)
const refExpression = ref(null)
const { expression, showResult } = toRefs(props)

watch(expression, async() => {
  const el = refResult.value
  await nextTick()
  if (el && el.scrollWidth > el.clientWidth) {
    el.scrollLeft = el.scrollWidth - el.clientWidth
  }
})

watch(showResult, async() => {
  const el = refExpression.value
  await nextTick()
  if (el && el.scrollWidth > el.clientWidth) {
    el.scrollLeft = el.scrollWidth - el.clientWidth
  }
})
</script>

<style lang="scss" scoped>
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
  span {
    width: 100%;
    text-align: right;
    display: inline-block;
    white-space: nowrap;
  }
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
</style>
