import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { QUESTION_URL } from "@/urls";

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
    answers: [""],
    responses: [] as any[],
    results: [] as any[],
  }),
  getters: {
    allValid(state) {
      return true;
      //return state.answer && state.answer.length > 0;
    },
    answerCount(state) {
      return state.answers.filter((a) => a.length > 0).length;
    },
  },
  actions: {
    async loadSurvey(
      token: string,
      requiredState?: number[],
      requireResponder: boolean = false,
      requireRater: boolean = false
    ) {
      this.isLoading = true;

      api
        .call("get", `${QUESTION_URL}/${token}`)
        .then((resp) => {
          if (requiredState && requiredState.includes(resp.data?.STATE)) {
            if (requireResponder && !resp.data.p_is_responder) return;
            if (requireRater && !resp.data.p_is_rater) return;

            this.question = resp.data;
          }
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

      for (let answer of this.answers.filter((a) => a.trim().length > 0)) {
        api
          .call("post", `${QUESTION_URL}/${token}`, { answer: answer })
          .then((resp) => {
            if (!resp.error) {
              this.question = resp.data;
              this.answers = [];
              m.notify({ text: "Answer submitted", variant: "success" });
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
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
  answers_remaining?: number;
}
