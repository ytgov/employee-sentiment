import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { QUESTION_URL } from "@/urls";

let m = useNotificationStore();
let api = useApiStore();

export const useResponseStore = defineStore("response", {
  state: (): ResponseStore => ({
    responses: new Array<Response>(),
    response: undefined,
  }),
  getters: {
    responseCount(state) {
      return 122;
    },
  },
  actions: {
    async initialize() {},
    async loadResponses() {
      /* await api
        .secureCall("get", QUESTION_URL)
        .then((resp) => {
          this.responses = resp.data;

        })
        .catch(); */
      this.responses.push({
        SID: 1,
        question: "What are you doing this weekend?",
        date: "Yesterday",
        status: "Moderated",
        answer: "Netflix and chill you moron",
        answer_moderated: "Netflix and chill you moron",
      });
      this.responses.push({
        SID: 1,
        question: "What are you doing this weekend?",
        date: "3 days ago",
        status: "Unmoderated",
        answer: "Going to the lake",
        answer_moderated: "Going to the lake",
      });
    },
    async create() {
      await api
        .secureCall("post", QUESTION_URL, this.response)
        .then(async (resp) => {
          await this.loadResponses();
        })
        .catch();
    },
    async update() {
      if (this.response) {
        await api
          .secureCall("put", `${QUESTION_URL}/${this.response.SID}`, this.response)
          .then(async (resp) => {
            await this.loadResponses();
          })
          .catch();
      }
    },
    async delete() {
      if (this.response) {
        await api
          .secureCall("delete", `${QUESTION_URL}/${this.response.SID}`, this.response)
          .then(async (resp) => {
            await this.loadResponses();
          })
          .catch();
      }
    },
    select(item: Response) {
      console.log("selected", item);
      this.response = item;
    },
    unselect() {
      this.response = undefined;
    },
  },
});

export interface ResponseStore {
  responses: Response[];
  response: Response | undefined;
}

export interface Response {
  SID: number;
  question: string;
  date: string;
  status: string;
  answer: string;
  answer_moderated: string;
}
