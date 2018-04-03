import Signin from '@/views/Login.vue'
import Home from '@/views/Home.vue'
// import ProjectHome from '@/views/ProjectHome.vue'
import RawLog from '@/views/LogManagement/RawLog.vue'
import Specificationlog from '@/views/LogManagement/Specificationlog.vue'
import EventLog from '@/views/LogManagement/EventLog.vue'
import MyPage from '@/views/MyPage.vue'
import FusionLogList from '@/views/LogFusion/FusionLogList.vue'
import FusionOP from '@/views/LogFusion/FusionOP.vue'
let routes = [
 {
        path: '/home',
        component: Home,
        name: '',
        hidden: true
    },
    {
        path: '/signin',
        component: Signin,
        name: '',
        hidden: true
    },
    {
        path: '/MyPage',
        component: MyPage,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '日志管理',
        // iconCls: 'el-icon-menu',//图标样式class
        children: [
         { path: '/RawLog', component: RawLog, name: '原始日志' },
         { path: '/Specificationlog', component: Specificationlog, name: '规范日志' },  
         { path: '/EventLog', component: EventLog, name: '事件日志' },   
        ]
    },
    {
        path: '/',
        component: Home,
        name: '日志融合',
        // iconCls: 'el-icon-message',//图标样式class
        children: [
          { path: '/FusionLogList', component: FusionLogList, name: '日志列表' },
          { path: '/FusionOP', component: FusionLogList, name: '融合操作' },
        ]
    },


];

export default routes;