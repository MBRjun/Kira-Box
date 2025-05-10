import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Kira Box",
      description:
        "Kira Box is a collection of my web tools, all developed out of personal interest.",
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    meta: {
      title: "About - Kira Box",
      description: "Something about Kira Box's development information.'",
    },
  },
  {
    path: "/tools/aplocator",
    name: "AP Locator",
    component: () =>
      import(/* webpackChunkName: "aplocator" */ "../views/LocatorView.vue"),
    meta: {
      title: "AP Locator - Kira Box",
      description:
        "This tool can query the SSID and geographical location based on the MAC or IPv6 address.",
    },
  },
  {
    path: "/tools/compressionratio",
    name: "Compression Ratio",
    component: () =>
      import(
        /* webpackChunkName: "compressionratio" */ "../views/CompressView.vue"
      ),
    meta: {
      title: "Compression Ratio - Kira Box",
      description:
        "This tool allows you to view and compare the size and compression time of a document using different levels of Gzip, Brotli, and Zstd compression.",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
