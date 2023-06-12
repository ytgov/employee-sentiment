import { defineStore } from "pinia";

import { useNotificationStore } from "@/store/NotificationStore";
import { useApiStore } from "@/store/ApiStore";
import { ANSWER_URL } from "@/urls";

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
      await api
        .secureCall("get", ANSWER_URL)
        .then((resp) => {
          this.responses = resp.data;
        })
        .catch();
    },

    async update() {
      if (this.response) {
        await api
          .secureCall("put", `${ANSWER_URL}/${this.response.ID}`, this.response)
          .then(async (resp) => {
            await this.loadResponses();
          })
          .catch();
      }
    },
    select(item: Response) {
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
  ID: number;
  HEADING: string;
  ANSWER_TEXT: string;
  MODERATED_TEXT: string;
  CATEGORY: string | string[];
  DELETED_FLAG: number;
  DONE_MODERATING: number;
  QUESTION_ID: number;
}
