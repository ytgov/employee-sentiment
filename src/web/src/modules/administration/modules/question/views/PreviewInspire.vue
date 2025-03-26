<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    bg-color="#7A9A01"
    style="margin: -13px -16px 10px -16px"
    class="pl-4 mb-4"
    color="white"
    active-color="#fff">
    <template v-slot:prepend>
      <v-icon color="white" icon="mdi-home"></v-icon>
    </template>
    <template v-slot:divider>
      <v-icon color="white" icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>

  <h1 class="mt-0">Here are the responses that we heard</h1>
  <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
    Below are a random list of responses that we heard from participants.
  </p>

  <v-divider class="my-4" />

  <div v-if="question">
    <label class="v-label" style="font-weight: 300">We asked:</label>
    <h4>{{ question.DISPLAY_TEXT }}</h4>

    <label class="v-label mt-6 mb-2" style="font-weight: 300">We heard:</label>

    <v-card elevation="0" class="mb-3" v-for="(item, idx) of results">
      <v-card-text>
        <p>{{ item.ANSWER_TEXT }}</p>
      </v-card-text>
    </v-card>
    <div v-if="question.answers_remaining > 0">
      <v-divider class="my-4" />
      <v-label> You can submit up to {{ question.answers_remaining }} more responses</v-label><br /><br />
      <v-btn color="primary" :to="answerLink"> Go to Response page </v-btn>
    </div>
    <div v-else>
      <v-divider class="my-4" />
      <v-label> You have submitted the maximum number of answers</v-label>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { usePublicStore } from "../store/PreviewStore";

export default {
  data: () => ({
    moveOn: false,
    questionId: "",
  }),
  async mounted() {
    this.questionId = this.$route.params.questionId;
    await this.loadSurveyInspire(this.questionId);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "allValid", "results"]),
    answerLink() {
      return `/administration/preview/question/${this.questionId}`;
    },
    
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/dashboard",
        },
        {
          title: "Preview Inspire",
        },
      ];
    },
  },
  methods: {
    ...mapActions(usePublicStore, ["loadSurveyInspire"]),

    async submitClick() {},
  },
};
</script>
