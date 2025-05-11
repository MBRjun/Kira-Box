import { defineNuxtPlugin } from "#app";
import { VueReCaptcha } from "vue-recaptcha-v3";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueReCaptcha, {
    siteKey: "6LeVsgEVAAAAAD_cU1YjriNpXfUAKTaWLCA1MlE1",
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: true,
      explicitRenderParameters: {
        badge: "bottomright",
      },
    },
  });
});
