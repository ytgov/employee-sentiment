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
      :items="questions"
      item-title="TITLE"
      item-value="ID"></v-select>

    <v-combobox
      label="Type"
      :items="listTypes"
      density="comfortable"
      variant="outlined"
      v-model="batch.participant_type"></v-combobox>

    <v-textarea
      v-model="batch.participants"
      variant="outlined"
      density="comfortable"
      bg-color="white"
      label="Participants"></v-textarea>
    <v-btn color="primary" @click="parseClick">Parse</v-btn> {{ parseMessage }}
    <v-btn color="primary" @click="saveClick" :disabled="!batchIsValid">Save</v-btn>

    <v-data-table :search="search" :headers="headers" :items="items" :loading="isLoading" @click:row="rowClick">
      <template v-slot:item.permissions="{ item }">
        <v-chip color="yg_moss" v-if="item.value.IS_ADMIN">Admin</v-chip>
        <v-chip color="yg_zinc" v-else-if="item.value.ROLE == 'Moderator'">Moderator</v-chip>
      </template>
    </v-data-table>
  </base-card>
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from "pinia";
import { useParticipantsStore } from "../store";
import { clone } from "lodash";
import { useQuestionStore } from "../../question/store";

export default {
  components: {},
  data: () => ({
    participantType: "",
    headers: [
      { title: "Name", key: "display_name" },
      { title: "Email", key: "EMAIL" },
      { title: "Status", key: "STATUS" },
      { title: "Permisions", key: "permissions" },
    ],
    search: "",
    parseMessage: "",
  }),
  computed: {
    ...mapWritableState(useParticipantsStore, ["batch"]),
    ...mapState(useParticipantsStore, ["isLoading", "listTypes", "batchIsValid"]),
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
  },
  beforeMount() {
    this.loadItems();
    this.loadQuestions();
  },
  methods: {
    ...mapActions(useParticipantsStore, ["parse", "create"]),
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
  },
};
</script>
