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

  <h1>ELCC Home</h1>

  <v-row>
    <v-col cols="4">
      <v-card elevation="3" color="#DC440566" to="/child-care-centres">
        <v-card-text style="text-align: right; color: white"> </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card elevation="3" color="#0097a966">
        <v-card-text style="text-align: right" color="white"> </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card elevation="3" color="#F2A90066">
        <v-card-text style="text-align: right"> </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card elevation="3" color="#7A9A0166">
        <v-card-text style="text-align: right"> </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: "Dashboard",
  data: () => ({
    breadcrumbs: [{ title: "Home", disabled: false }],
  }),
  computed: {},
};
</script>
