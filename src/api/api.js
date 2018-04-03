import axios from 'axios'
import qs from 'qs'
import {Notification} from 'element-ui'
let base = 'http://116.56.129.93:8081/processMiningPlatform'
//注：qs将axios发送的数据格式转换为form-data格式，否则单传params会传option请求，
//后台接收不到或发送成功后台接收参数为null

//请求登录
export const requestLogin = params => {
	return axios.post(`${base}/userAction/login`,qs.stringify(params)).then(res => res.data).catch(function (error) {
		//异常处理
　　		showError(error)
	})
}
//请求验证码
export const requestVerificationCode = params => {
	return axios.post(`${base}/userAction/sendCode`,qs.stringify(params)).then(res => res.data).catch(function (error) {
　　		showError(error)
	})
}
//注册
export const requestRegister = params => {
	return axios.post(`${base}/Test`,qs.stringify(params)).then(res => res.data).catch(function (error) {
　　		showError(error)
	})
}
//验证验证码是否正确
export const checkverificationCode = params => {
	return axios.post(`${base}/Test`,qs.stringify(params)).then(res => res.data).catch(function (error) {
		showError(error)
	})
}
//新添项目
export const addProject = params => {
    return axios.post(`${base}/projectAction/insert`,qs.stringify(params)).then(res => res.data).catch(function (error) {
        showError(error)
    })
}
//查询项目
export const queryProject = params => {
    return axios.get(`${base}/projectAction/list`,{params}).then(res => res.data).catch(function (error) {
        showError(error)
    })
}
//查询项目名称是否已存在
export const checkProjectName = params => {
    return axios.get(`${base}/projectAction/get`,{params}).then(res => res.data).catch(function (error) {
        showError(error)
    })
}
//更新项目
export const updateProject = params => {
    return axios.post(`${base}/projectAction/update`,qs.stringify(params)).then(res => res.data).catch(function (error) {
        showError(error)
    })
}

//删除项目
export const deleteProject = params => {
    return axios.get(`${base}/projectAction/delete`,{params}).then(res => res.data).catch(function (error) {
        showError(error)
    })
}

//查询原始日志
export const queryRawLog = params => {
    return axios.get(`${base}/rawlogAction/list`,{params}).then(res => res.data).catch(function (error) {
        showError(error)
    })
}

//删除原始日志
export const deleteRawLog = params => {
    return axios.get(`${base}/rawlogAction/delete`,{params}).then(res => res.data).catch(function (error) {
        showError(error)
    })
}
//上传原始日志,记：参数params不需要转换成json
export const uploadRawLog = params => {
    return axios.post(`${base}/rawlogAction/upload`,params).then(res => res.data).catch(function (error) {
        showError(error)
    })
}
function showError(error){
	statusError(error)
	Notification.error({
          title: '错误',
          message: error.message,
          showClose: true
    })
    return
}
function statusError(err){
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
	}else{
		 err.message = '连接服务器失败'
	}
	return err
    
    
}
 


