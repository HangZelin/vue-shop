import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css' // 富文本编辑器外部引用样式  三种样式三选一引入即可
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

//日期格式一 现成组件
import moment from 'moment'

Vue.use(require('vue-moment'));
Vue.prototype.moment = moment


Vue.filter('dateFormat',function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
  return moment(dateStr).format(pattern);
})

//日期格式二 自定义效果一样
Vue.filter('dateFormat1',function(originVal){
   const dt = new Date(originVal)
   const y = dt.getFullYear()
   const m = (dt.getMonth() + 1 + '').padStart(2,'0')
   const d = (dt.getDate() + '').padStart(2,'0')
  //  const hh  = (dt.getHours()+ '').padStart(2,'0')
  //  const mm  = (dt.getMinutes()+ '').padStart(2,'0')
  //  const ss  = (dt.getSeconds()+ '').padStart(2,'0')
  //  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
   return `${y}-${m}-${d}`

})


// 提交以后禁用按钮一段时间，防止重复提交
Vue.directive('noMoreClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      el.classList.add('is-disabled');
      el.disabled = true;
      setTimeout(() => {
        el.disabled = false;
        el.classList.remove('is-disabled');
      }, 3000)
    })
  }
});

//配置请求根路径
  //Vue.prototype.$url = 'http://192.168.10.248:9000/api';
//  Vue.prototype.$url = 'http://192.168.1.5:9000/api';
//  Vue.prototype.$url = 'https://183.136.134.154:8081/api';
  Vue.prototype.$url = 'https://www.zjdxczgyy.com:8081/api';
//   Vue.prototype.$picUrl = 'http://192.168.10.248:8888/';
  Vue.prototype.$picUrl = 'https://www.zjdxczgyy.com:8081/';
axios.defaults.baseURL = Vue.prototype.$url
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// Vue.config.useEslint = false

//手动注册vue-table-with-tree-grid为全局可用
Vue.component('tree-table',TreeTable)
//手动注册富文本编辑器为全局可用
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
