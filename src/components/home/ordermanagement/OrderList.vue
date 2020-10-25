<template>
  <div id="OrderList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- input输入区域 -->
      <div style="margin: 15px 0; width: 400px;">
        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <!-- table区域 -->
      <el-table 
        :data="orderList"
        stripe
        style="width: 100%"
        border >
          <el-table-column
            type="index"
            label="#"
            width="50">
          </el-table-column>
          <el-table-column
            prop="order_number"
            label="订单编号"
            width="450">
          </el-table-column>
          <el-table-column
            prop="order_price"
            label="订单价格">
          </el-table-column>
          <el-table-column
            label="是否付款"
            width="100">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_send"
            label="是否发货"
            width="120">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="下单时间">
            <template slot-scope="scope">
              {{scope.row.create_time | dateFormat}}
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <el-button type="primary" icon="el-icon-edit" 
            size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location-outline" 
            size="mini" @click="showProgressBox"></el-button>
          </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 8, 11, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addressVisible"
      width="40%" @close="dialogClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="ruleFormRef" label-width="100px">
        <el-form-item label="县市区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度按钮的对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVible"
      width="40%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default	{
  name:	'OrderList',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //order总条数
      total: 0,
      //order数据
      orderList: [],
      //输入查询的绑定数据
      input3: '',
      //修改地址对话框判断
      addressVisible: false,
      //物流信息的对话框判断
      progressVible: false,
      //修改地址表单双向绑定数据
      addressForm: {
        address1: [],
        address2: ''
      },
      //验证规则
      addressFormRules: {
        address1: {
          required: true, message: '请输入县市区县', trigger: 'blur' 
        },
        address2: {
          required: true, message: '请输入详细地址', trigger: 'blur' 
        }
      },
      //省市县地名
      cityData: cityData,
      //物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const {data: res} = await this.$http.get('orders', {params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      //总条数
      this.total = res.data.total
      //order总数据
      this.orderList = res.data.goods
    },
    // 每页显示几条数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log(this.queryInfo.pagesize);
      this.getOrderList()
    },
    //当前页码数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      console.log(this.queryInfo.pagenum);
      this.getOrderList()
    },
    //点击修改地址
    showBox() {
      this.addressVisible = true
    },
    //点击定位按钮
    async showProgressBox() {
      this.progressVible = true
      const {data: res} = await this.$http.get('/kuaidi/1106975712662')
      console.log(res);
      if(res.meta.status != 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
    },
    //对话框关闭后
    dialogClose() {
      this.$refs.ruleFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }
</style>