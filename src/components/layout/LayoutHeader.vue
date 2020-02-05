<template>
  <div class="layout-header">
    <div class="left">
       <img class="logo" src="../../assets/images/blog.png" alt="">
    </div>
    <div class="right">
      <div class="personal">
        <img class="logo" src="../../assets/images/logo.png" alt="">
        <span class="nike">青莲居士</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.layout-header{
  display: flex;
  justify-content: space-between;
  height:100%;
  color:#fff;
  .left{
    width:300px;
    text-align: left;
    img{
     vertical-align: middle;
     height:50px;
    }
    h1{
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 12px;
    }
  }
  .right{
    justify-content: flex-end;
    margin-right:25px;
    align-items: center;
    .personal{
      .logo{
        vertical-align: middle;
        border-radius: 50%;
        width:40px;
        margin:0 10px;
      }
      .nike{
        font-size:16px;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
