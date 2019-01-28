import signin from '@/views/Login.vue'
import home from '@/views/Home.vue'
import petriNet from '@/views/Charts/PetriNet.vue'
import rawLog from '@/views/LogManagement/RawLog.vue'
import normalizedLog from '@/views/LogManagement/NormalizedLog.vue'
import eventLog from '@/views/LogManagement/EventLog.vue'
import fusionLogList from '@/views/LogFusion/FusionLogList.vue'
import fusionOP from '@/views/LogFusion/FusionOP.vue'
import generateLogs from '@/views//LogManagement/GenerateLogs.vue'
//可视化展示
import baseGraph from '@/views/Graph/BaseGraph.vue'
import graphShow from '@/views/Graph/GraphShow.vue'
const routes = [
  //  {
  //     path: `/signin`,
  //     component: signin,
  //     name: '',
  //     hidden: true
  // },

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
      { path: `/generateLogs`, component: generateLogs, name: '生成事件日志' }
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
      // { path: `/baseGraph`, component: baseGraph, name: '基本图形' },
      { path: `/graphShow`, component: graphShow, name: '图形展示' },

    ]
  },

];

export default routes
