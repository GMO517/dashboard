<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl"
  >
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          匯率
        </h2>
        <EditMenu align="right" class="relative inline-flex">
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
        </EditMenu>
      </header>
      <div
        class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1"
      >
        Sales
      </div>
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          $24,780
        </div>
        <div
          class="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full"
        >
          +49%
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

<script>
import { ref } from "vue";
import { chartAreaGradient } from "../../charts/ChartjsConfig";
import LineChart from "../../charts/LineChart01.vue";
import EditMenu from "../../components/DropdownEditMenu.vue";

// Import utilities
import { adjustColorOpacity, getCssVariable } from "../../utils/Utils";
import { getUsdtTwdHistory } from "../../utils/api";

export default {
  name: "DashboardCard01",
  components: {
    LineChart,
    EditMenu,
  },
  setup() {
    const chartData = ref({
      labels: [],
      datasets: [
        // Indigo line
        {
          data: [],
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

    // 改用統一 API 管理方式取得 CoinGecko 資料
    getUsdtTwdHistory(365)
      .then(function (prices) {
        console.log("統一管理取得的近7天 TWD/USDT 價格資料:", prices);
        const newLabels = prices.map(function (item) {
          var d = new Date(item[0]);
          return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        });
        const newData = prices.map(function (item) {
          return item[1];
        });
        chartData.value = {
          labels: newLabels,
          datasets: [
            {
              data: newData,
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
        };
      })
      .catch(function (err) {
        console.log("CoinGecko API 錯誤:", err);
      });

    return {
      chartData,
    };
  },
};
</script>
