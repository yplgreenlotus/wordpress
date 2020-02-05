<template>
  <el-container id="container">
    <el-header>
      <layout-header></layout-header>
    </el-header>

    <el-container>
      <el-aside width="300px">
        <layout-menus></layout-menus>
      </el-aside>
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import LayoutMenus from './LayoutMenus'
import LayoutHeader from './LayoutHeader'
export default {
  components: {
    LayoutMenus,
    LayoutHeader
  },
  data () {
    return {}
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #183055;
  color: #333;
  line-height: 60px;
}
/deep/.el-menu{
  border-right: none;
}
.el-main {
  color: #333;
  min-height: 800px;
  border-left: solid 1px #e6e6e6;
}
</style>
