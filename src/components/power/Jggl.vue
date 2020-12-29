<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>机构管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-container>
      <el-aside width="400px">
        <el-row>
          <el-col>
            <div class="row1">
              <i class="el-icon-s-grid"></i>组织机构列表
              <i class="el-icon-s-grid"></i>
            </div>
            <div class="row2">
              <el-button
                type="success"
                icon="el-icon-plus"
                @click="showAddJgDialog()"
                circle
              ></el-button>
              <!-- <el-button
                  type="info"
                  icon="el-icon-edit"
                  @click="showEditJgDialog()"
                  circle
                  :disabled="this.companyName ? false : true"
                ></el-button> -->
              <el-button
                type="warning"
                icon="el-icon-refresh-left"
                @click="refreshJg()"
                circle
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteJg(jgForm.jgid)"
                circle
                :disabled="this.jgForm.jgid? false : true"
              ></el-button>
            </div>

            <div class="row3">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
              ></el-input>
            </div>
            <div class="row4">
              <el-tree
                icon-class="el-icon-tickets"
                class="filter-tree"
                :data="data"
                default-expand-all
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                ref="tree"
              ></el-tree>
            </div>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-header>
          <el-row>
            <el-col class="cat_opt">
              <span class="cat_opt_span">当前机构: {{ this.companyName }}</span>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="first">
                <el-card v-if="this.jglx == '0' &&  this.jgjc == '2'">
                  <el-form
                    ref="jgFormRef"
                    :model="jgForm"
                    label-width="120px"
                    :rules="addJgXxRules"
                  >
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="名称:" prop="companyName">
                          <el-input
                            v-model="this.companyName"
                            :disabled="true"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="地址:">
                          <el-input
                            v-model="jgForm.address2"
                            :disabled="true"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="成立时间:">
                      <el-col :span="4">
                        <el-date-picker
                          type="date"
                          placeholder="选择日期"
                          v-model="jgForm.slrq"
                          style="width: 100%"
                          value-format="yyyy-MM-dd"
                          :disabled="true"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>

                    <el-row>
                      <el-col :span="20">
                        <el-form-item label="详情:">
                          <div>
                            <baidu-map
                              v-bind:style="mapStyle"
                              class="bm-view"
                              ak="你的百度地图ak"
                              :center="center"
                              :zoom="zoom"
                              :scroll-wheel-zoom="true"
                              @click="getClickInfo"
                              @moving="syncCenterAndZoom"
                              @moveend="syncCenterAndZoom"
                              @zoomend="syncCenterAndZoom"
                            >
                              <bm-view
                                style="width: 100%; height: 500px"
                              ></bm-view>
                              <bm-marker
                                :position="{ lng: center.lng, lat: center.lat }"
                                :dragging="true"
                                animation="BMAP_ANIMATION_BOUNCE"
                              >
                              </bm-marker>
                              <bm-control
                                :offset="{ width: '10px', height: '10px' }"
                              >
                                <bm-auto-complete
                                  v-model="keyword"
                                  :sugStyle="{ zIndex: 999999 }"
                                >
                                  <input
                                    type="text"
                                    placeholder="请输入搜索关键字"
                                    class="serachinput"
                                  />
                                </bm-auto-complete>
                              </bm-control>
                              <bm-local-search
                                :keyword="keyword"
                                :auto-viewport="true"
                                style="
                                  width: 0px;
                                  height: 0px;
                                  overflow: hidden;
                                "
                              ></bm-local-search>
                            </baidu-map>
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-card>
                <el-card v-else-if="this.jglx == '2'">
                  <el-form
                    ref="jgFormRef"
                    :model="jgForm"
                    label-width="120px"
                    :rules="addJgXxRules"
                  >
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="公司名称" prop="companyName">
                          <el-input
                            v-model="this.companyName"
                            :disabled="true"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="社会信用代码">
                          <el-input v-model="jgForm.shxydm"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="公司地址" prop="address2">
                      <el-col :span="4">
                        <!-- <el-cascader
                          :options="cityData"
                          v-model="jgForm.address1"
                          placeholder="填选择城市"
                        ></el-cascader> -->
                        <el-select
                          v-model="jgForm.address1"
                          placeholder="请选择城市"
                        >
                          <el-option
                            v-for="item in cityData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="6">
                        <el-input
                          v-model="jgForm.address2"
                          placeholder="填写详细地址"
                        ></el-input>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="成立时间">
                      <el-col :span="4">
                        <el-date-picker
                          type="date"
                          placeholder="选择日期"
                          v-model="jgForm.slrq"
                          style="width: 100%"
                          value-format="yyyy-MM-dd"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="公司法人">
                          <el-input
                            v-model="jgForm.gsfr"
                            prefix-icon="el-icon-s-check"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="法人身份证">
                          <el-input
                            v-model="jgForm.sfzhm"
                            prefix-icon="el-icon-bank-card"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="联系电话" prop="lxdh">
                          <el-input
                            v-model="jgForm.lxdh"
                            prefix-icon="el-icon-phone"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="邮箱地址">
                          <el-input
                            v-model="jgForm.email"
                            prefix-icon="el-icon-message"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <!-- <el-row>
                      <el-col :span="8">
                        <el-form-item label="所属行业">
                          <el-input v-model="jgForm.name"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>-->
                    <el-form-item>
                      <el-button type="primary" @click="onSubmit"
                        >保存</el-button
                      >
                      <el-button @click="reset">重置</el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
                <el-card v-else>
                  <el-form
                    ref="jgFormRef"
                    :model="jgForm"
                    label-width="120px"
                    :rules="addJgXxRules"
                  >
                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="部门名称" prop="companyName">
                          <el-input
                            v-model="this.companyName"
                            :disabled="true"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="部门负责人">
                          <el-input
                            v-model="jgForm.gsfr"
                            :disabled="true"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-card>
              </el-tab-pane>
              <el-tab-pane
                label="人员列表"
                name="second"
                v-if="this.jglx == '1' || this.jglx == '2'"
              >
                <el-card>
                  <el-row>
                    <el-col class="cat_opt">
                      <el-button
                        type="success"
                        icon="el-icon-plus"
                        circl
                        @click="addRyDialog"
                        >添加人员</el-button
                      >
                      <!-- <el-button
                        type="danger"
                        icon="el-icon-notebook-2"
                        circl
                        @click="importDialog"
                        >导入列表</el-button
                      >
                      <el-button
                        type="warning"
                        icon="el-icon-notebook-2"
                        circl
                        @click="exportDialog(jgForm.jgid)"
                        >导出列表</el-button
                      > -->
                    </el-col>
                  </el-row>

                  <el-table :data="ryList" border stripe>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column
                      label="姓名"
                      prop="username"
                    ></el-table-column>
                    <!-- <el-table-column
                      label="工号"
                      prop="gongh"
                    ></el-table-column> -->
                    <el-table-column
                      label="手机"
                      prop="mobile"
                    ></el-table-column>
                    <el-table-column label="职位" prop="position">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.position === '0'"
                          >总经理</el-tag
                        >
                        <el-tag
                          v-else-if="scope.row.position === '1'"
                          type="success"
                          >部门经理</el-tag
                        >
                        <el-tag
                          v-else-if="scope.row.position === '2'"
                          type="info"
                          >项目主管</el-tag
                        >
                        <el-tag
                          v-else-if="scope.row.position === '3'"
                          type="warning"
                          >员工</el-tag
                        >
                        <el-tag v-else type="danger">其他</el-tag>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="微信id"
                      prop="wxOpenId"
                    ></el-table-column>
                    <!-- <el-table-column label="状态">
                      <template slot-scope="scope">
                        <el-switch
                          v-model="scope.row.isActive"
                          active-value="1"
                          inactive-value="0"
                          @change="wxuserStateChanged(scope.row)"
                        ></el-switch>
                      </template>
                    </el-table-column> -->

                    <el-table-column label="操作">
                      <template width="180px" slot-scope="scope">
                        <!-- <el-button
                          type="danger"
                          size="mini"
                          icon="el-icon-edit"
                          @click="showEditRyDialog(scope.row)"
                        ></el-button> -->
                        <el-button
                          type="primary"
                          size="mini"
                          icon="el-icon-remove-outline"
                          @click="removeRyById(scope.row.id)"
                        >移除</el-button>

                        <!-- <el-tooltip
                          class="item"
                          effect="dark"
                          content="分配角色"
                          placement="top"
                          :enterable="false"
                        >
                          <el-button
                            type="warning"
                            size="mini"
                            icon="el-icon-setting"
                            @click="setRole(scope.row)"
                          ></el-button>
                        </el-tooltip> -->
                      </template>
                    </el-table-column>
                  </el-table>
                </el-card>
              </el-tab-pane>
            </el-tabs>
          </template>
        </el-main>
      </el-container>
    </el-container>

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
        <div class="el-upload__tip" slot="tip">只能上传xls文件</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加机构的对话框 -->
    <el-dialog
      :title="'添加机构'"
      :visible.sync="addJgDialogVisible"
      width="30%"
      @close="addJgDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="addJgForm"
        :rules="addJgFormRules"
        ref="addJgFormRef"
        label-width="100px"
      >
        <el-form-item label="机构名称：" prop="jgName">
          <el-input v-model="addJgForm.jgName"></el-input>
        </el-form-item>
        <el-form-item label="父级机构：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentJglist"
            :props="defaultProps"
            @change="parentJgChanged"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addJgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addJg" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改机构的对话框 -->
    <!-- <el-dialog
      :title="'修改机构'"
      :visible.sync="editJgDialogVisible"
      width="30%"
      @close="editJgDialogClosed"
    >
      <el-form
        :model="editJgForm"
        :rules="editJgFormRules"
        ref="editJgFormRef"
        label-width="100px"
      >
        <el-form-item label="机构名称：" prop="jgName">
          <el-input v-model="editJgForm.jgName"></el-input>
        </el-form-item>
        <el-form-item label="父级机构：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentJglist"
            :props="defaultProps"
            @change="parentJgChanged"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editJgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editJg">确 定</el-button>
      </span>
    </el-dialog> -->

    <!-- 添加人员的对话框 -->
    <el-dialog
      :title="'添加人员'"
      :visible.sync="addRyDialogVisible"
      width="30%"
      @close="addRyDialogClosed"
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
        <!-- <el-form-item label="工号：" prop="gongh">
          <el-input v-model="addRyForm.gongh"></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="mobile">
          <el-input v-model="addRyForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="职位：" prop="position">
          <el-select v-model="addRyForm.position" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRy" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改人员的对话框 -->
    <el-dialog
      title="修改人员"
      :visible.sync="editRyDialogVisible"
      width="50%"
      @close="addEditDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form
        :model="editRyForm"
        :rules="editRyFormRules"
        ref="editRyFormRef"
        label-width="70px"
      >
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="editRyForm.nickname"></el-input>
        </el-form-item>
        <!-- <el-form-item label="工号" prop="gongh">
          <el-input v-model="editRyForm.gongh"></el-input>
        </el-form-item> -->
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editRyForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-select v-model="editRyForm.position" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRyInfo" v-no-more-click
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
     

