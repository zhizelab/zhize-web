import CodeDemo from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-plugin-md-enhance@_8cf5fb81cb587bd14cd54756c65cdc9a/node_modules/vuepress-plugin-md-enhance/lib/client/components/CodeDemo.js";
import MdDemo from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-plugin-md-enhance@_8cf5fb81cb587bd14cd54756c65cdc9a/node_modules/vuepress-plugin-md-enhance/lib/client/components/MdDemo.js";

export default {
  enhance: ({ app }) => {
    app.component("CodeDemo", CodeDemo);
    app.component("MdDemo", MdDemo);
  },
};
