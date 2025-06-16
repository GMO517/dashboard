// CoinGecko API 統一管理
import axios from "axios";

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

// CoinGecko API
export const CoinGeckoAPI = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

// Country API
export const CountryAPI = axios.create({
  baseURL: "https://restcountries.com/v3.1",
});
