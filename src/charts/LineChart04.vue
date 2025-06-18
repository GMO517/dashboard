<template>
  <canvas ref="canvas" :data="data" :width="width" :height="height"></canvas>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useDark } from "@vueuse/core";
import { getChartColors } from "./ChartjsConfig";

import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

// Import utilities
import { formatTWNumber } from "../utils/Utils";

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

export default {
  name: "LineChart01",
  props: ["data", "width", "height"],
  setup(props) {
    const canvas = ref(null);
    let chart = null;
    const darkMode = useDark();
    const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor } =
      getChartColors();

    onMounted(() => {
      const ctx = canvas.value;

      chart = new Chart(ctx, {
        type: "line",
        data: props.data,
        options: {
          layout: {
            padding: 20,
          },
          scales: {
            y: {
              display: true,
              beginAtZero: true,
              position: "left",
            },
            y1: {
              display: true,
              beginAtZero: true,
              position: "right",
              grid: {
                drawOnChartArea: false,
              },
            },
            x: {
              type: "time",
              time: {
                parser: "YYYY-M",
                unit: "month",
              },
              display: false,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: function (context) {
                  // 直接用 labels 陣列的原始字串
                  if (context && context.length > 0) {
                    // 取得 x 軸 index
                    var dataIndex = context[0].dataIndex;
                    // 取得原始 labels
                    var labels = context[0].chart.data.labels;
                    // 直接回傳原始 label（如 2023-03）
                    if (labels && labels[dataIndex]) {
                      // 轉成 2023-3 格式
                      var match = labels[dataIndex].match(
                        /^(\d{4})-(0?\\d{1,2})/
                      );
                      if (match) {
                        return match[1] + " - " + parseInt(match[2], 10);
                      }
                      return labels[dataIndex];
                    }
                  }
                  return "";
                },
                label: function (context) {
                  // 顯示國家名稱與數字
                  var label = "";
                  if (context.dataset && context.dataset.label) {
                    label += context.dataset.label + ": ";
                  }
                  label += formatTWNumber(context.parsed.y);
                  return label;
                },
              },
              bodyColor: darkMode.value
                ? tooltipBodyColor.dark
                : tooltipBodyColor.light,
              backgroundColor: darkMode.value
                ? tooltipBgColor.dark
                : tooltipBgColor.light,
              borderColor: darkMode.value
                ? tooltipBorderColor.dark
                : tooltipBorderColor.light,
            },
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
            mode: "nearest",
          },
          maintainAspectRatio: false,
          resizeDelay: 200,
        },
      });
    });

    onUnmounted(() => chart.destroy());

    watch(
      () => darkMode.value,
      () => {
        if (darkMode.value) {
          chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
          chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
          chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
        } else {
          chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
          chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
          chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
        }
        chart.update("none");
      }
    );

    // 監聽 data 變動，自動更新 chart
    watch(
      () => props.data,
      (newData) => {
        if (chart) {
          chart.data = newData;
          chart.update();
        }
      },
      { deep: true }
    );

    return {
      canvas,
    };
  },
};
</script>
