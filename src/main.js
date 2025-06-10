import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "./css/style.css";

import { createPinia } from "pinia";

const app = createApp(App);
app.use(router);
app.use(ElementPlus);

const pinia = createPinia();
app.use(pinia);

app.mount("#app");