<script>

function myFun(result) {
      var cityName = result.name
      //map.setCenter(cityName);
      console.log('当前定位城市:' + cityName)
}
import cityData from '../goods/citydata.js'
import { MP } from '@/map.js'
import {
  BaiduMap,
  BmControl,
  BmView,
  BmAutoComplete,
  BmLocalSearch,
  BmMarker,
} from 'vue-baidu-map'
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    value: function (currentValue) {
      this.showMapComponent = currentValue
      if (currentValue) {
        this.keyword = ''
      }
    },
  },
  components: {
    BaiduMap,
    BmControl,
    BmView,
    BmAutoComplete,
    BmLocalSearch,
    BmMarker,
  },

  methods: {
    /***
     * 地图点击事件。
     */
    getClickInfo(e) {
      console.log(e)
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    // UploadUrl() {
    //   return "http://192.168.1.119:9000/api/admin/jggl/importRyList"
    // },
    //  beforeAvatarUpload(file) {
    //    let Xls = file.name.split('.');
    //    if(Xls[1] === 'xls'||Xls[1] === 'xlsx'){
    //      return file
    //    }else {
    //      this.$message.error('上传文件只能是 xls/xlsx 格式!')
    //      return false
    //    }
    //  },
    handleError(err, file, fileList) {
      this.$message.error(err)
    },
    handleSuccess(response, file, fileList) {
      console.log(response)
      console.log(file)
      this.$message.info('上传成功')
      this.importDialogVisible = false
      this.getJgRyList()
    },
    importDialogClosed() {
      this.$refs.upload.clearFiles()
    },
    importConfirm() {
      this.$refs.upload.submit()
      // this.getJgRyList()
    },
    importDialog() {
      this.importDialogVisible = true
    },
    exportDialog(id) {
      this.$http
        .request({
          url: 'admin/jggl/export/exportRyList/' + id,
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
    async deleteJg(id) {
      if(this.jgjc != '4' ){
        this.$message.info('当前机构不允许删除')
        return 
      }
      const confirmResult = await this.$confirm(
        '此操作将删除该机构, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('admin/jggl/delJg/' + id)
      // console.log(res)
      if (res.status !== 200) {
        return this.$message.error('删除机构失败')
      }
      this.$message.info('删除机构成功')
      this.getJgTree()
    },
    refreshJg() {
      this.filterText = ''
      this.getJgTree()
    },
    handleNodeClick(data) {
      
      this.activeName = "first"
      Object.assign(this.$data.jgForm, this.$options.data().jgForm)
      this.jgjc = data.jgjc
      // if (data.jgjc == '1') return

      this.companyName = data.jgName
      this.jgForm.jgid = data.id

      this.jglx = data.jglx
      this.getJgDetail()
      this.getJgRyList()

      // console.log(this.jgjc)
    },
    async getJgDetail() {
      const { data: res } = await this.$http.get(
        `admin/jggl/getJgDetail/${this.jgForm.jgid}`
      )

      if (res.status !== 200) {
        return this.$message.error('获取详细信息失败')
      }
      if (res.data != null) {
        this.jgForm = res.data
      }
    },
    showAddJgDialog() {
      this.getParentJglist()
      this.addJgDialogVisible = true
    },
    async getParentJglist() {
      const { data: res } = await this.$http.get(
        'admin/jggl/getJgTreeByLevel/4'
      )
      if (res.status !== 200) {
        return this.$message.error('获取父级分类列表失败')
      }
      if (res.data != null) {
        this.parentJglist = this.getTreeData(res.data)
      }
    },

    // 递归判断列表，把最后的children设为undefined
    getTreeData(data){
      for(var i=0;i<data.length;i++){
        if(data[i].children.length<1){
          // children若为空数组，则将children设为undefined
          data[i].children=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    parentJgChanged() {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        //选中了父级分类
        this.addJgForm.jgPid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addJgForm.jgLevel = this.selectedKeys.length
        if(this.selectedKeys.length == 4){
          //写死
          if(this.selectedKeys[this.selectedKeys.length - 1] == '318551108156919808'){
               this.addJgForm.jglx = 1
          }else{
              this.addJgForm.jglx = 2
          }
        }
        return
      } else {
        this.addJgForm.jgPid = 0
        this.addJgForm.jgLevel = 0
        this.addJgForm.jglx = 0
      }
    },
    addJgDialogClosed() {
      this.$refs.addJgFormRef.resetFields()
      this.addJgForm.jgPid = 0
      this.addJgForm.jgLevel = 0
      this.addJgForm.jglx = 0
      this.selectedKeys = []
    },
    onSubmit() {
      //  console.log(this.jgForm)

      this.$refs.jgFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/jggl/addJgDetail',
          this.jgForm
        )
        if (res.status !== 200) {
          this.$message.info('保存信息失败')
        }

        this.$message.info('保存信息成功')
        // console.log(res)
        this.jgForm = res.data
      })
    },
    reset() {
      this.$refs.jgFormRef.resetFields()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.jgName.indexOf(value) !== -1
    },
    handleClick(tab, event) {
      //   console.log(tab, event)
    },
    async getJgTree() {
      const { data: res } = await this.$http.get('admin/jggl/getJgTree')

      if (res.status != 200) return this.$message.error('获取机构列表失败！')

      this.data = res.data
    },
    async addJg() {
     // console.log(this.addJgForm)
      this.$refs.addJgFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'admin/jggl/addJg',
          this.addJgForm
        )
        if (res.status !== 201) {
          this.$message.info('添加机构失败')
        }

        this.$message.info('添加机构成功')
        this.getJgTree()
        this.addJgDialogVisible = false
      })
    },
    editJg() {
      // console.log('222222')
    },
    async getJgRyList() {
      const { data: res } = await this.$http.get(
        `admin/jggl/getJgRyList/${this.jgForm.jgid}`
      )
      if (res.status != 200) return this.$message.error('获取人员信息失败！')
      // console.log(this.ryList)
      this.ryList = res.data
    },
    addRyDialogClosed() {
      this.$refs.addRyFormRef.resetFields()
      this.addRyForm.position = ''
    },
    addRy() {
      this.$refs.addRyFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `admin/jggl/addUser/${this.jgForm.jgid}`,
          this.value2
        )
        if (res.status !== 201) {
          this.$message.info('添加人员失败')
        }

        this.$message.success('添加人员成功')
        this.value2 = ''
        this.getJgRyList()
        this.addRyDialogVisible = false
      })
    },
    addRyDialog() {
      this.getRy()
      this.addRyDialogVisible = true
    },
    async getRy() {
      const { data: res } = await this.$http.get(`admin/jggl/getRy`)

      this.ryOptions = res.data
    },
    async wxuserStateChanged(userinfo) {
      const { data: res } = await this.$http.put(
        `admin/jggl/${userinfo.id}/state/${userinfo.status}`
      )

      if (res.status != 200) {
        userinfo.isActive = !userinfo.isActive
        return this.$message.error('修改用户状态失败！')
      }

      this.$message.success('修改用户状态成功！')
    },
    // 展示修改用户的对话框
    async showEditRyDialog(row) {
      // const { data: res } = this.$http.get('users')
      // console.log(res);
      // if (res.status !== 200) {
      //   return this.$message.error('查询用户信息失败！')
      // }
      // console.log(row);

      this.editRyForm = row
      this.editRyDialogVisible = true
    },
    // 监听修改对话框的关闭事件
    addEditDialogClosed() {
      this.$refs.editRyFormRef.resetFields()
    },
    // 修改用户信息并提交
    editRyInfo() {
      this.$refs.editRyFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'admin/jggl/editWxUser/' + this.editRyForm.id,
          {
            ryName: this.editRyForm.nickname,
            gongh: this.editRyForm.gongh,
            mobile: this.editRyForm.mobile,
            position: this.editRyForm.position,
          }
        )
        if (res.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        this.$message.success('更新用户信息成功！')
        this.editRyDialogVisible = false
        this.getJgRyList()
      })
    },
    // 根据id值删除对应的用户
    async removeRyById(id) {
      // console.log(this.jgForm.jgid)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将该用户移出此机构, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete(
        'admin/jggl/delUser/' + id + '/'+ this.jgForm.jgid
      )

      if (res.status !== 200) {
        return this.$message.error('删除人员失败！')
      }

      this.$message.success('删除人员成功！')
      this.getJgRyList()
    },

    
    //定义方法
    getCity() {
      let _this = this
      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          if (r.accuracy == null) {
            console.log('您已拒绝地理位置授权')

            var myCity = new BMap.LocalCity();
            myCity.get(myFun); 
            //用户决绝地理位置授权
            return
          } else {
            const myGeo = new BMap.Geocoder()
            myGeo.getLocation(
              new BMap.Point(r.point.lng, r.point.lat),
              (data) => {
                if (data.addressComponents) {
                  const result = data.addressComponents
                  const location = {
                    creditLongitude: r.point.lat, // 经度
                    creditLatitude: r.point.lng, // 纬度
                    creditProvince: result.province || '', // 省
                    creditCity: result.city || '', // 市
                    creditArea: result.district || '', // 区
                    creditStreet:
                      (result.street || '') + (result.streetNumber || ''), // 街道
                  }
                  _this.location = location
                  _this.creditLongitude = location.creditLongitude
                  _this.creditLatitude = location.creditLatitude
                  _this.creditCity = location.creditCity
                  // alert(this.getStatus());

                  console.log(location)
                }
              }
            )
          }
        }
      })
    },
  },
  created() {
    this.getJgTree()
    // this.location()
  },
  mounted() {
    this.$nextTick(function () {
      var _this = this
      MP().then((BMap) => {
        this.getCity();
    
      })
    })
  },
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
      if (regMobile.test(value)) {
        //判断是否符合格式要求
        return cb()
      } else {
        cb(new Error('请输入合法手机号码'))
      }
    }

    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        //判断是否符合格式要求
        return cb()
      } else {
        cb(new Error('请输入合法邮箱'))
      }
    }

    return {
      showMapComponent: this.value,
      keyword: '',
      mapStyle: {
        width: '100%',
        height: this.mapHeight + 'px',
      },
      center: { lng: 119.956811, lat: 31.831351 },
      zoom: 15,
      importDialogVisible: false,
      jgjc: 0,
      jglx: 1,
      companyName: '',
      cityData,
      addJgForm: {
        jgName: '',
        jgPid: 0,
        //默认添加1级分类
        jgLevel: 0,
        jglx: 0,
      },
      // editJgForm: {},
      addJgFormRules: {
        jgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
      },
      addJgXxRules: {
        shxydm: [
          { required: true, message: '请输入社会信用代码', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请选择公司地址', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        slrq: [
          { required: true, message: '请选择成立日期', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        gsfr: [
          { required: true, message: '请输入公司法人', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        sfzhm: [
          { required: true, message: '请输入法人身份证', trigger: 'blur' },
          // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
        ],
        lxdh: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
      },
      // editJgFormRules: {
      //   jgName: [
      //     { required: true, message: '请输入分类名称', trigger: 'blur' },
      //     // { min: 3, max: 10, message: '用户名长度在3~10', trigger: 'blur' }
      //   ],
      // },
      parentJglist: [],
      addJgDialogVisible: false,
      // editJgDialogVisible: false,
      jgForm: {
        jgid: '',
        address1: '',
        address2: '',
        shxydm: '',
        gsfr: '',
        sfzhm: '',
        lxdh: '',
        email: '',
        slrq: '',
      },
      filterText: '',
      activeName: 'first',
      data: [],
      defaultProps: {
        // checkStrictly: true,
        value: 'id',
        label: 'jgName',
        children: 'children',
      },
      selectedKeys: [],
      ryList: [],
      addRyDialogVisible: false,
      addRyForm: {
        mobile: '',
        ryName: '',
        gongh: '',
        position: '',
      },
      ryOptions: [],
      value2: '',
      addRyFormRules: {
        ryName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gongh: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        position: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur',
          },
        ],
      },
      options: [
        {
          value: '0',
          label: '总经理',
        },
        {
          value: '1',
          label: '部门经理',
        },
        {
          value: '2',
          label: '项目主管',
        },
        {
          value: '3',
          label: '员工',
        },
        {
          value: '4',
          label: '其他',
        },
      ],
      // 控制修改对话框的显示与隐藏
      editRyDialogVisible: false,
      // 查询到的用户信息对象
      editRyForm: {},
      editRyFormRules: {
        nickname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gongh: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        position: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '手机号码不正确，请重新输入',
            trigger: 'blur',
          },
        ],
      },
      baseUrl: this.$url + '/admin/jggl/importRyList',
      // baseUrl: 'http://183.136.134.154:9000/api/admin/jggl/importRyList'
    }
  },
}
</script>



