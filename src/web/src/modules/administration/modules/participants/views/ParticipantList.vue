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

  <h1>Participants</h1>

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
    <template v-slot:right> </template>

    <v-select
      v-model="batch.question"
      density="comfortable"
      variant="outlined"
      label="Question"
      :items="earlyStageQuestions"
      @update:model-value="questionChanged"
      item-title="TITLE"
      item-value="ID"></v-select>

    <v-select
      label="Type"
      :items="listTypes"
      density="comfortable"
      variant="outlined"
      v-model="batch.participant_type"></v-select>

    <v-textarea
      v-model="batch.participants"
      variant="outlined"
      density="comfortable"
      bg-color="white"
      label="Participants"></v-textarea>
    <v-btn color="primary" @click="parseClick">Parse</v-btn> {{ parseMessage }}
    <v-btn color="primary" @click="saveClick" :disabled="!batchIsValid">Save</v-btn>

    <v-data-table :search="search" :headers="headers" :items="participants"> </v-data-table>
  </base-card>
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from "pinia";
import { useParticipantsStore } from "../store";
import { useQuestionStore } from "../../question/store";

export default {
  components: {},
  data: () => ({
    participantType: "",
    headers: [
      { title: "Email", key: "EMAIL" },
      { title: "Responder", key: "IS_RESPONDER" },
      { title: "Rater", key: "IS_RATER" },
      { title: "Submitted", key: "ANSWERS_SUBMITTED" },
    ],
    search: "",
    parseMessage: "",
  }),
  computed: {
    ...mapWritableState(useParticipantsStore, ["batch"]),
    ...mapState(useParticipantsStore, ["isLoading", "listTypes", "batchIsValid", "participants"]),
    ...mapState(useQuestionStore, ["questions"]),

    items() {
      return [];
    },
    totalItems() {
      return 0;
    },
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Participants",
        },
      ];
    },
    earlyStageQuestions() {
      if (this.questions) {
        return this.questions.filter((q) => q.STATE == 0);
      }
      return [];
    },
  },
  beforeMount() {
    this.loadItems();
    this.loadQuestions();
  },
  methods: {
    ...mapActions(useParticipantsStore, ["parse", "create", "getParticipants"]),
    ...mapActions(useQuestionStore, ["loadQuestions"]),

    async loadItems() {
      //await this.getAllUsers();
    },
    rowClick(event: Event, thing: any) {
      //this.selectUser(clone(thing.item.value));
    },
    async parseClick() {
      let items = await this.parse();
      this.parseMessage = `${items.valid.length} valid email address and ${items.invalid.length} invalid`;
    },
    async saveClick() {
      await this.create();
    },
    async questionChanged() {
      await this.getParticipants(this.batch.question);
    },
  },
};
</script>
