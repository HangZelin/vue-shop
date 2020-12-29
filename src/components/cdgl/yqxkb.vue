<template>
<div> <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>场地管理</el-breadcrumb-item>
      <el-breadcrumb-item>园区销控表</el-breadcrumb-item>
    </el-breadcrumb>

<div>
    <input type="text" style="text-align:left; border-style: none; border-bottom-style:none; width: 250px; display:inline" class = "input"
           value="建筑面积:40000m²" />

    <input type="text" style="text-align:left; border-style: none; border-bottom-style: none;width: 250px; display:inline" class = "input"
           value="楼宇数量:30栋" />

    <input type="text" style="text-align:left; border-style: none; border-bottom-style: none;width: 250px; display:inline" class = "input"
           value="房间总数:300间" />

    <input type="text" style="text-align:left; border-style: none; border-bottom-style: none;width: 45px; display:inline" class = "input"
           value="已出租:" />

    <input type="text" style="border-style: none; border-bottom-style: none;width: 200px; display:inline;color:red " class = "input"
           value="100间" />

    <input type="text" style="text-align:left; border-style: none; border-bottom-style: none;width: 45px; display:inline" class = "input"
           value="未出租:" />

    <input type="text" style="border-style: none; border-bottom-style: none;width: 200px; display:inline;color:#409EFF" class = "input"
           value="100间" />

    <span>出租率:</span>
    <div class="bar">
      <el-progress :text-inside="false" :stroke-width="10" :percentage="33" :show-text="true" color=#6bb0a1></el-progress>
    </div>


  </div>


  <el-table
    :data="tableData"
    border
    style="width: 100%"
    :header-cell-style="{background:'#f2f2f2',color:'#606266'}" :cell-style="changeCellStyle">

    <el-table-column prop="address" label="楼栋号" width="120" align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="floors" label="楼层数量(层)" width="120" align="center" header-align="center">
      </el-table-column>
       <el-table-column prop="rooms" label="房间总数(间)" width="120"  align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="rented" label="已出租房间数(间)" width="120" align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="unrented" label="未出租房间数(间)" width="150" align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="locked" label="被锁定房间数(间)" width="150" align="center" header-align="center">
      </el-table-column>

  <el-table-column prop="rate" label="出租率" width="300" align="center" header-align="center">
        <template slot-scope="scope">
          <el-progress :type="line" :text-inside="false" :percentage="scope.row.rate" :color="scope.row.color" stroke-width="10"></el-progress>
        </template>
      </el-table-column>

      <el-table-column prop="area" label="建筑面积(m²)" width="148" align="center" header-align="center">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300" align="center" header-align="center">
      </el-table-column>

      <el-table-column width="150" align="center">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看平面图</el-button>
        </template>
      </el-table-column>
  </el-table>
  </div>
</template>

<script>


import json from 'C:/Users/Admin/Desktop/vue-shop-master/static/json/data.json'

  export default {
     data() {
    return {
      tableData:json
    };
  },
  methods: {
    //颜色修改部分
    changeCellStyle(row, column, rowIndex, columnIndex) {
      //对列的内容进行修改
      if (row.column.label === "已出租房间数(间)") {
        return "color:red";
      } else if (row.column.label === "未出租房间数(间)") {
        return "color:#409EFF";
      } else if (row.column.label === "被锁定房间数(间)") {
        return "color:#E6A23C";
      }
    }

    }
  }

</script>

<style>
@import url("//unpkg.com/element-ui@2.14.1/lib/theme-chalk/index.css");

.el-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.el-table--border,
.el-table--group {
  border-color: #c0c4cc;
}
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #c0c4cc;
}
.el-table--border th,
.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #c0c4cc;
}
.el-table--border td,
.el-table--border th {
  border-right: 1px solid #c0c4cc;
}

.bar {
  width: 15%;
  display: inline-block;
}

.input{width:125px;height:30px;font-size:15px; line-height:50px;
            background: #eaedf1;}

.el-progress-bar__outer {
    background-color: rgb(225, 239, 236);
    position: relative;
    vertical-align: middle;
    border-radius: 100px;
    overflow: hidden;
}
</style>
