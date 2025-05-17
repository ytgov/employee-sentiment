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

  <v-progress-linear
    indeterminate
    :class="isLoading ? '' : 'd-none'"
    color="yg_sun"
    height="5"
    rounded></v-progress-linear>

  <div v-if="question">
    <h1 class="mb-0">{{ question.TITLE }}</h1>
    <v-divider class="my-3" />
    <h2 class="text-h5 mb-3"><strong>Question:</strong> {{ question.DISPLAY_TEXT }}</h2>

    <div>
      <v-label v-if="question.answers_remaining > 0" class="mb-2"
        >You can submit up to {{ question.answers_remaining }} response{{
          question.answers_remaining > 1 ? "s" : ""
        }}</v-label
      >
      <div class="row">
        <div class="col-sm-12 col-md-9 col-lg-7" v-for="i in question.answers_remaining">
          <v-card class="mb-5 question" elevation="0">
            <v-card-title class="pb-0" style="min-height: 35px">
              <v-row>
                <v-col cols="11" class="pb-0" style="line-height: 24px">Response {{ i }}. </v-col>
                <v-col cols="1" class="">
                  <div class="float-right">
                    <v-icon
                      color="green"
                      class="float-right"
                      style="width: 40px"
                      title="Question complete"
                      v-if="answers[i]"
                      >mdi-check-bold</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text style="clear: both">
              <v-textarea
                density="comfortable"
                v-model="answers[i]"
                variant="outlined"
                rows="3"
                :counter="question.MAX_LENGTH ?? 256"
                :maxlength="question.MAX_LENGTH ?? 256"
                bg-color="white"
                class="mt-4"></v-textarea>
            </v-card-text>
          </v-card>
        </div>
        <div class="text-right">
          <v-spacer></v-spacer>
          <v-btn color="info" @click="doneClick" :disabled="answerCount == 0">
            Submit {{ answerCount }} and finish
          </v-btn>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!isLoading">Question not found</div>
</template>

<script>
import { mapActions, mapState, mapWritableState } from "pinia";
import { usePublicStore } from "../store/PreviewStore";
import { QuestionState } from "@/modules/administration/modules/question/store";

export default {
  data: () => ({}),
  async mounted() {
    let token = this.$route.params.questionId;
    await this.loadSurvey(token, [QuestionState.Inspire, QuestionState.Opinionate], true, false);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "allValid", "isLoading", "answerCount"]),
    ...mapWritableState(usePublicStore, ["answers"]),

    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/dashboard",
        },
        {
          title: "Preview Question",
        },
      ];
    },
  },
  methods: {
    ...mapActions(usePublicStore, ["loadSurvey", "submit"]),

    async submitSurvey() {
      let willBeDone = this.question.answers_remaining == 1;

      this.submit(this.$route.params.surveyId).then(() => {
        if (willBeDone) this.$router.push("/question/complete");
      });
    },
    async doneClick() {
      if (this.answers.length > 0 && this.question.answers_remaining > 0) {
        await this.submit(this.$route.params.surveyId).then(() => {
          this.$router.push("/question/complete");
        });
      } else this.$router.push("/question/complete");
    },
  },
};
</script>
