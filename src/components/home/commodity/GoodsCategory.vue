<template>
  <div id="GoodsCategory">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb> 
    <!-- 卡片区域 -->
    <el-card>
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入内容" v-model="goodsinfo.query" 
        class="input-with-select" clearable @clear="inquireClear">
          <el-button slot="append" icon="el-icon-search"
          @click="goodinfolist" ></el-button>
        </el-input>
        <el-button type="primary" @click="addGoodsRouter">添加商品</el-button>
      </div>
      <!-- 表格区 -->
      <el-table
        :data="goodslist.goods"
        style="width: 100%; margin-top: 10px;"
        stripe border >
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px" >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px" >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="160px" >
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改商品" 
            placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" 
            size="mini"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" 
              placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" 
              size="mini" @click="deleteGoods(scope.row.goods_id)" ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="goodsinfo.pagenum"
          :page-sizes="[5, 8, 11, 14]"
          :page-size="goodsinfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default	{
  name:	'GoodsCategory',
  data() {
    return {
      //获取列表数据的请求参数
      goodsinfo: {
        query: '',
        //当前页码
        pagenum: 1,
        //显示条数
        pagesize: 8
      },
      //所有的商品列表数据
      goodslist: [],
      //添加输入框的绑定数据
      addgoods: '',
      //总数据条数
      total: 0,
    }
  },
  mounted() {
    this.goodinfolist()
  },
  methods: {
    //获取商品列表数据
    async goodinfolist() {
      const {data: res} = await this.$http.get('goods/', 
      { params: this.goodsinfo })
      if(res.meta.status != 200) return this.$message.error('获取商品列表参数失败')
      console.log(res.data);
      this.goodslist = res.data
      this.total = res.data.total
    },
    // 当前显示的条数改变时
    handleSizeChange(NewSize) {
      this.goodsinfo.pagesize = NewSize
      this.goodinfolist()
    },
    // 当前页码改变时
    handleCurrentChange(NewNum) {
      this.goodsinfo.pagenum = NewNum
      this.goodinfolist()
    },
    // 点击删除搜索内容时
    inquireClear() {
      this.goodsinfo.query = ''
      this.goodinfolist()
    },
    //删除商品时
    async deleteGoods(goodId) {
      const config = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
      if(config === 'confirm') {
        const {data: ref} = await this.$http.delete(`goods/${goodId}`)
        console.log(ref);
        if(ref.meta.status != 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.goodinfolist()
      }
    },
    addGoodsRouter() {
      this.$router.push('/goods/addgoods')
    }
  },
}
</script>

<style scoped>
  .input-with-select {
    width: 350px;
    margin-right: 20px;
  }
</style>