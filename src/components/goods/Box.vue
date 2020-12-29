<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食堂管理</el-breadcrumb-item>
      <el-breadcrumb-item>包厢管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="5.5">
          <el-date-picker
            placeholder="请选择时间进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getBoxList()"
            style="width: 300px; float: left; margin-bottom: 20px"
            type="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button icon="el-icon-search" @click="getBoxList()"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7.5">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            @click="setBoxParams()"
            >包厢参数设置</el-button
          >

          <el-button
            type="danger"
            icon="el-icon-notebook-2"
            circl
            @click="setBoxMeal()"
            >订餐标准设置</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-user"
            circl
            @click="setBoxPerson()"
            >预定人员标准设置</el-button
          >
          <el-button
            type="success"
            icon="el-icon-phone"
            circl
            @click="setBoxOffline()"
            >线下预定包厢</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="boxList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="日期" prop="active_time">
          <template slot-scope="scope">
            {{ scope.row.active_time | dateFormat1 }}
          </template>
        </el-table-column>
        <el-table-column label="供餐时间" prop="time"> </el-table-column>
        <el-table-column label="订餐人" prop="user_name"></el-table-column>
        <el-table-column label="包间号" prop="room_name"></el-table-column>
        <el-table-column label="套餐" prop="meal_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditBoxDialog(scope.row)"
              >修改</el-button
            > -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeBox(scope.row.order_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 修改包厢订单的对话框 -->
      <el-dialog
        title="修改线下预定"
        :visible.sync="editOfflineDialogVisible"
        width="50%"
        @close="editOfflineDialogClosed"
        :close-on-click-modal="false"
      >
        <el-form
          :model="editOfflineForm"
          :rules="editOfflineFormRules"
          ref="editOfflineFormRef"
          label-width="130px"
        >
          <el-form-item label="选择订餐日期" prop="active_time">
            <el-date-picker
              v-model="editOfflineForm.active_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择订餐人" prop="user_id">
            <el-select
              v-model="editOfflineForm.user_id"
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
          <el-form-item label="选择包厢" prop="room_id">
            <el-radio-group v-model="editOfflineForm.room_id">
              <el-radio
                v-for="item in roomList"
                :key="item.id"
                :label="item.id"
                >{{ item.roomname }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择订餐时段" prop="time">
            <el-radio-group v-model="editOfflineForm.time">
              <el-radio label="午餐"></el-radio>
              <el-radio label="晚餐"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择套餐" prop="meal_id">
            <el-radio-group v-model="editOfflineForm.meal_id">
              <el-radio
                v-for="item in mealList"
                :key="item.id"
                :label="item.id"
                >{{ item.mealname }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editOfflineDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOffline">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: this.getTime(),
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      boxList: [],
      editOfflineDialogVisible: false,
      editOfflineForm: {},
      ryOptions: [],
      editOfflineFormRules: {
        time: [
          { required: true, message: '请选择订餐时段', trigger: 'change' },
        ],
        meal_id: [{ required: true, message: '请选择套餐', trigger: 'change' }],
        user_id: [{ required: true, message: '请选择人员', trigger: 'change' }],
        room_id: [{ required: true, message: '请选择包厢', trigger: 'change' }],
      },
      mealList: [],
      roomList: [],
      pickerOptions: {
        disabledDate(time) {
          return (time.getTime() + 86400000) <= Date.now();
        }
      }
    }
  },
  created() {
    this.getBoxList()
    this.getRy()
    this.getMealList()
    this.getRoomList()
  },
  methods: {
    getTime() {
        const dt = new Date()
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2,'0')
        const d = (dt.getDate() + '').padStart(2,'0')
        return `${y}-${m}-${d}`   
     },
    async getBoxList() {
      const { data: res } = await this.$http.get(`admin/sporder/getAllRoomOrder/${this.queryInfo.query}`)
      if (res.status != 200) {
        return this.$message.error('获取包厢预定信息失败')
      }
      this.boxList = res.data
    },
      setBoxParams(){
        this.$router.push('/box/params')
      },
      setBoxMeal() {
        this.$router.push('/box/meal')
      },
      setBoxPerson() {
        this.$router.push('/box/person')
      },
      setBoxOffline() {
        this.$router.push('/box/offline')
      },
    async getRy() {
      const { data: res } = await this.$http.get(`admin/jggl/getRy`)
      this.ryOptions = res.data
    },
    async getMealList() {
      const { data: res } = await this.$http.get('admin/sporder/getAllMeal')
      if (res.status != 200) {
        return this.$message.error('获取套餐标准失败')
      }
      this.mealList = res.data
    },
    async getRoomList() {
      const { data: res } = await this.$http.get('admin/sporder/getAllRoom')
      if (res.status != 200) {
        return this.$message.error('获取包厢参数失败')
      }
      this.roomList = res.data
    },
      async showEditBoxDialog(row) {
        this.editOfflineDialogVisible = true
        this.editOfflineForm = row
      },
      editOfflineDialogClosed(row) {
        this.$refs.editOfflineFormRef.resetFields()
      },
      editOffline() {
        this.$refs.editOfflineFormRef.validate(async (valid) => {
          if (!valid) return
          const { data: res } = await this.$http.put(
            'admin/sporder/editRoomOrder/' + this.editOfflineForm.order_id, {
                active_time: this.editOfflineForm.active_time,
                time: this.editOfflineForm.time,
                meal_id: this.editOfflineForm.meal_id,
                user_id: this.editOfflineForm.user_id,
                room_id: this.editOfflineForm.room_id,
            }
          )
          if (res.status !== 200) {
            return this.$message.error('修改包厢订单失败！')
          }
          this.$message.success('修改包厢订单成功！')
          this.editOfflineDialogVisible = false
          this.getBoxList() 
           })     
       },
      async removeBox(id) {
        const confirmResult = await this.$confirm(
          '此操作将删除该包厢订单, 是否继续?',
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
        // console.log(row);
        const { data: res } = await this.$http.delete(
          `admin/sporder/delRoomOrder/${id}`
        )
        if (res.status !== 200) {
          return this.$message.error('删除包厢订单失败！')
        }
        this.$message.info('删除包厢订单成功！')
        this.getBoxList()
      },
  }
}
</script>

<style scoped lang = "less">
</style>