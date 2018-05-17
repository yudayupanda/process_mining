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
				<el-input placeholder="请输入内容" v-model="searchInput" :disabled="currentProject === -1" class="input-with-select" @keyup.enter.native = "queryEventLogByKeyWord(searchInput)">
				     <template slot="prepend" style="cursor: pointer;">事件日志</template>
				    <el-button slot="append" icon="el-icon-search" @click="queryEventLogByKeyWord(searchInput)" :disabled="currentProject === -1"></el-button>
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
				      prop="eventLog"
				      label="事件日志"
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
				      prop="normalizedLog"
				      label="规范日志"
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
				          @click="mine(scope.row)">挖掘</el-button>
				        <el-button 
				          size="mini" type="primary" plain
				          @click="download(scope.row)">下载</el-button>
				        <el-button
				          size="mini" type="primary" plain @click="deleteSingleEventLog(scope.row)"
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
	    <el-dialog title="挖掘"  :visible.sync="mineForm.visible" width="62%" >
			<el-steps :active="mineForm.active" finish-status="success" simple>
			  <el-step title="1.算法选择"></el-step>
			  <el-step title="2.参数设置"></el-step>
			  <el-step title="3.查看结果"></el-step>
			</el-steps>

			<div id="step1" style="margin-top: 20PX;">
		    	<el-card>
					<el-table 
					 	:height="mineForm.algorithmTableHeight"
					 	highlight-current-row
					 	v-loading="mineForm.loading"
					 	element-loading-text="加载中..."
					    :data="mineForm.mineAlgorithms"
					    tooltip-effect="dark"
					    style="width: 100%"
					    @current-change="handelCurrentMineAlgorithm"
					>
					    <el-table-column
					      type="index"
					      width="100">
					    </el-table-column>
					    <el-table-column
					      prop="algorithmName"
					      label="挖掘算法"
					        width="190"
					      show-overflow-tooltip
					      sortable
					    >
					    </el-table-column> 
					     <el-table-column
					      prop="packageName"
					      label="包名"
					       sortable
					        width="180"
					      show-overflow-tooltip>
					    </el-table-column>
					    <el-table-column
					      prop="className"
					      label="类名"
					      width="180"
					      sortable
					    >
					    </el-table-column>
					   	 <el-table-column
					      prop="methodName"
					      label="方法名"
					      width="180"
					      show-overflow-tooltip
					      sortable
					    >
					    </el-table-column>

					</el-table>
					<div style="auto;height:auto;padding：0 auto;text-align:center;">
						<el-pagination 
							layout="total,prev, pager, next, jumper" 
							:total="mineForm.algorithmTotal"
							@current-change=""
	      					:current-page.sync="mineForm.currentAlgorithmPage"
	      					style="margin-top:10px;"
						>
						</el-pagination>
					</div>	
				</el-card>		
	    	</div>
	    	<div id="step2" style="margin-top: 20PX;">
		    	<el-card>
	    			<div style="width:100%;">
	    				<div class="toolbar">
	    					<span style="margin-left: 15px;color:#606266;">可视化方式 ： </span>
		    				<el-select style="width:290px;" v-model="mineForm.visualizationSelected" placeholder="请选择">
							    <el-option
							      v-for="item in mineForm.visualization"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value"
							      :disabled="item.disabled">
							      <span style="float: left">{{ item.label }}</span>
							      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
							    </el-option>
							</el-select>
	    				</div>		
	    			</div>	
					<el-table 
					 	:height="mineForm.algorithmTableHeight"
					 	v-loading="mineForm.algorithmParamsForm.loading"
					 	element-loading-text="加载中..."
					    :data="mineForm.algorithmParamsForm.params"
					    tooltip-effect="dark"
					    style="width: 100%;margin-top: 20px;"
					    @current-change="handelCurrentMineAlgorithm"
					>
					    <el-table-column
					      type="index"
					      width="50">
					    </el-table-column>
					    <el-table-column
					      prop="paramName"
					      label="参数名"
					        width="200"
					      show-overflow-tooltip
					    >
					    </el-table-column> 
					     <el-table-column
					      prop="paramTypeName"
					      label="类型"
					        width="100"
					      show-overflow-tooltip>
					    </el-table-column>
					    <el-table-column
					      prop="isNeed"
					      label="必须"
					      width="60"
					    >
					    </el-table-column>
					   	<el-table-column
					      prop="description"
					      label="描述"
					      width="150"
					      show-overflow-tooltip
					    >
					    </el-table-column>
					    <el-table-column
					      prop="defaultValue"
					      label="默认值"
					      width="110"
					    >
					    </el-table-column>
					    <el-table-column
					      label="实际值"
					      width="160"
					      show-overflow-tooltip
					    >
					    	<template slot-scope="scope">
					    		<el-form :model="scope.row" :rules="mineForm.checkParamsRule" ref="paramInput" style="">
					    			<el-form-item prop="paramValue" v-if="scope.row.inputShow">
					    				<el-input v-if="scope.row.inputShow" size="small" v-model="scope.row.paramValue" style="width:100px;margin-top: 15px;"></el-input>
					    			</el-form-item>
					    			<el-form-item ref="boolForm" v-if="!scope.row.inputShow">
						    			<el-select v-model="scope.row.paramValue"  style="width:100px;height:60px;margin-top: 30px;">
											    <el-option
											      v-for="item in mineForm.algorithmParamsForm.boolTypeParamName"
											      :key="item.value"
											      :label="item.label"
											      :value="item.value">
											    </el-option>
										</el-select>
					    			</el-form-item>
					    		</el-form>	
					    	</template>
					    </el-table-column>		   
					</el-table>
				</el-card>		
	    	</div>
	    	<div id="step3" style="margin-top: 20PX;">
	    		 <router-view></router-view>  
	    		<el-card style="height: 500px;">
	    			<div style="height: 500px;" id="canvas"/>
	    		</el-card>		
	    	</div>
	    	<div  class="step-div">
	    		<span class="step-label" v-if="(mineForm.active != 1) && !(mineForm.isMining)" id="previous_step" @click="backToPreviousStep()"><i class="fa fa-arrow-left"></i></span>
	    		<span class="step-label" v-if="(mineForm.active != 3) && !(mineForm.isMining)" id="next_step" @click="goToNextStep()"><i class="fa fa-arrow-right"></i></span>
	    		<span class="step-label" v-if="mineForm.isMining"><i class="fa fa-refresh fa-spin fa-3x fa-fw" style="font-size: 30px;"></i><span class="sr-only">Loading...</span></span>
	    	</div>	    	
		</el-dialog>
	</div>
