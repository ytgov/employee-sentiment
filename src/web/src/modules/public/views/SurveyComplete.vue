<template>
  <h1>Thank you!</h1>

  <p>Your answers has been saved</p>

  <p v-if="question.answers_remaining > 0">
    You can come back and submit up to {{ Math.max(0, question.answers_remaining) }} more responses
  </p>
</template>

<script>
import { mapState } from "pinia";
import { usePublicStore } from "../store";

export default {
  computed: {
    ...mapState(usePublicStore, ["question"]),
  },
};
</script>
