import comp from "D:/vuepress-theme-hope/project_of_zhizelab/my-docs/src/.vuepress/.temp/pages/demo/HardWare.html.vue"
const data = JSON.parse("{\"path\":\"/demo/HardWare.html\",\"title\":\"\",\"lang\":\"zh-CN\",\"frontmatter\":{},\"readingTime\":{\"minutes\":0,\"words\":0},\"filePathRelative\":\"demo/HardWare.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
