<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入姓名进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="addDialogVisible = true"
            >添加用户</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-notebook-2"
            circl
            @click="importDialog"
            >导入列表</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-notebook-2"
            circl
            @click="exportDialog()"
            >导出列表</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="userlist" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="所属机构" prop="jgmc">
          <template slot-scope="scope">
            <el-tag v-for="(item, i) in scope.row.jgmc" :key="i"
              >{{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="roleName">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-for="(item, i) in scope.row.roleName"
              :key="i"
              >{{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row.isActive}} -->
            <el-switch
              v-model="scope.row.isActive"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template width="180px" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeUserBuId(scope.row.id)"
            ></el-button>

            <el-tooltip
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
            </el-tooltip>
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
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="所属机构">
          <tree-select
            :data="data"
            :defaultProps="defaultProps"
            multiple
            :nodeKey="nodeKey"
            :checkedKeys="defaultCheckedKeys"
            @popoverHide="popoverHide"
          ></tree-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>

        <el-form-item label="所属机构">
          <tree-select
            :data="data"
            v-if="sonRefresh"
            :defaultProps="defaultProps"
            multiple
            :nodeKey="nodeKey"
            :checkedKeys="checkedKeys"
            @popoverHide="popoverHide"
          ></tree-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      align="left"
      @close="setRoleDialogClosed"
      :close-on-click-modal="false"
    >
      <div>
        <p align="left">当前用户：{{ userinfo.username }}</p>
        <p align="left">
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择" multiple>
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 导入列表的对话框 -->
    <el-dialog
      :title="'导入文件'"
      :visible.sync="importDialogVisible"
      width="30%"
      @close="importDialogClosed"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        drag
        :action="baseUrl"
        multiple
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import TreeSelect from '../../components/common/tree-select.vue'
export default {
  components: { TreeSelect },
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        //判断是否符合格式要求
        return cb()
      } else {
        cb(new Error('请输入合法邮箱'))
      }
    }

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
      sonRefresh: true,
      data: [],
      defaultProps: {
        value: 'id',
        label: 'jgName',
        children: 'children',
      },
      nodeKey: 'id',
      defaultCheckedKeys: [],
      checkedKeys: [],
      baseUrl: this.$url + '/admin/users/importUserList',
      importDialogVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      userlist: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        jgid: [],
        mobile: '',
      },
      setRoleDialogVisible: false,
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在2~10', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在6~10', trigger: 'blur' },
        ],
        jgid: [
          { required: true, message: '请输入请选择所属机构', trigger: 'blur' },
          // { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      userinfo: {
        //分配角色用户信息
      },
      rolesList: [
        //所有角色的数据列表
      ],
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
    this.getJgTree()
    // 注意：初始化defaultCheckedKeys时，在created里面
    // 父组件先执行自己的created，然后子组件开始执行自己的created和mounted，最后父组件再执行自己的mounted。
    // 因为此页面加载，先执行该组件自己的created，然后执行TreeSelect组件的created和mounted，最后执行该组件的mounted
    this.defaultCheckedKeys = []
  },
  mounted() {
    // 此处初始化defaultCheckedKeys，没效果
    this.defaultCheckedKeys = []
  },
  methods: {
    async getJgTree() {
      const { data: res } = await this.$http.get('admin/jggl/getJgTree')

      if (res.status != 200) return this.$message.error('获取机构列表失败！')

      this.data = res.data
    },
    popoverHide(checkedIds, checkedData) {
      // console.log(checkedIds)
      // console.log(checkedData)
      this.addForm.jgid = checkedIds
    },
    handleError(err, file, fileList) {
      this.$message.error(err)
    },
    handleSuccess(response, file, fileList) {
      // console.log(response)
      // console.log(file)
      this.$message.info('上传成功')
      this.importDialogVisible = false
      this.getUserList()
    },
    importDialogClosed() {
      this.$refs.upload.clearFiles()
    },
    importConfirm() {
      this.$refs.upload.submit()
      // this.getJgRyList()
    },
    importDialog() {
      this.importDialogVisible = true
    },
    exportDialog(jgid) {
      this.$http
        .request({
          url: 'admin/users/export/exportUserList?jgid=' + jgid,
          method: 'get',
          responseType: 'blob',
        })
        .then((res) => {
          //将文件流转成blob形式
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel',
          })

          let filename = decodeURIComponent(res.headers['filename'])
          //创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const eLink = document.createElement('a')
          eLink.download = filename
          eLink.style.display = 'none'
          eLink.href = URL.createObjectURL(blob)
          document.body.appendChild(eLink)
          eLink.click()
          URL.revokeObjectURL(eLink.href) // 释放URL 对象
          document.body.removeChild(eLink)
        })
        .catch((error) => {
          this.$message.error('导出失败')
        })
    },
    async getUserList() {
      const { data: res } = await this.$http.get(
        `admin/users/page/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}/?query=${this.queryInfo.query}`
      )

      // console.log(res)
      if (res.status != 200) return this.$message.error('获取用户列表失败！')

      this.userlist = res.data.list
      this.total = res.data.total
      // console.log(res)
    },
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`)

      this.queryInfo.pagesize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`)
      this.queryInfo.pagenum = pageNum
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      // console.log(userinfo);
      // console.log('users/${userinfo.id}/state/${userinfo.isActive}')
      const { data: res } = await this.$http.put(
        `admin/users/${userinfo.id}/state/${userinfo.isActive}`
      )

      if (res.status != 200) {
        userinfo.isActive = !userinfo.isActive
        return this.$message.error('修改用户状态失败！')
      }

      this.$message.success('修改用户状态成功！')
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          'admin/users/addUser',
          this.addForm
        )
        // console.log(res)
        if (res.status !== 201) {
          return this.$message.error('添加用户失败！')
        } else {
          if (res.data === null) {
            return this.$message.error('该用户名已存在！')
          }
          this.$message.success('添加用户成功！')
          this.addDialogVisible = false
          this.getUserList()
        }
      })
    },
    async showEditDialog(row) {
      // console.log(row.jgid)
      // 强制刷新子组件

      this.sonRefresh = false
      this.$nextTick(() => {
        if (row.jgid != null) {
          this.checkedKeys = row.jgid.split(',')
        } else {
          this.checkedKeys = []
        }
        // this.addForm.jgid = this.checkedKeys
        this.sonRefresh = true
      })

      this.editForm = row
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.getUserList()
      // Object.assign(this.$data.editForm, this.$options.data().editForm)
    },
    editUser() {
      // console.log(this.addForm.jgid)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admin/users/' + this.editForm.id,
          {
            mobile: this.editForm.mobile,
            jgid: this.addForm.jgid,
          }
        )
        if (res.status !== 200) {
          return this.$message.error('修改用户失败！')
        }
        this.$message.success('修改用户成功！')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    async removeUserBuId(id) {
      console.log(id)
      const confirmResult = await this.$confirm(
        '此操作将删除用户信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(
        'admin/users/deleteUser/' + id
      )

      if (res.status !== 200) {
        return this.$message.error('删除用户失败')
      }

      this.$message.info('删除用户成功')
      this.getUserList()
      // .then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });
    },
    async setRole(userinfo) {
      this.userinfo = userinfo
      this.selectedRoleId = userinfo.roleId
      //获取所有角色列表
      const { data: res } = await this.$http.get('admin/users/getRoleLists')
      if (res.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // console.log(res)
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    async saveRoleInfo() {
      // console.log(this.selectedRoleId)
      if (!this.selectedRoleId) {
        return this.$message.error('请选择用户角色')
      }
      const { data: res } = await this.$http.put(
        `admin/users/${this.userinfo.id}/role`,
        {
          roleId: this.selectedRoleId,
        }
      )

      if (res.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userinfo = {}
    },
  },
  computed: {
    headers() {
      return {
        Authorization: window.sessionStorage.getItem('token'),
      }
    },
  },
}
</script>


<style scoped lang="less">
.el-tag {
  margin-left: 5px;
  margin-top: 5px;
}
</style>