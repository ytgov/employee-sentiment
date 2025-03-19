<template>
  <v-card elevation="3" color="#F2A90066">
    <v-card-text style="text-align: right">
      <v-icon class="float-left" style="font-size: 90px; opacity: 25%; position: absolute; left: 0px; margin-top: 30px"
        >mdi-lightbulb</v-icon
      >

      <div style="">
        <div style="font-size: 16px; line-height: 21px">
          <div>{{ question.TITLE }}</div>
          <v-divider class="mb-1"></v-divider>
          <span style="font-size: 13px"
            >{{ participantStats.opinionators }} Opinionators, {{ participantStats.raters }} Raters -
          </span>
          <span style="font-weight: 700">{{ stateTitle(question.STATE) }}</span>
        </div>

        <v-row class="mt-1" style="margin-left: 70px">
          <v-col cols="6" md="4">
            <v-card
              v-if="isAdminOrOwner"
              color="#ffffff88"
              :border="true"
              flat
              class="fill-height"
              @click.stop="goToResults">
              <v-card-text class="pt-0 pb-1">
                <div class="text-right text-no-wrap">
                  <v-spacer />
                  <span style="font-size: 40px">{{ ratingCountForQuestion(question.ID) }}</span
                  ><br />
                  Ratings
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" md="4">
            <v-card color="#ffffff88" :border="true" flat class="fill-height" @click="goToModeration">
              <v-card-text class="pt-0 pb-1">
                <div class="text-right text-no-wrap">
                  <v-spacer />
                  <span style="font-size: 40px">{{ moderatedCountForQuestion(question.ID) }}</span
                  ><br />
                  Moderated
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6" md="4">
            <v-card color="#ffffff88" :border="true" flat class="fill-height" @click="goToUnModeration">
              <v-card-text class="pt-0 pb-1">
                <div class="text-right text-no-wrap">
                  <span style="font-size: 40px">{{ unmoderatedCountForQuestion(question.ID) }}</span
                  ><br />
                  Unmoderated
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { useQuestionStore } from "@/modules/administration/modules/question/store";
import { mapActions, mapState } from "pinia";
import { useResponseStore } from "../modules/response/store";
import { useParticipantsStore } from "../modules/participants/store";
import { useUserStore } from "@/store/UserStore";

export default {
  name: "ModeratorCard",
  props: ["question"],
  data: () => ({
    participantStats: { raters: 0, opinionators: 0 },
  }),
  computed: {
    ...mapState(useUserStore, ["user", "isAdmin"]),
    isAdminOrOwner() {
      if (this.isAdmin) return true;
      if (this.user && this.question.owners.includes(this.user.EMAIL)) return true;
      return false;
    },
  },
  async mounted() {
    this.participantStats = await this.getParticipantStats(this.question.ID);
  },
  methods: {
    ...mapActions(useQuestionStore, ["stateTitle"]),
    ...mapActions(useParticipantsStore, ["getParticipantStats"]),
    ...mapActions(useResponseStore, [
      "moderatedCountForQuestion",
      "unmoderatedCountForQuestion",
      "ratingCountForQuestion",
    ]),

    goToModeration() {
      this.$router.push(`/administration/moderation/${this.question.ID}?status=Moderated`);
    },
    goToUnModeration() {
      this.$router.push(`/administration/moderation/${this.question.ID}?status=Unmoderated`);
    },

    goToResults() {
      this.$router.push(`/administration/results/${this.question.ID}`);
    },
  },
};
</script>
