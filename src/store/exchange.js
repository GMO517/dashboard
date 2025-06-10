import { defineStore } from "pinia";
import { getHistory } from "../utils/api";

export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    historyCache: {},
  }),
  actions: {
    async fetchHistory(days, currency) {
      const key = currency + "_" + days;
      if (this.historyCache[key]) {
        return this.historyCache[key];
      }
      const data = await getHistory(days, currency);
      this.historyCache[key] = data;
      return data;
    },
  },
});
