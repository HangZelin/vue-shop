<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" class="addCate" @click="addCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!--表格-->

      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: green" v-if="scope.row.catDeleted === 0"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.catLevel === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.catLevel === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template> -->

        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditCateDialog(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateById(scope.row.id)">删除</el-button>
        </template>
      </tree-table>
<!-- 
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination> -->
      <!--数据-->
    </el-card>


    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible"  width="30%" @close="addCateDialogClosed"> 
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="catName" >
          <el-input v-model="addCateForm.catName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatelist"
            :props="cascaderProps"
            @change="parentCateChanged"
            filterable
            clearable
          ></el-cascader>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible"  width="30%" @close="editCateDialogClosed"> 
      <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="catName" >
          <el-input v-model="editCateForm.catName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCatelist"
            :props="cascaderProps"
            @change="parentCateChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate" v-no-more-click>确 定</el-button>
      </span>
    </el-dialog>
     
  </div>
</template>


<script>
export default {
  data() {
    return {
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      addCateForm: {
        catName: '',
        catPid: 0,
        //默认添加1级分类
        catLevel: 0,
      },
      editCateForm:{

      },
      addCateFormRules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      editCateFormRules: {
        catName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'catName',
          width: '400px',
        } ,
        // {
        //   label: '是否有效',
        //   width: '200px',
        //   type: 'template',
        //   template: 'isOk',
        // },
        // {
        //   label: '排序',
        //   width: '200px',
        //   type: 'template',
        //   template: 'order',
        // },
        {
          label: '操作',
          width: '400px',
          type: 'template',
          template: 'opt',
        },
      ],
      parentCatelist: [],
      cascaderProps: {
        // expandTrigger: 'hover',
        checkStrictly: true,
        value: 'id',
        label: 'catName',
        children: 'children',
      },
      selectedKeys: [],
      keys:[]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('admin/categories/getCate', {
        params: this.queryInfo,
      })

      if (res.status !== 200) {
        return this.$message.info('获取商品分类失败')
      }

      this.cateList = res.data
      // this.total = res.data.total
    },
    // handleSizeChange(newSize) {
    //   this.queryInfo.pagesize = newSize
    //   this.getCateList()
    // },
    // handleCurrentChange(newNum) {
    //   this.queryInfo.pagenum = newNum
    //   this.getCateList()
    // },
    addCateDialog() {
      this.getParentCatelist()
      this.addCateDialogVisible = true
    },
    showEditCateDialog(role) {
      console.log(role);
      this.editCateDialogVisible = true
      this.editCateForm = role
      this.getParentCatelist()
    },
    async getParentCatelist() {
      const { data: res } = await this.$http.get('admin/categories/getCate', {
        params: { type: 2 },
      })

      if (res.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      this.parentCatelist = res.data
    },
    parentCateChanged() {
      console.log(this.selectedKeys)
      if(this.selectedKeys.length > 0){
        //选中了父级分类
        this.addCateForm.catPid = this.selectedKeys[this.selectedKeys.length -1]
        this.addCateForm.catLevel = this.selectedKeys.length
        return 
      }else{
        this.addCateForm.catPid = 0
        this.addCateForm.catLevel = 0
      }
    },
    parentCateChange() {
      if(this.selectedKeys.length > 0){
        //选中了父级分类
        this.editCateForm.catPid = this.selectedKeys[this.selectedKeys.length -1]
        this.editCateForm.catLevel = this.selectedKeys.length
        return 
      }else{
        this.editCateForm.catPid = 0
        this.editCateForm.catLevel = 0
      }
    },
    addCate(){
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} =  await this.$http.post('admin/categories/addCate',this.addCateForm)
        if(res.status !== 201){
          this.$message.info("添加分类失败")
        }
         this.$message.info("添加分类成功")
         this.getCateList();
         this.addCateDialogVisible = false
      })
    },
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid) return
        const {data: res} =  await this.$http.put('admin/categories/editCate/' + this.editCateForm.id, {
          catName: this.editCateForm.catName,
          catLevel: this.editCateForm.catLevel,
          catPid: this.editCateForm.catPid
        })
        if(res.status !== 200){
          this.$message.info("修改分类失败")
        }
         this.$message.info("修改分类成功")
         this.getCateList();
         this.editCateDialogVisible = false
      })
    },
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.catPid = 0
      this.addCateForm.catLevel = 0
      this.selectedKeys = []
    },
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
      this.selectedKeys = []
    },
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除商品分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('admin/categories/delCate/' + id)
      console.log(id)
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.info('删除分类成功')
      // this.getRightData()
      this.getCateList()
    }
  },
}
</script>


<style scoped lang="less">
.addCate {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}
.el-cascader{
  width:100%
}

</style>