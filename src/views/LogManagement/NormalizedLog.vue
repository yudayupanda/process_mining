<template>
	<div class="main">
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-col :span="12">
				<div style="margin-left:15px;">
				<el-form :inline="true">	
					  <el-button icon="el-icon-upload" @click="uploadForm.visible=true" type="primary" :disabled="currentProject === -1" plain>上传</el-button>
					  <el-button icon="el-icon-delete" type="primary" plain :disabled="this.sels.length===0" @click="batchRemove()">删除</el-button>
				</el-form>
				</div>
			</el-col>
			<el-col :span="12">
				<el-input placeholder="请输入内容" v-model="searchInput" :disabled="currentProject === -1" class="input-with-select" @keyup.enter.native = "queryNormalizedLogByKeyWord(searchInput)">
				     <template slot="prepend" style="cursor: pointer;">规范日志</template>
				    <el-button slot="append" icon="el-icon-search" @click="queryNormalizedLogByKeyWord(searchInput)" :disabled="currentProject === -1"></el-button>
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
				      prop="normalizedLog"
				      label="规范日志"
				      width="200"
				      show-overflow-tooltip
				      sortable
				     >
				    </el-table-column>
				     <el-table-column
				      prop="createdTime"
				      label="创建时间"
				       sortable
				        width="200"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="rawLog"
				      label="原始日志"
				      width="200"
				      sortable
				    >
				    </el-table-column>
				    <el-table-column
				      prop="eventLog"
				      label="事件日志"
				        width="200"
				      show-overflow-tooltip
				      sortable
				    >
				    </el-table-column>   
				    <el-table-column
				      label="操作"
				      width="260">
				      <span slot-scope="scope" >
				      	<el-button 
				          size="mini" type="primary" plain
				          @click="normalizedLogToEventLog(scope.row)">事件化</el-button>
				        <el-button 
				          size="mini" type="primary" plain
				          @click="download(scope.row)">下载</el-button>
				        <el-button
				          size="mini" type="primary" plain @click="deleteSingleNormalizedLog(scope.row)"
				          >删除</el-button>
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
		<!--上传文件-->
	<el-dialog title="上传文件" :visible.sync="uploadForm.visible" :width="uploadForm.dialogWidth">
        <el-form :model="uploadForm" ref="uploadForm" style="margin: 0 auto;text-align:center;">
         	<el-upload
         	  ref="upload"
			  class="upload-demo"
			  style="margin: 0 auto;"
			  drag
			  action=";"
			  :limit="uploadForm.limit"
			  accept="txt"
			  multiple
			  :auto-upload="false"
			  :file-list="fileList"
			  :beforeUpload="beforeUpload"
			  >
			  <i class="el-icon-upload"></i>
			  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			  <div class="el-upload__tip" slot="tip">提示：只能上传单个txt或xes文件</div>
			</el-upload>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="uploadForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload()">确 定</el-button>
        </div>
    </el-dialog>
	</div>
