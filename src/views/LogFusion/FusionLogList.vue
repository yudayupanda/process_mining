<template>
	<div class="main">
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-col :span="16">
				<div style="margin-left:15px;">
				<el-form :inline="true">	
					  <el-button icon="el-icon-delete" type="primary" plain :disabled="this.sels.length===0" @click="batchRemove()">删除</el-button>
				</el-form>
				</div>
			</el-col>
			<el-col :span="8">
				<el-input placeholder="请输入内容" v-model="searchInput" :disabled="currentProject === -1" class="input-with-select" @>
				     <template slot="prepend" style="cursor: pointer;">搜索</template>
				    <!-- <el-button slot="append" icon="el-icon-search" @click="queryMergeLogByKeyWord(searchInput)" :disabled="currentProject === -1"></el-button> -->
  				</el-input>
			</el-col>
		</el-col>
		<el-col :span="24">
			<el-card class="table-div" id="table_card">
				<el-table 
				 	:height="tableHeight"
				 	v-loading="loading"
				 	element-loading-text="加载中..."
				    :data="log"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="selsChange"
				    @cell-mouse-enter=""
				>
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      type="index"
				      width="60">
				    </el-table-column>
				    <el-table-column
				      prop="mergeLog"
				      label="融合日志"

				      show-overflow-tooltip
				      sortable
				    >
				    </el-table-column> 
				     <el-table-column
				      prop="createdTime"
				      label="创建时间"
				       sortable

				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="associatedEventLog_1"
				      label="关联事件日志-1"
				    
				      sortable
				    >
				    </el-table-column>
				   	<el-table-column
				      prop="associatedEventLog_2"
				      label="关联事件日志-2"
	
				      show-overflow-tooltip
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      label="操作"
				      width="260">
				      <span slot-scope="scope" >
				        <el-button
				          size="mini" type="primary" plain @click="deleteSingleMergeLog(scope.row)"
				          ><i class="fa fa-trash-o fa-lg"></i> 删除</el-button>
				      </span>
				    </el-table-column>
				</el-table>
				<div style="auto;height:auto;padding：0 auto;text-align:center;">
					<el-pagination 
						layout="total,prev, pager, next, jumper" 
						:total="total"
						@current-change="handleCurrentChange"
      					:current-page.sync="currentPage"
      					style="margin-top:10px;"
					>
					</el-pagination>
				</div>	
			</el-card>		
		</el-col>
	</div>
</template>
<script>
import {timestamp2Time} from '../../common/common'
import {queryMergeLog} from '../../api/api'
import {deleteEventLog} from '../../api/api'

