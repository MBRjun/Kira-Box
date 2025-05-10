const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig(async () => {
  const Components = await import("unplugin-vue-components/webpack");
  const Icons = await import("unplugin-icons/webpack");
  const IconsResolver = await import("unplugin-icons/resolver");
  return {
    transpileDependencies: true,
    productionSourceMap: false,
    configureWebpack: {
      plugins: [
        Components.default({
          resolvers: [
            IconsResolver.default({
              prefix: "Icon",
              enabledCollections: ["mdi"],
            }),
          ],
        }),
        Icons.default({
          autoInstall: false,
          compiler: "vue3",
        }),
      ],
    },
  };
});
