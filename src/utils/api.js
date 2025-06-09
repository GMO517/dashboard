// CoinGecko API 統一管理
import axios from "axios";
// 取得 USDT/TWD 近 N 天價格資料（CoinGecko）
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

export function getHistory(days, currency) {
  return axios
    .get("https://api.coingecko.com/api/v3/coins/tether/market_chart", {
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

export function calExchangeRate(days,currency,base) {
  const prices = getHistory(days,currency);
  const basePrices = getHistory(days,base);

  const exchangeRate = prices.map((price,index) => {
    return [price[0],price[1]/basePrices[index][1]];
  });

  return exchangeRate;
}
