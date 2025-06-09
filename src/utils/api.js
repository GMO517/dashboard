// CoinGecko API 統一管理
// UTF-8 中文註解
import axios from "axios";

// 取得 USDT/TWD 近 N 天價格資料
export function getUsdtTwdHistory(days) {
  return axios
    .get("https://api.coingecko.com/api/v3/coins/tether/market_chart", {
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

/**
 * 取得指定幣種的歷史價格資料
 * @param {number} days 歷史天數
 * @param {string} vs_currency 匯率幣值
 * @param {string} compare_to 比較幣種
 * @returns {Promise<Array>} 歷史價格資料
 */
export function getHistory(days, vs_currency, compare_to) {
  return axios
    .get("https://api.coingecko.com/api/v3/coins/tether/market_chart", {
      params: {
        vs_currency: vs_currency,
        days: days,
        compare_to: compare_to,
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
