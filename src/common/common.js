/* 公用函数模块 */

/**
* 时间戳转换
*/
const timestamp2Time = function (timestamp){
    let result = ''
    let date = new Date()
    if(timestamp.length != 0){
      //前台传来的数据多了八个小时，需要减去八个小时的毫秒数
      date.setTime(timestamp-28800000)
      let year = date.getFullYear()  
      let month = date.getMonth() + 1 
      let day = date.getDate()  
      let hour = date.getHours()
      let minute = date.getMinutes()
      let seconds = date.getSeconds()
      month = month < 10 ?"0" + month : month
	    day = day < 10 ? "0" + day : day
      hour = hour < 10 ? "0" + hour : hour
      minute = minute < 10 ? "0" + minute : minute
      seconds = seconds < 10 ? "0" + seconds : seconds
      result = year + "-" + month + "-" + day+" "+hour+":"+minute+":"+seconds
    }
    return result   
}
/**
*	项目升序排序
*/
const compareUp = function(propertyName){
	//对项目名称进行排序
	if(propertyName === 'name'){
		return function(object1, object2) {  
            let value1 = object1[propertyName]  
            let value2 = object2[propertyName]  
            //value1-value2
            return value1.localeCompare(value2)  
        }  
	}
	//对项目创建时间进行排序
	if(propertyName === 'createdTime'){
		return function(object1, object2) {  
            let value1 = object1[propertyName]  
            let value2 = object2[propertyName]  
            //value2-value1
            return value1 - value2 
        }  
	}
}
/**
*	项目降序排序
*/
const compareDown = function(propertyName){
	//对项目名称进行排序
	if(propertyName === 'name'){
		return function(object1, object2) {  
            let value1 = object1[propertyName]  
            let value2 = object2[propertyName]  
            //value2-value1
            return value2.localeCompare(value1)  
        }  
	}
	//对项目创建时间进行排序
	if(propertyName === 'createdTime'){
		return function(object1, object2) {  
            let value1 = object1[propertyName]  
            let value2 = object2[propertyName]  
            //value2-value1
            return value2-value1 
        }  
	}
}
/**
* 判断是否为数字
*/
const isNumber = function(value){
  let regPos = /^\d+(\.\d+)?$/; //非负浮点数
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if(regPos.test(value) || regNeg.test(value)){
    return true;
  }else{
    return false;
  }
}
export {timestamp2Time,compareDown,compareUp,isNumber}