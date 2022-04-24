<template>
  <router-view />
</template>

<script>
import { defineComponent } from "vue";
import { useTitle } from "vue-composable";

export default defineComponent({
  setup() {
    useTitle("Aviata test")
  }
})
</script>
