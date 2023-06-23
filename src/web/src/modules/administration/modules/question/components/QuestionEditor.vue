<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="question">
      <v-toolbar color="primary" variant="dark" title="Edit Question">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field label="Title" v-model="question.TITLE" variant="outlined" density="comfortable"></v-text-field>
        <v-textarea
          label="Display text"
          v-model="question.DISPLAY_TEXT"
          variant="outlined"
          rows="3"
          density="comfortable" />
        <v-select
          label="Owner"
          v-model="question.OWNER"
          variant="outlined"
          density="comfortable"
          :items="users"
          item-title="EMAIL"
          item-value="email" />
        <v-row>
          <v-col cols="6">
            <v-text-field
              type="number"
              label="State"
              v-model="question.STATE"
              variant="outlined"
              hide-details
              density="comfortable"></v-text-field
          ></v-col>
          <v-col cols="6">
            <v-text-field
              type="number"
              label="Max answer"
              v-model="question.MAX_ANSWERS"
              variant="outlined"
              hide-details
              density="comfortable"></v-text-field
          ></v-col>
          <v-col cols="6">
            <v-text-field
              type="number"
              label="Ratings per tranche"
              v-model="question.RATINGS_PER_TRANCHE"
              variant="outlined"
              hide-details
              density="comfortable"></v-text-field
          ></v-col>
          <v-col cols="6">
            <v-text-field
              type="number"
              label="Current rating tranche"
              v-model="question.CURRENT_RATING_TRANCHE"
              variant="outlined"
              density="comfortable"></v-text-field
          ></v-col>
        </v-row>

        <v-autocomplete
          :items="moderators"
          multiple
          item-title="display_name"
          label="Moderators"
          variant="outlined"
          density="comfortable"></v-autocomplete>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveClick">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useQuestionStore } from "../store";
import { useUserAdminStore } from "../../users/store";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useQuestionStore, ["question"]),
    ...mapState(useUserAdminStore, ["moderators", "users"]),
    visible() {
      return this.question ? true : false;
    },
  },
  async mounted() {
    await this.getAllUsers();
  },
  methods: {
    ...mapActions(useQuestionStore, ["unselect", "update", "create"]),
    ...mapActions(useUserAdminStore, ["getAllUsers"]),
    close() {
      this.unselect();
    },
    async saveClick() {
      if (this.question && this.question.ID) {
        this.update().then(() => {
          this.close();
        });
      } else {
        this.create().then(() => {
          this.close();
        });
      }
    },
  },
};
</script>
