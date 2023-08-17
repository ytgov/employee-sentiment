<template>
  <h1 class="mt-0">Thank you to everybody who participated on this question!</h1>
  <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
    Below are all responses and their ratings.
  </p>

  <v-divider class="my-4" />

  <div v-if="question">
    <label class="v-label" style="font-weight: 300">We asked:</label>
    <h4>{{ question.DISPLAY_TEXT }}</h4>
    <label class="v-label mt-6 mb-2" style="font-weight: 300">We heard:</label>

    <v-card elevation="0" class="mb-3" v-for="(item, idx) of results">
      <v-card-text>
        <p>{{ item.ANSWER_TEXT }}</p>

        <label class="v-label mt-2" style="font-size: 12px">Average Rating: {{ item.rating }}</label>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { usePublicStore } from "../store";

export default {
  data: () => ({
    moveOn: false,
  }),
  async mounted() {
    let questionId = this.$route.params.surveyId;
    await this.loadSurveyResults(questionId);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "results"]),
  },
  methods: {
    ...mapActions(usePublicStore, ["loadSurveyResults"]),
  },
};
</script>
