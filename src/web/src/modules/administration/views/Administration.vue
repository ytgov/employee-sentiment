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
      <v-card to="/administration/users">
        <v-card-title>Users</v-card-title>
        <v-card-text>
          <div style="font-size: 30px">
            {{ userCount }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card to="/administration/surveys">
        <v-card-title>Surveys</v-card-title>
        <v-card-text>
          <div style="font-size: 30px">
            {{ surveyCount }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useSurveyStore } from "../modules/survey/store";

export default {
  data: () => ({
    userCount: 0,
  }),
  mounted() {},
  computed: {
    ...mapState(useSurveyStore, ["surveyCount"]),

    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
      ];
    },
  },
  methods: {},
};
</script>
