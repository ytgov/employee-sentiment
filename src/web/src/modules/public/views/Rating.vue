<template>
  <h1 class="mt-0">{{ survey.survey.PAGE_TITLE }}</h1>
  <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
    {{ survey.survey.DESCRIPTION }}
  </p>

  <v-divider class="my-4" />

  <label class="v-label" style="font-weight: 300">We asked:</label>

  <div v-for="(question, idx) of survey.questions" :key="idx">
    {{ question.ASK }}
  </div>

  <label class="v-label mt-6 mb-2" style="font-weight: 300">We heard:</label>

  <v-card elevation="0" class="mb-3">
    <v-card-text>
      <p>I really like to go skiing, but it's summer so I will go water skiing.</p>

      <v-rating color="primary" density="comfortable"></v-rating>
    </v-card-text>
  </v-card>
  
  <v-card elevation="0" class="mb-3">
    <v-card-text>
      <p>I probably will walk my dogs then take a nap.</p>

      <v-rating label="What did you think of this response?" color="primary" density="comfortable">Reat</v-rating>
    </v-card-text>
  </v-card>

  <v-card elevation="0" class="mb-3">
    <v-card-text>
      <p>I really like to go skiing, but it's summer so I will go water skiing.</p>

      <v-rating color="primary" density="comfortable"></v-rating>
    </v-card-text>
  </v-card>

  <v-divider class="my-4" />
  <v-btn color="primary"> Submit </v-btn>
  <v-btn color="primary" class="ml-5"> Submit and Rate More </v-btn>

</template>

<script>
import { mapActions, mapState } from "pinia";
import { usePublicStore } from "../store";
import QuestionRenderer from "../components/question-renderer.vue";

export default {
  components: { QuestionRenderer },
  data: () => ({
    moveOn: false,
  }),
  async mounted() {
    let token = this.$route.params.surveyId;
    await this.loadSurvey(token);
  },

  computed: {
    ...mapState(usePublicStore, ["survey", "allValid"]),
  },
  methods: {
    ...mapActions(usePublicStore, ["loadSurvey"]),

    submitSurvey() {
      this.$router.push("/survey/1/complete");
    },
  },
};
</script>
