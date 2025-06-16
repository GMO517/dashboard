<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl"
  >
    <header
      class="px-5 py-4 flex items-center mb-2 gap-x-5 border-b border-gray-100 dark:border-gray-700/60"
    >
      <div class="w-1/3">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">各國資料</h2>
      </div>
      <div class="w-2/3">
        <el-select
          v-model="selectedCountries"
          multiple
          :multiple-limit="3"
          placeholder="請選擇國家"
          class="w-full"
        >
          <el-option
            v-for="item in countriesNameList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </header>

    <!-- Chart built with Chart.js 3 -->
    <!-- Change the height attribute to adjust the chart height -->
    <BarChart :data="chartData" width="595" height="248" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import BarChart from "../../charts/BarChart01.vue";
import { getCssVariable } from "../../utils/Utils";
import country from "../../utils/country";

const selectedCountries = ref([]);
const countriesNameList = ref([]);

const defaultData = {
  labels: ["國家A", "國家B"],
  datasets: [
    {
      label: "人口",
      data: [800, 1700],
      backgroundColor: getCssVariable("--color-sky-500"),
      hoverBackgroundColor: getCssVariable("--color-sky-600"),
      barPercentage: 0.7,
      categoryPercentage: 0.7,
      borderRadius: 4,
    },
    {
      label: "面積",
      data: [200, 4800],
      backgroundColor: getCssVariable("--color-violet-500"),
      hoverBackgroundColor: getCssVariable("--color-violet-600"),
      barPercentage: 0.7,
      categoryPercentage: 0.7,
      borderRadius: 4,
    },
  ],
};
const chartData = ref(defaultData);
// 取得所有國家名稱
onMounted(async () => {
  const res = await country.getAllCountriesName();
  countriesNameList.value = res.map((item) => ({
    label: item.name.common,
    value: item.name.common,
  }));
});

// 查詢多個國家
async function fetchCountriesData(data) {
  if (data.length === 0) {
    chartData.value = defaultData;
    return;
  }
  const populationArr = [];
  const areaArr = [];
  const labelsArr = [];
  for (const countryName of data) {
    const res = await country.getCountryDetail(countryName);
    const area = res.data[0]?.area || 0;
    const population = res.data[0]?.population || 0;
    labelsArr.push(countryName);
    populationArr.push(population);
    areaArr.push(area);
  }
  chartData.value = {
    labels: labelsArr,
    datasets: [
      {
        label: "人口",
        data: populationArr,
        backgroundColor: getCssVariable("--color-sky-500"),
      },
      {
        label: "面積",
        data: areaArr,
        backgroundColor: getCssVariable("--color-violet-500"),
      },
    ],
  };
}

// 監聽 selectedCountries，每次變動時查詢人口數並更新 chartData
watch(selectedCountries, async (newVal) => {
  fetchCountriesData(newVal);
});
</script>
