<template>
  <div id="rights">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容主体区 -->
    <el-card class="box-card">
      <el-table :data="rightslist" border stripe 
      style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <!-- 标签的颜色和内容判断 -->
            <el-tag v-if="scope.row.level == '0'"> 等级一 </el-tag>
            <el-tag v-else-if="scope.row.level == '1'" type="success"> 等级二 </el-tag>
            <el-tag v-else-if="scope.row.level == '2'" type="warning"> 等级三 </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default	{
  name:	'rights',
  data() {
    return {
      //权限页的值
      rightslist: [],
    }
  },
  created() {
    //创建完则获取到权限页的值
    this.rights()
  },
  methods: {
    //获取权限列表
    async rights() {
      const {data: res} = await this.$http.get('rights/list',)
      console.log(res);
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rightslist = res.data
      this.$message.success(res.meta.msg)
    },
  },
}
</script>

<style scoped>

</style>