import { CountryAPI } from "./api";

/**
 * 取得所有國家資料（含譯名）
 * @returns {Array} 國家資料
 */
export async function getAllCountriesName() {
  const res = await CountryAPI.get("/all?fields=name,translations");
  return res.data;
}

/**
 * 取得指定國家的人口、面積資料
 * @param {string} country - 國家名稱
 * @returns {Object} 國家資料
 */
export async function getCountryDetail(country) {
  return CountryAPI.get(`/name/${country}?fields=population,area`);
}

// 特定國家名稱例外處理對照表
export const specialCountryNameMapping = {
  Taiwan: "台灣",
  China: "中國",
  "Hong Kong": "香港",
  Macau: "澳門",
  Singapore: "新加坡",
};

// 處理特定國家名稱的翻譯
export const translateSpecialCountryName = (name) => {
  return specialCountryNameMapping[name] || name;
};

const country = {
  getAllCountriesName,
  getCountryDetail,
  translateSpecialCountryName,
};

export default country;
