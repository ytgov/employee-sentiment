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

  <h1 class="mt-0">Thank you to everybody who participated on this question!</h1>
  <p class="mb-4" style="font-size: 1.2rem; font-weight: 300">Below are all responses and their ratings.</p>

  <v-divider class="my-4" />

  <div v-if="question">
    <label class="v-label" style="font-weight: 300">We asked:</label>
    <h4>{{ question.DISPLAY_TEXT }}</h4>
    <label class="v-label mt-6 mb-2" style="font-weight: 300">We heard:</label>

    <v-card elevation="0" class="mb-3" v-for="(item, idx) of results" :color="getColor(idx)">
      <v-card-text>
        <p class="mb-2">{{ item.ANSWER_TEXT }}</p>
        <v-divider class="mb-3" />

        <v-chip size="small" class="mr-2"
          >Average Rating: <strong class="ml-1"> {{ item.rating }}</strong>
        </v-chip>
        <v-chip size="small" class="mr-2" color="#333"
          >Total Ratings: <strong class="ml-1"> {{ item.totalRatings }}</strong>
        </v-chip>
        <v-chip size="small" class="mr-2"
          >Standard Deviation: <strong class="ml-1"> {{ item.std_dev }}</strong>
        </v-chip>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useQuestionStore } from "../store";

export default {
  data: () => ({
    moveOn: false,
  }),
  async mounted() {
    let questionId = this.$route.params.questionId;
    await this.loadSurveyResults(questionId);
  },
  computed: {
    ...mapState(useQuestionStore, ["question", "results"]),

    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/dashboard",
        },
        {
          title: "Preview Results",
        },
      ];
    },
  },
  methods: {
    ...mapActions(useQuestionStore, ["loadSurveyResults"]),
    getColor(idx) {
      let percent = idx / this.results.length;
      let color1 = { red: 205, green: 225, blue: 206 };
      let color2 = { red: 240, green: 193, blue: 189 };

      let resultRed = Math.round(color1.red + percent * (color2.red - color1.red));
      let resultGreen = Math.round(color1.green + percent * (color2.green - color1.green));
      let resultBlue = Math.round(color1.blue + percent * (color2.blue - color1.blue));

      return `#${toHex(resultRed)}${toHex(resultGreen)}${toHex(resultBlue)}`;
    },
  },
};
function toHex(val) {
  var hex = val.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
</script>
