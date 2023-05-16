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

  <h1>Questions</h1>

  <base-card showHeader="t" heading="" elevation="0">
    <template v-slot:left>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"></v-text-field>
    </template>
    <template v-slot:right>
      <v-btn color="primary" variant="tonal" size="small" class="mr-5" @click="addQuesionClick">Add Question</v-btn>
    </template>

    <v-data-table :search="search" :headers="headers" :items="items" :loading="isLoading" @click:row="rowClick">
      <template v-slot:item.permissions="{ item }">
        <v-chip color="yg_moss" v-if="item.value.IS_ADMIN == true">Admin</v-chip>
        <v-chip color="yg_zinc" v-else-if="item.value.ROLE == 'Moderator'">Moderator</v-chip>
      </template>
    </v-data-table>
  </base-card>

  <question-editor></question-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useQuestionStore } from "../store";
import QuestionEditor from "../components/QuestionEditor.vue";
import { clone } from "lodash";

export default {
  components: { QuestionEditor },
  data: () => ({
    headers: [
      { title: "Title", key: "TITLE" },
      { title: "Owner", key: "OWNER" },
      { title: "State", key: "STATE" },
      { title: "Current Tranche", key: "CURRENT_RATING_TRANCHE" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useQuestionStore, ["questions", "isLoading"]),
    items() {
      return this.questions;
    },
    totalItems() {
      return this.questions.length;
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Questions",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useQuestionStore, ["loadQuestions", "select"]),

    async loadItems() {
      await this.loadQuestions();
    },
    rowClick(event: Event, thing: any) {
      this.select(clone(thing.item.value));
    },
    addQuesionClick() {
      this.select({
        TITLE: "",
        CREATE_DATE: new Date(),
        CURRENT_RATING_TRANCHE: 0,
        DISPLAY_TEXT: "",
        MAX_ANSWERS: 4,
        OWNER: "",
        STATE: 0,
        RATINGS_PER_TRANCHE: 10,
      });
    },
  },
};
</script>
