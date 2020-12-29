<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入权限名进行搜索"
            v-model="rightInfo.right"
            clearable
            @clear="getRightsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getRightsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="addRight" @click="addRight"
            >添加权限</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success"
              >二级权限</el-tag
            >
            <el-tag v-else type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeRightById(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>


      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="rightInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="rightInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加权限对话框 -->
    <el-dialog
      title="添加权限"
      :visible.sync="addRightDialogVisible"
      width="30%"
      @close="addRightDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addRightForm"
        :rules="addRightFormRules"
        ref="addRightFormRef"
        label-width="100px"
      >
        <el-form-item label="权限名称：" prop="rightName">
          <el-input v-model="addRightForm.rightName"></el-input>
        </el-form-item>
        <el-form-item label="权限路径：" prop="rightPath">
          <el-input v-model="addRightForm.rightPath"  :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="上级权限：" prop="superRight">
          <el-select
            v-model="addRightForm.superRight"
            clearable
            placeholder="请选择"
            @change="handlechange"
          >
            <el-option
              v-for="item in rightData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRightConfirm" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改权限的对话框 -->
    <!-- <el-dialog
      title="修改权限"
      :visible.sync="editRightDialogVisible"
      width="50%"
      @close="editRightDialogClosed"
    >
      <el-form
        :model="editRightForm"
        :rules="editRightFormRules"
        ref="editRightFormRef"
        label-width="80px"
      >
        <el-form-item label="权限名称"  prop="rightName">
          <el-input v-model="editRightForm.rightName" disabled></el-input>
        </el-form-item>

        <el-form-item label="权限路径" prop="rightPath">
          <el-input v-model="editRightForm.rightPath"></el-input>
        </el-form-item>

        <el-form-item label="权限等级" prop="superRight">
          <el-input v-model="editRightForm.superRight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRight">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightData: {},
      rightInfo: {
        right: '',
        pagenum: 1,
        pagesize: 5,
      },
      rightsList: [],
      total: 0,
      addRightDialogVisible: false,
      editRightDialogVisible: false,
      addRightForm: {
        rightName: '',
        rightPath: '',
        superRight: '',
      },
      addRightFormRules: {
        rightName: [
          { required: true, message: '请输入权限名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        // rightPath: [
        //   { required: true, message: '请输入权限路径', trigger: 'blur' },
        //   // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        // ],
      },
      disabled: true,
      // editRightForm: {},
      // editRightFormRules: {
      // rightName: [
      //   { required: true, message: '请输入权限名称', trigger: 'blur' },
      //   // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
      // ],
      // },
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    addRightConfirm() {
      this.$refs.addRightFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/rights/addRight',
          this.addRightForm
        )
        if (res.status !== 201) {
          this.$message.info('保存权限失败')
        }
        this.addRightDialogVisible = false
        this.$message.info('保存权限成功')
        this.getRightsList()
      })
    },
    addRightDialogClosed() {
      this.$refs.addRightFormRef.resetFields()
      this.addRightDialogVisible = false
      this.disabled = true
    },
    addRight() {
      this.getRightData()
      this.addRightDialogVisible = true
    },
    async getRightData() {
      const { data: res } = await this.$http.get('admin/rights/lists/0')
      if (res.status != 200) return this.$message.error('获取权限列表失败！')

      this.rightData = res.data
    },
    async getRightsList() {
      const { data: res } = await this.$http.get(
        `admin/rights/page/${this.rightInfo.pagenum}/${this.rightInfo.pagesize}/?right=${this.rightInfo.right}`
      )

      console.log(res)
      if (res.status != 200) return this.$message.error('获取权限列表失败！')

      this.rightsList = res.data.list
      this.total = res.data.total
    },
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`)

      this.rightInfo.pagesize = pageSize
      this.getRightsList()
    },
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`)
      this.rightInfo.pagenum = pageNum
      this.getRightsList()
    },
    async removeRightById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除用户权限, 是否继续?',
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
      const { data: res } = await this.$http.delete('admin/rights/' + id)
      console.log(id)
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.info('删除权限成功')
      // this.getRightData()
      this.getRightsList()
    },
    handlechange(data) {
      console.log(data);
      if(data) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
    edit() {

    }
  },
}
</script>


<style scoped lang="less">
.addRight {
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