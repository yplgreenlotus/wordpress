<template>
  <article id="article" class="markdown-body">
  </article>
</template>

<script>
import '@/assets/css/markdown.css'
import '@/assets/css/highlight.css'
import config from './config'
import Vue from 'vue'
export default {
  mounted () {
    this.renderArticle()
  },
  watch: {
    $route (val) {
      this.renderArticle()
    }
  },
  methods: {
    /**
     * 渲染文档
     */
    renderArticle () {
      try {
        let category = this.$route.params.category
        let name = this.$route.params.name
        const md = require(`@/views/md/${category}/${name}.md`).default
        const Doc = Vue.extend(md)
        const doc = new Doc().$mount()
        document.getElementById('article').innerHTML = ''
        document.getElementById('article').appendChild(doc.$el)
        window.scrollTo(0, 0)
      } catch (error) {
        this.redirect(error)
      }
    },
    /**
     * 访问异常处理
     */
    redirect ({ code }) {
      if (code === config.REJECTED) {
        this.$router.push('/visit/exception/403')
      } else if (code === config.NOTFOUND) {
        this.$router.push('/visit/exception/404')
      } else {
        this.$router.push('/visit/exception/500')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
