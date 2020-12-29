<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="7.5">
          <!-- <el-input placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input> -->
          <el-date-picker
            v-model="queryInfo.query"
            type="daterange"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button
            icon="el-icon-search"
            @click="getOrderList()"
          ></el-button>
        </el-col>
      </el-row>

      <el-table
        :data="orderlist"
        border
        stripe
        show-summary
        :summary-method="getSummaries"
        :header-cell-style="{'text-align':'center'}"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="订单编号" prop="id" align="center"></el-table-column>
        <el-table-column label="订餐用户" prop="username" align="center"></el-table-column>
        <el-table-column label="订餐方式" prop="orderNumber" align="center" width="210px">
          <template slot="header">
            <el-select
                v-model="search"
                filterable
                placeholder="请选择分类进行搜索"
                @change="cateChange"
                clearable
                @clear="getOrderList"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.id"
                  :label="item.catName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.orderPay === '1'">微信下单</span>
            <span v-else>堂食下单</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单价格"
          prop="orderPriceMinus"
          align="right"
        ></el-table-column>
        <el-table-column label="优惠金额" prop="promptPrice" align="right">
        </el-table-column>
        <el-table-column label="实付金额" prop="orderPrice" align="right">
        </el-table-column>
        <el-table-column label="是否付款" prop="payStatus" align="center">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.payStatus === '5'"
              >取消订单</el-tag
            >
            <el-tag type="danger" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否取餐" prop="isSend" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payStatus === '2'"
              >已取餐</el-tag
            >
            <el-tag v-else-if="scope.row.payStatus === '3'">已备餐</el-tag>
            <el-tag type="info" v-else-if="scope.row.payStatus === '5'"
              >取消订单</el-tag
            >
            <el-tag type="warning" v-else-if="scope.row.payStatus === '1'"
              >备餐中</el-tag
            >
            <el-tag type="danger" v-else>去评价</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单时间" prop="createTime" align="center">
          <template slot-scope="scope">{{
            scope.row.createTime | dateFormat
          }}</template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeOrderById(scope.row.id)"></el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: [this.getTime(),this.getTime()],
        pagenum: 1,
        pagesize: 10,
        type: ''
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      search: '',
      cateList: [
        {id: 0, catName: '堂食下单'},
        {id: 1, catName: '微信下单'}
      ]
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getTime() {
        const dt = new Date()
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2,'0')
        const d = (dt.getDate() + '').padStart(2,'0')
        return `${y}-${m}-${d}`   
     },
    async getOrderList() {
      const { data: res } = await this.$http.get(`admin/sporder/page?pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}&query=${this.queryInfo.query[0]}&endTime=${this.queryInfo.query[1]}&type=${this.queryInfo.type}`)
      if (res.status != 200) return this.$message.error('获取订单列表失败')

      console.log(res.data)
      this.total = res.data.total
      this.orderlist = res.data.list
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    async removeOrderById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该订单, 是否继续?',
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
      const { data: res } = await this.$http.delete('admin/sporder/' + id)
      if (res.status !== 200) {
        return this.$message.error('删除订单失败')
      }
      this.$message.info('删除订单成功')
      this.getOrderList()
    },
    change() {
      if (!this.queryInfo.query) {
        this.orderlist = []
        this.total = 0
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
        } else if (index === 4 || index === 5 || index === 6) {
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
           sums[index] = Math.round(sums[index] * Math.pow(10,2)) / Math.pow(10,2) 
           sums[index] = Number(sums[index]).toFixed(2) 
          } else {
            sums[index] = 'N/A'
          }
        } else {
          sums[index] = '--'
        }
      })
      return sums
    },
    cateChange(row) {
      console.log(row);
      this.queryInfo.type = row
      this.getOrderList()
    }
  },
}
</script>


<style scoped lang="less">
.el-cascader {
  width: 100%;
}
.el-timeline-item {
  text-align: left;
}
</style>