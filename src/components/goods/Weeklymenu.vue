<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订餐管理</el-breadcrumb-item>
      <el-breadcrumb-item>每周菜单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-date-picker
            v-model="value1"
            type="week"
            format="yyyy 第 WW 周"
            value-format="yyyy-MM-dd"
            placeholder="选择周"
            @change="change"
          ></el-date-picker>
        </el-col>
        <el-col class="cat_opt_span">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getWeeklyMenu()"
            >搜索菜单</el-button
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-button
        type="primary"
        size="mini"
        class="start"
        icon="el-icon-plus"
        @click="addDialogVisible = true"
        >添加菜单</el-button
      >
      <el-table :data="weeklymenulist" border stripe>
        <!-- <el-table-column type="expand">
        </el-table-column> -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="日期" prop="time"></el-table-column>
        <el-table-column label="供餐时间" prop="value3">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.value3 === '0'" type="warning">早餐</el-tag>
            <el-tag v-else-if="scope.row.value3 === '1'" type="success"
              >午餐</el-tag
            >
            <el-tag v-else>晚餐</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="dayofweek"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeMenu(scope.row.time, scope.row.value3)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加菜单的对话框 -->
    <el-dialog
      :title="'添加菜单'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addWeeklyMenuForm"
        ref="addWeeklyMenuFormRef"
        label-width="120px"
      >
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="value2"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="选择供餐时间">
          <el-select v-model="value3" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="选择菜单">
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入菜品拼音"
            v-model="value"
            :data="this.goodslist"
            :titles="['可选菜品', '已选菜品']"
            ref="myTransfer"
          ></el-transfer>
        </el-form-item> -->
        <!-- 使用树形穿梭框组件 -->
        <el-form-item label="选择菜单">
          <tree-transfer
            :title="['可选菜品', '已选菜品']"
            :from_data="fromData"
            :to_data="toData"
            :defaultProps="{ label: 'label' }"
            @addBtn="add"
            @removeBtn="remove"
            :mode="mode"
            height="540px"
            filter
            openAll
          >
          </tree-transfer>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWeeklyMenu" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="修改菜单" :visible.sync="editDialogTableVisible" :close-on-click-modal="false">
      <el-table border :data="editMenu.goods" size="small">
        <el-table-column label="菜品图片" prop="pic">
          <template slot-scope="scope">
            <img :src="$picUrl + scope.row.pic" class="image" />
          </template>
        </el-table-column>
        <el-table-column label="菜品种类" prop="name">
        </el-table-column>
        <el-table-column label="菜品份数" prop="number">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.number"
              @change="(value) => handleChange(value, scope)"
              controls-position="right"
              :min="0"
              size="mini"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button
              type="primary"
              size="mini"
              @click="saveNum(scope.row.id, scope.row)"
              v-no-more-click
              >保存</el-button
            > -->
            <el-button
              type="danger"
              size="mini"
              @click.native.prevent="deleteRow(scope.$index, editMenu.goods)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNum" v-no-more-click
          >保存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
