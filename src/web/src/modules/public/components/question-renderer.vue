<template>
  <div>
    <v-card class="mb-5 question" elevation="0">
      <v-card-title class="pb-0" style="min-height: 48px">
        <v-row>
          <v-col cols="11" class="pb-1" style="line-height: 24px"> Question: {{ question.DISPLAY_TEXT }} </v-col>
          <v-col cols="1" class="">
            <div class="float-right">
              <v-icon color="green" class="float-right" style="width: 40px" title="Question complete" v-if="question"
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
      </v-card-text>
    </v-card>
  </div>
</template>

<style>
.question .v-label {
  color: #323232 !important;
}
.question .v-radio {
  padding-top: 12px;
}
</style>

<script>
export default {
  name: "Home",
  props: ["index", "question"],
  computed: {
    data: () => ({ answer: "" }),
    methods: {},
  },
};
</script>
