<template>
  <div id="login">
    <canvas id="myCanvas"></canvas>
      <div class="login_main">
      <!-- 头像区域 -->
      <div class="login_from">
        <img src="~assets/logo.png">
      </div>
      <!-- 登录表单 model绑定一个-->
      <el-form :rules="rules" :model="loginfrom" ref="loginFromRef" class="from">
        <el-form-item prop="username">
          <el-input placeholder="请输入账号" v-model="loginfrom.username" clearable prefix-icon="iconfont icon-lianhe4"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginfrom.password" prefix-icon="iconfont icon-anquan" show-password></el-input>
        </el-form-item>
        <el-form-item class="button">
          <el-button type="primary" round @click="valiclick">登录</el-button>
          <el-button type="info" round @click="remclick">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    return {
      //登录注册的数据绑定注册
      loginfrom: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        //验证用户名是否合法
        username: [
          //required为true是必填项 trigger是文本框失去焦点后触发
          { required: true, message: '请输入账号信息', trigger: 'blur' },
          { min: 3, max: 10, message: '请控制在3到10个字符', trigger: 'blur'}
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 10, message: '请控制在3到10个字符', trigger: 'blur'}
        ]
      },
      show: true,
    }
  },
  mounted() {
    const width = document.getElementById("myCanvas").width = screen.availWidth;
    const height = document.getElementById("myCanvas").height = screen.availHeight;
    const ctx = document.getElementById("myCanvas").getContext("2d");
    const arr = Array(Math.ceil(width / 10)).fill(0);
    const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

    function rain() {
    	//这里的重点就是每次调用这个方法的时候都会重新绘制一张透明度为0.05的黑色画布来覆盖前图
    	//所以就会形成人眼中的下雨效果
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#0f0";
        arr.forEach(function (value, index) {
            ctx.fillText(str[Math.floor(Math.random() * str.length)], index * 10, value + 10);
            arr[index] = value >= height || value > 8888 * Math.random() ? 0 : value + 10;
        });
    }

    setInterval(rain, 30);
  },
  methods: {
    remclick() {
      //重置整个表单
      this.$refs.loginFromRef.resetFields()
    },
    valiclick() {
      //validate ui的校验函数 返回一个布尔值
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return;
        //发送axios请求是否登录成功
        const { data: res } = await this.$http.post('login', this.loginfrom)
        if (res.meta.status !== 200) {
          return this.$message.error('账号或者密码错误');
        } else {
          sessionStorage.setItem('token', res.data.token);
          //接口暂时失效时
          // sessionStorage.setItem('token', 'IIsToken');
          this.$router.push('/home')
          return this.$message.success('登录成功')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  @w: 600px;
  @h: 400px;
  @sw: 200px;
  @sh: 200px;
  body{
    margin: 0;
    overflow: hidden;
  }
  #login {
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    width: @w;
    height: @h;
  }
  .login_from {
    position: relative;
    top: @sw / -2;
    left: @w / 2 - @sw / 2;
    width: @sw;
    height: @sh;
    background-color: #eceeeb;
    border-radius: 50%;
    border: 1px solid #fff;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 0 10px #dddddd;
    img {
      border-radius: 50%;
      border: 1px solid #fff;
    }
  }
  .from {
    position: absolute;
    top: 200px;
    left: 10%;
    width: 80%;
  }
  .button {
    position: absolute;
    right: 0px;
    bottom: -67px;
  }
</style>