<style scoped lang="less">
.el-cascader {
  width: 100%;
}
.el-tabs {
  line-height: 50px;
}
.cat_opt {
  margin: 15px 0;
  width: 500px;
  display: flex;
  align-items: flex-start;
}
// .el-input {
//   width: 200px;
// }
.cat_opt_span {
  width: 400px;
  //   margin: 5px 5px;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: flex-start;
}
.row1 {
  line-height: 60px;
  font-size: 20px;
  padding-top: 20px;
}

.row2 {
  line-height: 80px;
  font-size: 20px;
}

.row3 {
  width: 350px;
  line-height: 80px;
  margin-left: 20px;
}
.row4 {
  width: 350px;
  align-items: center;
  margin-left: 20px;
  background-color: white;
  //   line-height: 500px;
}
// .el-tree {
//   background-color: #d3dce6;
// }
.el-header {
  color: #333;
  text-align: center;
  line-height: 80px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  margin-top: 30px;
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 600px;
  //   border: 1px solid;
  //   border-color: gray;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.serachinput {
  width: 300px;
  box-sizing: border-box;
  padding: 9px;
  border: 1px solid #dddee1;
  line-height: 20px;
  font-size: 16px;
  height: 38px;
  color: #333;
  position: relative;
  border-radius: 4px;
  -webkit-box-shadow: #666 0px 0px 10px;
  -moz-box-shadow: #666 0px 0px 10px;
  box-shadow: #666 0px 0px 10px;
}
</style>