// 匯率幣別清單 Pinia 狀態管理
import { defineStore } from "pinia";
import { getSupportCurrencyList } from "../utils/api";

const CACHE_KEY = "supportCurrencyList";
const CACHE_EXPIRE_KEY = "supportCurrencyListExpire";
const CACHE_EXPIRE_MS = 7 * 24 * 60 * 60 * 1000; // 7天

export const useCurrencyStore = defineStore("currency", {
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
      // 1. 先檢查 localStorage
      const cache = localStorage.getItem(CACHE_KEY);
      const expire = localStorage.getItem(CACHE_EXPIRE_KEY);
      const now = Date.now();
      if (cache && expire && now < Number(expire)) {
        this.supportCurrencyList = JSON.parse(cache);
        this.loaded = true;
        return;
      }
      // 2. 沒有快取才請求 API
      const res = await getSupportCurrencyList();
      this.supportCurrencyList = res.data.map((item) => ({
        label: item.toUpperCase(),
        value: item,
      }));
      this.loaded = true;
      // 3. 存入 localStorage 並設過期時間
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.supportCurrencyList));
      localStorage.setItem(
        CACHE_EXPIRE_KEY,
        (now + CACHE_EXPIRE_MS).toString()
      );
    },
  },
});
