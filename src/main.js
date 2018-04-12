// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import routes from './router/routes'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)

// Vue.http.options.emulateJSON = true
const router = new VueRouter({
  mode:'history',
  routes
})
router.beforeEach((to, from, next) => {
  //sessionStorage 方法针对一个 session 进行数据存储。当用户关闭浏览器窗口后，数据会被删除
  if (to.path == '/process-mining/signin') {
    sessionStorage.removeItem('user')
  }
 // next()
  let user = JSON.parse(sessionStorage.getItem('user'))
  //如果当前没有用户登录过，并且请求的页面不是登录页面
  if (!user && to.path != '/process-mining/signin') {
    //进入登录首页
    next({ path: '/process-mining/signin' })
  } else {
    //已登录，可以跳转
    next()
  }

})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

