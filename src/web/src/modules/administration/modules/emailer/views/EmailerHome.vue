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

  <h1>Emailer</h1>

  <base-card showHeader="" heading="" class="pt-3" elevation="0">
    <template v-slot:left>
      <!--  <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        class="ml-2"></v-text-field> -->
    </template>
    <template v-slot:right>
      <!-- <v-btn color="primary" variant="tonal" size="small" class="mr-5">Send</v-btn> -->
    </template>

    <v-row>
      <v-col cols="8">
        <v-select
          density="comfortable"
          variant="outlined"
          label="Question"
          :items="questions"
          item-title="TITLE"></v-select>

        <v-row>
          <v-col cols="4">
            <v-checkbox
              label="Opinionators (63)"
              density="comfortable"
              variant="outlined"
              hide-details
              rows="3"></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              label="Raters (107)"
              density="comfortable"
              variant="outlined"
              hide-details
              rows="3"></v-checkbox>
          </v-col>
        </v-row>

        <v-divider class="my-3 mb-5" />

        <!--  <div class="d-flex">
      <v-btn color="info" size="small" class="mb-5 mt-4 mr-5" @click="parsed = true">Parse participants</v-btn>
      <v-label v-if="parsed">Found 2 valid emails</v-label>
    </div> -->

        <v-text-field label="Subject" density="comfortable" variant="outlined"></v-text-field>
        <v-textarea label="Email body" density="comfortable" variant="outlined" rows="3"></v-textarea>

        <div class="d-flex">
          <v-btn color="primary" :disabled="!isValid">Send Test</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="warning" :disabled="!isValid">Send to Participants</v-btn>
        </div></v-col
      >
      <v-col>
        Event Log <br />
        Email to opinionators sent on May 29th <br />
      </v-col>
    </v-row>
  </base-card>

  <email-editor></email-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useEmailerStore } from "../store";
import EmailEditor from "../components/EmailEditor.vue";
import { clone } from "lodash";

export default {
  components: { EmailEditor },
  data: () => ({
    headers: [
      { title: "Title", key: "TITLE" },
      { title: "Owner", key: "OWNER" },
      { title: "State", key: "STATE" },
      { title: "Current Tranche", key: "CURRENT_RATING_TRANCHE" },
    ],
    parsed: false,
    search: "",
  }),
  computed: {
    ...mapState(useEmailerStore, ["questions", "isLoading"]),
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
          title: "Emailer",
        },
      ];
    },
    isValid() {
      return true;
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useEmailerStore, ["loadQuestions", "select"]),

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
