<template>
  <div class="filter">
    <div class="options">
      <search-filter-item
          v-for="(block, idx) in option_blocks"
          :key="`block-${idx}`"
          :title="block.title"
          :options="block.options"
          :is-all-filters-reset="state.is_all_filters_reset"
          @checked="emitFilterSearchResults"
      />
      <the-button
          text="Сбросить все фильтры"
          @clicked="resetFilters"
          variant="dashed"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue"
import SearchFilterItem from "@/components/SearchPage/SearchFilter/SearchFilterItem.vue";
import TheButton from "@/components/common/TheButton.vue";
import results_json from "@/assets/results.json"
import {OptionT} from "@/core/types/search.types";

export default defineComponent({
  components: {
    "search-filter-item": SearchFilterItem,
    "the-button": TheButton,
  },
  emits: ['search-results'],
  setup(props, { emit }) {
    const state = reactive({
      is_all_filters_reset: false,
    })

    const tariffs = [
        {
          id: 1,
          value: "Только прямые",
          is_active: false,
          type: "tariffs",
          filter_by: "stops"
        },
        {
          id: 2,
          value: "Только с багажом",
          is_active: false,
          type: "tariffs",
          filter_by: "baggage"
        },
        {
          id: 3,
          value: "Только возвратные",
          is_active: false,
          type: "tariffs",
          filter_by: "refundable"
        },
    ]

    const airlines: OptionT[] = []

    Object.values(results_json.airlines).forEach((airline, idx) => {

      airlines.push({
        id: idx,
        value: airline,
        is_active: false,
        filter_by: airline,
      })
    })

    const option_blocks = reactive([
        {
          title: "Опции тарифа",
          options: tariffs
        },
        {
          title: "Авиакомпании",
          options: airlines
        },
    ])

    const resetFilters = () => {
      emit('search-results', [])
      option_blocks.forEach(block => block.options.forEach(option => option.is_active = false))
      state.is_all_filters_reset = true
    }

    const emitFilterSearchResults = (active_options: string[]) => {
      emit('search-results', active_options)
    }

    return {
      state,
      props,
      option_blocks,
      resetFilters,
      emitFilterSearchResults,
    }
  }
})
</script>

<style lang="scss" scoped>
.filter {
  width: 240px;
}

@media(max-width: 800px) {
  .filter {
    width: 100%;
    margin-bottom: 23px;
  }
}
</style>