<template>
  <div id="name">
    <div class="data">管理时间，做时间的主人</div>
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>

<script>
export default	{
  name:	'name',
  data() {
    return {
      value: new Date()
    }
  },
}
</script>

<style scoped>
  .data {
    padding-bottom: 10px;
  }
</style>