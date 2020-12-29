<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订餐管理</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <!-- <el-col :span="8">
          <el-input
            placeholder="请输入姓名进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getWxAccountList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getWxAccountList()"
            ></el-button>
          </el-input>
        </el-col> -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialog">个人充值</el-button>
          <el-button type="primary" @click="addAllUserDialog"
            >批量充值</el-button
          >
           <!-- <el-button type="primary" @click="exportFile">下载模板</el-button> -->
        </el-col>
      </el-row>

      <el-tabs
        v-model="activeName"
        @tab-click="handleTabsClick"
        style="margin-top: 20px"
      >
        <el-tab-pane label="账户详情" name="many">
          <el-input
            placeholder="请输入姓名进行搜索"
            v-model="queryInfo.query"
            clearable
            @clear="getWxAccountList()"
            style="width: 300px!important; float: left;margin-bottom: 20px"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getWxAccountList()"
            ></el-button>
          </el-input>
          <el-table :data="accountlist" border :stripe="true">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="所属单位" prop="jgmc"></el-table-column>
            <el-table-column label="手机号码" prop="mobile"></el-table-column>
            <el-table-column label="账户余额" prop="balance"></el-table-column>
            <el-table-column label="操作">
              <template width="180px" slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-info"
                  @click="checkLs(scope.row.id)"
                  >查看流水</el-button
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
        </el-tab-pane>
        <el-tab-pane label="充值流水" name="only">
          <el-date-picker
            placeholder="请选择时间进行搜索"
            v-model="paramsInfo.query1"
            clearable
            @clear="getCzAccountList()"
            style="width: 300px; float: left;margin-bottom: 20px"
            type="date"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
              <el-button
              icon="el-icon-search"
              style="margin-left: -1267px!important;"
              @click="getCzAccountList()"
            ></el-button>
          <el-table :data="czAccountlist" border :stripe="true">
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="订单号" prop="id"></el-table-column>
            <el-table-column label="充值人" prop="username"></el-table-column>
            <el-table-column label="充值时间" prop="createTime"></el-table-column>
            <!-- <el-table-column label="账户余额" prop="balance"></el-table-column> -->
            <el-table-column label="操作">
              <template width="180px" slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-info"
                  @click="checkXq(scope.row.id)"
                  >查看详情</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChanged"
            @current-change="handleCurrentChanged"
            :current-page="paramsInfo.pagenum1"
            :page-sizes="[1, 5, 10, 100]"
            :page-size="paramsInfo.pagesize1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAll"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 批量充值的对话框 -->
    <el-dialog
      :title="'账户充值'"
      :visible.sync="addAllDialogVisible"
      align="left"
      width="30%"
      @close="addAllDialogClosed"
      :close-on-click-modal="false"
    >
      <div>
        <p align="left">
          选择机构：
          <el-cascader
            :options="jglist"
            :props="jgProps"
            v-model="editForm.jgSelect"
            clearable
            @change="handleChange"
          ></el-cascader>
        </p>
        <!-- <p align="left">
          选择人员：
          <el-select v-model="value" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </p> -->
        <p align="left">
          充值金额：
          <el-input-number
            v-model="num"
            controls-position="right"
            :max="1000"
          ></el-input-number>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAllDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAllAccount" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

  <!-- 单个充值的对话框 -->
    <el-dialog
      :title="'账户充值'"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addRyForm"
        :rules="addRyFormRules"
        ref="addRyFormRef"
        label-width="100px"
      >
        <el-form-item label="姓名：">
          <!-- <el-input v-model="addRyForm.ryName"></el-input> -->
          <el-select
            v-model="value2"
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
      </el-form>
      <div>
        <p align="left" style="margin-left: 28px">
          充值金额：
          <el-input-number
            v-model="number"
            controls-position="right"
            :max="1000"
          ></el-input-number>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAccount" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

  <!-- 导入列表的对话框 -->
    <el-dialog
      :title="'导入文件'"
      :visible.sync="importDialogVisible"
      width="30%"
      @close="importDialogClosed"
      :close-on-click-modal="false"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        :headers="headers"
        :on-success="handleSuccess"
        :on-error="handleError"
        drag
        :action="baseUrl"
        multiple
        :auto-upload="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">只能上传xls文件 <el-button class="export" size="mini" type="success" @click="exportFile">下载模板</el-button></div>
        
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
import _ from 'lodash'

