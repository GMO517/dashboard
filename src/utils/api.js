// CoinGecko API 統一管理
import axios from "axios";

/**
 * 取得 USDT/TWD 近 N 天價格資料（CoinGecko）
 * @param {number} days - 天數
 * @returns {Array} 價格資料
 */
export function getUsdtTwdHistory(days) {
  return axios
    .get("/api/v3/coins/tether/market_chart", {
      params: {
        vs_currency: "twd",
        days: days,
      },
    })
    .then(function (res) {
      if (res.data && res.data.prices) {
        return res.data.prices;
      } else {
        throw new Error("找不到 CoinGecko 價格資料");
      }
    });
}

// sleep 工具函式
function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

/**
 * 取得幣值價格資料
 * @param {number} days - 天數
 * @param {string} currency - 幣值
 * @returns {Array} 價格資料
 */
export async function getHistory(days, currency) {
  // 每次請求都自動延遲 300ms，避免 API 被限制
  await sleep(1000);
  return axios
    .get("/api/v3/coins/tether/market_chart", {
      params: {
        vs_currency: currency,
        days: days,
      },
    })
    .then(function (res) {
      if (res.data && res.data.prices) {
        return res.data.prices;
      } else {
        throw new Error("找不到 CoinGecko 價格資料");
      }
    });
}

//取得支援匯率的文字清單
export function getSupportCurrencyList() {
  return axios.get("/api/v3/simple/supported_vs_currencies");
}
