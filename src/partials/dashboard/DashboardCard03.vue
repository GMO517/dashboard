<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl"
  >
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          各國確診數對比(臺、美、日)
        </h2>
        <!-- 
        
          <li>
            <a
              class="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
              href="#0"
              >Option 1</a
            >
          </li>
          <li>
            <a
              class="font-medium text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 flex py-1 px-3"
              href="#0"
              >Option 2</a
            >
          </li>
          <li>
            <a
              class="font-medium text-sm text-red-500 hover:text-red-600 flex py-1 px-3"
              href="#0"
              >Remove</a
            >
          </li>
        </EditMenu> -->
      </header>
      <div
        class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1"
      >
        最高單月確診人數
      </div>
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          {{ formatTWNumber(maxCases) }}
        </div>
      </div>
    </div>
    <!-- Chart built with Chart.js 3 -->
    <div class="grow max-sm:max-h-[128px] xl:max-h-[128px]">
      <!-- Change the height attribute to adjust the chart height -->
      <LineChart :data="chartData" width="389" height="128" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import LineChart from "../../charts/LineChart04.vue";
import EditMenu from "../../components/DropdownEditMenu.vue";
import covidData from "../../utils/covidData";
import { formatTWNumber } from "../../utils/Utils";
// Import utilities
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";

const chartData = ref({
  labels: [
    "12-01-2022",
    "01-01-2023",

    "01-01-2024",
    "02-01-2024",
    "03-01-2024",
    "04-01-2024",
    "05-01-2024",
    "06-01-2024",
    "07-01-2024",
    "08-01-2024",
    "09-01-2024",
    "10-01-2024",
    "11-01-2024",
    "12-01-2024",
    "01-01-2025",
  ],
  datasets: [
    // Indigo line
    {
      data: [
        540, 466, 540, 466, 385, 432, 334, 334, 289, 289, 200, 289, 222, 289,
        289, 403, 554, 304, 289, 270, 134, 270, 829, 344, 388, 364,
      ],
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
    },
    // Gray line
    {
      data: [
        689, 562, 477, 477, 477, 477, 458, 314, 430, 378, 430, 498, 642, 350,
        145, 145, 354, 260, 188, 188, 300, 300, 282, 364, 660, 554,
      ],
      borderColor: adjustColorOpacity(getCssVariable("--color-gray-500"), 0.25),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 3,
      pointBackgroundColor: adjustColorOpacity(
        getCssVariable("--color-gray-500"),
        0.25
      ),
      pointHoverBackgroundColor: adjustColorOpacity(
        getCssVariable("--color-gray-500"),
        0.25
      ),
      pointBorderWidth: 0,
      pointHoverBorderWidth: 0,
      clip: 20,
      tension: 0.2,
    },
  ],
});

const countries = ref(["Taiwan", "United States", "Japan"]);
const countryNames = ["台灣", "美國", "日本"];
const maxCases = ref(0);
const setChartData = async () => {
  const data = await covidData.getAllCovidDataByCountries(countries.value);
  const sums = [];
  data.forEach((item) => {
    sums.push(covidData.getMonthlyCovidSummary(item.timeline));
  });
  // 計算所有國家 cases 的最大值
  let max = 0;
  sums.forEach((item) => {
    const localMax = Math.max.apply(null, item.cases);
    if (localMax > max) max = localMax;
  });
  maxCases.value = max;
  chartData.value = {
    labels: sums[0].labels,
    datasets: sums.flatMap(function (item, idx) {
      return [
        {
          label: countryNames[idx] + "確診人數",
          data: item.cases,
          yAxisID: "y",
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
        {
          label: countryNames[idx] + " 死亡",
          data: item.deaths,
          yAxisID: "y1",
          borderColor: adjustColorOpacity(
            getCssVariable("--color-gray-500"),
            0.25
          ),
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          pointBackgroundColor: adjustColorOpacity(
            getCssVariable("--color-gray-500"),
            0.25
          ),
          pointHoverBackgroundColor: adjustColorOpacity(
            getCssVariable("--color-gray-500"),
            0.25
          ),
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,
          clip: 20,
          tension: 0.2,
        },
      ];
    }),
  };
};
onMounted(async () => {
  await setChartData();
});
</script>
