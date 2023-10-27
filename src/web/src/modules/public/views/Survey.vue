<template>
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
                <v-col cols="11" class="pb-0" style="line-height: 24px"
                  >Response {{ i }}.
                </v-col>
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
                hide-details
                rows="3"
                bg-color="white"
                class="mt-4"></v-textarea>
            </v-card-text>
          </v-card>
        </div>
        <div class="text-right">
          <v-spacer></v-spacer>
          <!-- <v-btn
            color="primary"
            class="mb-4"
            :disabled="!allValid"
            @click="submitSurvey"
            v-if="question.answers_remaining > 0">
            Submit {{ answerCount }} Responses</v-btn
          ><br /> -->
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
import { usePublicStore } from "../store";
import { QuestionState } from "@/modules/administration/modules/question/store";

export default {
  data: () => ({}),
  async mounted() {
    let token = this.$route.params.surveyId;
    await this.loadSurvey(token, [QuestionState.Inspire, QuestionState.Opinionate], true, false);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "allValid", "isLoading", "answerCount"]),
    ...mapWritableState(usePublicStore, ["answers"]),
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
