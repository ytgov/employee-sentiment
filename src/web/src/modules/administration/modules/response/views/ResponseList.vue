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

  <base-card showHeader="t" heading="">
    <template v-slot:left>


      <v-select
        label="Question"
        :items="['Weekend', 'Moderated']"
        density="compact"
        single-line
        hide-details
        style="width: 100px"></v-select>

    <!--   <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
        append-inner-icon="mdi-magnify"
        density="compact"
        style="width: 100px"
        class="ml-2"></v-text-field> -->
    </template>
    <template v-slot:right>
** maybe moderators only see unmoderated, admins see all

      <v-select
        label="Status"
        :items="['Unmoderated', 'Moderated']"
        density="compact"
        single-line
        hide-details
        style="width: 100px"></v-select>
    </template>

    <v-data-table :search="search" :headers="headers" :items="responses" @click:row="rowClick"> </v-data-table>
  </base-card>

  <response-editor></response-editor>
</template>
<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useResponseStore } from "../store";
import ResponseEditor from "../components/ResponseEditor.vue";

export default {
  components: { ResponseEditor },
  data: () => ({
    headers: [
      { title: "Question", key: "question" },
      { title: "Date", key: "date" },
      { title: "Status", key: "status" },
    ],
    search: "",
  }),
  computed: {
    ...mapState(useResponseStore, ["responses"]),
    breadcrumbs() {
      return [
        {
          title: "Administration",
          to: "/administration",
        },
        {
          title: "Responses",
        },
      ];
    },
  },
  beforeMount() {
    this.loadItems();
  },
  methods: {
    ...mapActions(useResponseStore, ["loadResponses", "select"]),

    async loadItems() {
      await this.loadResponses();
    },
    rowClick(event: Event, thing: any) {
      console.log("TEST")
      this.select(thing.item.value);
    },
  },
};
</script>
