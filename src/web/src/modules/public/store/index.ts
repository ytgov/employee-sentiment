import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL, QUESTION_URL, USERS_URL } from "@/urls";

let m = useNotificationStore();
let api = useApiStore();

export const usePublicStore = defineStore("public", {
  state: () => ({
    isLoading: false,
    survey: {
      survey: {
        PAGE_TITLE: "We are curious about your free time...",
        DESCRIPTION: "This topic couldn't be more fun!",
        PAGE_INTRO: "We want to judge how much fun you have on the weekends. Please be truthful, this is important.",
      },
    },
    question: undefined as Question | undefined,
    answer: "",
    responses: [] as any[],
    results: [] as any[],
  }),
  getters: {
    allValid(state) {
      return state.answer && state.answer.length > 0;
    },
  },
  actions: {
    async loadSurvey(token: string) {
      this.isLoading = true;

      api
        .call("get", `${QUESTION_URL}/${token}`)
        .then((resp) => {
          this.question = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    loadSurveyResults(questionId: string) {
      this.isLoading = true;

      api
        .call("get", `${QUESTION_URL}/${questionId}/results`)
        .then((resp) => {
          this.results = resp.data.answers;
          this.question = resp.data.question;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    loadSurveyInspire(token: string) {
      this.isLoading = true;

      api
        .call("get", `${QUESTION_URL}/${token}/inspire`)
        .then((resp) => {
          this.results = resp.data.answers;
          this.question = resp.data.question;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async loadResponses(token: string) {
      console.log("Loading Responses", token);
      this.isLoading = true;

      api
        .call("get", `${QUESTION_URL}/${token}/responses`)
        .then((resp) => {
          this.responses = resp.data;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async submit(token: string) {
      this.isLoading = true;
      api
        .call("post", `${QUESTION_URL}/${token}`, { answer: this.answer })
        .then((resp) => {
          if (!resp.error) {
            this.answer = "";
            this.question = resp.data;
            m.notify({ text: "Answer submitted", variant: "success" });
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async saveRatings(token: string) {
      for (let resp of this.responses) {
        api
          .call("post", `${QUESTION_URL}/${token}/responses/${resp.ID}`, {
            rating: resp.rating,
          })
          .then((resp) => {
            this.question = resp.data;
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  },
});

export interface Question {
  ID: number;
  TITLE: string;
  DISPLAY_TEXT: string;
  CREATE_DATE: Date;
  OWNER: string;
  STATE: number;
  MAX_ANSWERS: number;
  RATINGS_PER_TRANCHE: number;
  CURRENT_RATING_TRANCHE: number;
}
