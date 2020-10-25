<template>
  <div id="name">
    <!-- 面包屑区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps :space="200" :active="tabsnum" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- from区域 -->
      <el-form :model="addRules" :rules="ruleForm" 
        ref="ruleForm" label-width="100px" label-position="top">
        <el-tabs tab-position="left" :before-leave="beforeTabLeave"
          v-model="tabsModel" @tab-click="tabClick(tabsModel)" >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addRules.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addRules.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addRules.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addRules.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类(请选择三级分类！否则无效)" prop="goods_cat">
              <el-cascader
                v-model="addRules.goods_cat"
                :options="cateList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData"
              :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" 
                :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData"
            :key="item.attr_id" >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传的地址 -->
            <!-- list-type 指定图片上传的效果 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess" >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload> 
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addRules.goods_introduce">

            </quill-editor>
            <el-button type="primary" class="addButton" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 展示图片的对话框 -->
      <el-dialog
        title="图片"
        :visible.sync="dialoguplod"
        width="40%">
        <img :src="previewPath" class="dialogImg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default	{
  name:	'addGoods',
  data() {
    return {
      //转存标签页码
      tabsnum: 0,
      //绑定的标签页码
      tabsModel: 0,
      //校验规则
      ruleForm: {
        goods_name: {
           required: true, message: '请输入商品名称', trigger: 'blur' 
        },
        goods_price: {
          required: true, message: '请输入商品价格', trigger: 'blur' 
        },
        goods_weight: {
          required: true, message: '请输入商品重量', trigger: 'blur'
        },
        goods_number: {
          required: true, message: '请输入商品数量', trigger: 'blur'
        },
        goods_cat: {
           required: true, message: '请选择商品分类', trigger: 'blur'
        }
      },
      //表单数据保存
      addRules : {
        //商品名字
        goods_name: '',
        //商品价格
        goods_price: 0,
        //商品重量
        goods_weight: 0,
        //商品数量
        goods_number: 0,
        //商品所属的分类数组
        goods_cat: [],
        //商品图片
        pics: [],
        //商品介绍
        goods_introduce: '',
        //商品参数动态或静态
        attrs: '',
      },
      //级联选择器数据源
      cateList: [],
      //动态参数列表
      manyTableData: [],
      //静态属性
      onlyTableData: [],
      //上传图片的url地址
      uploadURL: 'https://www.liulongbin.top:8888/api/private/v1/upload',
      //上传图片的请求头token
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 存放点击预览的图片url
      previewPath: '',
      //图片展示的flag
      dialoguplod: false
    }
  },
  mounted() {
    this.categoriesMethods()
  },
  methods: {
    //当点击商品参数切换栏时获取参数
    async tabClick(name) {
      this.tabsnum = (name * 1)
      if(name === '1') {
        const {data: res} = await this.$http.get(`categories/${this.catId}/attributes`,
        { params: {sel: 'many'}} )
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        res.data.forEach(element => {
          element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(',')
        });
        this.manyTableData = res.data
      } else if(name === '2') {
        const {data: res} = await this.$http.get(`categories/${this.catId}/attributes`,
        { params: {sel: 'only'}} )
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      }
    },
    //获取商品分类
    async categoriesMethods() {
      const {data: res} = await this.$http.get('categories/')
      if(res.meta.status != 200) return this.$message.error('获取商品分类失败')
      this.cateList = res.data
      console.log(this.cateList);
    },
    //当分类选择没有选择三级时 则清空
    handleChange() {
      if(this.addRules.goods_cat.length < 3) {
        this.addRules.goods_cat = []
      }
    },
    // 切换类型的钩子回调函数，当选择的不是三级分类时，不给切换
    beforeTabLeave(activeName, oldActiveName) {
      if(oldActiveName==='0' && this.addRules.goods_cat.length !== 3) {
        this.$message.error('商品分类请选择一个三级分类')
        return false
      }
    },
    //处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialoguplod = true
    },
    //点击图片移除时触发
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const i =this.addRules.pics.findIndex(x => x.pic === filePath)
      this.addRules.pics.splice(i, 1)
    },
    //监听图片上传的事件
    handleSuccess(response) {
      if(response.meta.status === 200) {
        var picInfo = {pic: response.data.tmp_path}
        this.addRules.pics.push(picInfo)
      } else {
        this.$message.error('图片上传失败')
      }
    },
    add() {
      this.$refs.ruleForm.validate(async value => {
        if(!value) {
          return this.$message.error('请先把所有表单必填项填写完毕')
        }
        //添加的业务逻辑
        //深拷贝
        const from = _.cloneDeep(this.addRules)
        from.goods_cat = from.goods_cat.join(',')
        //处理动态属性
        this.manyTableData.forEach(item => {
          const newInfo = { 
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addRules.attrs.push(newInfo)
        })
        //处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addRules.attrs.push(newInfo)
        })
        //将新的数据存入深拷贝中
        from.attrs = this.addRules.attrs
        const {data: res} = await this.$http.post('goods', from)
        if(res.meta.status != 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    //获取分类三级分类的id
    catId() {
      if(this.addRules.goods_cat.length === 3) {
        return this.addRules.goods_cat[2]
      } else {
        return null
      } 
    }
  }
}
</script>

<style scoped >
  .el-steps {
    margin: 5px 0;
  }
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }
  .dialogImg {
    width: 100%;
    height: 100%;
  }
  .addButton {
    margin-top: 5px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
</style>