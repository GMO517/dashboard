// 匯率幣別清單 Pinia 狀態管理
import { defineStore } from "pinia";
import { getSupportCurrencyList } from "../utils/api";

export const useCurrencyStore = defineStore("currencyNameList", {
  // state 用來存放全域響應式資料
  state: () => ({
    // 支援的幣別清單，供全站共用
    supportCurrencyList: [],
    // 是否已經載入過，避免重複請求
    loaded: false,
  }),

  // actions 用來定義可呼叫的函式（通常是異步操作或邏輯處理）
  actions: {
    async fetchCurrencyList() {
      // 如果已經載入過就不重複請求
      if (this.loaded) return;
      // 呼叫 API 取得清單
      const res = await getSupportCurrencyList();
      // 將回傳的字串陣列轉成 { label, value } 物件陣列
      this.supportCurrencyList = res.data.map(function (item) {
        return {
          label: item.toUpperCase(), // 顯示大寫
          value: item,
        };
      });
      // 標記已載入
      this.loaded = true;
    },
  },
});
