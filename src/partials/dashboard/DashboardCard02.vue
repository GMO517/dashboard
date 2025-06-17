<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl"
  >
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          新冠確診人數
        </h2>
        <!-- <EditMenu align="right" class="relative inline-flex">
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
        確診
      </div>
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          $17,489
        </div>
        <div
          class="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full"
        >
          -14%
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
import LineChart from "../../charts/LineChart03.vue";
import EditMenu from "../../components/DropdownEditMenu.vue";
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";
import covidData from "../../utils/covidData";

const chartData = ref({
  labels: [
    "12-01-2022",
    "01-01-2023",
    "02-01-2023",
    "03-01-2023",
    "04-01-2023",
    "05-01-2023",
    "06-01-2023",
    "07-01-2023",
    "08-01-2023",
    "09-01-2023",
    "10-01-2023",
    "11-01-2023",
    "12-01-2023",
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
        622, 622, 426, 471, 365, 365, 238, 324, 288, 206, 324, 324, 500, 409,
        409, 273, 232, 273, 500, 570, 767, 808, 685, 767, 685, 685,
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
        732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192,
        154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532,
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

const fetchCovidData = async () => {
  const data = await covidData.getCovidData("Taiwan");
  const timeLabels = [];
  const cases = [];
  const deaths = [];

  // 處理確診數資料
  for (const date in data.timeline.cases) {
    // 處理日期格式
    const [month, day, year] = date.split("/");
    const fullYear = "20" + year; // 將 '23' 轉換為 '2023'
    const fullMonth = month.length === 1 ? "0" + month : month;
    const fullDay = day.length === 1 ? "0" + day : day;
    const formattedDate = `${fullMonth}-${fullDay}-${fullYear}`;

    timeLabels.push(formattedDate);
    cases.push(data.timeline.cases[date]);
    deaths.push(data.timeline.deaths[date]);
  }

  chartData.value = {
    labels: timeLabels,
    datasets: [
      {
        label: "確診人數",
        data: cases,
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
        label: "死亡人數",
        data: deaths,
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
    ],
  };
  console.log("chartData.value", chartData.value);
  console.log("timeLabels", timeLabels);
  console.log("cases", cases);
  console.log("deaths", deaths);
};
// 測試 COVID-19 API
onMounted(() => {
  fetchCovidData();
});
</script>
