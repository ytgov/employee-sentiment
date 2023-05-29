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

  <h1>Administration</h1>

  <v-row>
    <v-col>
      <v-card to="/administration/users" elevation="0">
        <v-card-title>Users</v-card-title>
        <v-card-text class="pb-6">
          <div style="font-size: 30px; font-weight: 700;">
            {{ userCount }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card to="/administration/questions" elevation="0">
        <v-card-title>Questions</v-card-title>
        <v-card-text class="pb-6">
          <div style="font-size: 30px; font-weight: 700;">
            {{ questionCount }}
          </div>
        </v-card-text>
      </v-card>
    </v-col> <v-col>
      <v-card to="/administration/emailer" elevation="0">
        <v-card-title>Emailer</v-card-title>
        <v-card-text class="pb-6">
          <div style="font-size: 30px; font-weight: 700;">
            &nbsp
          </div>
        </v-card-text>
      </v-card>
    </v-col><v-col>
      <v-card to="/administration/participants" elevation="0">
        <v-card-title>Participants</v-card-title>
        <v-card-text class="pb-6">
          <div style="font-size: 30px; font-weight: 700;">
            &nbsp
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useQuestionStore } from "../modules/question/store";
import { useUserAdminStore } from "../modules/users/store";

export default {
  data: () => ({}),
  async mounted() {
    await this.getAllUsers();
    await this.loadQuestions();
  },
  computed: {
    ...mapState(useUserAdminStore, ["userCount"]),
    ...mapState(useQuestionStore, ["questionCount"]),

    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
      ];
    },
  },
  methods: {
    ...mapActions(useQuestionStore, ["loadQuestions"]),
    ...mapActions(useUserAdminStore, ["getAllUsers"]),
  },
};
</script>
