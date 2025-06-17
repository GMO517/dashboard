import { Covid19API } from "./api";

// 特定國家名稱例外處理對照表
export const showDataCountry = {
  Taiwan: "台灣",
  China: "中國",
  "Hong Kong": "香港",
  Macau: "澳門",
  Singapore: "新加坡",
};

export const getCovidData = async (country) => {
  const res = await Covid19API.get(`/historical/${country}`);
  return res.data;
};

const covidData = {
  getCovidData,
};

export default covidData;
