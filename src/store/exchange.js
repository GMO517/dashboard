import { defineStore } from "pinia";
import currency from "./currency";

export const useExchangeStore = defineStore("exchange", {
  state: () => ({
    historyCache: {},
  }),
  actions: {
    async fetchHistory(days, currencyName) {
      const key = currencyName + "_" + days;
      if (this.historyCache[key]) {
        return this.historyCache[key];
      }
      const data = await currency.getHistory(days, currencyName);
      this.historyCache[key] = data;
      return data;
    },
  },
});

const exchangeStore = {
  useExchangeStore,
  // 其他 export 的 function/const 也加進來
};

export default exchangeStore;
