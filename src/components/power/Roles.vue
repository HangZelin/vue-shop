<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入角色名进行搜索"
            v-model="roleInfo.role"
            clearable
            @clear="getRolesList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRolesList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="addRole" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',i1 ===0 ? 'bdtop': '','vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限-->
                <el-row
                  :class="[i2 === 0 ? '' :'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <!-- <i class="el-icon-caret-right"></i> -->
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                      type="warning"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                    {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="roleInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="roleInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination> -->
    </el-card>

  <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      :close-on-click-modal="false"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        node-key="id"
        :default-checked-keys="defKeys"
        show-checkbox
        default-expand-all
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

  <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="addRoleDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

  <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="50%" @close="editRoleDialogClosed" :close-on-click-modal="false">
      <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.email"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {
    return {
      treeProps: {
        label: 'authName',
        children: 'children',
      },
      roleList: [],
      setRightDialogVisible: false,
      rightslist: [],
      defKeys: [],
      roleId: '',
      addRoleDialogVisible: false,
      editRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
      },
      editRoleForm: {},
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      roleInfo: {
        role: ''
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    addRoles() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/roles/addRolesName',
          this.addRoleForm
        )
        if (res.status !== 201) {
          this.$message.info('保存角色失败')
        }

        this.$message.info('保存角色成功')
        this.addRoleDialogVisible = false
        // this.getLists()        
        this.getRolesList()

      })
    },
    addRoleDialogClosed() {
       this.$refs.addRoleFormRef.resetFields()
      this.addRoleDialogVisible = false;
    },
    async getRolesList() {
      const { data: res } = await this.$http.get(`admin/roles/getRoles?roleName=${this.roleInfo.role}`)

      if (res.status != 200) return this.$message.error('获取角色列表失败！')

      this.roleList = res.data
      // console.log(this.roleList)
    },

    async removeRightById(role, right) {
      //弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `admin/roles/${role.id}/rights/${right}`
      )
      //  console.log(res)
      if (res.status !== 200) {
        return this.$message.info('删除权限失败')
      }
      // role.children = res.data
      this.roleList = res.data
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      //获取所有权限数据以树状图呈现
      const { data: res } = await this.$http.get('admin/roles/tree')
      console.log(res);

      if (res.status !== 200) {
        return this.$message.info('获取权限失败')
      }

      this.rightslist = res.data
      //递归获取三级节点Id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    getLeafKeys(node, arr) {
      //通过递归的形式获得角色下三级权限的ID，保存到defKeys数组中
      // console.log(node)

      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `admin/roles/${this.roleId}/rights`,
        { rids: idStr },
        { timeout: 30000 }
      )

      console.log(res)
      if (res.status !== 200) {
        return this.$message.info('分配权限失败')
      }

      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    //  handleSizeChange(pageSize) {
    //   // console.log(`每页 ${pageSize} 条`)
    //   this.roleInfo.pagesize = pageSize
    //   this.getRolesList()
    // },
    // handleCurrentChange(pageNum) {
    //   // console.log(`当前页: ${pageNum}`)
    //   this.roleInfo.pagenum = pageNum
    //   this.getRolesList()
    // },
    async showEditRoleDialog(row) {
      // console.log(row)
      // const { data: res } = await this.$http.get('admin/users/getUser/' + id)
      // if (res.status !== 200) {
      //   return this.$message.error('查询角色数据失败')
      // }
      // this.editForm = res.data
      this.editRoleForm = row
      // console.log(this.editForm)
      this.editRoleDialogVisible = true
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
      this.getRolesList()
    },
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admin/roles/editRole/' + this.editRoleForm.id,
          {
            roleName: this.editRoleForm.roleName,
          }
        )
        if (res.status !== 200) {
          return this.$message.error('修改角色失败！')
        }
        this.$message.success('修改角色成功！')
        this.editRoleDialogVisible = false
        this.getRolesList()
      })
    },
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除用户角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('admin/roles/' + id)
      console.log(id)
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.info('删除角色成功')
      this.getRolesList()
    },
  },
}
</script>


<style scoped lang="less">
.addRole {
  display: flex;
  align-items: flex-start;
}
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