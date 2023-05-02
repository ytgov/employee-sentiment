import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { PROFILE_URL, SURVEY_URL, USERS_URL } from "@/urls";

let m = useNotificationStore();
let api = useApiStore();

export const useSurveyStore = defineStore("survey", {
  state: (): SurveyStore => ({
    surveys: new Array<Survey>(),
    survey: undefined,
  }),
  getters: {
    surveyCount(state) {
      return 15;
      //return state.surveys.length;
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
    async loadSurveys() {
      await api
        .secureCall("get", SURVEY_URL)
        .then((resp) => {
          this.surveys = resp.data;
        })
        .catch();
    },
    async create() {
      await api
        .secureCall("post", SURVEY_URL, this.survey)
        .then(async (resp) => {
          await this.loadSurveys();
        })
        .catch();
    },
    async update() {
      if (this.survey) {
        await api
          .secureCall("put", `${SURVEY_URL}/${this.survey.SID}`, this.survey)
          .then(async (resp) => {
            await this.loadSurveys();
          })
          .catch();
      }
    },
    async delete() {
      if (this.survey) {
        await api
          .secureCall("delete", `${SURVEY_URL}/${this.survey.SID}`, this.survey)
          .then(async (resp) => {
            await this.loadSurveys();
          })
          .catch();
      }
    },
  },
});

export interface SurveyStore {
  surveys: Survey[];
  survey: Survey | undefined;
}

export interface Survey {
  SID: number;
  questions: Question[];
}
export interface Question {
  QID: number;
  SID: number;
  ASK: string;
  OPTIONAL: number;
  TYPE: string;
  SELECTION_JSON: string;
}
