<template>
  <v-dialog v-model="visible" persistent max-width="800">
    <v-card v-if="response">
      <v-toolbar color="primary" variant="dark" title="Moderation">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Question"
          v-model="response.QUESTION_ID"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"></v-text-field>

        <v-textarea
          label="Original response"
          v-model="response.ANSWER_TEXT"
          readonly
          variant="outlined"
          density="comfortable"
          rows="3"
          append-inner-icon="mdi-lock"></v-textarea>
        <v-textarea
          label="Moderated response"
          v-model="response.MODERATED_TEXT"
          :error="response.MODERATED_TEXT != response.ANSWER_TEXT"
          variant="outlined"
          density="comfortable"
          rows="3"></v-textarea>
        <v-textarea
          label="Moderator notes"
          v-model="response.MODERATOR_NOTES"
          variant="outlined"
          density="comfortable"
          rows="3"></v-textarea>
        <v-row>
          <!-- <v-col cols="12" md="6">
            <v-checkbox label="Duplicate response?" hide-details class="my-0 py-0"></v-checkbox>
            <v-checkbox label="Inappropriate?" hide-details class="my-0 py-0"></v-checkbox>
          </v-col> -->
          <v-col cols="12" md="6">
            <v-combobox
              label="Category"
              v-model="response.CATEGORY"
              clearable
              variant="outlined"
              density="comfortable"></v-combobox>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              label="Visibility"
              v-model="response.DELETED_FLAG"
              :items="[
                { title: 'Visible', value: 0 },
                { title: 'Deleted', value: 1 },
              ]"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveClick">Moderation Complete</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useResponseStore } from "../store";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useResponseStore, ["response"]),
    visible() {
      return this.response ? true : false;
    },
  },
  methods: {
    ...mapActions(useResponseStore, ["unselect", "update"]),
    close() {
      this.unselect();
    },
    saveClick() {
      if (this.response) {
        this.response.DONE_MODERATING = 1;

        this.update().then(() => {
          this.close();
        });
      }
    },
  },
};
</script>
