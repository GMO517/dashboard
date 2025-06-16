<!-- 匯率卡片組件 -->
<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl"
  >
    <div class="px-5 pt-5">
      <header class="flex justify-between items-start mb-2 gap-x-4">
        <h2
          class="text-lg font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap"
        >
          匯率
        </h2>
        <el-select
          v-model="currency1"
          placeholder="貨幣1"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in supportCurrencyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="currency2"
          placeholder="貨幣2"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in supportCurrencyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </header>
      <div
        class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1"
      >
        rates
      </div>
      <div class="flex items-start">
        <div
          class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2"
          v-if="isCalculated"
        >
          ${{ currentRate }}
        </div>
        <div
          v-else
          class="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2"
          v-if="!isCalculated"
        >
          請先選擇想要計算的貨幣
        </div>
        <div
          v-if="isDailyGrowth && isCalculated"
          class="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full"
        >
          {{ dailyChangePct }}%
        </div>
        <div
          v-else-if="!isDailyGrowth && isCalculated"
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
import { ref } from "vue";
import currency from "../../store/currency";
import exchange from "../../store/exchange";
import chartUtils from "../../utils/chart";
import { useCurrencyStore } from "../../store/currency";
import { useExchangeStore } from "../../store/exchange";

import { storeToRefs } from "pinia";
import LineChart from "../../charts/LineChart01.vue";
import { createLineDataset } from "../../utils/chart";

const currencyStore = useCurrencyStore();
const { supportCurrencyList } = storeToRefs(currencyStore);

const currency1 = ref("");
const currency2 = ref("");
const isCalculated = ref(false);
// 狀態：匯率、漲跌幅、漲跌方向、圖表資料
const currentRate = ref(0);
const dailyChangePct = ref(0);
const isDailyGrowth = ref(true);
const chartData = ref({
  labels: [],
  datasets: [createLineDataset([])],
});

const onSelectChange = async function () {
  const exchangeStore = useExchangeStore();

  // 只對有值的幣別做快取
  if (currency1.value) {
    await exchangeStore.fetchHistory(7, currency1.value);
  }
  if (currency2.value) {
    await exchangeStore.fetchHistory(7, currency2.value);
  }

  // 兩個選項都選完 才計算匯率
  if (!currency1.value || !currency2.value) return;

  // 計算匯率資料（直接用快取資料，不重複請求）
  const prices = await exchangeStore.fetchHistory(7, currency1.value);
  const basePrices = await exchangeStore.fetchHistory(7, currency2.value);

  const exchangeRate = prices.map(function (price, index) {
    return [price[0], price[1] / basePrices[index][1]];
  });
  // 更新圖表資料
  const newLabels = exchangeRate.map(function (item) {
    var d = new Date(item[0]);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  });
  const newData = exchangeRate.map(function (item) {
    return item[1];
  });
  chartData.value = {
    labels: newLabels,
    datasets: [createLineDataset(newData)],
  };
  // 更新匯率與漲跌幅
  if (exchangeRate.length > 1) {
    const last = exchangeRate[exchangeRate.length - 1][1];
    const prev = exchangeRate[exchangeRate.length - 2][1];
    currentRate.value = last.toFixed(2);
    dailyChangePct.value = (((last - prev) / prev) * 100).toFixed(2);
    isDailyGrowth.value = dailyChangePct.value > 0;
  }
  isCalculated.value = true;
};
</script>
