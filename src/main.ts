import { createApp } from "vue";
import { VueReCaptcha } from "vue-recaptcha-v3";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(VueReCaptcha, {
  siteKey: "6LeVsgEVAAAAAD_cU1YjriNpXfUAKTaWLCA1MlE1", // Public Key
  loaderOptions: {
    useRecaptchaNet: true,
    autoHideBadge: true,
    explicitRenderParameters: {
      badge: "bottomright",
    },
  },
});
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string;
  }

  const description = to.meta?.description as string;
  if (description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }
});
app.use(router);
app.mount("#app");
