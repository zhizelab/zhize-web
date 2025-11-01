import { Layout, NotFound, injectDarkMode, setupDarkMode, setupSidebarItems, scrollPromise } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_c185f05b380936ddb2e46a5f13b14ec1/node_modules/vuepress-theme-hope/lib/bundle/exports/base.js";

import { defineCatalogInfoGetter } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+plugin-catalog@2._3dabc323a3322de9cea0d2d786a96765/node_modules/@vuepress/plugin-catalog/lib/client/index.js"
import { h } from "vue"
import { resolveComponent } from "vue"
import { GlobalEncrypt, LocalEncrypt } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_c185f05b380936ddb2e46a5f13b14ec1/node_modules/vuepress-theme-hope/lib/bundle/exports/encrypt.js";
import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_c185f05b380936ddb2e46a5f13b14ec1/node_modules/vuepress-theme-hope/lib/bundle/styles/encrypt/bundle.scss"

import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/styles/colors.css";
import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/styles/normalize.css";
import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";
import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-theme-hope@2.0.0-r_c185f05b380936ddb2e46a5f13b14ec1/node_modules/vuepress-theme-hope/lib/bundle/styles/bundle.scss";

defineCatalogInfoGetter((meta) => {
  const title = meta.title;
  const shouldIndex = meta.index ?? true;
  const icon = meta.icon;

  return shouldIndex ? {
    title,
    content: icon ? () =>[h(resolveComponent("VPIcon"), { icon, sizing: "both" }), title] : null,
    order: meta.order,
    index: meta.index,
  } : null;
});

export default {
  enhance: ({ app, router }) => {
    const { scrollBehavior } = router.options;

    router.options.scrollBehavior = async (...args) => {
      await scrollPromise.wait();

      return scrollBehavior(...args);
    };

    // inject global properties
    injectDarkMode(app);

    app.component("GlobalEncrypt", GlobalEncrypt);
    app.component("LocalEncrypt", LocalEncrypt);
  },
  setup: () => {
    setupDarkMode();
    setupSidebarItems();

  },
  layouts: {
    Layout,
    NotFound,

  }
};
