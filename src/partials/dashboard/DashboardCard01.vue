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
        rates
      </div>
      <div class="flex items-start">
        <div class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          ${{ currentRate }}
        </div>
        <div
          v-if="isDailyGrowth"
          class="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full"
        >
          {{ dailyChangePct }}%
        </div>
        <div
          v-else
          class="text-sm font-medium text-red-700 px-1.5 bg-red-500/20 rounded-full"
        >
          {{ dailyChangePct }}%
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
import LineChart from "../../charts/LineChart01.vue";
import EditMenu from "../../components/DropdownEditMenu.vue";

// 匯率圖表 Composable
import { useChartData } from "../../composables/useChartData";

// 解構出所有響應式資料
const { chartData, currentRate, dailyChangePct, isDailyGrowth } =
  useChartData();
</script>
