import signin from '@/views/Login.vue'
import home from '@/views/Home.vue'
import petriNet from '@/views/Charts/PetriNet.vue'
import rawLog from '@/views/LogManagement/RawLog.vue'
import normalizedLog from '@/views/LogManagement/NormalizedLog.vue'
import eventLog from '@/views/LogManagement/EventLog.vue'
import fusionLogList from '@/views/LogFusion/FusionLogList.vue'
import fusionOP from '@/views/LogFusion/FusionOP.vue'
//可视化展示
import workflowCharts from '@/views/Graph/WorkflowCharts.vue'
const routes = [
    {
        path: '/',
        redirect: "/signin",
        hidden: true
    },
    {
        path: `/home`,
        component: home,
        name: '主页',
        hidden: true
    },
    {
        path: `/signin`,
        component: signin,
        name: '',
        hidden: true
    },
    {
        path: `/petriNet`,
        component: petriNet,
        name: 'petri网',
        hidden: true
    },
    {
        path: '/',
        component: home,
        name: '日志管理',
        // iconCls: 'el-icon-menu',//图标样式class
        children: [
         { path: `/rawLog`, component: rawLog, name: '原始日志' },
         { path: `/normalizedLog`, component: normalizedLog, name: '规范日志' },  
         { path: `/eventLog`, component: eventLog, name: '事件日志' },   
        ]
    },
    {
        path: '/',
        component: home,
        name: '日志融合',
        // iconCls: 'el-icon-message',//图标样式class
        children: [
          { path: `/fusionLogList`, component: fusionLogList, name: '日志列表' },
          { path: `/fusionOP`, component: fusionOP, name: '融合操作' },
        ]
    },
    {
        path: '/',
        component: home,
        name: '可视化展示',
        // iconCls: 'el-icon-message',//图标样式class
        children: [
          { path: `/workflowCharts`, component: workflowCharts, name: '工作流图' },
              
        ]
    },
];

export default routes