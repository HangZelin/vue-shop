import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import AddGoods from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import WxUsers from '../components/user/WxUsers.vue'
import Weeklymenu from '../components/goods/Weeklymenu.vue'
import Wxaccount from '../components/goods/Wxaccount.vue'
import WxaccountMx from '../components/goods/WxaccountMx.vue'
import Jggl from '../components/power/Jggl.vue'
import Coupon from '../components/goods/Coupon.vue'
import Wxaccountxq from '../components/goods/Wxaccountxq.vue'
import Box from '../components/goods/Box.vue'
import BoxParams from '../components/goods/BoxParams.vue'
import BoxMeal from '../components/goods/BoxMeal.vue'
import BoxPerson from '../components/goods/BoxPerson.vue'
import BoxOffline from '../components/goods/BoxOffline.vue'
import yqxkb from '../components/cdgl/yqxkb.vue'


const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}


Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
        redirect: '/welcome',
        children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/cate', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: AddGoods },
        { path: '/order', component: Order },
        { path: '/wxusers', component: WxUsers },
        { path: '/weeklymenu', component: Weeklymenu},
        { path: '/wxaccount', component: Wxaccount},
        { path: '/goods/wxaccountmx', component: WxaccountMx},
        { path: '/jggl', component: Jggl},
        { path: '/coupon', component: Coupon},
        { path: '/goods/wxaccountxq', component: Wxaccountxq},
        { path: '/box', component: Box},
        { path: '/box/params', component: BoxParams},
        { path: '/box/meal', component: BoxMeal},
        { path: '/box/person', component: BoxPerson},
        { path: '/box/offline', component: BoxOffline},
        { path: '/yqxkb', component: yqxkb},
      ]
    },
  ]
});

router.beforeEach((to, from, next) => {
  //to  访问的路径
  //from  从哪里跳转
  //next 函数，next()表示放行    next('/login')强制跳转

  if (to.path == '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()


})




export default router
