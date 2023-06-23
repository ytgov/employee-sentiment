<template>
  <h1>Thank you!</h1>

  <p>Your answers has been saved</p>

  You can come back and submit up to {{ question.answers_remaining }} more responses
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
