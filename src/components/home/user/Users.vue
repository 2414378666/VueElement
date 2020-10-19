<template>
  <div id="Users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- input输入框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div>
            <!-- 查询功能 -->
            <el-input placeholder="请输入内容" class="input-with-select" 
            v-model="queryInfo.query" clearable @clear="querys">
              <el-button slot="append" icon="el-icon-search" @click="querys"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="addDialogVisible = true">添加客户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
       <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column
          type="index"
          label="#">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" 
              size="mini" @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" 
              size="mini" @click="openUsers(scope.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-connection" 
              size="mini" class="elb" @click="setRole(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
     <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <!-- 添加用户对话框 :visible.sync="变量"是关闭对话框的变量-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" 
      width="50%" @close="resetFields" ref="dialog">
      <!-- 内容主体区 -->
        <el-form ref="form" :model="addForm" 
        label-width="80px" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="userlogVisible" 
      width="30%" ref="submitref" @close="SubmitUser">
        <!-- 主体区 -->
        <el-form ref="editfromref" :model="editfrom" 
        :rules="addFormRules" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editfrom.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editfrom.mobile"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editfrom.email"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="SubmitUser">取 消</el-button>
          <el-button type="primary" @click="EditSubmitUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <el-dialog title="分配角色" :visible.sync="setRoleDlalogVisible"
    width="30%" @close="userdialogclose">
      <div>
        <p>当前的角色：{{userinfo.username}}</p>
        <p>当前的身份：{{userinfo.role_name}}</p>
        <p>分配新角色
          <template>
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
              </el-option>
            </el-select>
          </template>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDlalogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default	{
  name:	'Users',
  data() {
    //rule验证规则 value需要验证的值 callback回调函数验证后调用
    var checkEmail = (rule, value, callback) => {
      const emzz = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if(emzz.test(value)) {
        return callback()
      }
      return callback(new Error('邮箱格式错误'));
    }
    //手机号验证自定义规则
    var checkmobile = (rule, value, callback) => {
      const pozz = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if(pozz.test(value)) {
        return callback()
      }
      return callback(new Error('电话号码格式错误'));
    }
    return {
      queryInfo: {
        // query: '',
        //当前页数
        pagenum: 1,
        //当前一页展示数量
        pagesize: 2
      },
      //用户数据
      userList: [],
      //一共多少个用户数据
      total: 0,
      // 控制添加用户对话框显示隐藏
      addDialogVisible: false,
      //控制修改用户对话框显示隐藏
      userlogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单验证规则对象
      addFormRules: {
        //账号addFormRules
        username: [{ required: true,
        message: '请输入用户名', 
        trigger: 'blur' },
        { min: 3, max: 10, 
        message: '用户名的长度在3到10之间', trigger: 'blur'}],
        //密码
        password: [{ required: true,
        message: '请输入密码', 
        trigger: 'blur' },
        { min: 3, max: 15, 
        message: '用户名的长度在3到15之间', trigger: 'blur'}],
        //邮箱
        email: [{ required: true,
        message: '请输入邮箱', 
        trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }],
        //手机
        mobile: [{ required: true,
        message: '请输入手机号码', 
        trigger: 'blur' },
        { validator: checkmobile, trigger: 'blur' }]
      },
      //修改值的存放地
      editfrom: '',
      //修改校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur'},
          { validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: checkmobile, trigger: 'blur'}
        ]
      },
      //分配角色的对话框开启关闭与否
      setRoleDlalogVisible: false,
      //当前点击分配角色的角色信息
      userinfo: '',
      //所有角色的数据列表
      rolesList: '',
      //已选中的角色
      selectedRoleId: ''
    }
  },
  created() {
    //创建后就获取到用户列表数据
    this.querys()
  },
  methods: {
    //获取用户列表数据
    async querys() {
      const {data: query} = await this.$http.get('users', { 
        params: this.queryInfo 
      })
      if(query.meta.status == 200) {
        this.userList = query.data.users
        this.total = query.data.total
        return this.$message.success(query.meta.msg)
      } else {
        return this.$message.error(query.meta.msg)
        
      }
    },
    //监听每次展示几个数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.querys()
    },
    //监听页码改变的值
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.querys()
    },
    //点击用户状态按钮的逻辑
    async userStateChange(row) {
      const{data: res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if(res.meta.status != 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('更新用户状态失败')
      } 
      this.$message.success('用户状态更新成功')
    },
    // 当添加用户页面销毁后触发
    resetFields() {
      this.$refs.form.resetFields()
    },
    //提交添加用户请求
    adduser() {
      this.$refs.form.validate(async flag => {
        //校验失败后
        if(!flag) return
        //校验成功后
         const {data: res} = await this.$http.post('users', this.addForm)
        //  请求失败后a
         if(res.meta.status != 201) {
           return this.$message.error('添加失败')
         } 
        //请求成功后
        this.$message.success('添加成功')
        this.addDialogVisible = false
        this.querys()
      })
    },
    //点击修改后出现修改对话框和提交修改请求
    async showEditDialog(id) {
      this.userlogVisible = true
      this.modificationId = id
      const {data: res} = await this.$http.get('users/' + id)
      if(res.meta.status != 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.editfrom = res.data
    },
    //提交修改用户信息
    EditSubmitUser() {
      this.$refs.editfromref.validate(async flag => {
        if(!flag) return this.$message.error('验证失败请重新输入')
        const {data: res} = await this.$http.put('users/' + this.editfrom.id, 
        {email: this.editfrom.email, 
        mobile: this.editfrom.mobile})
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.userlogVisible = false
        this.$message.success(res.meta.msg)
        this.querys()
      })
    },
    //点击取消修改用户数据后触发
    SubmitUser() {
      this.userlogVisible = false
      this.$refs.editfromref.resetFields()
    },
    //提交删除用户操作
    async openUsers(id) {
      // 是否删除弹窗
      const dtus = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?', 
        '提示', 
        {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
      }).catch(error => error)
      //删除成不成功
      if('cancel' == dtus) return
      const {data: res} = await this.$http.delete('users/' + id)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.querys()
    },
    async setRole(row) {
      this.setRoleDlalogVisible = true
      this.userinfo = row
      const {data: res} = await this.$http.get('roles/')
      console.log(res);
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if(!this.selectedRoleId) {
        return this.$message.error('您还没有选择新的角色')
      }
      const {data: res} = await this.$http.put(`users/${this.userinfo.id}/role`,
      {rid: this.selectedRoleId})
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRoleDlalogVisible = false
      this.querys()
    },
    //修改角色对话框关闭后回调
    userdialogclose() {
      this.selectedRoleId = ''
    }
  }
}
</script>

<style scoped>
  .elb {
    background-color: #E6A23C;
  }
  .el-table {
    margin: 15px 0;
  }
</style>