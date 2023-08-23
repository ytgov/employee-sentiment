<template>
  <div v-if="question && responses.length > 0">
    <h1 class="mt-0">We want to know what you think of the following responses</h1>
    <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">
      Below are a random list of responses that we heard from participants. Please indicate your rating on each item
      then click submit. If you would like to rate additional answers, that's great too.
    </p>

    <v-divider class="my-4" />

    <label class="v-label" style="font-weight: 300">We asked:</label>

    <h4>{{ question.DISPLAY_TEXT }}</h4>
    <!-- <div v-for="(question, idx) of survey.questions" :key="idx">
    {{ question.ASK }}
  </div> -->

    <label class="v-label mt-6 mb-2" style="font-weight: 300">We heard:</label>

    <v-card elevation="0" class="mb-3" v-for="(item, idx) of responses">
      <v-card-text>
        <p>{{ item.ANSWER_TEXT }}</p>

        <v-rating clearable color="primary" density="comfortable" v-model="item.rating"></v-rating>
      </v-card-text>
    </v-card>
    <v-divider class="my-4" />
    <v-btn color="primary" @click="submitClick"> Submit </v-btn>
    <v-btn color="primary" class="ml-5 d-none"> Submit and Rate More </v-btn>
  </div>
  <div v-else-if="!isLoading && responses.length == 0">No answers remain to be rated</div>
  <div v-else-if="!isLoading">Question not found</div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { usePublicStore } from "../store";

export default {
  data: () => ({
    moveOn: false,
  }),
  async mounted() {
    let token = this.$route.params.surveyId;
    await this.loadSurvey(token, 3, false, true);
    await this.loadResponses(token);
  },

  computed: {
    ...mapState(usePublicStore, ["question", "allValid", "responses", "isLoading"]),
  },
  methods: {
    ...mapActions(usePublicStore, ["loadSurvey", "loadResponses", "saveRatings"]),

    async submitClick() {
      await this.saveRatings(this.$route.params.surveyId).then((r) => {
        this.$router.push(`/rating/complete`);
      });
    },
  },
};
</script>
