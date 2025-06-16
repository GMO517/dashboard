import currency from "./currency";

/**
 * 計算指定法幣的匯率
 * @param {number} days - 天數
 * @param {string} currency - 幣值
 * @param {string} base - 基準幣值
 * @returns {Array} 匯率資料
 */
export async function calExchangeRate(days, currencyName, base) {
  const prices = await currency.getHistory(days, currencyName);
  const basePrices = await currency.getHistory(days, base);

  const exchangeRate = prices.map(function (price, index) {
    return [price[0], price[1] / basePrices[index][1]];
  });
  return exchangeRate;
}

const exchange = {
  calExchangeRate,
};

export default exchange;
