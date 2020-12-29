<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品图片" width="100px">
          <template slot-scope="scope">
            <img :src="$picUrl + scope.row.pic" alt="">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goodsPrice"></el-table-column>
        <el-table-column prop="value">
          <template slot="header" slot-scope={}>
            <el-select
                v-model="search"
                filterable
                placeholder="请选择分类进行搜索"
                @change="cateChange"
                clearable
                @clear="getGoodsList"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.id"
                  :label="item.catName"
                  :value="item.catName"
                >
                </el-option>
              </el-select>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间" >
            <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column> -->
        <el-table-column label="商品介绍" >
            <template slot-scope="scope">{{scope.row.goodsIntroduce.replace(/&lt;.*?&gt;/ig, "")}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGoodsPage(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.id)"></el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      goodsList: [],
      cateList:[],
    }
  },
  created() {
    this.getGoodsList()
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('admin/categories/getCate?type=3', {
        params: this.queryInfo,
      })

      if (res.status !== 200) {
        return this.$message.info('获取商品分类失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
      // this.total = res.data.total
    },

    async getGoodsList() {
      const { data: res } = await this.$http.get('admin/goods/list', {
        params: this.queryInfo,
      })
      if (res.status != 200) return this.$message.error('获取商品失败')

    console.log(res)
      // this.$message.success('获取商品成功')
      this.goodsList = res.data.list
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    async removeById(id){
       const confirmResult = await this.$confirm('此操作将删除该该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err)

        if(confirmResult !== 'confirm'){
          return this.$message.info('已经取消删除操作')
        }

        const { data:res} = await this.$http.delete(`admin/goods/${id}`)
        console.log(res)
        if (res.status != 200) return this.$message.error('删除失败')

        this.$message.success('删除成功')
        this.getGoodsList()

    },
    addGoodsPage(){
      this.$router.push('/goods/add')
    },
    editGoodsPage(id) {
      this.$router.push('/goods/add?id='+ id)
    },
    cateChange(row) {
      console.log(row);
      this.queryInfo.query = row
      this.getGoodsList()
    }
  },
}
</script>


<style scoped lang="less">
.cell img {
  width: 70px!important;
  height: 70px!important;
}
</style>