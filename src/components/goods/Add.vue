<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="this.$route.query.id"
        >修改商品</el-breadcrumb-item
      >
      <el-breadcrumb-item v-else>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <el-alert
        title="修改商品信息"
        type="info"
        center
        show-icon
        :closable="false"
        v-if="this.$route.query.id"
      ></el-alert>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
        v-else
      ></el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="value">
              <!-- <el-cascader
                :options="catelist"
                :props="cateProps"
                v-model="addForm.goods_cat"
                clearable
                @change="handleChange"
              ></el-cascader> -->
              <el-select v-model="addForm.value" placeholder="请选择" clearable @change="change">
                <el-option
                  v-for="item in catelist"
                  :key="item.id"
                  :label="item.catName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <el-upload
              :action="uploadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              :file-list="filelist"
            >
              <el-button type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="2">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button
              type="primary"
              class="btn"
              @click="edit()"
              v-if="this.$route.query.id"
              v-no-more-click
              >修改商品</el-button
            >
            <el-button
              type="primary"
              class="btn"
              @click="add"
              v-else
              v-no-more-click
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <img :src="perivewPath" alt class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        pics: [],
        goods_introduce: '',
        value: '',
      },
      
      filelist: [{url: ''}],
      catelist: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        value: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      uploadUrl: this.$url + '/upload/uploadPic',
      // uploadUrl: 'http://183.136.134.154:9000/api/upload/uploadPic',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      perivewPath: '',
      previewDialogVisible: false,
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getDetail()
    }
    this.getCateList()
  },
  methods: {
    back() {
      this.$router.push('/goods')
    },
    async getCateList() {
      const { data: res } = await this.$http.get('admin/params/getCate')
      if (res.status != 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.catelist = res.data
      this.filelist = []
      console.log(this.catelist)
    },
    async getDetail(id) {
      const { data: res } = await this.$http.get(
        `admin/goods/getDetail/${this.$route.query.id}`
      )
      console.log(res)
      if (res.status != 200) {
        return this.$message.error('获取商品信息失败！')
      }
      this.addForm.goods_name = res.data.goodsName
      this.addForm.goods_price = res.data.goodsPrice
      this.addForm.goods_introduce = res.data.goodsIntroduce
      this.addForm.value = res.data.value
      this.filelist.unshift({url: this.$picUrl + res.data.pic})
    },
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName)
      // console.log(oldActiveName)
      // return false
      if (oldActiveName === '0' && !this.addForm.value) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    handlePreview(file) {
      //图片预览效果
      console.log(file);
      this.perivewPath = file.url
      this.previewDialogVisible = true
    },
    handleRemove(file) {
      //图片删除
      const filePath = file.response.tmp_path
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      this.addForm.pics.splice(i, 1)
    },
    handleSuccess(response, file, fileList) {
      const picInfo = { pic: response.tmp_path }
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    async add() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项目')
      })
      //深拷贝lodash  cloneDeep(obj)
      const form = _.cloneDeep(this.addForm)
      const { data: res } = await this.$http.post('admin/goods/addGoods', form)
      console.log(res)
      if (res.status != 201) {
        return this.$message.error('添加商品据失败')
      }

      this.$message.success('添加商品成功')
      this.$router.push('/goods')
    },
    async edit(id) {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项目')
      })

      //深拷贝lodash  cloneDeep(obj)
     let a = JSON.parse(JSON.stringify(this.filelist[0]).replace(/url/g,"pic"))
     this.addForm.pics.push({pic: a.pic})
    //  this.addForm.pics.push({pic: a.pic.includes(this.$picUrl) ? a.pic.substr(27,a.pic.length-27) : a.pic})
    //  this.addForm.value = this.value
      const form = _.cloneDeep(this.addForm)
      console.log(this.addForm.pics);
      const { data: res } = await this.$http.put(
        `admin/goods/editGoods/${this.$route.query.id}`,
        form
      )
      // console.log(res)
      if (res.status != 200) {
        return this.$message.error('修改商品据失败')
      }

      this.$message.success('修改商品成功')
      this.$router.push('/goods')
    },
    change(e) {
      console.log(e);
      this.value = e
    }
  },
}
</script>


<style scoped lang="less">
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.el-button {
  text-align: left;
}
.previewImg {
  width: 100%;
}
.btn {
  display: flex;
  align-items: flex-start;
  margin-top: 15px;
}
.cat_opt {
  margin: 15px 0;
  width: 200px;
  display: flex;
  align-items: flex-start;
}
</style>