<template>
  <div class="switch-wrap">
    <div
      class="switch"
      :class="{ active: isDarkTheme, inactive: !isDarkTheme }"
      @click="$emit('changeTheme', !isDarkTheme)"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  isDarkTheme: {
    type: Boolean,
    required: true
  }
})
defineEmits(['changeTheme'])
</script>

<style lang="scss" scoped>
$switchColor: #d1d5db;

.switch-wrap {
  grid-row: 1 / 2;
  grid-column: 1 / 5;
  position: relative;
  top: 50%;
  width: 15%;
  height: 50%;
  margin-left: auto;
}

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
</style>
