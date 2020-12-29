<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许第三级添加参数" type="warning" :closable="false" show-icon></el-alert>

      <el-row>
        <el-col class="cat_opt">
          <span class="cat_opt_span">选择商品分类:</span>
          <el-cascader
            :options="catelist"
            :props="cateProps"
            v-model="selectedCateKeys"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            class="start"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manytableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attrVals"
                  :key="i"
                  closable
                  @close="handlerClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParmas(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            class="start"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlytableData" border stripe>
            <el-table-column type="expand">
                  <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attrVals"
                  :key="i"
                  closable
                  @close="handlerClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attrName"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParmas(scope.row.id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attrName">
          <el-input v-model="addParamsForm.attrName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attrName">
          <el-input v-model="editParamsForm.attrName"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    return {
      catelist: [],
      cateProps: {
        checkStrictly: true,
        value: 'id',
        label: 'catName',
        children: 'children',
      },
      selectedCateKeys: [],
      activeName: 'many',
      manytableData: [],
      onlytableData: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addParamsForm: {
        attrName: '',
      },
      editParamsForm: {
        attrName: '',
      },
      addParamsFormRules: {
        attrName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      editParamsFormRules: {
        attrName: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('admin/params/getCate')
      if (res.status != 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data
    },
    handleChange() {
      this.getParamsData()
    },
    handleTabsClick() {
      this.getParamsData()
    },
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [] //选中的不是三级分类
        this.manytableData = []
        this.onlytableData = []
        return
      }
      const { data: res } = await this.$http.get(
        `admin/params/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )

      if (res.status != 200) {
        return this.$message.error('获取参数列表失败')
      }
      //将tags字符串转换成数组
      res.data.forEach((item) => {
        item.attrVals = item.attrVals ? item.attrVals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      //   console.log(res.data)
      if (this.activeName === 'many') {
        this.manytableData = res.data
      } else {
        this.onlytableData = res.data
      }
    },
    addDialogClosed() {
      this.$refs.addParamsFormRef.resetFields()
    },
    editDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
    },
    addParams() {
      //点击按钮添加参数
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `admin/params/${this.cateId}/attributes`,
          {
            attrName: this.addParamsForm.attrName,
            attrSel: this.activeName,
          }
        )

        if (res.status != 201) {
          return this.$message.error('添加参数失败')
        }

        this.$message.success('添加参数成功')
        this.addDialogVisible = false
        this.getParamsData()
      })
    },
    async showEditDialog(id) {
      //查询当前参数信息
      const { data: res } = await this.$http.get(
        `admin/params/${this.cateId}/attributes/${id}`,
        {
          params: {
            attrSel: this.activeName,
          },
        }
      )

      if (res.status != 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editParamsForm = res.data

      this.editDialogVisible = true
    },
    editParams() {
      //点击按钮添加参数
      this.$refs.editParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `admin/params/${this.cateId}/attributes/${this.editParamsForm.id}`,
          {
            attrName: this.editParamsForm.attrName,
            attrSel: this.activeName,
          }
        )

        if (res.status != 200) {
          return this.$message.error('修改参数失败')
        }

        this.$message.success('修改参数成功')
        this.editDialogVisible = false
        this.getParamsData()
      })
    },
    async removeParmas(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(
        `admin/params/${this.cateId}/attributes/${id}`
      )

      if (res.status != 200) {
        return this.$message.error('删除失败')
      }

      this.$message.success('删除成功')
      this.getParamsData()
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      row.attrVals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrValue(row)
    },
    showInput(row) {
      row.inputVisible = true
      //让文本框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handlerClose(i, row) {
      console.log(i)
      row.attrVals.splice(i, 1)
      this.saveAttrValue(row)
    },
    async saveAttrValue(row) {

      const { data: res } = await this.$http.put(
        `admin/params/${this.cateId}/attributes/${row.id}`,
        {
          attrName: row.attrName,
          attrVals: row.attrVals.join(' '),
          attrSel: row.attrSel,
        }
      )

      if (res.status != 200) {
        return this.$message.error('添加参数项失败')
      }
      this.$message.success('添加参数项成功！')
    },
  },
  computed: {
    //如果按钮被禁用，返回true
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    cateId: function () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    },
  },
}
</script>


<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
  width: 400px;
  display: flex;
  align-items: flex-start;
}
.el-cascader {
  width: 200px;
}
.cat_opt_span {
  width: 100px;
  margin: 10px 5px;
  font-size: 15px;
  display: flex;
  align-items: flex-start;
}
.start {
  display: flex;
  align-items: flex-start;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>