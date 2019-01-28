//import axios from 'axios'
import axios from '../axios/axios.js'
import qs from 'qs'
import { Notification } from 'element-ui'
export const base = 'http://localhost:8080/processMiningPlatform/'
//let base = 'http://192.168.1.95:8080/processMiningPlatform'

//注：qs将axios发送的数据格式转换为form-data格式，否则单传params会传option请求，
//后台接收不到或发送成功后台接收参数为null

//测试
// export const test = params => {
//   return axios.post(`http://localhost:8080/processMiningPlatform/miningAction/mining`, params).then(res => res.data).catch(function (error) {
//
//   })
// }

//请求登录
export const requestLogin = params => {
  return axios.post(`${base}/userAction/login`, qs.stringify(params)).then(res => res.data).catch(function (error) {
    //异常处理

  })
}
// axios.post('http://101.132.138.141:8888/service/pageUsers', objectToForm({
//         'currentPage': '1',
//         'pageSize': '10',
//         'token': '7e987daa-6c84-46d2-be26-f345dfaed8a7',
//     }), {
//         // 单独配置
//         withCredentials: true
//     })
//     .then(function(res) {
//         console.log(res.data);
//     })
//     .catch(function(err) {
//         console.error(err);
// });
//请求验证码
export const requestVerificationCode = params => {
  return axios.post(`${base}/userAction/sendCode`, qs.stringify(params), { withCredentials: true }).
    then(res => res.data).catch(function (error) {
    })
}
//注册
export const requestRegister = params => {
  return axios.post(`${base}/userAction/register`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}
//验证验证码是否正确
export const checkverificationCode = params => {
  return axios.post(`${base}/userAction/verifyCode`, qs.stringify(params), { withCredentials: true }).then(res => res.data).catch(function (error) {

  })
}
//新添项目
export const addProject = params => {
  return axios.post(`${base}/projectAction/insert`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}
//查询项目
export const queryProject = params => {
  return axios.get(`${base}/projectAction/list`, { params }).then(res => res.data).catch(function (error) {

  })
}
//查询项目名称是否已存在
export const checkProjectName = params => {
  return axios.get(`${base}/projectAction/get`, { params }).then(res => res.data).catch(function (error) {

  })
}
//更新项目
export const updateProject = params => {
  return axios.post(`${base}/projectAction/update`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}

//删除项目
export const deleteProject = params => {
  return axios.get(`${base}/projectAction/delete`, { params }).then(res => res.data).catch(function (error) {

  })
}

/** 原始日志模块 **/

//查询原始日志
export const queryRawLog = params => {
  return axios.get(`${base}/rawlogAction/list`, { params }).then(res => res.data).catch(function (error) {

  })
}

//删除原始日志
export const deleteRawLog = params => {
  return axios.get(`${base}/rawlogAction/delete`, { params }).then(res => res.data).catch(function (error) {

  })
}
//上传原始日志,记：参数params不需要转换成json
export const uploadRawLog = params => {
  return axios.post(`${base}/rawlogAction/upload`, params).then(res => res.data).catch(function (error) {

  })
}

//规范化原始日志
export const standardizedRawLog = params => {
  return axios.post(`${base}/rawlogAction/normalize`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}

/** 规范化日志模块 **/

//查询规范化日志
export const queryNormalizedLog = params => {
  return axios.get(`${base}/normalizedlogAction/list`, { params }).then(res => res.data).catch(function (error) {

  })
}
//上传规范化日志
export const uploadNormalizedLog = params => {
  return axios.post(`${base}/normalizedlogAction/upload`, params).then(res => res.data).catch(function (error) {

  })
}

//事件化规范日志
export const normalizedLog2EventLog = params => {
  return axios.post(`${base}/normalizedlogAction/convertToEventlog`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}

//删除规范化日志
export const deleteNormalizedLog = params => {
  return axios.get(`${base}/normalizedlogAction/delete`, { params }).then(res => res.data).catch(function (error) {

  })
}

/**事件日志模块**/

//查询事件化日志
export const queryEventLog = params => {
  return axios.get(`${base}/eventlogAction/list`, { params }).then(res => res.data).catch(function (error) {

  })
}
//上传事件化日志
export const uploadEventLog = params => {
  return axios.post(`${base}/eventlogAction/upload`, params).then(res => res.data).catch(function (error) {

  })
}

//删除事件化日志
export const deleteEventLog = params => {
  return axios.get(`${base}/eventlogAction/delete`, { params }).then(res => res.data).catch(function (error) {

  })
}

/**生成事件日志模块 */
export const generateEventLog = params => {
  return axios.post(`${base}/generateEventlogAction/generate`, params).then(res => res.data).catch(function (error) {

  })
}

/** 融合日志模块 **/

//查询融合日志
export const queryMergeLog = params => {
  return axios.get(`${base}/eventlogAction/listMerge`, { params }).then(res => res.data).catch(function (error) {

  })
}
//融合事件日志
export const mergeEventLogs = params => {
  return axios.post(`${base}/eventlogAction/merge`, qs.stringify(params)).then(res => res.data).catch(function (error) {

  })
}

/** 挖掘算法模块 **/

//查询所有的挖掘算法
export const queryMineAlgorithms = params => {
  return axios.get(`${base}/algorithmAction/listAvailable`, {}).then(res => res.data).catch(function (error) {

  })
}

//获取算法执行函数参数信息
export const getAlgorithmInfo = params => {
  return axios.get(`${base}/algorithmAction/getConfig`, { params }).then(res => res.data).catch(function (error) {

  })
}

//挖掘事件日志
export const mineEventLog = params => {
  return axios.post(`${base}/miningAction/mining`, params).then(res => res.data).catch(function (error) {

  })
}
//显示错误
function showError(error) {
  statusError(error)
  Notification.error({
    title: '错误',
    message: error.message,
    showClose: true
  })
  return
}
//错误状态中文表示
function statusError(err) {
  //请求已发出，但服务器响应的状态码不在 2xx 范围内
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误(400)'
        break
      case 401: err.message = '未授权，请重新登录(401)'
        break
      case 403: err.message = '拒绝访问(403)'
        break
      case 404: err.message = '请求出错(404)'
        break
      case 408: err.message = '请求超时(408)'
        break
      case 500: err.message = '服务器错误(500)'
        break
      case 501: err.message = '服务未实现(501)'
        break
      case 502: err.message = '网络错误(502)'
        break
      case 503: err.message = '服务不可用(503)'
        break
      case 504: err.message = '网络超时(504)'
        break
      case 505: err.message = 'HTTP版本不受支持(505)'
        break
      default: err.message = `连接出错(${err.response.status})`
    }
  } else {
    err.message = '连接服务器失败'
  }
  return err


}



