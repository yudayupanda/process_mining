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
				<el-input placeholder="请输入内容" v-model="searchInput" :disabled="currentProject === -1" class="input-with-select" @keyup.enter.native = "queryRawLogByKeyWord(searchInput)">
				     <template slot="prepend" style="cursor: pointer;">规范日志</template>
				    <el-button slot="append" icon="el-icon-search" @click="queryRawLogByKeyWord(searchInput)" :disabled="currentProject === -1"></el-button>
  				</el-input>
			</el-col>
		</el-col>
		<el-col :span="24">
			<el-card style="margin-top:20px;">
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
				          @click="">规范化</el-button>
				        <el-button 
				          size="mini" type="primary" plain
				          @click="download(scope.row)">下载</el-button>
				        <el-button
				          size="mini" type="primary" plain @click="deleteSingleRawLog(scope.row)"
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
			  <div class="el-upload__tip" slot="tip">提示：只能上传单个txt文件</div>
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
import axios from 'axios'
import {timestamp2Time} from '../../common/common'
import {queryRawLog} from '../../api/api'
import {uploadRawLog} from '../../api/api'
import {deleteRawLog} from '../../api/api'
export default {
		data() {
			return {
				loading:true,
				currentProject:'',
				projectId:'',
				currentPage:0,
				searchInput:"",
				searchType:"日志名称",
				tableHeight:459,
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
				fileList: []
			}
		},
		methods: {
			//根据关键字查询相关原始日志
			queryRawLogByKeyWord(keyWord){
				this.loading = false
				this.log=[]
				//如果当前项目不为空
				if(this.currentProject !== null){
					this.uploadForm.upLoadData.projectId = this.currentProject.pid
					//加载完成	
					let params = {currentPage: 1, lineSize: 10,keyWord:keyWord,projectId:this.currentProject.pid}
		            queryRawLog(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	let all= data.data.allRawlogs
			            	this.total=data.data.rawlogCount
			            	let i=0,length=all.length
			            	for(;i<length;i++){
			            		let createdTime = timestamp2Time(all[i].rawlogCreatetime)
			            		let normalizedLog,normalizedLogName = ''
			            		let eventLog,eventLogName = ''
			            		if(all[i].normalizedlog != null){
			            			normalizedLog = all[i].normalizedlog
			            			normalizedLogName = normalizedLog.normalizedlogName
			            			if(all[i].normalizedlog.eventlog != null){
			            				eventLog = all[i].normalizedlog.eventlog
			            				eventLogName = eventLog.eventlog.eventLogName
			            			}

			            		}
			            		let rawlog = {rawlogId:all[i].rawlogId,rawLog:all[i].rawlogName,normalizedLog:normalizedLogName,eventLog:eventLog,createdTime:createdTime}
			            		this.log.push(rawlog)
			            	}
			            	
			            } else {
			            }
			            this.loading = false
		            })
	            }else{
	            	this.loading = false
	            }
			},
			//获取路由参数
			getRouterParams(){
				let routerParams = this.$route.params
				this.currentProject = routerParams.project
				if(this.currentProject != -1 && typeof(this.currentProject) != "undefined"){
					this.queryRawLogByKeyWord('')
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
	            if(!extension ) {  
	                this.$message({  
	                    message: '上传的文件格式只能是txt，请检查',  
	                    type: 'warning'  
	                })  
	            }else{
	            	let formData = new FormData()
				    formData.append('file', file)
				    formData.append('format', 'txt')
				    formData.append('projectId', this.currentProject.pid)
				    uploadRawLog(formData).then(data => {
	            		if(typeof(data)=="undefined"){
	            			return
	            		}
	            		if(data.code == 1){	
	            			this.$notify({
					          title: '提示',
					          message: '上传规范日志成功！',
					          type: 'success'
					        })
					        this.uploadForm.visible = false
					        let createdTime = timestamp2Time(data.data.rawlogCreatetime)
					       	let rawlog = {rawlogId:data.data.rawlogId,rawLog:data.data.rawlogName,normalizedLog:'',eventLog:'',createdTime:createdTime}
		            		this.log.push(rawlog)
	            		}
	            		if(data.code == -1){
	            			this.$notify.error({
					          title: '提示',
					          message: '日志名已存在，请重新上传！'
					        });
	            		}	
	            	})
	            }
	            return extension
	        },
	        //下载原始日志
	        download(row){
	        	let rawlogId = row.rawlogId
	        	if(rawlogId){
	        		window.open("http://116.56.129.93:8081/processMiningPlatform/rawlogAction/download?rawlogId="+rawlogId) 
	        	}
	        },
	        //获取当前所选项
	        selsChange(sels){
				this.sels = sels
			},
	        //单条删除原始日志
	        deleteSingleRawLog(rawLog){
	        	this.$confirm(
	        		'此操作将永久删除所选中原始日志，是否继续?',
	        	 	'提示',
	        		{ type: 'warning' }
	        	 ).then(() => {
	        	 	let ids = []
	        		ids.push(rawLog.rawlogId)
	        		let params = {ids:ids.toString()}
	        	 	deleteRawLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              let length = this.log.length
			              for(let i=0; i<length; i++) {
			                if(this.log[i].rawlogId === rawLog.rawlogId) {  
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
	        	 	deleteRawLog(params).then(data =>{
		    	 		if(typeof(data)==="undefined")
		    	 			return
		    	 		if(data.code === 1){
		    	 			//删除成功
			              	let i = 0
			              	let oldLodLength = this.log.length
			              	let newLog = []
			              	for(;i<oldLodLength;i++){
			              		if(ids.indexOf(this.log[i].rawlogId) === -1){
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
      		// 自定义文件上传的方式
			upload (item) {
			    
			},
		},
		created(){

		},
		watch: {
    		//监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      		'$route': 'getRouterParams'
    	},
		mounted() {	
			this.tableHeight = document.body.clientHeight-300
			this.getRouterParams()
			// this.$router.push({name: '原始日志',params: {id:1,project:-1}})
		}
	}
</script>

<style scoped>
.main{
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
.el-input-group{
	float:right;
	margin-right: 20px;
	margin-top: 10px;
}
.el-select{
    width: 120px;
  }
</style>