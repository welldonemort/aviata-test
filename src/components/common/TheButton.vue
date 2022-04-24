<template>
  <button
      :class="`the-button ${variant}`"
      @click="emitClick"
  >
    <span class="text">{{ text }}</span>
  </button>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  emits: ['clicked'],
  props: {
    text: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: null,
    },
  },
  setup(props, { emit }) {
    const emitClick = () => {
      emit('clicked')
    }

    return {
      props,
      emitClick,
    }
  }
})
</script>

<style lang="scss" scoped>
.the-button {
  border: none;
  outline: none;
  background: none;
  cursor: pointer;
  transition: all .3s;
  &:hover {
    opacity: .8;
  }
}
.dashed {
  border-bottom: 1px dashed rgba(114, 132, 228, 0.5);
  .text {
    font-size: 12px;
    line-height: 16px;
    color: #7284E4;
  }
}
.green {
  background: #55BB06;
  border-radius: 4px;
  padding: 7px 12px;
  .text {
    color: #FFFFFF;
    font-weight: 700;
    font-size: 18px;
    line-height: 25px;
  }
}
.blue-light {
  background: #EAF0FA;
  border-radius: 2px;
  padding: 3px 8px;
  .text {
    color: #5763B3;
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
}
.full {
  width: 100%;
}
</style>