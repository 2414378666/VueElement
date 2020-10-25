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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 11]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="48">
      </el-pagination>
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
      queryInfo: {
        //当前页数
        pagenum: 1,
        //当前一页展示数量
        pagesize: 5,
        //一共多少用户
        total: 0
      },
    }
  },
  created() {
    //创建完则获取到权限页的值
    this.rights()
  },
  methods: {
    //获取权限列表
    async rights () {
      const {data: res} = await this.$http.get('rights/list',)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)

      const allData = res.data
      this.total = allData.length
      this.rightslist = []
      //开始循环数据的下标
      let allNum = (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize
      //结束循环数据的下标
      let endNum = allNum + this.queryInfo.pagesize
      if(this.total >= endNum) {
        for(var i=allNum; i<endNum; i++) {
          this.rightslist.push(allData[i])
        }
      } else {
        for(var i=allNum; i<this.total; i++) {
          this.rightslist.push(allData[i])
        }
      }
      this.$message.success(res.meta.msg)
    },
    //监听每次展示几个数据
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.rights()
    },
    //监听页码改变的值
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.rights()
    }
  },
}
</script>

<style scoped>

</style>