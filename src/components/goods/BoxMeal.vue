<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食堂管理</el-breadcrumb-item>
        <el-breadcrumb-item>订餐标准设置</el-breadcrumb-item>
      </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
        <el-col class="cat_opt">
          <el-button type="primary" @click="setMealDialogVisible = true">设置套餐</el-button>
        </el-col>
      </el-row>
      <el-table :data="mealList" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="套餐名称" prop="mealname"></el-table-column>
        <el-table-column label="套餐价格" prop="mealPrice"></el-table-column>
        <el-table-column label="套餐介绍" prop="mealDetail"></el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button type="primary"  size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeMealById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

    <!-- 设置套餐对话框 -->
    <el-dialog
        title="参数设置"
        :visible.sync="setMealDialogVisible"
        width="50%"
        @close="setMealDialogClosed"
        :close-on-click-modal="false"
        >
      <el-form
        :model="addMealForm"
        :rules="addMealFormRules"
        ref="addMealFormRef"
        label-width="100px"
      >
        <el-form-item label="套餐名" prop="meal_name">
          <el-input v-model="addMealForm.meal_name"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="meal_price">
          <el-input v-model="addMealForm.meal_price"></el-input>
        </el-form-item>
        <el-form-item label="套餐说明" prop="meal_introduce">
            <el-input type="textarea" v-model="addMealForm.meal_introduce"></el-input>        
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setMealDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMeal">确 定</el-button>
        </span>
        </el-dialog>


    <!-- 修改套餐对话框 -->
    <el-dialog
        title="参数设置"
        :visible.sync="editMealDialogVisible"
        width="50%"
        @close="editMealDialogClosed"
        :close-on-click-modal="false"
        >
      <el-form
        :model="editMealForm"
        :rules="editMealFormRules"
        ref="editMealFormRef"
        label-width="100px"
      >
        <el-form-item label="套餐名" prop="mealname">
          <el-input v-model="editMealForm.mealname"></el-input>
        </el-form-item>
        <el-form-item label="套餐价格" prop="mealPrice">
          <el-input v-model="editMealForm.mealPrice"></el-input>
        </el-form-item>
        <el-form-item label="套餐说明" prop="mealDetail">
            <el-input type="textarea" v-model="editMealForm.mealDetail"></el-input>        
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editMealDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editMeal">确 定</el-button>
        </span>
        </el-dialog>

    </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      mealList: [],
			setMealDialogVisible: false,
			editMealDialogVisible: false,
      addMealFormRules: {
        meal_name: [
          { required: true, message: '请输入套餐名', trigger: 'blur' },
        ],
        meal_price: [
          { required: true, message: '请输入套餐价格', trigger: 'blur' },
				],
        desc: [
          { required: true, message: '请输入套餐说明', trigger: 'blur' },
				],      
			},
      addMealForm: {
          meal_name: '',
					meal_price:'',
					meal_introduce: ''
			},
			editMealForm: {},
      editMealFormRules: {
        mealname: [
          { required: true, message: '请输入套餐名', trigger: 'blur' },
        ],
        mealPrice: [
          { required: true, message: '请输入套餐价格', trigger: 'blur' },
				],
        mealDetail: [
          { required: true, message: '请输入套餐说明', trigger: 'blur' },
				],      
			},
    }
  },
  created() {
		this.getMealList()
  },
  methods: {
    back() {
      this.$router.push('/box')
    },
    async getMealList() {
      const { data: res } = await this.$http.get('admin/sporder/getAllMeal')
      if (res.status != 200) {
        return this.$message.error('获取套餐标准失败')
      }
      this.mealList = res.data
    },
    setMealDialogClosed() {
      this.$refs.addMealFormRef.resetFields()
      },
    addMeal(){
      this.$refs.addMealFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/sporder/addMeal',
          this.addMealForm
        )
        // console.log(res)
        if (res.status !== 200) {
          return this.$message.error('添加套餐失败！')
        }
        this.$message.success('添加套餐成功！')
        this.setMealDialogVisible = false
        this.getMealList()
      })
    },
	showEditDialog(row) {
    this.editMealDialogVisible = true
		this.editMealForm = row
	},
	editMealDialogClosed() {
		this.$refs.editMealFormRef.resetFields()
	},
	async editMeal() {
      this.$refs.editMealFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项目')
      })
      const { data: res } = await this.$http.put(
        `admin/sporder/editMeal/${this.editMealForm.id}`,
        {
          meal_name: this.editMealForm.mealname,
          meal_price: this.editMealForm.mealPrice,
          meal_introduce: this.editMealForm.mealDetail
        }
      )
      // console.log(res)
      if (res.status != 200) {
        return this.$message.error('修改套餐失败')
      }
      this.editMealDialogVisible = false
      this.$message.success('修改套餐成功')
      this.getMealList()
	},
	async removeMealById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该套餐, 是否继续?',
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
        'admin/sporder/delMeal/' + id
      )
      if (res.status !== 200) {
        return this.$message.error('删除套餐失败')
      }
      this.$message.info('删除套餐成功')
      this.getMealList()
		},

  },
}
</script>

<style>
.cat_opt {
  margin: 15px 0;
  width: 200px;
  display: flex;
  align-items: flex-start;
}
</style>