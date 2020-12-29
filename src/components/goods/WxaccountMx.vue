<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户流水详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>

      <el-table :data="mxlist" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="订单号" prop="order_id"></el-table-column>
        <el-table-column label="时间" prop="create_time"></el-table-column>
        <el-table-column label="金额" prop="balance"></el-table-column>
        <el-table-column label="交易类型" prop="lx">
            <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.lx === '1'">充值</el-tag>
                <el-tag type="info" v-else-if="scope.row.lx === '2'">退款</el-tag>
                <el-tag type="danger" v-else>消费</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="余额" prop="profit"></el-table-column>
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
  </div>
</template>


<script>
export default {
  data() {
    return {
      id: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      mxlist: [],
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getMxList(this.id)
  },
  methods: {
    back() {
        this.$router.push('/wxaccount');
    },
     handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getMxList(this.id)
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getMxList(this.id)
    },
    async getMxList(id){

      const { data: res } = await this.$http.get(`admin/sporder/getMxList/?pagenum=${this.queryInfo.pagenum}&pagesize=${this.queryInfo.pagesize}&userId=${id}`)

      if (res.status != 200) return this.$message.error('获取用户账户失败！')

      this.mxlist = res.data.list
      this.total = res.data.total

    }
  },
}
</script>


<style scoped lang = "less">
.cat_opt {
  margin: 15px 0;
  width: 200px;
  display: flex;
  align-items: flex-start;
}
</style>