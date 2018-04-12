import signin from '@/views/Login.vue'
import home from '@/views/Home.vue'
import petriNet from '@/views/Charts/PetriNet.vue'
import rawLog from '@/views/LogManagement/RawLog.vue'
import specificationlog from '@/views/LogManagement/Specificationlog.vue'
import eventLog from '@/views/LogManagement/EventLog.vue'
import fusionLogList from '@/views/LogFusion/FusionLogList.vue'
import fusionOP from '@/views/LogFusion/FusionOP.vue'
const base = '/process-mining'
const routes = [
 {
        path: `${base}/home`,
        component: home,
        name: '主页',
        hidden: true
    },
    {
        path: `${base}/signin`,
        component: signin,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: home,
        name: '日志管理',
        // iconCls: 'el-icon-menu',//图标样式class
        children: [
         { path: `${base}/rawLog/:id`, component: rawLog, name: '原始日志' },
         { path: `${base}/specificationlog/:id`, component: specificationlog, name: '规范日志' },  
         { path: `${base}/eventLog/:id`, component: eventLog, name: '事件日志' },   
        ]
    },
    {
        path: '/',
        component: home,
        name: '日志融合',
        // iconCls: 'el-icon-message',//图标样式class
        children: [
          { path: `${base}/fusionLogList`, component: fusionLogList, name: '日志列表' },
          { path: `${base}/fusionOP`, component: fusionLogList, name: '融合操作' },
        ]
    },
];

export default routes;