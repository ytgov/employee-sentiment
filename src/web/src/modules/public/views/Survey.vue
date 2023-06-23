<template>
  <v-progress-linear
    indeterminate
    :class="isLoading ? '' : 'd-none'"
    color="yg_sun"
    height="5"
    rounded></v-progress-linear>

  <div v-if="question">
    <h1>{{ question.TITLE }}</h1>
    <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
      <!--  {{ question.DESCRIPTION }} -->
    </p>
    <!-- 
  <v-divider class="my-4" /> -->

    <div v-if="!moveOn">
      <v-card elevation="0">
        <v-card-text>
          <!-- <div v-html="question.PAGE_INTRO"></div>
 -->
          <v-btn @click="moveOn = true" size="large" class="mt-8" color="primary"
            >Continue to Survey</v-btn
          ></v-card-text
        >
      </v-card>
    </div>

    <div v-if="moveOn">
      <div class="row">
        <div class="col-sm-12 col-md-9 col-lg-7">
          <v-card class="mb-5 question" elevation="0">
            <v-card-title class="pb-0" style="min-height: 48px">
              <v-row>
                <v-col cols="11" class="pb-1" style="line-height: 24px"> Question: {{ question.DISPLAY_TEXT }} </v-col>
                <v-col cols="1" class="">
                  <div class="float-right">
                    <v-icon
                      color="green"
                      class="float-right"
                      style="width: 40px"
                      title="Question complete"
                      v-if="question"
                      >mdi-check-bold</v-icon
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text style="clear: both">
              <v-textarea
                density="comfortable"
                v-model="answer"
                variant="outlined"
                hide-details
                bg-color="white"
                class="mt-4"></v-textarea>
              <v-label v-if="question.answers_remaining > 0" class="my-3"
                >You can submit up to {{ question.answers_remaining }} more responses</v-label
              >
              <div class="text-right">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  class="mb-4"
                  :disabled="!allValid"
                  @click="submitSurvey"
                  v-if="question.answers_remaining > 0">
                  Submit </v-btn
                ><br />
                <v-btn color="info" @click="doneClick"> I'm done </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="!isLoading">Question not found</div>
</template>

<script>
import { mapActions, mapState, mapWritableState } from "pinia";
import { usePublicStore } from "../store";

export default {
  data: () => ({
    moveOn: true,
  }),
  async mounted() {
    let token = this.$route.params.surveyId;
    await this.loadSurvey(token);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "allValid", "isLoading"]),
    ...mapWritableState(usePublicStore, ["answer"]),
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
      if (this.answer.length > 0 && this.question.answers_remaining > 0) {
        await this.submit(this.$route.params.surveyId).then(() => {
          this.$router.push("/question/complete");
        });
      } else this.$router.push("/question/complete");
    },
  },
};
</script>
