<template>
  <v-dialog v-model="visible" persistent max-width="500">
    <v-card v-if="selectedUser">
      <v-toolbar color="primary" variant="dark" title="Edit User">
        <v-spacer></v-spacer>
        <v-btn icon @click="close" color="white"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Name"
          v-model="selectedUser.display_name"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"></v-text-field>
        <v-text-field
          label="Email"
          v-model="selectedUser.EMAIL"
          readonly
          variant="outlined"
          density="comfortable"
          append-inner-icon="mdi-lock"></v-text-field>
        <v-select
          label="Status"
          v-model="selectedUser.STATUS"
          :items="['Active', 'Inactive']"
          variant="outlined"
          density="comfortable"></v-select>

        <v-row v-if="selectedUser.STATUS == 'Active'">
          <v-col>
            <v-checkbox
              label="System Admin"
              v-model="selectedUser.IS_ADMIN"
              variant="outlined"
              density="comfortable"></v-checkbox
          ></v-col>
          <v-col>
            <v-checkbox
              v-if="!selectedUser.IS_ADMIN"
              label="Moderator"
              v-model="selectedUser.ROLE"
              value="Moderator"
              variant="outlined"
              density="comfortable"></v-checkbox
          ></v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mx-4 mb-2">
        <v-btn color="primary" variant="flat" @click="saveUser()">Save</v-btn>
        <v-spacer></v-spacer>

        <ConfirmButton
          button-text="Delete"
          button-size="default"
          button-color="error"
          button-class="mr-4"
          confirm-title="Delete User?"
          confirm-text="Are you sure you want to delete this user?"
          confirm-variant="error"
          confirm-button-text="Yes"
          @on-confirm="doDeleteUser" />

        <v-btn color="yg_sun" variant="outlined" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mapActions, mapState } from "pinia";
import { useUserAdminStore } from "../store";
import ConfirmButton from "@/components/ConfirmButton.vue";

export default {
  name: "UserEditor",
  data: () => ({}),
  computed: {
    ...mapState(useUserAdminStore, ["selectedUser"]),
    visible() {
      return this.selectedUser ? true : false;
    },
  },
  methods: {
    ...mapActions(useUserAdminStore, ["unselectUser", "saveUser", "deleteUser"]),
    close() {
      this.unselectUser();
    },

    async doDeleteUser() {
      await this.deleteUser(this.selectedUser);
      this.unselectUser();
    },
  },
};
</script>
