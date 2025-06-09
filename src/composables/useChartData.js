// CoinGecko API 統一管理
import { ref } from "vue";
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { adjustColorOpacity, getCssVariable } from "../utils/Utils";
import { getUsdtTwdHistory } from "../utils/api";

// 本 composable 用於 Chart.js 資料處理，預設使用 CoinGecko API
// fetchChartData：呼叫 getUsdtTwdHistory 取得近 N 天價格，並組裝 chartData 給 Chart.js
// setDailyInfo：設定當日價格資訊
// getUsdtTwdHistory 來源：src/composables/useUsdtTwdChart.js，呼叫 CoinGecko API
export function useChartData() {
  // 當前匯率
  const currentRate = ref(0);
  // 當日漲跌百分比
  const dailyChangePct = ref(0);
  // 是否為上漲 漲(綠)=true 跌(紅)=false
  const isDailyGrowth = ref(true);

  // Chart.js 資料格式
  const chartData = ref({
    labels: [], // X軸標籤（日期）
    datasets: [
      // Indigo 線條
      {
        data: [], // Y軸資料（匯率）
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            {
              stop: 0,
              color: adjustColorOpacity(
                getCssVariable("--color-violet-500"),
                0
              ),
            },
            {
              stop: 1,
              color: adjustColorOpacity(
                getCssVariable("--color-violet-500"),
                0.2
              ),
            },
          ]);
        },
        borderColor: getCssVariable("--color-violet-500"),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable("--color-violet-500"),
        pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  });

  // 設定每日資訊（當前匯率、漲跌百分比、漲跌方向）
  function setDailyInfo(prices) {
    // 設定目前匯率
    currentRate.value = prices[prices.length - 1][1].toFixed(2);
    // 計算每日變動百分比
    dailyChangePct.value =
      (
        (prices[prices.length - 1][1] - prices[prices.length - 2][1]) /
        prices[prices.length - 2][1]
      ).toFixed(4) * 100;
    // 判斷是否為上漲
    isDailyGrowth.value = dailyChangePct.value > 0;
  }

  // 建立 Chart.js dataset 結構
  function createDataset(data) {
    return {
      data,
      fill: true,
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        return chartAreaGradient(ctx, chartArea, [
          {
            stop: 0,
            color: adjustColorOpacity(getCssVariable("--color-violet-500"), 0),
          },
          {
            stop: 1,
            color: adjustColorOpacity(
              getCssVariable("--color-violet-500"),
              0.2
            ),
          },
        ]);
      },
      borderColor: getCssVariable("--color-violet-500"),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: getCssVariable("--color-violet-500"),
      pointHoverBackgroundColor: getCssVariable("--color-violet-500"),
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
      clip: 20,
      tension: 0.2,
    };
  }

  // 取得近一年 USDT/TWD 價格資料，並填入 chartData（CoinGecko）
  function fetchChartData(days) {
    return getUsdtTwdHistory(days)
      .then(function (prices) {
        // 轉換 API 回傳資料為 Chart.js 格式
        const newLabels = prices.map(function (item) {
          var d = new Date(item[0]);
          return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        });
        const newData = prices.map(function (item) {
          return item[1];
        });
        chartData.value = {
          labels: newLabels,
          datasets: [createDataset(newData)],
        };
        // 設定當日資訊
        setDailyInfo(prices);
      })
      .catch(function (err) {
        // 錯誤處理
        console.log("CoinGecko API 錯誤:", err);
      });
  }

  // 預設載入近一年資料
  fetchChartData(365);

  return {
    chartData,
    currentRate,
    dailyChangePct,
    isDailyGrowth,
    setDailyInfo,
    fetchChartData,
  };
}
