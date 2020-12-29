<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>订餐用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入姓名进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getWxUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getWxUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table :data="userlist" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="nickname"></el-table-column>
        <el-table-column label="所属单位" prop="jgmc"></el-table-column>
        <el-table-column label="手机号码" prop="mobile"></el-table-column>
        <el-table-column label="微信openid" prop="openid"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row.status}} -->
            <el-switch v-model="scope.row.status" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template width="180px" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
            ></el-button>

            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

   <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed" :close-on-click-modal="false">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
<!-- 
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item> -->
<!-- 
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item> -->

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop>
              <el-cascader
                :options="jglist"
                :props="jgProps"
                v-model="addForm.jgSelect"
                clearable
                @change="handleChange"
              ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

  <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed" :close-on-click-modal="false">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.nickname" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop>
              <el-cascader
                :options="jglist"
                :props="jgProps"
                v-model="editForm.jgSelect"
                clearable
                @change="handleChanged"
              ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        //判断是否符合格式要求
        return cb()
      } else {
        cb(new Error('请输入合法手机号码'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        nickname: '',
        jgSelect:[],
        mobile: ''
      },
      jglist:[],
      jgProps: {
        checkStrictly: true,
        value: 'id',
        label: 'jgName',
        children: 'children',
      },
      setRoleDialogVisible: false,
      editForm: {},
      addFormRules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editFormRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      userinfo: {
        //分配角色用户信息
      },
      rolesList: [
        //所有角色的数据列表
      ],
      selectedRoleId: ''
    }
  },
  created() {
    this.getWxUserList()
  },
  methods: {
    async getWxUserList() {
      const { data: res } = await this.$http.get( `admin/wxusers/page/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}?query=${this.queryInfo.query}`)

      if (res.status != 200)
        return this.$message.error('获取用户列表失败！')

      this.userlist = res.data.list
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`)

      this.queryInfo.pagesize = pageSize
      this.getWxUserList()
    },
    addUserDialog(){
        this.addDialogVisible = true
        this.getJgList()
    },
    async getJgList() {
      const { data: res } = await this.$http.get('admin/wxusers/getJgTree')
      if (res.status != 200) {
        return this.$message.error('获取机构数据失败')
      }
      this.jglist = res.data
      //   console.log(this.catelist)
    },
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`)
      this.queryInfo.pagenum = pageNum
      this.getWxUserList()
    },
    async userStateChanged(userinfo) {
        
      //console.log('users/${userinfo.id}/state/${userinfo.isActive}')
      const { data: res } = await this.$http.put(
        `admin/wxusers/${userinfo.id}/${userinfo.status}`
      )

      if (res.status != 200) {
        userinfo.status = !userinfo.status
        return this.$message.error('修改用户状态失败！')
      }
      this.$message.success('改用户状态成功！')
      this.getWxUserList()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post('admin/wxusers/addUser', this.addForm)
        console.log(res)
        if (res.status !== 201) {
          return this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getWxUserList()
      })
    },
    async showEditDialog(id) {
      this.getJgList()
      const { data: res } = await this.$http.get('admin/wxusers/getUser/' + id)
      if (res.status !== 200) {
        return this.$message.error('查询用户数据失败')
      }
      this.editDialogVisible = true
      this.editForm = res.data
      console.log(this.editForm)
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.getWxUserList()
    },
    editUser() {
      console.log(this.editForm)
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admin/wxusers/' + this.editForm.id,
          {
            jgid: this.editForm.jgid,
            mobile: this.editForm.mobile
          }
        )
        if (res.status !== 200) {
          return this.$message.error('修改用户失败！')
        }
        this.$message.success('修改用户成功！')
        this.editDialogVisible = false
        this.getWxUserList()
      })
    },
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('admin/wxusers/deleteUser/' + id)
      if (res.status !== 200) {
        return this.$message.error('删除用户失败')
      }

      this.$message.info('删除用户成功')
      this.getWxUserList()
    },
    handleChange() {
      if (this.addForm.jgSelect.length !== 3) {
        this.addForm.jgSelect = [] //选中的不是三级分类
        return
      }
      //   console.log(this.addForm.goods_cat)
    },
    handleChanged() {
     if (this.editForm.jgSelect.length !== 3) {
        this.editForm.jgSelect = [] //选中的不是三级分类
        return
      }
      this.editForm.jgid = this.editForm.jgSelect[this.editForm.jgSelect.length - 1] 
    // console.log(editForm);
    }
  }
}
</script>


<style scoped lang="less">
</style>