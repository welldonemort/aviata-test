<template>
  <div class="search-page">
    <search-filter @search-results="searchResults" />
    <search-results :results="state.results" />
  </div>
</template>

<script lang="ts">
import SearchFilter from "@/components/SearchPage/SearchFilter/SearchFilter.vue";
import SearchResults from "@/components/SearchPage/SearchResults/SearchResults.vue";
import {defineComponent, reactive} from "vue";
import results_json from "@/assets/results.json"
import {ActiveOptionsT, FlightT} from "@/core/types/search.types";

export default defineComponent({
  components: {
    "search-filter": SearchFilter,
    "search-results": SearchResults,
  },
  setup() {
    const state = reactive({
      results: [] as FlightT[] | null,
      results_initial: [] as FlightT[] | null,
      active_options: {} as ActiveOptionsT | null,
    })

    state.results = results_json.flights
    state.results_initial = results_json.flights

    const searchResults = (active_options: string[]) => {
      state.results = state.results_initial

      if (state.active_options && active_options[0] === "tariffs") {
        state.active_options.tariffs = []
      }
      else if (state.active_options && !active_options.length) {
        state.active_options.airlines = []
      }
      else {
        active_options = active_options.map(option => option.toLowerCase())

        if (!(active_options.includes("stops") ||
            active_options.includes("baggage") ||
            active_options.includes("refundable")))
        {
          if (state.active_options) state.active_options.airlines = active_options
        }
        else {
          if (state.active_options) state.active_options.tariffs = active_options
        }
      }

      if (state.results_initial && state.active_options?.airlines && state.active_options?.airlines.length) state.results = state.results_initial.filter(result => {
        if (state.active_options &&
            state.active_options.airlines &&
            state.active_options.airlines.includes(result.itineraries[0][0].carrier_name.toLowerCase())) return result
      })

      if (state.active_options && state.active_options.tariffs && state.active_options.tariffs.length) {
        state.active_options.tariffs.forEach(option => {
          if (state.results && option === "stops") {
            state.results = state.results.filter(result => {
              if (!result.itineraries[0][0].stops) return result
            })
          }
          else if (state.results && option === "baggage") {
            state.results = state.results.filter(result => {
              const key = Object.keys(result.services)[0]
              const amount = result.services[key].value.split(" ")[0]

              if (amount !== '0') return result
            })
          }
          else if (state.results && option === "refundable") {
            state.results = state.results.filter(result => result.refundable)
          }
        })
      }
    }

    return {
      state,
      searchResults,
    }
  }
})
</script>

<style lang="scss">
.search-page {
  display: flex;
}

@media(max-width: 800px) {
  .search-page {
    flex-direction: column;
  }
}
</style>