export default {
  data() {
    return {
      addRyForm: {},
      value2: '',
      ryOptions: [],
      activeName: 'many',
      num: 0,
      number: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      paramsInfo: {
        query1: '',
        pagenum1: 1,
        pagesize1: 10,
      },
      total: 0,
      totalAll: 0,
      accountlist: [],
      czAccountlist: [],
      addAllDialogVisible: false,
      importDialogVisible: false,
      baseUrl: this.$url + '/admin/wxusers/importMoneyList',
      addDialogVisible: false,
      editForm: {
        userId: '',
        jgSelect: [],
      },
      editFormSingle: {},
      jglist: [],
      jgProps: {
        value: 'id',
        label: 'jgName',
        children: 'children',
      },
      options: [],
      value: '',
      addRyFormRules: {},
    }
  },
  created() {
    this.getWxAccountList()
    this.getCzAccountList()
  },
  computed: {
    headers() {
      return {
        Authorization: window.sessionStorage.getItem('token'),
      }
    }
  },
  methods: {
    async getRy() {
      const { data: res } = await this.$http.get(`admin/jggl/getRy`)
      this.ryOptions = res.data
    },

    // numhandleChange(value) {
    //   this.num = value
    // },
    async getWxAccountList() {
      const { data: res } = await this.$http.get('admin/sporder/getAccount', {
        params: this.queryInfo,
      })

      if (res.status != 200)
        return this.$message.error('获取用户账户信息失败！')

      this.accountlist = res.data.list
      this.total = res.data.total
      // console.log(res)
    },
    async getCzAccountList() {
      const { data: res } = await this.$http.get(`admin/wxusers/adminPage/${this.paramsInfo.pagenum1}/${this.paramsInfo.pagesize1}?time=${this.paramsInfo.query1}`
      )

      if (res.status != 200)
        return this.$message.error('获取充值流水信息失败！')

      this.czAccountlist = res.data.list
      this.totalAll = res.data.total
      // console.log(res)
    },
    async handleChange() {
      if (this.editForm.jgSelect.length !== 5) {
        this.editForm.jgSelect = [] //选中的不是五级分类
        this.value = ''
        this.options = []
        return
      }
      const { data: res } = await this.$http.get(
        `admin/wxusers/getWxUserByJg/${this.editForm.jgSelect[4]}`
      )
      if (res.status != 200) {
        return this.$message.error('获取机构信息失败')
      }
      console.log(res.data)
      res.data.forEach((wxusers, index) => {
        this.options.push(wxusers.id)
        // this.options.push({
        //   value: wxusers.id,
        //   label: wxusers.nickname,
        // })
      })
    },
    addAllUserDialog() {
      this.importDialogVisible = true
      // this.getJgList()
    },
    async getJgList() {
      const { data: res } = await this.$http.get('admin/jggl/getJgTree')
      // if (res.status != 200) {
      //   return this.$message.error('获取机构信息失败')
      // }

      // this.jglist = res.data
      //   console.log(this.catelist)
      // const { data: res } = await this.$http.get(
      //   'admin/jggl/getJgTreeByLevel/4'
      // )
      if (res.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      if (res.data != null) {
        this.jglist = this.getTreeData(res.data)
      }
    },
    
    // 递归判断列表，把最后的children设为undefined
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children)
        }
      }
      return data
    },
    handleError(err, file, fileList) {
      this.$message.error(err)
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      // console.log(file)
      if(response.success === 'success') {
        this.$message.info('充值成功')
        this.importDialogVisible = false
        this.getWxAccountList()
      }else {
        this.$message.error('表格数据有误，请重新上传！')
        return
      }
    },
    importDialogClosed() {
      this.$refs.upload.clearFiles()
    },
    importConfirm() {
      this.$refs.upload.submit()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getWxAccountList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getWxAccountList()
    },
    handleSizeChanged(newSize1) {
      this.paramsInfo.pagesize1 = newSize1
      this.getCzAccountList()
    },
    handleCurrentChanged(newNum1) {
      this.paramsInfo.pagenum1 = newNum1
      this.getCzAccountList()
    },
    addAllDialogClosed() {
      this.editForm.jgSelect = []
      this.options = []
      // this.value = ''
      this.num = 1
    },
    addDialogClosed() {
      this.value2 = ''
      this.number = 1
    },
    async addAllAccount() {
      const form = _.cloneDeep(this.editForm)
      form.userId = this.options
      form.num = this.num
      const { data: res } = await this.$http.post(
        'admin/sporder/addAccount',
        form
      )
      // console.log(res)
      if (res.status !== 201) {
        return this.$message.error('充值失败！')
      }
      this.$message.success('充值成功！')
      this.addAllDialogVisible = false
      this.getWxAccountList()
      this.getCzAccountList()
    },
    addUserDialog() {
      this.getRy()
      this.addDialogVisible = true
    },
    async addAccount() {
      const formSingle = _.cloneDeep(this.editFormSingle)
      formSingle.user = this.value2
      formSingle.number = this.number
      const { data: res } = await this.$http.post(
        'admin/sporder/addForOne',
        formSingle
      )
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('用户充值失败！')
      }
      this.$message.success('用户充值成功！')
      this.addDialogVisible = false
      this.getWxAccountList()
      this.getCzAccountList()
    },
    checkLs(id) {
      //   console.log(id)
      this.$router.push({ path: '/goods/wxaccountmx', query: { id: id } })
    },
    checkXq(id) {
      this.$router.push({ path: '/goods/wxaccountxq', query: { id: id } })
    },
    handleTabsClick() {},
    exportFile() {
      this.$http
        .request({
          url: 'admin/wxusers/exportMoneyList',
          method: 'get',
          responseType: 'blob',
        })
        .then((res) => {
          //将文件流转成blob形式
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel',
          })

          let filename = decodeURIComponent(res.headers['filename'])
          //创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
          const eLink = document.createElement('a')
          eLink.download = filename
          eLink.style.display = 'none'
          eLink.href = URL.createObjectURL(blob)
          document.body.appendChild(eLink)
          eLink.click()
          URL.revokeObjectURL(eLink.href) // 释放URL 对象
          document.body.removeChild(eLink)
        })
        .catch((error) => {
          this.$message.error('导出失败')
        })
    },
  },
}
</script>



<style scoped lang="less">
.el-input--small .el-input__inner {
  width: 170px;
  margin-left: -25px !important;
}
.export {
  margin-left: 10px;
}
</style>