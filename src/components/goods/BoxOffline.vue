<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>食堂管理</el-breadcrumb-item>
      <el-breadcrumb-item>线下包厢预定</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <el-calendar>
        <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
        <template slot="dateCell" slot-scope="{ date, data }">
        <div  @click=" (date.getTime() + 86400000) >= new Date().getTime() ? handleClick(data.day) : ''" style="width: 225px;height:118px;margin: -8px 0 0 -8px;"
          :class="(date.getTime() + 86400000) < new Date().getTime() ? 'noClick' : ''"
          >
          <div :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(1).join('-') }}
          </div>
          <div v-for="item in orderList" :key="item.id">
            <div v-if="item.date.split('-').slice(0)[0].indexOf(data.day.split('-').slice(0)[0]) != -1"> 
            <div
              v-if="item.date.split('-').slice(1)[0].indexOf(data.day.split('-').slice(1)[0]) != -1"
            >
              <div
                v-if="
                  item.date.split('-').slice(2).indexOf(data.day.split('-').slice(2).join('-')) !=
                  -1
                "
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.message"
                  placement="right"
                >
                  <div class="selected">{{ item.message }}</div>
                </el-tooltip>
              </div>
              <div v-else></div>
            </div>
            <div v-else></div>
          </div>
        <div v-else></div>
       </div>
      </div>
        </template>
      </el-calendar>
    </el-card>

    <!-- 线下预定的对话框 -->
    <el-dialog
      title="线下预定"
      :visible.sync="setOfflineDialogVisible"
      width="50%"
      @close="setOfflineDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="setOfflineForm"
        :rules="setOfflineFormRules"
        ref="setOfflineFormRef"
        label-width="130px"
      >
        <el-form-item label="选择订餐日期" prop="active_time">
          <el-date-picker
            v-model="setOfflineForm.active_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            disabled
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="选择订餐人" prop="user_id">
          <el-select
            v-model="setOfflineForm.user_id"
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
          <el-radio-group v-model="setOfflineForm.room_id">
            <el-radio
              v-for="item in roomList"
              :key="item.id"
              :label="item.id"
              >{{ item.roomname }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择订餐时段" prop="time">
          <el-radio-group v-model="setOfflineForm.time">
            <el-radio label="午餐"></el-radio>
            <el-radio label="晚餐"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择套餐" prop="meal_id">
          <el-radio-group v-model="setOfflineForm.meal_id">
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
        <el-button @click="setOfflineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setOffline">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  name: 'calendar',
  data() {
    return {
      calendarData: [
        { id: 1, months: ['09', '11'], days: ['15'], things: '包厢一午餐已定' },
        { id: 2,months: ['10', '12'], days: ['02'], things: '包厢一午餐已定' },
        { id: 3,months: ['12'], days: ['02'], things: '包厢一晚餐已定' },
        { id: 4,months: ['12'], days: ['02'], things: '包厢二晚餐已定' },
        { id: 5, months: ['12'], days: ['02'], things: '包厢二午餐已定' },
      ],
      value: new Date(),
      setOfflineDialogVisible: false,
      setOfflineForm: {
        active_time: '',
        time: '',
        meal_id: '',
        user_id: '',
        room_id: '',
      },
      ryOptions: [],
      setOfflineFormRules: {
        time: [
          { required: true, message: '请选择订餐时段', trigger: 'change' },
        ],
        meal_id: [{ required: true, message: '请选择套餐', trigger: 'change' }],
        user_id: [{ required: true, message: '请选择人员', trigger: 'change' }],
        room_id: [{ required: true, message: '请选择包厢', trigger: 'change' }],
      },

      mealList: [],
      roomList: [],
      boxList: [],
      orderList: [],
      flag: false
    }
  },
  created() {
    this.getRy()
    this.getMealList()
    this.getRoomList()
    this.getOrderAll()
  },
  methods: {
    back() {
      this.$router.push('/box')
    },
    async getOrderAll() {
      const { data: res } = await this.$http.get('admin/sporder/getOrderCal')
      if (res.status != 200) {
        return this.$message.error('获取包厢订单失败')
      }
      this.orderList = res.data
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
    handleClick(data) {
      console.log(data);
      this.setOfflineDialogVisible = true
      this.$nextTick(() => {
        this.$refs.setOfflineFormRef.resetFields()
        this.setOfflineForm.active_time = data.split('-').join('-')
      })
    },
    setOfflineDialogClosed() {
      this.$refs.setOfflineFormRef.resetFields()
    },
    setOffline() {
      this.$refs.setOfflineFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/sporder/orderRoom',
          this.setOfflineForm
        )
        // console.log(res)
        if (res.data.result == '该包厢在该时间段已预定') {
          this.$message.error(res.data.result)
        }
        this.$message.success(res.data.result)
        this.setOfflineDialogVisible = false
        this.getOrderAll()
      })
    },
  },
}
</script>

<style>
/* .el-calendar-table:not(.is-range) td.next,
.el-calendar-table:not(.is-range) td.prev{
  pointer-events: none;
} */

.is-selected {
  color: #1989fa;

}

.selected {
  color: #f8a535;
  font-size: 10px;
  margin-top: 5px;
}

.el-calendar-table .el-calendar-day {
  height: 118px;
}

.noClick {
  background: #d1d1e0!important;
}
</style>