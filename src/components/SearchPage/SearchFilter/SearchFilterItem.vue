<template>
  <div class="filter-item">
    <div class="header">
      <p class="title">{{ title }}</p>
      <div class="reset-svg--holder">
        <reset-filter-svg class="reset-svg" @click="resetLocalFilter"/>
        <span class="tooltip">Сбросить выбор</span>
      </div>
    </div>
    <div class="options">
      <div
          @click="handleClick(option)"
          v-for="(option, idx) in options"
          :key="`option-${idx}`"
          class="options__item"
      >
        <input
            v-model="option.is_active"
            type="checkbox"
            class="custom-checkbox"
        >
        <label class="label">{{ option.value }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from "vue"
import ResetFilterSVG from "@/components/svg/ResetFilterSVG.vue";
import { OptionT } from "@/core/types/search.types";

export default defineComponent({
  components: {
    "reset-filter-svg": ResetFilterSVG
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    options: {
      type: Array as PropType<OptionT[]>,
      default: () => [],
    },
    isAllFiltersReset: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['checked'],
  setup: function (props, { emit }) {
    const state = reactive({
      active_options: [] as string[] | null,
      active_filter_type: null as string | null,
    })

    const handleClick = (option: OptionT) => {
      option.is_active = !option.is_active
      // Добавление/удаление в фильтры
      if (option.filter_by) {
        if (option.type) state.active_filter_type = option.type
        if (option.type && state.active_options && state.active_options.length === 1 && state.active_options.includes(option.type)) {
          state.active_filter_type = null
          state.active_options = []
        }
        if (option.is_active) state.active_options?.push(option.filter_by)
        else state.active_options?.splice(state.active_options.indexOf(option.filter_by), 1)
        if (option.type && state.active_options && !state.active_options.length) {
          state.active_filter_type = option.type
          state.active_options = [option.type]
        }
        emit('checked', state.active_options)

      }
    }

    const resetLocalFilter = () => {
      if (state.active_filter_type) state.active_options = [state.active_filter_type]
      else if (!state.active_filter_type) state.active_options = []
      state.active_filter_type = null

      emit('checked', state.active_options)
      props.options && props.options.forEach(checkbox => checkbox.is_active = false)
    }

    return {
      state,
      props,
      handleClick,
      resetLocalFilter,
    }
  }
})
</script>

<style lang="scss" scoped>
.filter-item {
  width: 100%;
  background: #F5F5F5;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 12px;
    .title {
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
    }
    .reset-svg--holder {
      position: relative;
      display: inline-block;
      transition: all .4s;
      .reset-svg {
        cursor: pointer;
        fill: #B9B9B9;
      }
      .tooltip {
        visibility: hidden;
        width: max-content;
        max-width: 150px;
        background-color: #FFFFFF;
        border: 1px solid #E1E1E1;
        font-size: 12px;
        line-height: 16px;
        border-radius: 6px;
        padding: 12px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        margin-left: -60px;
        opacity: 0;
        transition: opacity 0.3s;
        &::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #FFFFFF transparent transparent transparent;
        }
      }
      &:hover {
        .tooltip {
          visibility: visible;
          opacity: 1;
        }
        .reset-svg {
          fill: #7284E4;
        }
      }
    }
  }
  .options {
    &__item {
      display: flex;
      align-items: center;
      padding: 10px 12px;
      cursor: pointer;
      transition: all .3s;
      &:hover {
        background: #EBEBEB;
        .custom-checkbox + label::before {
          background-size: 60%;
          transition: all .3s;
          background-color: #FFFFFF;
          //noinspection CssUnknownTarget
          background-image: url("@/assets/checkbox_hover.svg");
        }
      }
      .custom-checkbox {
        position: absolute;
        z-index: -1;
        opacity: 0;
      }
      .custom-checkbox + label::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid #B9B9B9;
        border-radius: 2px;
        margin-right: 12px;
        background-repeat: no-repeat;
        background-position: center center;
      }
      .custom-checkbox:checked + label::before {
        border-color: #55BB06;
        background-color: #55BB06;
        background-size: contain;
        //noinspection CssUnknownTarget
        background-image: url("@/assets/checkbox_active.svg");
      }
      .hover-checkbox:checked + label::before {
        border-color: #55BB06;
        background-size: contain;
        //noinspection CssUnknownTarget
        background-image: url("@/assets/checkbox_active.svg");
      }
      .label {
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        user-select: none;
      }
    }
  }
}
@media(max-width: 800px) {
  .reset-svg--holder {
    .reset-svg {
      fill: #B9B9B9 !important;
    }
    .tooltip {
      visibility: hidden !important;
      opacity: 0 !important;
    }
  }
}
</style>