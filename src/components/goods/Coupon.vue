<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>优惠券管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入名称进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getCouponList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCouponList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加优惠券</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="couponlist" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="名称" prop="pName"></el-table-column>
        <el-table-column label="满减金额" prop="pRequest"></el-table-column>
        <el-table-column label="可减金额" prop="pPrice"></el-table-column>
        <el-table-column label="使用期限" prop="activeTime">
          <!-- <template slot-scope="scope">
            {{scope.row.activeTime | dateFormat}}
          </template> -->
        </el-table-column>
        <!-- <el-table-column label="角色" prop="roleName"></el-table-column> -->
        <el-table-column label="操作">
          <template width="180px" slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeCouponById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-s-check"
              @click="handleCoupon(scope.row.id,scope.row.pName)"
              >派发</el-button
            >
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

    <!-- 添加优惠券对话框 -->
    <el-dialog
      title="添加优惠券"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="满减金额" prop="totalPrice">
          <el-input v-model="addForm.totalPrice"></el-input>
        </el-form-item>
        <el-form-item label="可减金额" prop="price">
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="使用期限" prop="active_date">
          <el-date-picker
            v-model="addForm.active_date"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCoupon" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改优惠券对话框 -->
    <el-dialog
      title="修改优惠券"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="名称" prop="pName">
          <el-input v-model="editForm.pName"></el-input>
        </el-form-item>
        <el-form-item label="满减金额" prop="pRequest">
          <el-input v-model="editForm.pRequest"></el-input>
        </el-form-item>
        <el-form-item label="可减金额" prop="pPrice">
          <el-input v-model="editForm.pPrice"></el-input>
        </el-form-item>
        <el-form-item label="使用期限" prop="activeTime">
          <el-date-picker
            v-model="editForm.activeTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            disabled
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCoupon" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 派发优惠券  -->
    <el-dialog
      :title="this.couName"
      :visible.sync="handleDialogVisible"
      width="50%"
      @close="handleDialogClosed"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="8">
          <tree-select
            :data="data"
            :defaultProps="defaultProps"
            multiple
            :nodeKey="nodeKey"
            :checkedKeys="checkedKeys"
            @popoverHide="popoverHide"
          ></tree-select>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" icon="el-icon-search" @click="getJgRyList"
            >查询</el-button
          >
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="ryList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <!-- <el-table-column
                      label="工号"
                      prop="gongh"
                    ></el-table-column> -->
        <el-table-column label="手机" prop="mobile"></el-table-column>
        
        <el-table-column label="优惠券数量" prop="number">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              @change="(value) => handleChange(value, scope)"
              controls-position="right"
              :min="1"
              size="mini"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="queryInfo1.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo1.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveHandleCoupon" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
