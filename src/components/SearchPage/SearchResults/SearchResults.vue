<template>
  <div class="results">
    <div v-if="results.length">
      <search-results-item
          v-for="(item, idx) in results"
          :key="`block-${idx}`"
          :item="item"
          :airlines="airlines"
          class="results__item"
      />
    </div>
    <div v-else class="blank">Совпадения не найдены! Попробуйте другие фильтры.</div>
  </div>
</template>

<script lang="ts">
import SearchResultsItem from "@/components/SearchPage/SearchResults/SearchResultsItem.vue";
import results_json from "@/assets/results.json"
import { defineComponent, PropType } from "vue"
import { FlightT } from "@/core/types/search.types";

export default defineComponent({
  components: {
    "search-results-item": SearchResultsItem,
  },
  props: {
    results: {
      type: Array as PropType<FlightT[]>,
      default: () => [],
    },
  },
  setup() {
    const airlines = results_json.airlines

    return {
      airlines,
    }
  }
})
</script>

<style lang="scss" scoped>
.results {
  width: calc(100% - 20px - 240px);
  margin-left: 20px;
  .blank {
    display: flex;
    justify-content: center;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    padding: 12px;
    font-size: 12px;
    line-height: 16px;
  }
}

@media(max-width: 800px) {
  .results {
    width: 100%;
    margin: 0;
  }
}
</style>