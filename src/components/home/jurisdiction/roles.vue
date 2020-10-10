<template>
  <div id="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> 
    <!-- 卡片区域 -->
    <el-card>
       <el-button type="primary">添加角色</el-button>
      <template>
        <el-table :data="rolelist" border
        style="width: 100%" >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 栅格布局 -->
              <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" 
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']">
                <!-- 一级权限区域 -->
                <el-col :span="5">
                  <el-tag closable 
                  @close="openMessageBox(scope.row, item1.id)">
                  {{item1.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级和三级权限区域 -->
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" 
                  :key="item2.id" :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']">
                    <!-- 二级权限区 -->
                    <el-col :span="6">
                      <el-tag type="success" 
                      closable @close="openMessageBox(scope.row, item2.id)">
                      {{item2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 三级权限区 -->
                    <el-col :span="18">
                      <el-tag type="warning" closable 
                      v-for="(item3, i3) in item2.children" 
                      :key="i3" @close="openMessageBox(scope.row, item3.id)">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 角色信息 -->
          <el-table-column
            type="index"
            label="#">
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称">
          </el-table-column>
          <el-table-column
            prop="roleDesc"
            label="角色描述">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <!-- 处于上方的文字提醒 -->
              <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" 
                size="mini">编辑</el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" 
                size="mini">删除</el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-connection" 
                size="mini" @click="showSetRightDialog(scope.row)">分配角色</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分配权限的对话框 props配置表 data所有要展示的 default-checked-keys默认要勾选的-->
        <el-dialog title="提示" :visible.sync="dialogVisible" 
        width="30%" @close="setRightDialogClosed">
          <el-tree :data="roleslist" :props="defaultProps"
          show-checkbox node-key="id" default-expand-all
          :default-checked-keys="defKeys" ref="trees"></el-tree>
          <span slot="footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button @click="allotrights">确定</el-button>
          </span>
        </el-dialog>
      </template>
    </el-card>
  </div>
</template>

<script>
export default	{
  name:	'roles',
  data() {
    return {
      // 角色权限列表
      rolelist: [],
      // 对话框是否关闭
      dialogVisible: false,
      //所有权限列表
      roleslist: {},
      //树根的配置表 children是要循环的，label是需要显示的
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      //当前需要修改的角色的所有默认勾选
      defKeys: [],
      //获得当前需要修改权限的角色id
      roleId: ''
    }
  },
  created() {
    this.roleslistfun()
  },
  methods: {
    // 获取权限列表的数据
    async roleslistfun() {
      const {data: res} = await this.$http.get('roles/')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.rolelist = res.data
      this.$message.success(res.meta.msg)
    },
    // 删除角色权限
    async openMessageBox(row, id3) {
      const ff = await this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if(ff != 'confirm') return
      const {data: res} = await this.$http.delete(`roles/${row.id}/rights/${id3}`)
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      row.children = res.data
      this.$message.success(res.meta.msg)
    },
    // 获取到全部权限信息
    async showSetRightDialog(row) {
      this.roleId = row.id
      const {data: res} = await this.$http.get('rights/tree')
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.roleslist = res.data
      this.getLeafKeys(row, this.defKeys)
      this.dialogVisible = true
    },
    // 递归获得所有默认勾选的三级权限
    getLeafKeys(node, arr) {
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      }); 
    },
    //当对话框关闭时 马上清空默认勾选的数组
    setRightDialogClosed() {
      this.defKeys = []
    },
    //提交已经修改的角色权限
    async allotrights() {
      //getCheckedKeys全部勾选的按钮id getHalfCheckedKeys半勾选的按钮id
      let getcheck = [
        ...this.$refs.trees.getCheckedKeys(),
        ...this.$refs.trees.getHalfCheckedKeys()
        ]
      //提交请求需要把所有id以 "," 隔离开来然后发送
      let chars = getcheck.join(',')
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: chars})
      if(res.meta.status != 200) return this.$message.error(res.meta.msg)
      this.dialogVisible = false
      this.roleslistfun()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>