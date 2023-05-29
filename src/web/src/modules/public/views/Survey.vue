<template>
  <h1>{{ survey.survey.PAGE_TITLE }}</h1>
  <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
    {{ survey.survey.DESCRIPTION }}
  </p>
<!-- 
  <v-divider class="my-4" /> -->

  <div v-if="!moveOn">
    <v-card elevation="0">
      <v-card-text>
        <div v-html="survey.survey.PAGE_INTRO"></div>

        <!--
            <p>
            Your participation in this survey is voluntary, and you may submit
            your responses only once.
          </p>

          <p>
            Your answers are kept securely on a Yukon Government server and are
            stored in a non-identifiable format.
          </p>

          <p>
            Only non-identifiable and aggregated information will be used when
            reporting results. By participating in this survey, you consent that
            your information can be used to inform business improvement and
            program planning initiatives towards creating a more efficient
            public service.
          </p>

          <p>
            If you have any questions about the collection, use or disclosure of
            your personal information, contact the Director, People Metrics,
            Analytics and Projects Branch at (867) 332-2738 or in person at:
          </p>

          <p class="ml-3">
            Main Administration Building, <br />2071 2nd Ave.<br />
            Whitehorse YT, Y1A 1B2
          </p>
          -->

        <v-btn @click="moveOn = true" size="large" class="mt-8" color="primary">Continue to Survey</v-btn></v-card-text
      >
    </v-card>
  </div>

  <div v-if="moveOn">
   <!--  <h4 class="mb-4">
      This survey consists of {{ survey.questions.length }} questions. Once completed, please press 'Submit' at the
      bottom.
    </h4> -->

    <div class="row">
      <div class="col-sm-12 col-md-9 col-lg-7">



        <div v-for="(question, idx) of survey.questions" :key="idx">
          <question-renderer :index="idx" :question="question"></question-renderer>
        </div>

        <div v-if="survey.survey.CONTACT_QUESTION">
          <v-card class="mb-5 question" elevation="0">
            <v-card-title class="pb-0" style="min-height: 48px">
              <v-row>
                <v-col cols="12" class="pb-1" style="line-height: 24px"> Regarding this survey... </v-col>
              </v-row>
            </v-card-title>
            <v-card-text style="clear: both">
              <v-checkbox :label="survey.survey.CONTACT_QUESTION" v-model="contactMe"></v-checkbox>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>
<v-label>You can submit up to 4 more responses</v-label>
<div class="d-flex">
        
    <v-btn color="primary" :disabled="!allValid" @click="submitSurvey"> Submit </v-btn>
    <v-spacer></v-spacer>
    <v-btn color="secondary"  @click="submitSurvey"> I'm done </v-btn>
  </div>
    <span style="font-size: 0.9rem" class="pl-4 text-error" v-if="!allValid">
      * Not all required questions have answers (look for the red asterisks next to the question)
    </span>
  </div>
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

      this.$router.push("/survey/1/complete")
    },
  },
};
</script>
