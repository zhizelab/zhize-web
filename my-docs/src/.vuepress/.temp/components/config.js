import { hasGlobalComponent } from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/index.js";
import Badge from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-plugin-components@_3d62adac7d004fed8ed7ea8e03ceea95/node_modules/vuepress-plugin-components/lib/client/components/Badge.js";
import VPCard from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/vuepress-plugin-components@_3d62adac7d004fed8ed7ea8e03ceea95/node_modules/vuepress-plugin-components/lib/client/components/VPCard.js";

import "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/node_modules/.pnpm/@vuepress+helper@2.0.0-rc.1_d21bbdbcbbeb1853acb94ce0424e7e0b/node_modules/@vuepress/helper/lib/client/styles/sr-only.css";

export default {
  enhance: ({ app }) => {
    if(!hasGlobalComponent("Badge")) app.component("Badge", Badge);
    if(!hasGlobalComponent("VPCard")) app.component("VPCard", VPCard);
    
  },
  setup: () => {

  },
  rootComponents: [

  ],
};
