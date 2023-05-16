import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { QUESTION_URL } from "@/urls";

let m = useNotificationStore();
let api = useApiStore();

export const useEmailerStore = defineStore("emailer", {
  state: (): QuestionStore => ({
    questions: new Array<Question>(),
    question: undefined,
    isLoading: false,
  }),
  getters: {
    questionCount(state) {
      if (state && state.questions) return state.questions.length;
      return 0;
    },
    responseCount(state) {
      return 122;
    },
    moderateCount(state) {
      return 2;
    },
  },
  actions: {
    async initialize() {},
    async loadQuestions() {
      await api
        .secureCall("get", QUESTION_URL)
        .then((resp) => {
          this.questions = resp.data;
        })
        .catch();
    },
    async create() {
      await api
        .secureCall("post", QUESTION_URL, this.question)
        .then(async (resp) => {
          await this.loadQuestions();
        })
        .catch();
    },
    async update() {
      if (this.question) {
        await api
          .secureCall("put", `${QUESTION_URL}/${this.question.ID}`, this.question)
          .then(async (resp) => {
            await this.loadQuestions();
          })
          .catch();
      }
    },
    async delete() {
      if (this.question) {
        await api
          .secureCall("delete", `${QUESTION_URL}/${this.question.ID}`, this.question)
          .then(async (resp) => {
            await this.loadQuestions();
          })
          .catch();
      }
    },
    select(item: Question) {
      this.question = item;
    },
    unselect() {
      this.question = undefined;
    },
  },
});

export interface QuestionStore {
  questions: Question[];
  question: Question | undefined;
  isLoading: boolean;
}

export interface Question {
  ID?: number;
  TITLE: string;
  DISPLAY_TEXT: string;
  CREATE_DATE: Date;
  OWNER: string;
  STATE: number;
  MAX_ANSWERS: number;
  RATINGS_PER_TRANCHE: number;
  CURRENT_RATING_TRANCHE: number;
}
