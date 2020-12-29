<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食堂管理</el-breadcrumb-item>
        <el-breadcrumb-item>订餐人员设置</el-breadcrumb-item>
      </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
        <el-col class="cat_opt">
          <el-button type="primary" @click="addPersonDialog">添加人员</el-button>
        </el-col>
      </el-row>
      <el-table :data="personList" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="机构" prop="jgmc">
          <template slot-scope="scope">
            <el-tag v-for="(item, i) in scope.row.jgmc" :key="i"
              >{{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" > </el-table-column>
        <el-table-column label="手机" prop="mobile" > </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
              <!-- <el-button type="primary"  size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button> -->
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removePersonById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

    <!-- 添加人员对话框 -->
    <el-dialog
      :title="'添加人员'"
      :visible.sync="addPersonDialogVisible"
      width="30%"
      @close="addPersonDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addPersonForm"
        :rules="addPersonFormRules"
        ref="addPersonFormRef"
        label-width="100px"
      >
        <el-form-item label="姓名：">
          <el-select
            v-model="name"
            filterable
            multiple
            placeholder="请输入姓名进行搜索"
          >
            <el-option
              v-for="item in ryOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPersonDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPerson" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>


    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      personList: [],
      addPersonDialogVisible: false,
      addPersonForm:{},
      addPersonFormRules:{},
      name: '',
      ryOptions: [],

    }
  },
  created() {
    this.getPersonList()
  },
  methods: {
    back() {
      this.$router.push('/box')
    },
    async getPersonList() {
      const { data: res } = await this.$http.get('admin/sporder/getAllRoomUser')
      if (res.status != 200) {
        return this.$message.error('获取订餐人员标准失败')
      }
      this.personList = res.data
    },
    addPersonDialog(){
      this.getRy()
      this.addPersonDialogVisible = true
    },
    async getRy() {
      const { data: res } = await this.$http.get(`admin/jggl/getRy`)
      this.ryOptions = res.data
    },
    addPersonDialogClosed() {
      this.name = ''
    },
    addPerson(){
      this.$refs.addPersonFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `admin/sporder/addRoomUser/`,
          {user: this.name}
        )
        if (res.status !== 200) {
          this.$message.info('添加人员失败')
        }

        this.$message.success('添加人员成功')
        this.name = ''
        this.getPersonList()
        this.addPersonDialogVisible = false
      })  
    },
    async removePersonById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该人员, 是否继续?',
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
        'admin/sporder/delRoomUser/' + id
      )
      if (res.status !== 200) {
        return this.$message.error('删除人员失败')
      }
      this.$message.info('删除人员成功')
      this.getPersonList()
    }
  }
}
</script>

<style scoped>
.el-tag{
  margin-left: 5px;
  margin-top: 5px;
}
</style>