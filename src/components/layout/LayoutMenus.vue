<template>
  <el-menu
    :default-active="activeIndex"
    class="layout-menus"
    background-color="#fff"
    text-color="#000"
    active-text-color="#409EFF"
    :router="true"
  >
    <el-submenu v-for="menu in menus" :key="menu.path" :index="menu.path">
      <template slot="title">
        <i class="el-icon-folder"></i>
        <span>{{menu.name}}</span>
      </template>
      <el-menu-item  v-for="child in menu.children" :index="`/article${child.path}`" :key="child.path">
        <i class="el-icon-document"></i>
        <span slot="title">{{child.name}}</span>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
import menus from '@/config/menu'
export default {
  data () {
    return {
      menus: menus,
      activeIndex: this.$route.path || '/article/introduce/index'
    }
  },
  watch: {
    $route (val) {
      if (val.startsWith('/article/')) {
        this.activeIndex = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
.layout-menus {
  text-align: left;
  // max-height: 800px;
}

/deep/.el-submenu .el-menu-item {
  height: 40px;
  line-height: 40px;
}
/deep/.el-menu-item,
/deep/.el-submenu__title {
  height: 40px;
  line-height: 40px;
}
</style>
