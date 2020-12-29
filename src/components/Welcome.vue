<template>
  <div class="bg1">
    <el-main :style="bg" class="bg1"> </el-main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bg: null,
    }
  },
  mounted() {
    this.bg = {
      background: 'url(' + require('../assets/images/page1.png') + ')',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }
  },
}
</script>


<style lang="less" scoped>
    .bg1 {
        height: 100%;
    }
</style>