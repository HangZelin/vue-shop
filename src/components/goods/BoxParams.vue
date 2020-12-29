<template>
   <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>食堂管理</el-breadcrumb-item>
        <el-breadcrumb-item>包厢参数设置</el-breadcrumb-item>
      </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col class="cat_opt">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
        <el-col class="cat_opt">
          <el-button type="primary" @click="addParamsDialogVisible = true">添加包厢</el-button>
        </el-col>
      </el-row>
      <el-table :data="roomList" border :stripe="true">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="包厢名称" prop="roomname"></el-table-column>
        <el-table-column label="包厢照片" width="800px" >
          <template slot-scope="scope">
            <img :src="$picUrl + scope.row.roomPics" alt="" class="pic">
          </template>
        </el-table-column>
        <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button type="primary"  size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeParamsById(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

    <!-- 添加包厢对话框 -->
    <el-dialog
        title="参数设置"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="addParamsDialogClosed"
        :close-on-click-modal="false"
        >
      <el-form
        :model="addParamsForm"
        :rules="addParamsFormRules"
        ref="addParamsFormRef"
        label-width="100px"
      >
        <el-form-item label="包厢名称" prop="room_name">
          <el-input v-model="addParamsForm.room_name"></el-input>
        </el-form-item>
        <el-form-item label="包厢照片">
            <el-upload
              :action="uploadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              ref="upload"
            >
              <el-button type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            title="图片预览"
            :visible.sync="previewDialogVisible"
            width="50%"
            :close-on-click-modal="false"
            >
      <img :src="perivewPath" alt class="previewImg" />
    </el-dialog>


<!-- 修改包厢的对话框 -->
    <el-dialog
        title="修改参数"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="editParamsDialogClosed"
        :close-on-click-modal="false"
        >
      <el-form
        :model="editParamsForm"
        :rules="editParamsFormRules"
        ref="editParamsFormRef"
        label-width="100px"
      >
        <el-form-item label="包厢名称" prop="roomname">
          <el-input v-model="editParamsForm.roomname"></el-input>
        </el-form-item>
        <el-form-item label="包厢照片">
            <el-upload
              :action="uploadUrl"
              :headers="headerObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="handleSuccess"
              ref="upload"
              :file-list="filelist"
            >
              <el-button type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
        </el-form-item>
      </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editParamsDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
        </el-dialog>
        <el-dialog
            title="图片预览"
            :visible.sync="previewDialogVisible"
            width="50%"
            :close-on-click-modal="false"
            >
      <img :src="perivewPath" alt class="previewImg" />
    </el-dialog>

    </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      roomList: [],
      addParamsDialogVisible: false,
      previewDialogVisible: false,
      editParamsDialogVisible: false,
      addParamsFormRules: {
        room_name: [
          { required: true, message: '请输入包厢名称', trigger: 'blur' },
        ],
      },
      uploadUrl: this.$url + '/upload/uploadPic',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      perivewPath: '',
      addParamsForm: {
          room_name: '',
          pics:[]
      },
      editParamsForm: {},
      editParamsFormRules: {
        roomname: [
          { required: true, message: '请输入包厢名称', trigger: 'blur' },
        ],
      },
      filelist: [{url: ''}],
    }
  },
  created() {
    this.getRoomList()
  },
  methods: {
    back() {
      this.$router.push('/box')
    },
    async getRoomList() {
      const { data: res } = await this.$http.get('admin/sporder/getAllRoom')
      if (res.status != 200) {
        return this.$message.error('获取包厢参数失败')
      }
      this.roomList = res.data
      this.filelist = []
    },
    addParamsDialogClosed() {
      this.$refs.upload.clearFiles()
      this.$refs.addParamsFormRef.resetFields()
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
      const i = this.addParamsForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      this.addParamsForm.pics.splice(i, 1)
    },
    handleSuccess(response, file, fileList) {
      const picInfo = { pic: response.tmp_path }
      this.addParamsForm.pics.push(picInfo)
      this.editParamsForm.pics.push(picInfo)
      console.log(this.addParamsForm.pics)
    },
    addParams(){
      this.$refs.addParamsFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/sporder/addRoom',
          this.addParamsForm
        )
        // console.log(res)
        if (res.status !== 200) {
          return this.$message.error('添加包厢参数失败！')
        }
        this.$message.success('添加包厢参数成功！')
        this.addParamsDialogVisible = false
        this.getRoomList()
      })      
    },
    async showEditDialog(row) {
      console.log(row)
      this.editParamsForm = row
      this.editParamsDialogVisible = true
      this.editParamsForm.pics = []
      this.filelist = [],
      this.filelist.unshift({url: this.$picUrl + row.roomPics})
      console.log(this.filelist);
    },
    editParamsDialogClosed() {
      this.$refs.editParamsFormRef.resetFields()
      this.getRoomList()
    },
    async editParams(id) {
      this.$refs.editParamsFormRef.validate((valid) => {
        if (!valid) return this.$message.error('请填写必要的表单项目')
      })
    //  this.addParamsForm.pics = []
     let a = JSON.parse(JSON.stringify(this.filelist[0]).replace(/url/g,"pic"))
     this.editParamsForm.pics.push({pic: a.pic})
      const { data: res } = await this.$http.put(
        `admin/sporder/editRoom/${this.editParamsForm.id}`,
        {
          pics: this.editParamsForm.pics,
          room_name: this.editParamsForm.roomname
        }
      )
      // console.log(res)
      if (res.status != 200) {
        return this.$message.error('修改包厢参数失败')
      }
      this.editParamsDialogVisible = false
      this.$message.success('修改包厢参数成功')
      this.editParamsForm.pics.shift({pic: a.pic})
      this.getRoomList()
    },
    async removeParamsById(id) {
      const confirmResult = await this.$confirm(
        '此操作将删除该包厢, 是否继续?',
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
        'admin/sporder/delRoom/' + id
      )
      if (res.status !== 200) {
        return this.$message.error('删除包厢失败')
      }
      this.$message.info('删除包厢成功')
      this.getRoomList()
    }
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

.pic {
  width: 180px;
  height: 100px;
}
</style>