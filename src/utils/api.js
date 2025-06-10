// CoinGecko API 統一管理
import axios from "axios";
import { ElNotification } from "element-plus";
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

// 判斷是否為 API 限流錯誤
function isRateLimitError(data) {
  return (
    (data && data.error_code === 429) ||
    (data &&
      data.error_message &&
      data.error_message.indexOf("Rate Limit") !== -1) ||
    (data &&
      data.status &&
      (data.status.error_code === 429 ||
        (data.status.error_message &&
          data.status.error_message.indexOf("Rate Limit") !== -1)))
  );
}

/**
 * 取得幣值價格資料
 * @param {number} days - 天數
 * @param {string} currency - 幣值
 * @returns {Array} 價格資料
 */
export async function getHistory(days, currency) {
  await sleep(1000);
  try {
    const res = await axios.get("/api/v3/coins/tether/market_chart", {
      params: {
        vs_currency: currency,
        days: days,
      },
    });
    if (isRateLimitError(res.data)) {
      ElNotification({
        title: "API限制",
        message: "已達到API限制，請稍後再試",
        type: "error",
      });
      throw new Error("API Rate Limit Exceeded");
    }
    if (res.data && res.data.prices) {
      return res.data.prices;
    } else {
      throw new Error("找不到 CoinGecko 價格資料");
    }
  } catch (err) {
    const data = err.response && err.response.data ? err.response.data : {};
    if (isRateLimitError(data)) {
      ElNotification({
        title: "API限制",
        message: "已達到API限制，請稍後再試",
        type: "error",
      });
    } else {
      ElNotification({
        title: "錯誤",
        message: "查詢匯率失敗, 請稍後再試",
        type: "error",
      });
    }
    throw err;
  }
}

//取得支援匯率的文字清單
export async function getSupportCurrencyList() {
  try {
    const res = await axios.get("/api/v3/simple/supported_vs_currencies");
    if (isRateLimitError(res.data)) {
      ElNotification({
        title: "API限制",
        message: "已達到API限制，請稍後再試",
        type: "error",
      });
      throw new Error("API Rate Limit Exceeded");
    }
    return res;
  } catch (err) {
    ElNotification({
      title: "錯誤",
      message: "查詢支援幣別失敗, 請稍後再試",
      type: "error",
    });
    throw err;
  }
}
