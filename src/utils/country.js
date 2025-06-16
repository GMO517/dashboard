import { CountryAPI } from "./api";

/**
 * 取得所有國家資料
 * @returns {Array} 國家資料
 */
export async function getAllCountriesName() {
  const res = await CountryAPI.get("/all?fields=name");
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

const country = {
  getAllCountriesName,
  getCountryDetail,
};

export default country;