import TreeSelect from '../../components/common/tree-select.vue'
export default {
  components: { TreeSelect },
  data() {
    return {
      data: [],
      defaultProps: {
        value: 'id',
        label: 'jgName',
        children: 'children',
      },
      nodeKey: 'id',
      defaultCheckedKeys: [],
      checkedKeys: [],
      ryList: [],
      jgid: [],
      multipleSelection: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      queryInfo1: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      couponlist: [],
      total: 0,
      total1: 0,
      couName: '',
      couId: '',
      handleDialogVisible: false,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        name: '',
        totalPrice: '',
        price: '',
        active_date: '',
      },
      setRoleDialogVisible: false,
      editForm: {},
      addFormRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' },
        ],
        totalPrice: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        price: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        active_date: [
          { required: true, message: '请输入使用期限', trigger: 'blur' },
        ],
      },
      editFormRules: {
        pName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' },
        ],
        pRequest: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        pPrice: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        activeTime: [
          { required: true, message: '请输入使用期限', trigger: 'blur' },
        ],
      },
      couponinfo: {
        //分配角色用户信息
      },
      rolesList: [
        //所有角色的数据列表
      ],
      selectedRoleId: '',
    }
  },
  created() {
    this.getCouponList()
    this.defaultCheckedKeys = []
  },
  mounted() {
    // 此处初始化defaultCheckedKeys，没效果
    this.defaultCheckedKeys = []
  },
  methods: {
    handleChange(value, scope) {
      console.log(value, scope)
      // this.num = value
    },
    popoverHide(checkedIds, checkedData) {
      // console.log(checkedIds)
      // console.log(checkedData)
      this.jgid = checkedIds
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    async getCouponList() {
      const { data: res } = await this.$http.get(
        `admin/wxusers/getAllPrompt/${this.queryInfo.pagenum}/${this.queryInfo.pagesize}/?query=${this.queryInfo.query}`
      )

      if (res.status != 200) return this.$message.error('获取优惠券列表失败！')

      this.couponlist = res.data.list
      this.total = res.data.total
      console.log(res)
    },

    async getJgRyList() {
      const { data: res } = await this.$http.get(
        `admin/jggl/getJgRyById?jgid=${this.jgid}`
      )
      if (res.status != 200) return this.$message.error('获取人员信息失败！')
      // console.log(this.ryList)
      
        for(var i=0;i<res.data.length;i++){
            res.data[i].num = 1;
        }
      this.ryList = res.data
      this.total1 = res.data.total
    },
    handleCoupon(id,name) {
      this.handleDialogVisible = true
      this.couName = '派发优惠券--'+name
      this.couId = id
      this.getJgTree()
    },
    async getJgTree() {
      const { data: res } = await this.$http.get('admin/jggl/getJgTree')

      if (res.status != 200) return this.$message.error('获取机构列表失败！')

      this.data = res.data
    },
    async saveHandleCoupon() {
       const { data: res } = await this.$http.post('admin/jggl/saveCouponByUser',{
         multipleSelection: this.multipleSelection,
         couId: this.couId
       })


       if (res.status != 201) return this.$message.error('派发优惠券失败！')
       this.$message.info('派发优惠券成功！')
       this.handleDialogVisible = false

    },
    handleDialogClosed() {},
    handleSizeChange(pageSize) {
      // console.log(`每页 ${pageSize} 条`)
      this.queryInfo.pagesize = pageSize
      this.getCouponList()
    },
    handleSizeChange1(pageSize) {
      // console.log(`每页 ${pageSize} 条`)
      this.queryInfo1.pagesize = pageSize
      this.getJgRyList()
    },
    handleCurrentChange(pageNum) {
      // console.log(`当前页: ${pageNum}`)
      this.queryInfo.pagenum = pageNum
      this.getCouponList()
    },
    handleCurrentChange1(pageNum) {
      // console.log(`当前页: ${pageNum}`)
      this.queryInfo1.pagenum = pageNum
      this.getJgRyList()
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addCoupon() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          'admin/wxusers/addPrompt',
          this.addForm
        )
        // console.log(res)
        if (res.status !== 201) {
          return this.$message.error('添加优惠券失败！')
        }
        this.$message.success('添加优惠券成功！')
        this.addDialogVisible = false
        this.getCouponList()
      })
    },
    async showEditDialog(row) {
      console.log(row)
      // const { data: res } = await this.$http.get('admin/users/getUser/' + id)
      // if (res.status !== 200) {
      //   return this.$message.error('查询用户数据失败')
      // }
      // this.editForm = res.data

      this.editForm = row
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.getCouponList()
      // Object.assign(this.$data.editForm, this.$options.data().editForm)
    },
    editCoupon() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admin/wxusers/prompt/' + this.editForm.id,
          {
            name: this.editForm.pName,
            active_date: this.editForm.activeTime,
            price: this.editForm.pPrice,
            totalPrice: this.editForm.pRequest
          }
        )
        if (res.status !== 200) {
          return this.$message.error('修改优惠券失败！')
        }
        this.$message.success('修改优惠券成功！')
        this.editDialogVisible = false
        this.getCouponList()
      })
    },
    async removeCouponById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该优惠券信息, 是否继续?',
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
        'admin/wxusers/delPrompt/' + id
      )
      if (res.status !== 200) {
        return this.$message.error('删除优惠券失败')
      }
      this.$message.info('删除优惠券成功')
      this.getCouponList()
    },
  },
}
</script>


<style scoped lang="less">
</style>