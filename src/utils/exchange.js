import { getHistory } from "./api";

/**
 * 計算指定法幣的匯率
 * @param {number} days - 天數
 * @param {string} currency - 幣值
 * @param {string} base - 基準幣值
 * @returns {Array} 匯率資料
 */
export async function calExchangeRate(days, currency, base) {
  const prices = await getHistory(days, currency);
  const basePrices = await getHistory(days, base);

  const exchangeRate = prices.map(function (price, index) {
    return [price[0], price[1] / basePrices[index][1]];
  });
  return exchangeRate;
}
