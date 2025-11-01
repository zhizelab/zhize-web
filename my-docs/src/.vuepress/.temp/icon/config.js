import { hasGlobalComponent } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/index.js";
import { useScriptTag } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vueuse+core@14.0.0_vue@3.5.22/node_modules/@vueuse/core/dist/index.js";
import { h } from "vue";
import { VPIcon } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+plugin-icon@2.0.0_1eefc90410799b439506a0f337eef4b5/node_modules/@vuepress/plugin-icon/lib/client/index.js"

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("VPIcon")) {
      app.component(
        "VPIcon",
        (props) =>
          h(VPIcon, {
            type: "iconify",
            prefix: "fa6-solid:",
            ...props,
          })
      )
    }
  },
  setup: () => {
    useScriptTag(`https://cdn.jsdelivr.net/npm/iconify-icon@2`);
  },
}
