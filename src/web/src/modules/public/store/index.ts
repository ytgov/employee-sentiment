import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL, USERS_URL } from "@/urls";

let m = useNotificationStore();

export const usePublicStore = defineStore("public", {
  state: () => ({
    survey: {
      survey: {
        PAGE_TITLE: "We are curious about your free time...",
        DESCRIPTION: "This topic couldn't be more fun!",
        PAGE_INTRO: "We want to judge how much fun you have on the weekends. Please be truthful, this is important.",
      },
      questions: [
        {
          OPTIONAL: 0,
          TYPE: "free-text",
          SELECTION_JSON: "",
          ASK: "What are you doing this weekend?",
          answer: "",
        },
      ],
    },
  }),
  getters: {
    allValid(state) {
      if (state.survey && state.survey.questions) {
        for (let q of state.survey.questions) {
          //if ((q as any).isValid()) continue;
         // else return false;
        }
        return true;
      }

      return false;
    },
  },
  actions: {
    async loadSurvey(token: number) {
      console.log("Loading Survey", token);

      for (let q of this.survey.questions) {
        (q as any).isValid = () => {
          return q.answer && q.answer.length > 0;
        };
      }
    },
  },
});
