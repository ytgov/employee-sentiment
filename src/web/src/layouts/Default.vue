<template>
  <v-app-bar app color="#fff" flat height="70" style="left: 0; border-bottom: 3px #f3b228 solid">
    <img src="/yukon.svg" style="margin: -10px 85px 0 14px" height="44" />
    <!-- <v-img class="ml-0m pl-0" src="src/assets/yukon.svg" height="44" /> -->
    <v-app-bar-title class="pt-0 font-weight-bold" style="margin-left: -20px">{{ title }}</v-app-bar-title>

    <template v-slot:append>
      <div v-if="isAuthenticated">
        <v-btn color="primary" class="mr-1" to="/dashboard" icon="mdi-home"></v-btn>

        <v-divider class="mr-5" vertical inset></v-divider>
        <span style="font-size: 0.9rem"> {{ username }} </span>

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" color="primary" v-bind="props"></v-btn>
          </template>

          <v-list density="compact">
            <v-list-item @click="logoutClick">
              <template v-slot:prepend>
                <v-icon>mdi-exit-run</v-icon>
              </template>
              <v-list-item-title style="font-size: 0.9rem !important">Sign out</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div v-else></div>
    </template>
  </v-app-bar>

  <v-main>
    <!-- Provides the application the proper gutter -->
    <!-- fill-height causes the main content to fill the entire page -->
    <v-container fluid class="page-wrapper">
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-overlay v-model="showOverlay" class="align-center justify-center">
    <div class="text-center">
      <v-progress-circular indeterminate size="64" class="mb-5" color="#f3b228" width="6"></v-progress-circular>
      <h2>Loading {{ title }}</h2>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { useUserStore } from "@/store/UserStore";
import { useNotificationStore } from "@/store/NotificationStore";
import { mapState, mapActions, mapWritableState } from "pinia";

export default {
  name: "Default",

  data() {
    return {
      isAuthenticated: this.$auth0.isAuthenticated,
      authUser: this.$auth0.user,
      showOverlay: true,
    };
  },
  computed: {
    ...mapWritableState(useNotificationStore, ["showNotification"]),
    ...mapState(useUserStore, ["user", "isAdmin"]),

    title() {
      return "Employee Sentiment";
    },
    username() {
      if (this.authUser) return this.authUser.name || "";
      return "";
    },
  },

  async mounted() {
    await this.initialize();
    this.showOverlay = false;
  },
  methods: {
    ...mapActions(useUserStore, ["initialize"]),

    logoutClick() {
      this.$auth.logout({ logoutParams: { returnTo: window.location.origin } });
    },
  },
};
</script>

<style scoped>
.v-list-item__prepend > .v-icon {
  margin-inline-end: 12px;
}
</style>
