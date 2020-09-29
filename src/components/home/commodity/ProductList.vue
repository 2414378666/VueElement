<template>
  <div id="ProductList">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="showAddCateDiaLog">添加分类</el-button>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="dialogVisible"
        width="50%" @close="addCateDiaLogClose">
        <el-form
          :model="addCateForm" :rules="addCateFormRules"
          ref="addCateFormRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- options：数据源 -->
            <!-- props：指定配置对象 v-model选择后的id列表-->
            <el-cascader
              v-model="selectedKeys"
              :options="cateList"
              :props="{
              value:'cat_id', 
              label:'cat_name', 
              children:'children',
              checkStrictly:true }"
              @change="parentCateChange"
              clearable
              filterable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="postCategories">确 定</el-button>
        </span>
      </el-dialog>
      <el-row>

      </el-row>
      <!-- 表格 -->
        <!-- data所有需要绑定的值 columns各列的配置表 selection-type是否为多选类型表格 
        expand-type 行是否能展开 show-index是否显示数据索引 index-text数据索引名称
        show-row-hover鼠标悬停时，是否高亮当前行-->
      <tree-table
        :data="cateList" :columns="columns"
        selection-type :expand-type="false"
        show-index index-text="#" stripe
        :show-row-hover="false" border class="treeTable">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted"
          style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else
          style="color: red;"></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == '0'"> 一级 </el-tag>
          <el-tag v-else-if="scope.row.cat_level == '1'" type="success"> 二级 </el-tag>
          <el-tag v-else-if="scope.row.cat_level == '2'" type="warning"> 三级 </el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" 
          size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" 
          size="mini">删除</el-button>
        </template>
      </tree-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[3, 6, 9]" 
          :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" 
          :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name:	'ProductList',
  data() {
    return {
      // 查询条件 要通过pagenum得到当前页码数 
      // 和pagesize一页显示多少数据 来决定请求多少条，第几条数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //所有请求参数
      cateList: [],
      //当前总条数
      total: 0,
      //给列指定分类名称
      columns: [
      {
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        //表示将当前行设置为模板
        type: 'template',
        //表示当前模板的slsot的名
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        template: 'level'
      }, {
        label: '操作',
        type: 'template',
        template: 'operation'
      },
      ],
      // 添加分类的对话框弹出与否
      dialogVisible: false,
      // 分类名称input的验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      //父级分类的列表
      parentCateList: [],
      // 添加分类的配置对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      //选中的父级id数组
      selectedKeys: [],
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo 
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // 给数据列表赋值
      this.cateList = res.data.result
      // 总数据条数
      this.total = res.data.total
      return this.$message.success(res.meta.msg)
    },
    //获得当前一页显示数据
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize
      this.getCateList()

    },
    //获得当前的页码数
    handleCurrentChange(NewNum) {
      this.queryInfo.pagenum = NewNum
      this.getCateList()
    },
    //展示分类对话框
    async showAddCateDiaLog() {
      this.dialogVisible = true
      const {data: res} = await this.$http.get(
        'categories', { params: { type: 2 } })
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data

    },
    // 点击添加分类的确定按钮
    async postCategories() {
      const {data: res} = await this.$http.post('categories', this.addCateForm)
      if(res.meta.status != 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.dialogVisible = false
    },
    // 选择项发生变化时触发
    parentCateChange() {
      if(this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return 0
      } else {
        //父级分类id
        this.this.addCateForm.cat_pid = 0
        //父级分类等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    //对话框关闭时
    addCateDiaLogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style scoped>
  .treeTable {
    margin-top: 20px;
  }
  .el-cascader {
    width: 100%;
  }
</style>