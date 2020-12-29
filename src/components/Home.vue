<template>
  <!--  -->
  <div class="home-container">
    <el-container class="home-container">
      <el-header>
        <div>
          <img src="../assets/Black.png" alt />
          <span>食堂后台管理系统</span>
        </div>
        <span class="user"></span>

        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            你好，{{ username
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button type="info" @click="logout">退出</el-button> -->
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse()">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState('/' + subItem.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog
      title="修改密码"
      :visible.sync="setPwdDialogVisible"
      width="25%"
      align="left"
      @close="setPwdDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="pwdForm"
        :rules="pwdFormRules"
        ref="pwdFormRef"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="password">
          <el-input v-model="pwdForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input v-model="pwdForm.newpassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmpassword">
          <el-input v-model="pwdForm.confirmpassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setPwdDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePwdInfo" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        '308793747628363823': 'iconfont icon-icon-test78',
        '308793747628363833': 'iconfont icon-icon-test77',
        '308793747628363837': 'iconfont icon-icon-test76',
        '308793747628363840': 'iconfont icon-icon-test75',
   
      },
      isCollapse: false,
      activePath: '',
      mobile: '',
      username: '',
      setPwdDialogVisible: false,
      pwdForm: {
        mobile: '',
        password: '',
        newpassword: '',
        confirmpassword: '',
      },
      pwdFormRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在6~10', trigger: 'blur' },
        ],
        newpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在6~10', trigger: 'blur' },
        ],
        confirmpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在6~10', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getMenuList()
    setTimeout(function () {}, 5000)
    this.activePath = window.sessionStorage.getItem('activePath')
    this.mobile = window.sessionStorage.getItem('mobile')
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case 'logout':
          this.logout()
          break
        case 'changePwd':
          this.changePwd()
          break
        default:
          logout()
      }
    },
    changePwd() {
      this.setPwdDialogVisible = true
      this.$nextTick(() => {
        this.$refs.pwdFormRef.resetFields()
      })
    },
    setPwdDialogClosed() {
      this.setPwdDialogVisible = false
    },
   savePwdInfo() {
      this.$refs.pwdFormRef.validate(async (valid) => {
        if (!valid) return
        if (this.pwdForm.newpassword != this.pwdForm.confirmpassword) {
          this.$message.error('两次设置的密码不一致！')
          return
        }

        this.pwdForm.mobile = this.mobile
        const { data: res } = await this.$http.post(
          'sso/changePwd',
          this.pwdForm
        )
        if (res.status != 200) {
          return this.$message.error('修改密码失败！')
        } else {
  
          if (res.success == 'success') {
            this.$message.info('修改密码成功，请重新登录！')
            this.setPwdDialogVisible = false

            this.logout()
          } else {
            return this.$message.error('原密码不正确！')
          }
        }
      })
    },
    async logout() {
      const { data: res } = await this.$http.post('sso/logOutMobile', {
        mobile: this.mobile,
      })
      if (res.status != 200) return this.$message.error('退出失败！')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('sso/menus')

      if (res.status != 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data

      // console.log(this.menulist)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
  mounted() {
    this.username = window.sessionStorage.getItem('username')
  },
}
</script>


<style scoped lang="less">
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    > img {
      height: 50px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
  // line-height: 160px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.home-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.user {
  font-size: 16px;
  margin-right: -95em;
}
</style>