export default {
		data() {
			return {
				loading:true,
				currentProject:'',
				projectId:'',
				currentPage:0,
				searchInput:"",
				searchType:"日志名称",
				tableHeight:200,
				log:[
				],
				sels: [],//列表选中列
				total:0,
				uploadForm:{
					file:"",
					visible:false,
					dialogWidth:"30%",
					limit:1,
					//上传文件时要上传的额外参数
					upLoadData: {
				       format: '', 
				       projectId:'',
				    }
				},
				//上传的文件列表，注:目前只允许上传单条日志
				fileList: []
			}
		},
		computed:{
	      logTable:function(){
	        let search = this.searchInput
	        if(search){
	          return  this.log.filter(function(dataNews){
	            return Object.keys(dataNews).some(function(key){
	              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
	            })
	          })
	        }
	        return this.log
	      },
    	},
		methods: {
			//根据关键字查询相关原始日志
			queryMergeLogByKeyWord(keyWord){
				this.loading = false
				this.log=[]
				//如果当前项目不为空
				if(this.currentProject !== null){
					//this.uploadForm.upLoadData.projectId = this.currentProject.pid
					//加载完成	
					let params = {currentPage: 1, lineSize: 10,keyWord:keyWord,projectId:this.currentProject.pid}
		            queryMergeLog(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	// let all= data.data.allEventlogs
			            	// this.total=data.data.eventlogCount
			            	// let i=0,length=all.length
			            	// for(;i<length;i++){
			            	// 	let createdTime = timestamp2Time(all[i].eventlogCreatetime)
			            	// 	let eventLogName = all[i].eventlogName
			            	// 	//let rawLog = (all[i].rawlog===null?'':all[i].rawlog.rawlogName)
			            	// 	//提示：在返回的信息中，并未有原始日志的信息
			            	// 	let rawLog = ''
			            	// 	let normalizedLog = (all[i].normalizedlog===null?'':all[i].normalizedlog.normalizedlogName)
			            	// 	let log = {eventLogId:all[i].eventlogId,rawLog:rawLog,eventLog:eventLogName,normalizedLog:normalizedLog,createdTime:createdTime}
			            	// 	this.log.push(log)
			            	// }
			            	
			            } else {
			            }
			            this.loading = false
		            })
	            }else{
	            	this.loading = false
	            }
			},
	        //下载事件日志
	        download(row){
	        	let eventLogId = row.eventLogId
	        	console.log(row)
	        	if(eventLogId){
	        		window.open("http://116.56.129.93:8081/processMiningPlatform/eventlogAction/download?eventlogId="+eventLogId) 
	        	}
	        },

	        //获取当前所选项
	        selsChange(sels){
				this.sels = sels
			},
	        //单条删除规范化日志
	        deleteSingleMergeLog(eventLog){
	        	this.$confirm(
	        		'此操作将永久删除所选中原始日志，是否继续?',
	        	 	'提示',
	        		{ type: 'warning' }
	        	 ).then(() => {
	        	 	let ids = []
	        		ids.push(eventLog.eventLogId)
	        		let params = {ids:ids.toString()}
	        	 	deleteEventLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              let length = this.log.length
			              for(let i=0; i<length; i++) {
			                if(this.log[i].eventLogId === eventLog.eventLogId) {  
			                  this.log.splice(i, 1);
			                  break;
			                }
			              }
		    	 		}else{
		    	 			this.$notify.error({
					          title: '提示',
					          message: data.msg
					    	})
		    	 		}
	        		})
	    		}).catch(() => { 
				}) 
	        },
	        //批量删除原始日志
	        batchRemove(){	
	        	this.$confirm(
	        		'此操作将永久删除所选中'+this.sels.length+'条原始日志，是否继续?',
	        	 	'提示',
	        		{ type: 'warning' }
	        	 ).then(() => {
	        	 	let ids = []
	        		let i = 0
	        		let length = this.sels.length
	        		for(;i<length;i++){
	        			ids.push(this.sels[i].rawlogId)
	        		}
	        		let params = {ids:ids.toString()}
	        	 	deleteEventLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              	let i = 0
			              	let oldLodLength = this.log.length
			              	let newLog = []
			              	for(;i<oldLodLength;i++){
			              		if(ids.indexOf(this.log[i].eventLogId) === -1){
			              			newLog.push(this.log[i])
			              		}
			              	}
			              	this.log = newLog
		    	 		}
	        		})
	    		}).catch(() => { 
				}) 
	        },
	        // 上传成功后的回调
		    uploadSuccess (response, file, fileList) {
		      console.log('上传文件', response)
		    },
		    // 上传错误
		    uploadError (response, file, fileList) {
		      console.log('上传失败，请重试！')
		    },
		    //当前页面
		    handleCurrentChange(val) {
      		},
      		//自定义文件上传的方式
			upload (item) {
			},
		},
			
		//页面刷新,重新获取当前项目信息
		created(){	
			this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
			this.queryMergeLogByKeyWord('')
				
		},
		watch: {
    		//监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      		//'$route': 'getRouterParams'
    	},
		mounted() {		
			this.$nextTick(function() {
				console.log(this.currentProject)
				this.tableHeight = document.getElementById('table_card').offsetHeight*0.82	
      		})  
		}
	}
</script>

<style scoped>
.main{
	overflow-y:auto;
}
.scroll-table{
	overflow: auto;
}
.el-upload {
	width: 100px !important;
}
.toolbar{
	background-color: #EBEEF5;
	height: 60px;
	margin-top: 15px;
	line-height: 60px;
}
.table-div{
	position: absolute;
	bottom:20px;
	top:150px;
	right:40px;
	left:40px;
}
.el-input-group{
	float:right;
	margin-right: 20px;
	margin-top: 10px;
}
.el-select{
    width: 120px;
}
.table-cell-input{
	height:40px;
	width:100%;
	outline:none;
	border:none;
	background:none;
	font-size: 14px;
	color:#606266;
}
.add-cog{
	font-size: 25px;
	color:#445f93;
	
	width:100%;
	background-color:#EBEEF5;
	height:40px;
	line-height: 40px;
	text-align: left;
	padding-left: 5px;
	margin-bottom: 10px;
}
.cog-icon{
	cursor: pointer;
	margin-left: 10px;
}
</style>