import treeTransfer from 'el-tree-transfer'
export default {
  data() {
    return {
      editMenu:[],
      editDialogTableVisible: false,
      num: 0,
      mode: 'transfer', // transfer addressList
      fromData: [],
      toData: [],
      keys: [],
      goodslist: [],
      value: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1
      },
      value1: new Date(new Date(new Date().getTime())),
      value2: new Date(new Date(new Date().getTime())),
      value3: '',
      weeklymenulist: [],
      addDialogVisible: false,
      addWeeklyMenuForm: {},
      options: [
        {
          value: '0',
          label: '早餐',
        },
        {
          value: '1',
          label: '午餐',
        },
        {
          value: '2',
          label: '晚餐',
        },
      ],
    }
  },
  methods: {
    async getDataList() {
      const { data: res } = await this.$http.get('admin/goods/getMenuGoods')
      if (res.status != 200) {
        return this.$message.error('获取商品信息失败')
      }
      console.log(res.data)
      this.fromData = res.data
    },
    // async delNum(id, row) {
    //   console.log(id,row)
    //   const { data: res } = await this.$http.delete(
    //     `admin/goods/delWeeklyMenuGoods/${id}/time/${this.editMenu.time}/${row.value3}`
    //   )
    //   console.log(res)
    //   if (res.status != 200) {
    //     return this.$message.error('删除失败')
    //   }
    //   this.$message.success('删除成功')
    //   this.getWeeklyMenu()
    // },
    async removeMenu(time, val) {
      const confirmResult = await this.$confirm(
        '此操作将删除该菜单, 是否继续?',
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
        `admin/goods/delWeeklyMenuGoods/${time}/${val}`
      )
      if (res.status !== 200) {
        return this.$message.error('删除菜单失败')
      }
      this.$message.info('删除菜单成功')
      this.getWeeklyMenu()
    },
    async getWeeklyMenu() {
      if (this.value1 == '') {
        //  this.$message.warn('请先选择日期')
        this.$message({
          message: '请先选择查询日期',
          type: 'warning',
        })
        return
      }
      const { data: res } = await this.$http.get('admin/goods/getWeeklyMenu', {
        params: {
          time: this.value1,
        },
      })
      if (res.status != 200) {
        return this.$message.error('获取菜单失败')
      }
      this.weeklymenulist = res.data
    },
    async addWeeklyMenu() {
      if (this.value2 == '') {
        this.$message({
          message: '请选择添加日期',
          type: 'warning',
        })
        return
      } else if (this.value3 == '') {
        this.$message({
          message: '请选择供餐时间',
          type: 'warning',
        })
        return
      } else if (this.toData == '') {
        this.$message({
          message: '请选择菜品',
          type: 'warning',
        })
        return
      }
      const { data: res } = await this.$http.post(`admin/goods/addWeeklyMenu`, {
        date: this.value2,
        time: this.value3,
        keys: this.keys,
      })
      if (res.status != 201) {
        return this.$message.error('添加菜单失败')
      }
      if(res.data !== "success") {
        this.keys = []
        return this.$message.error(res.data)
      }
      this.$message.success('添加菜单成功')
      this.addDialogVisible = false
      this.getWeeklyMenu()
    },
    getLeafKeys(node, arr) {
      this.keys = []
      node.forEach((item) => {
        item.children.forEach((item1) => {
          this.keys.push(item1.id)
        })
      })
    },
    addDialogClosed() {
      if (this.$refs.myTransfer) {
        this.$refs.myTransfer.$children['0']._data.query = ''
        // 清空右边搜索
        this.$refs.myTransfer.$children['3']._data.query = ''
      }
      this.value2 = new Date(new Date(new Date().getTime()))
      this.value3 = ''
      this.goodslist = []
      this.value = []
      this.keys = []
      this.toData = []
      this.$refs.addWeeklyMenuFormRef.resetFields()
      this.getDataList()
    },
    change() {
      if (!this.value1) {
        this.weeklymenulist = []
      }
    },
    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {
      if (this.mode == 'transfer') {
        this.mode = 'addressList'
      } else {
        this.mode = 'transfer'
      }
    },
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
      this.toData = toData
      this.getLeafKeys(this.toData, this.keys)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log('fromData:', fromData)
      console.log('toData:', toData)
      console.log('obj:', obj)
      this.toData = toData
      this.getLeafKeys(this.toData, this.keys)
    },
    handleChange(value, scope) {
      console.log(value, scope)
      this.num = value
    },
    async saveNum() {
      console.log(this.editMenu);
      const { data: res } = await this.$http.put(
        `admin/goods/weeklyMenuGoods`,
        {
          menu: this.editMenu.goods,
          time: this.editMenu.time,
          value3: this.editMenu.value3
        }
      )
      if (res.status != 200) {
        return this.$message.error('修改菜单失败')
      }

      this.$message.success('修改菜单成功')
      this.editDialogTableVisible = false
      this.getWeeklyMenu()

    },
    showEditDialog(row) {
      this.editDialogTableVisible = true
      console.log(row);
      this.editMenu = row
    },
    deleteRow(index, rows) {
        rows.splice(index, 1);
      }
  },
  components: { treeTransfer }, // 注册
  created() {
    this.getDataList()
    this.getWeeklyMenu()
  },
}
</script>



<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
  width: 200px;
  display: flex;
  align-items: flex-start;
}
.cat_opt_span {
  width: 100px;
  margin: 15px 10px;
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
.image {
  width: 60px;
  height: 60px;
}
</style>