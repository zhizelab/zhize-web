import { CodeTabs } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_3a0c76d54d9d17835918864539434b98/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_3a0c76d54d9d17835918864539434b98/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+plugin-markdown-t_3a0c76d54d9d17835918864539434b98/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