</template>
<script src="../../../lib/qunee-min.js"></script>
<script>
import {timestamp2Time} from '../../common/common'
import {isNumber} from '../../common/common'
import {queryEventLog} from '../../api/api'
import {uploadEventLog} from '../../api/api'
import {deleteEventLog} from '../../api/api'
import {queryMineAlgorithms} from '../../api/api'
import {getAlgorithmInfo} from '../../api/api'
import {mineEventLog} from '../../api/api'
import {Q} from '../../../lib/qunee-min.js'
export default {
		data() {
			/* 验证器 */

			//验证挖掘算法输入的参数类型是否正确
		    var validateMineParamsValueInput = (rule, value, callback) => {
		    	//输入为空
		        if (!value) {
		          return callback(new Error('请输入参数'))
		        } else {
				    if(!isNumber(value)){
				        return callback(new Error('请输入数字'))
				    }			       
		            callback()
		        }
		    }
			return {
				loading:true,
				currentProject:'',
				projectId:'',
				currentPage:0,
				currentEventLog:-1,
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
				fileList: [],
				//挖掘
				paramInput:'',
				mineForm:{
					isMining:false,
					active:1,
					currentMineAlgorithm:-1,
					visible:false,
					algorithmTableHeight:300,
					mineAlgorithms:[],
					algorithmTotal:0,
					currentAlgorithmPage:1,
					loading:true,
					//算法参数
					algorithmParamsForm:{
						params:[
						],
						loading:true,
						boolTypeParamName:[
							{
								value:'true',
								label:'true',
							},
							{
								value:'false',
								label:'false',
							},	
						]
					},
					checkParamsRule:{
						paramValue:[
				            { validator: validateMineParamsValueInput, trigger: 'blur' }
				        ],
					},
					visualization:[
						{	
							value:'Workflow network',
							label:'工作流网',
						},
						{	
							value:'Flow chart',
							label:'流程图',
							disabled: true
						},
						{	
							value:'Sankey diagram',
							label:'桑基图',
							disabled: true
						},
						{	
							value:'Force guide graph',
							label:'力导向图',
							disabled: true
						},
					],
					visualizationSelected:'工作流网',
					graph:'',
					logsMineResult:[

					],
				},		
			}
		},
		methods: {
			//根据关键字查询相关日志
			queryEventLogByKeyWord(keyWord){
				this.loading = false
				this.log=[]
				//如果当前项目不为空
				if(this.currentProject !== null){
					//this.uploadForm.upLoadData.projectId = this.currentProject.pid
					//加载完成	
					let params = {currentPage: 1, lineSize: 10,keyWord:keyWord,projectId:this.currentProject.pid}
		            queryEventLog(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	let all= data.data.allEventlogs
			            	this.total=data.data.eventlogCount
			            	let i=0,length=all.length
			            	for(;i<length;i++){
			            		let createdTime = timestamp2Time(all[i].eventlogCreatetime)
			            		let eventLogName = all[i].eventlogName
			            		//提示：在返回的信息中，并未有原始日志的信息
			            		let rawLog = ''
			            		let normalizedLog = (all[i].normalizedlog===null?'':all[i].normalizedlog.normalizedlogName)
			            		let log = {eventLogId:all[i].eventlogId,rawLog:rawLog,eventLog:eventLogName,normalizedLog:normalizedLog,createdTime:createdTime}
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
					//this.queryEventLogByKeyWord('')
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
	            if(!extension && !extension2 ) {  
	                this.$message({  
	                    message: '上传的文件格式只能是txt或xes，请检查',  
	                    type: 'warning'  
	                })  
	            }else{
	            	let formData = new FormData()
				    formData.append('file', file)
				    formData.append('format', testmsg)
				    formData.append('projectId', this.currentProject.pid)
				    uploadEventLog(formData).then(data => {
	            		if(typeof(data)=="undefined"){
	            			return
	            		}
	            		if(data.code == 1){	
	            			this.$notify({
					          title: '提示',
					          message: '上传事件日志成功！',
					          type: 'success'
					        })
					        this.uploadForm.visible = false
					        let createdTime = timestamp2Time(data.data.EventLogCreatetime)
					       	let EventLog = {eventLogId:data.data.eventlogId,EventLog:data.data.EventLogName,rawLog:data.data.rawlog,eventLog:data.data.eventlog,createdTime:createdTime}
		            		this.log.push(EventLog)
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
	        //下载事件日志
	        download(row){
	        	let eventLogId = row.eventLogId
	        	if(eventLogId){
	        		window.open("http://116.56.129.93:8081/processMiningPlatform/eventlogAction/download?eventlogId="+eventLogId) 
	        	}
	        },
	        //
	        handelCurrentMineAlgorithm(val){
	        	this.mineForm.currentMineAlgorithm = val
	        },
	        //挖掘
	        mine(row){
	        	this.mineForm.visible = true
	        	this.mineForm.currentMineAlgorithm = -1
	        	this.$nextTick(function() {
	        		document.getElementById('step1').style.display = ''
	        		if(document.getElementById('step2') != null){
	        			document.getElementById('step2').style.display = 'none'
	        		}
	        		if(document.getElementById('step3') != null){
	        			document.getElementById('step3').style.display = 'none'
	        		}	
		        	this.mineForm.active = 1
		        	this.mineForm.loading = true
		        	this.currentEventLog = row
		        	//初始化
		        	this.mineForm.mineAlgorithms = []
		        	let params = {currentPage: 1, lineSize: 10,keyWord:''}
		            queryMineAlgorithms(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	let all = data.data.allAlgorithms
			            	 this.mineForm.mineAlgorithms
			            	let count = data.data.algorithmCount
			            	//算法计数
			            	this.mineForm.algorithmTotal = count
			            	let i = 0
			            	let algorithmId,algorithmName,packageName,className,methodName
			            	for(;i<count;i++){
			            		//如果为挖掘算法
			            		if(all[i].algorithmType){
			            			algorithmId = all[i].algorithmId
			            			algorithmName =  all[i].algorithmName
			            			packageName = all[i].algorithmPackage
			            			className = all[i].algorithmClassName
			            			methodName = all[i].algorithmMethod
			            			let algorithm = {algorithmId:algorithmId,algorithmName:algorithmName,packageName:packageName,
			            				className:className,methodName:methodName}
			            			this.mineForm.mineAlgorithms.push(algorithm)
			            		}	
			            	}
			            	this.mineForm.loading = false
			            } else {
			            	this.mineForm.loading = false
			            }
			            this.loading = false
		            })
	        	})        	
	        },
	        //挖掘界面返回上一个界面
	        backToPreviousStep(){
	        	let active = this.mineForm.active
	        	document.getElementById('step'+active).style.display = 'none'
				document.getElementById('step'+(active-1)).style.display = ''
				this.mineForm.active = active-1
	        },
	        //挖掘界面跳转下一个界面
	        goToNextStep(){
	        	let active = this.mineForm.active
	        	switch(active){
	        		//算法选择步骤
	        		case 1:
	        			//未选择挖掘算法
	        			if(this.mineForm.currentMineAlgorithm === -1 || this.mineForm.currentMineAlgorithm === null){
	        				this.$message({  
			                    message:'请选择挖掘算法！',  
			                    type: 'info'  
				            })
	        			}else{
	        				document.getElementById('step'+active).style.display = 'none'
	        				this.mineForm.active += 1
	        				//显示第二步骤界面
	        				document.getElementById('step2').style.display = ''
	        				//获取算法参数信息
	        				//获取算法参数
		        			let algoId = this.mineForm.currentMineAlgorithm.algorithmId
		        			let params = {algoId:algoId}
		        			getAlgorithmInfo(params).then(data =>{
		        				this.mineForm.algorithmParamsForm.params = []
		        				if(data.code === 1){
		        					let params = data.data.params
		        					if(params != null){
		        						let paramsCount = params.length
			        					let i = 0
			        					let paramName,paramTypeName,defaultValue,displayName,paramValue
			        					let paramMap = {
			        						1:'整型',
			        						2:'浮点型',
			        						3:'整型枚举型',
			        						4:'浮点枚举型',
			        						5:'布尔型',
			        					}
			        					//展示下拉选择框或输入框
			        					let paramType,inputShow = true
			        					let isNeed = '是'
			        					let description = ''
			        					for(;i<paramsCount;i++){
			        						paramName = params[i].name
			        						paramType = params[i].type
			        						if(paramType  === 5){
			        							inputShow = false
			        						}
			        						paramTypeName = paramMap[paramType]
			        						defaultValue = params[i].defaultValue
			        						displayName = params[i].displayName
			        						let param = {inputShow:inputShow,paramName:paramName,paramType:paramType,paramTypeName:paramTypeName,defaultValue:defaultValue,isNeed:isNeed,description:description,paramValue:defaultValue}
			        						this.mineForm.algorithmParamsForm.params.push(param)
			        					}
		        					}
		        					this.mineForm.algorithmParamsForm.loading = false		
		        				}else{
		        					if(data.code === -1){
		        						this.$message({  
						                    message:data.msg,  
						                    type: 'error'  
							            })
							            this.mineForm.algorithmParamsForm.loading = false
		        					}	
		        				}
		        			})
		        		}
	        		break
	        		//开始挖掘
	        		case 2:
		        		//验证算法参数是否填写正确
		        		this.$refs.paramInput.validate((valid) => {
				          if (valid) {
				          	this.mineForm.isMining = true
				          	let logId,methodId,imageType
				          	let paramList = []
				          	let originParams = this.mineForm.algorithmParamsForm.params
				          	let i = 0,paramsCount = originParams.length
				          	let param
				          	for(;i<paramsCount;i++){
				          		param  = {name:originParams[i].paramName,value:originParams[i].paramValue,type:originParams[i].paramType}
				          		paramList.push(param)     		
				          	}  	
				          	logId = this.currentEventLog.eventLogId
				            methodId = this.mineForm.currentMineAlgorithm.algorithmId
				            imageType = 1
				            let params = {logId:logId,methodId:methodId,paramList:paramList,imageType:imageType}
				            mineEventLog(params).then(data =>{
				            	//挖掘成功
				            	if(data.code === 1){	
				            		//挖掘时间
				            		// let mineUseTime = data.data.mineUsetime
				            		// let netElementList = data.data.netElementList
				            		let result = data.data
				            		//保存事件日志挖掘结果，包含日志id，算法id，可视化类型，以及挖掘结果信息
				            		var date = new Date()
				            		let mineTime = date.toLocaleString( )  //获取当前日期和时间
				            		let logName = this.currentEventLog.eventLog
				            		let user = JSON.parse(sessionStorage.getItem('user'))
				            		let algorithmName = this.mineForm.currentMineAlgorithm.algorithmName
				            		let logMineResult = {mineTime:mineTime,user:user,logName:logName,logId:logId,algorithmName:algorithmName,methodId:methodId,imageType:imageType,result:result}
				            		//sessionStorage.setItem('eventLogResult', JSON.stringify(logMineResult))

				            		this.mineForm.logsMineResult.push(logMineResult)
				            		let netElementList = result.netElementList
				            		this.mineForm.active += 1
				            		document.getElementById('step2').style.display = 'none'
				            		//document.getElementById('step3').style.display = ''
				            		//this.$router.push({name: '工作流图' })
				            		this.$router.push({name: '工作流图',params: {eventLogResult:logMineResult}})
				            		this.mineForm.isMining = false
				            	}else{
				            		//挖掘失败
				            		if(data.code === -1){
				            			this.$message({  
						                    message:data.msg,  
						                    type: 'error'  
							            })
				            		}
				            		this.mineForm.isMining = false
				            	}
				           	})    
				          } else {				            
				          }
				        })	
	        		break

	        		default:
	        		break
	        	}	
	        },
	        //添加结点
	        createNode(name){
	        	let graph = this.mineForm.graph
	        	let node = graph.createNode(name)
    			node.image = customDraw
    			node.size = {width:25}
    			return node
	        },
	        //获取当前所选项
	        selsChange(sels){
				this.sels = sels
			},
	        //单条删除事件日志
	        deleteSingleEventLog(eventLog){
	        	this.$confirm(
	        		'此操作将永久删除所选中事件日志，是否继续?',
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
	        //批量删除事件日志
	        batchRemove(){	
	        	this.$confirm(
	        		'此操作将永久删除所选中'+this.sels.length+'条事件日志，是否继续?',
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
			this.queryEventLogByKeyWord('')
				
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
.algorithmTitle{
	font-size: 18px;
}
.step-div{

	text-align:right;
	height:20px;
	display: block;
}
.step-label{
	
	padding: 10px;
	font-size: 30px;
	display: inline-block;
	height: 40px;
	color:#9AC0CD;
	cursor: pointer;
}

</style>