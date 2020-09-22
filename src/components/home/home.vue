<template>
  <div id="home">
    <el-button type="info" @click="remtoken">退出登录</el-button>
  </div>
</template>

<script>
export default	{
  name:	'home',
  methods: {
    remtoken () {
      window.sessionStorage.removeItem('token');
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>