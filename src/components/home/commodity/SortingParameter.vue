<template>
  <div id="SortingParameter">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert title="提示：仅支持为第三级分类分配相关属性" type="warning" 
      show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类</span>
          <div class="block">
            <el-cascader
              v-model='selectedCateKeys'
              :options="cateLists"
              :props="{ 
              value:'cat_id',
              label:'cat_name',
              children:'children' }"
              @change="catelistChange"
              ></el-cascader>
          </div>
        </el-col>
      </el-row>

      <!-- table页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" 
          :disabled='tabPaneflag' style="margin-bottom: 15px"
          @click="dialogVisible = true">添加参数</el-button>
          <!-- 下面的动态列表 -->
          <el-table :data="TableData" border stripe>
            <!-- 额外展开行 添加 type="expand"-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals"
                closable :key="index" @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!-- 按钮文本框切换 -->
                <el-input
                  class="el-input-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"
                @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini"
                @click="deleteEdit(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" 
          :disabled='tabPaneflag' style="margin-bottom: 15px"
          @click="dialogVisible = true">添加属性</el-button>
          <!-- 下面的动态列表 -->
          <el-table :data="TableData" border stripe>
            <!-- 额外展开行 添加 type="expand"-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item, index) in scope.row.attr_vals"
                closable :key="index" @close="handleClose(index, scope.row)">{{item}}</el-tag>
                <!-- 按钮文本框切换 -->
                <el-input
                  class="el-input-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)" >
                </el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini"
                  @click="showEditDialog(scope.row.attr_id)" >编辑</el-button>
                <el-button type="danger" size="mini" 
                  @click="deleteEdit(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加属性的对话框 -->
      <el-dialog :title="'添加' + inputText"
        :visible.sync="dialogVisible" 
        width="40%" @close="addDlalogClose">
        <el-form ref="form" :model="addfrom" 
          :rules="addFormRules" label-width="80px">
          <el-form-item :label="inputText" prop="attr_name">
            <el-input v-model="addfrom.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改属性对话框 -->
      <el-dialog :title="'修改' + inputText"
        :visible.sync="editDialog" 
        width="40%" @close="editDlalogClose">
        <el-form ref="editform" :model="editfrom" 
          :rules="editFormRules" label-width="80px">
          <el-form-item :label="inputText" prop="edit_name">
            <el-input v-model="editfrom.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default	{
  name:	'SortingParameter',
  data() {
    return {
      // 所有数据列表
      cateLists: [],
      // 点击的id存储
      selectedCateKeys: [],
      //页签页的双向绑定数据,绑定是动态还是静态
      activeName: 'many',
      //tab区可否选择
      tabPaneflag: true,
      //动态静态参数展示
      TableData: [],
      //添加属性的对话框
      dialogVisible: false,
      //添加属性对话框input文本
      inputText: '动态参数',
      //双向绑定表单的
      addfrom: '',
      //表单验证规则
      addFormRules: {
        attr_name: { required: true, message: '请输入新的属性', trigger: 'blur' },
      },
      //表单绑定对象
      addfrom: {
        attr_name: ''
      },
      //修改对话框显示与否
      editDialog: false,
      //修改的表单
      editfrom: {
      },
      //修改的验证对象
      editFormRules: {
        attr_name: { required: true, message: '请输入需要修改的属性', trigger: 'blur' },
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获得商品分类列表
    async getCateList() {
      const {data: res} = await this.$http.get('categories/')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.cateLists = res.data
    },
    //当级联选择发生变化时
    catelistChange() {
      if(this.selectedCateKeys.length != 3) {
        //级联选择器的id清空
        this.selectedCateKeys = []
        //下面属性页清空
        this.TableData = []
        this.tabPaneflag = true
        return
      }
      this.tabPaneflag = false
      this.getParamsData()
    },
    //获取参数的列表数据
    async getParamsData() {
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
      { params: { sel: this.activeName } })
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      res.data.forEach(item => {
        item.attr_vals =  item.attr_vals ? 
        item.attr_vals.split(',') : []
        //控制文本显示和隐藏
        item.inputVisible = false
        //文本框中输入的值
        item.inputValue = ''
      })
     
      this.TableData = res.data
    },
    //当点击级联选择器时获得其动态参数
    handleTabClick() {
      if(this.selectedCateKeys.length === 3) {
        this.getParamsData()
        if(this.activeName == 'many') {
          this.inputText = '动态参数'
        } else if(this.activeName == 'only') {
          this.inputText = '静态属性'
        }
      }
      return null
    },
    //添加属性对话框关闭时
    addDlalogClose() {
      this.$refs.form.resetFields()
    },
    //添加属性
    addParams() {
      this.$refs.form.validate(async vaild => {
        if(!vaild) {
          return this.$message.error('请先把表单填完')
        }
        const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, 
        { attr_name: this.addfrom.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status != 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getParamsData()
      })
    },
    // 点击编辑按钮
    async showEditDialog(attrid) {
      //查询当前参数
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attrid}`, 
      { params: { 'attr_sel': this.activeName} })
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.editfrom = res.data
      this.editDialog = true
    },
    // 当修改属性对话框销毁时
    editDlalogClose() {
      this.$refs.editform.resetFields()
    },
    //当点击确认修改按钮后
    editParams() {
      this.$refs.editform.validate(async vaild => {
        if(!vaild) return this.$message.error('请先输入一个新修改的值')
        //验证成功后修改需要的值
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editfrom.attr_id}`, 
        { 'attr_name': this.editfrom.attr_name, 
        'attr_sel': this.activeName } )
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getParamsData()
        this.editDialog = false
      })
    },
    //点击删除后根据id删除
    async deleteEdit(attrid) {
      const confirmResult = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult);
      if(confirmResult === 'confirm') {
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrid}`)
        if(res.meta.status != 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.getParamsData()
      } else {
        this.$message.error('取消了删除')
      }
    },
    //点击new tag按钮
    showInput(row) {
      row.inputVisible = true
      //nextTick 方法的作用就是页面的元素被重新渲染过后
      //才会回调函数中的方法
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //new tag输入框的绑定事件失去焦点或按下enter
    handleInputConfirm(row) {
      //如果用户输入的值是空或者空格
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //如果用户输入了值
      row.attr_vals.push(row.inputValue)
      console.log(row.attr_id);
      this.saveAtterVals(row)
    },
    async saveAtterVals(row) {
      const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
      { attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(',')
        })
      if(res.meta.status != 200) return this.$message.error('修改失败')
      row.inputValue = ''
      row.inputVisible = false
      this.$message.success('修改成功')
    },
    //点击删除属性tag
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAtterVals(row)
    }
  },
  computed: {
    //分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    }
  }
}
</script>

<style scoped>
  .el-row {
    margin: 15px 0;
  }
  .el-tag {
    margin: 0 7px;
  }
  .el-input-tag {
    width: 100px;
  }
</style>