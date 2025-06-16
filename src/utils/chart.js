// Chart.js 資料處理與顏色工具
// 用於產生 dataset 與顏色處理，供 useChartData 等 composable 使用
import { chartAreaGradient } from "../charts/ChartjsConfig";
import { adjustColorOpacity, getCssVariable } from "./Utils";

/**
 * 產生 Chart.js dataset 結構
 * @param {Array} data - Y 軸資料
 * @returns {Object} dataset 物件
 */
export function createLineDataset(data) {
  return {
    data: data,
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
          color: adjustColorOpacity(getCssVariable("--color-violet-500"), 0.2),
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

const chartUtils = {
  createLineDataset,
};

export default chartUtils;
