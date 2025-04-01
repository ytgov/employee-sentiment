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
      <v-select
        v-model="batch.question"
        density="compact"
        label="Question"
        :items="earlyStageQuestions"
        @update:model-value="questionChanged"
        item-title="TITLE"
        hide-details
        class="ml-2"
        item-value="ID"></v-select>
    </template>
    <template v-slot:right>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        class="mr-2"
        density="compact"></v-text-field>
    </template>
    <v-row>
      <v-col>
        <v-btn @click="openEditor" size="small" color="primary" class="float-right" :disabled="!batch.question"
          >Add Participants</v-btn
        >
      </v-col>
    </v-row>

    <v-data-table :search="search" :headers="headers" :items="participants">
      <template v-slot:item.actions="{ item }">
        <div>
          <v-btn icon="mdi-delete" variant="tonal" color="warning" @click="deleteClick(item.ID)"></v-btn>
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="visible" persistent max-width="700">
      <v-card>
        <v-toolbar color="primary" variant="dark" title="Add Participants">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeEditor" color="white"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text>
          <v-select
            label="Type"
            :items="listTypes"
            density="comfortable"
            variant="outlined"
            v-model="batch.participant_type"></v-select>
            <v-file-input
            v-model="csvFile"
            variant="outlined"
            density="comfortable"
            accept="text/csv"
            label="Choose a CSV to import"></v-file-input>

            <div v-if="csvFile">
            <v-label class="mb-3">
              This CSV parser assumes:<br />
              1) The first row in the file contains headers - it is skipped during parsing <br />
              2) The first header is always EMAIL <br />
              3) Any additional headers are demographics and match existing values
            </v-label>
          </div>

          <v-textarea
            v-model="batch.participants"
            variant="outlined"
            density="comfortable"
            bg-color="white"
            label="Participants"></v-textarea>

          <div class="d-flex mb-3">
            <v-btn color="success" @click="parseClick">Parse</v-btn>
            <div class="ml-4 pt-2">{{ parseMessage }}</div>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveClick" :disabled="!batchIsValid">Save</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </base-card>
</template>
<script lang="ts">
import { mapActions, mapState, mapWritableState } from "pinia";
import { useParticipantsStore } from "../store";
import { useQuestionStore } from "../../question/store";
import { parse as csvParser } from "csv-parse/browser/esm";
import { useNotificationStore } from "@/store/NotificationStore";

const notify = useNotificationStore();

export default {
  components: {},
  data: () => ({
    participantType: "",
    headers: [
      { title: "", key: "actions", width: "60px" },
      { title: "Email", key: "EMAIL" },
      { title: "Responder", key: "IS_RESPONDER" },
      { title: "Rater", key: "IS_RATER" },
      { title: "Submitted", key: "ANSWERS_SUBMITTED" },
    ],
    search: "",
    parseMessage: "",
    visible: false,
    csvFile: null,
    parsedCsv: "",
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
          to: "/dashboard",
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
  unmounted() {
    this.unselect();
  },
  methods: {
    ...mapActions(useParticipantsStore, ["parse", "create", "getParticipants", "deleteParticipant", "unselect"]),
    ...mapActions(useQuestionStore, ["loadQuestions"]),

    async loadItems() {
      //await this.getAllUsers();
    },
    rowClick(event: Event, thing: any) {
      //this.selectUser(clone(thing.item.value));
    },
    async parseClick() {

      if (this.csvFile) {
        var reader = new FileReader();
        reader.onload = async (end) => {
          const fileContent = end.target?.result;
          const records = new Array<any>();
          const parser = csvParser({ delimiter: "," });

          parser.on("readable", () => {
            let record;
            while ((record = parser.read()) !== null) {
              records.push(record);
            }
          });
          parser.on("error", function (err) {
            console.error(err.message);
          });

          parser.write(fileContent);
          parser.end();

          let headers = records.shift();

          if (headers[0] && headers[0].toLowerCase() != "email") {
            console.log("THIS FILE NEEDS HEADERS");

            notify.notify({
              text: "This CSV File doesn't have the EMAIL header row",
              icon: "mdi-thumb-down",
              variant: "error",
            });
            return;
          }

          let emails = records.map((r) => r[0]);

          this.batch.fileData = { headers, records };
          this.batch.participants = emails.join(", ");

          let items = await this.parse(true);
          this.parseMessage = `${items.valid.length} valid email address and ${items.invalid.length} invalid`;
        };

        reader.readAsText(this.csvFile);
      } else {
        this.batch.fileData = {};
        let items = await this.parse();
        this.parseMessage = `${items.valid.length} valid email address and ${items.invalid.length} invalid`;
      }
    },
    async saveClick() {
      await this.create();
    },
    async questionChanged() {
      await this.getParticipants(this.batch.question);
    },
    async deleteClick(participantId: any) {
      await this.deleteParticipant(this.batch.question, participantId);
    },

    openEditor() {
      this.visible = true;
    },
    closeEditor() {
      this.visible = false;
    },
  },
};
</script>