</template>
<script>
import {timestamp2Time} from '../../common/common'
import {queryNormalizedLog} from '../../api/api'
import {uploadNormalizedLog} from '../../api/api'
import {deleteNormalizedLog} from '../../api/api'
import {normalizedLog2EventLog} from '../../api/api'
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
					//上传地址
					importFileUrl:"http://116.56.129.93:8081/processMiningPlatform/rawlogAction/upload",
					//上传文件时要上传的额外参数
					upLoadData: {
				       format: 'txt', 
				       projectId:'',
				    }
				},
				//上传的文件列表，注:目前只允许上传单条日志
				fileList: []
			}
		},
		methods: {
			//根据关键字查询相关原始日志
			queryNormalizedLogByKeyWord(keyWord){
				this.loading = false
				this.log=[]
				//如果当前项目不为空
				if(this.currentProject !== null){
					//this.uploadForm.upLoadData.projectId = this.currentProject.pid
					//加载完成	
					let params = {currentPage: 1, lineSize: 10,keyWord:keyWord,projectId:this.currentProject.pid}
		            queryNormalizedLog(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	let all= data.data.allNormalizedlogs
			            	this.total=data.data.normalizedlogCount
			            	let i=0,length=all.length
			            	for(;i<length;i++){
			            		let createdTime = timestamp2Time(all[i].normalizedlogCreatetime)
			            		let normalizedlogName = all[i].normalizedlogName
			            		let rawLog = (all[i].rawlog === null?'':all[i].rawlog.rawlogName)
			            		let eventLog = (all[i].eventlog === null?'':all[i].eventlog.eventlogName)
			            		let log = {normalizedlogId:all[i].normalizedlogId,rawLog:rawLog,normalizedLog:normalizedlogName,eventLog:eventLog,createdTime:createdTime}
			            		this.log.push(log)
			            	}
			            	
			            } else {
			            }
			            this.loading = false
		            })
	            }else{
	            	this.loading = false
	            }
			},
			//获取路由参数,未用
			getRouterParams(){
				this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))	
				// let routerParams = this.$route.params
				// this.currentProject = routerParams.project
				if(this.currentProject != -1 && typeof(this.currentProject) != "undefined"){
					//this.queryNormalizedLogByKeyWord('')
				}else{
					//如果当前项目为空
					this.loading = false
					this.log = []
				}
			},
			//上传文件
			submitUpload(){
        		this.$refs.upload.submit()
      		},
			//判断上传的文件格式,在判断格式里上传文件
		    beforeUpload(file) {   
		        this.uploadForm.file = file     
	            let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                 
	            const extension = testmsg === 'txt'  
	            const extension2 = testmsg === 'xes'  
	            const isLt2M = file.size / 1024 / 1024 < 10  
	            if(file.size === 0){
	            	this.$message({  
	                    message: '上传的文件为空，请检查',  
	                    type: 'warning'  
	                })
	                return  
	            }
	            if(!extension && !extension2) {  
	                this.$message({  
	                    message: '上传的文件格式只能是txt，请检查',  
	                    type: 'warning'  
	                })  
	            }else{
	            	let formData = new FormData()
				    formData.append('file', file)
				    formData.append('format', testmsg)
				    formData.append('projectId', this.currentProject.pid)
				    uploadNormalizedLog(formData).then(data => {
	            		if(typeof(data)=="undefined"){
	            			return
	            		}
	            		if(data.code == 1){	
	            			this.$notify({
					          title: '提示',
					          message: '上传规范化日志成功！',
					          type: 'success'
					        })
					        this.uploadForm.visible = false
					        let createdTime = timestamp2Time(data.data.normalizedlogCreatetime)
					       	let normalizedLog = {normalizedlogId:data.data.normalizedlogId,normalizedLog:data.data.normalizedlogName,rawLog:data.data.rawlog,eventLog:data.data.eventlog,createdTime:createdTime}
		            		this.log.push(normalizedLog)
	            		}
	            		if(data.code == -1){
	            			this.$notify.error({
					          title: '提示',
					          message: data.msg
					        })
	            		}	
	            	})
	            }
	            return extension
	        },
	        //下载原始日志
	        download(row){
	        	let normalizedlogId = row.normalizedlogId
	        	if(normalizedlogId){
	        		window.open("http://116.56.129.93:8081/processMiningPlatform/normalizedlogAction/download?normalizedlogId="+normalizedlogId) 
	        	}
	        },
	        //获取当前所选项
	        selsChange(sels){
				this.sels = sels
			},
	        //单条删除规范化日志
	        deleteSingleNormalizedLog(normalizedLog){
	        	this.$confirm(
	        		'此操作将永久删除所选中原始日志，是否继续?',
	        	 	'提示',
	        		{ type: 'warning' }
	        	 ).then(() => {
	        	 	let ids = []
	        		ids.push(normalizedLog.normalizedlogId)
	        		let params = {ids:ids.toString()}
	        	 	deleteNormalizedLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              let length = this.log.length
			              for(let i=0; i<length; i++) {
			                if(this.log[i].normalizedlogId === normalizedLog.normalizedlogId) {  
			                  this.log.splice(i, 1);
			                  break;
			                }
			              }
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
	        	 	deleteNormalizedLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              	let i = 0
			              	let oldLodLength = this.log.length
			              	let newLog = []
			              	for(;i<oldLodLength;i++){
			              		if(ids.indexOf(this.log[i].normalizedlogId) === -1){
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
			//事件化规范化日志
			normalizedLogToEventLog(normalizedLog){
				let params={normalizedlogId:normalizedLog.normalizedlogId}
				normalizedLog2EventLog(params).then(data => {
					//连接失败
	            	if (typeof(data) == "undefined")
	            		return
	            	if(data.code === 1){
	            		this.$notify({
					          title: '提示',
					          message: '事件化规范日志成功！',
					          type: 'success'
					        })
	            	}else{
	            		this.$notify.error({
					          title: '提示',
					          message: data.msg
					    })
	            	}
				})
			},
		},
			
		//页面刷新,重新获取当前项目信息
		created(){	
			this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
			this.queryNormalizedLogByKeyWord('')
			//this.tableHeight = document.getElementById('table_card').scrollHeight*0.82
			//this.tableHeight = document.getElementById('table_card').offsetHeight*0.82	
		},
		watch: {
    		//监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      		//'$route': 'getRouterParams'
    	},
		mounted() {		
			this.$nextTick(function() {
				
				this.tableHeight = document.getElementById('table_card').offsetHeight*0.82
				//this.tableHeight = document.getElementById('table_card').scrollHeight*0.82	
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