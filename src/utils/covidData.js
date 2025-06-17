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

export const getAllCovidData = async (country) => {
  const res = await Covid19API.get(`/historical/${country}?lastdays=all`);
  return res.data;
};

// 取得每月彙總資料
export const getMonthlyCovidSummary = (timeline) => {
  const monthly = {};
  const allDates = Object.keys(timeline.cases);

  allDates.forEach((dateStr) => {
    // 解析日期
    const [month, day, year] = dateStr.split("/");
    const fullYear = year.length === 2 ? "20" + year : year;
    const ym = `${fullYear}-${month.padStart(2, "0")}`;
    // 每月只保留最後一天
    if (!monthly[ym] || new Date(dateStr) > new Date(monthly[ym].dateStr)) {
      monthly[ym] = {
        dateStr,
        cases: timeline.cases[dateStr],
        deaths: timeline.deaths[dateStr],
        recovered: timeline.recovered[dateStr],
      };
    }
  });

  // 依年月排序
  const labels = Object.keys(monthly).sort();
  const cases = [];
  const deaths = [];
  const recovered = [];
  let prevCases = 0,
    prevDeaths = 0,
    prevRecovered = 0;

  labels.forEach((ym) => {
    const cur = monthly[ym];
    cases.push(cur.cases - prevCases);
    deaths.push(cur.deaths - prevDeaths);
    recovered.push(cur.recovered - prevRecovered);
    prevCases = cur.cases;
    prevDeaths = cur.deaths;
    prevRecovered = cur.recovered;
  });

  return { labels, cases, deaths, recovered };
};

const covidData = {
  getCovidData,
  getAllCovidData,
  getMonthlyCovidSummary,
};

export default covidData;
