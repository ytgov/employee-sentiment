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

  <h1>Responses</h1>

      ** maybe moderators only see unmoderated, admins see all
  <base-card showHeader="t" heading="">
    <template v-slot:left>
      <v-select
        label="Question"
        :items="questions"
        v-model="question"
        density="compact"
        single-line
        hide-details
        item-title="TITLE"
        item-value="ID"
        style="width: 100px"></v-select>
    </template>
    <template v-slot:right>

      <v-select
        label="Status"
        :items="['Unmoderated', 'Moderated']"
        v-model="status"
        density="compact"
        single-line
        hide-details
        style="width: 100px"></v-select>
    </template>

    <v-data-table :search="search" :headers="headers" :items="filteredList" @click:row="rowClick"> </v-data-table>
  </base-card>

  <response-editor></response-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useResponseStore } from "../store";
import ResponseEditor from "../components/ResponseEditor.vue";
import { useQuestionStore } from "../../question/store";

export default {
  components: { ResponseEditor },
  data: () => ({
    headers: [
      { title: "Category", key: "CATEGORY" },
      { title: "Response", key: "ANSWER_TEXT" },
      { title: "Deleted", key: "DELETED_FLAG" },
      { title: "Complete", key: "DONE_MODERATING" },
    ],
    search: "",
    question: 0,
    status: "Unmoderated",
  }),
  computed: {
    ...mapState(useResponseStore, ["responses"]),
    ...mapState(useQuestionStore, ["questions"]),
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/dashboard",
        },
        {
          title: "Responses",
        },
      ];
    },
    filteredList() {
      let items = this.responses;
      if (this.question) {
        items = items.filter((i) => i.QUESTION_ID == this.question);
      }

      if (this.status == "Moderated") {
        items = items.filter((i) => (i.DONE_MODERATING == 1));
      } else if (this.status == "Unmoderated") {
        items = items.filter((i) => (i.DONE_MODERATING == 0));
      }

      return items;
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useResponseStore, ["loadResponses", "select"]),
    ...mapActions(useQuestionStore, ["loadQuestions"]),
    async loadItems() {
      await this.loadResponses();
      await this.loadQuestions();

      if (this.questions.length > 0 && this.questions[0].ID) {
        this.question = this.questions[0].ID || 0;
      }
    },
    rowClick(event: Event, thing: any) {
      this.select(thing.item);
    },
  },
};
</script>
