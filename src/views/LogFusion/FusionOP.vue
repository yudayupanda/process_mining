<template>
	<div class="root">
		<el-col :span="24">
			<el-card class="algorithm-card">
				<div slot="header" class="clearfix">
				    <span class="algorithm-tag">1.算法选择</span>
				</div>
				<div style="overflow-y:auto;">
					<div v-for="(a,i) in mergelAgorithms"  >
						<div class="algorithm-box" @click="handleSelectAlgorithm(a,i)" :id="'algorithm_'+i">
							{{a.name }}
							<i class="fa fa-lightbulb-o algorithm-check" :id="'check_'+i"></i>
							<div class="algorithm-setting">		
								<button id="getMoreDetailBtn" class="algorithm-setting-btn" title="详细信息" @click.stop="handleGetMoreDetail(a,i)">
									<i class="fa fa-info" style="" :id="'check_'+i"></i>
								</button>
								<button class="algorithm-setting-btn" title="参数设置" @click.stop="handleSettingParams(a,i)">
									<i class="fa fa-cog" style="" :id="'check_'+i"></i>
								</button>				
							</div>
							
						</div>
						
					</div>
				</div>
				<div class="line"></div> 
			</el-card>
		</el-col>
		<el-col :span="24">
			<el-card class="algorithm-card" style="height: auto;">
				<div slot="header" class="clearfix">
				    <span class="log-tag">2.日志选择</span>
				</div>
				<div>
				    <el-collapse v-model="activeNames" @change="handleChange" style="width: 98%;">
					  	<el-collapse-item  name="1" >
						  	<template slot="title" >
						      <div style="font-size: 16px;color:#A1A1A1;"  id="selectEvenLogDiv_1">选择事件日志 - 1
						      		<i class="fa fa-file-o" style="margin-left:30px;"></i> 
						      		<el-tag style="margin-left: 100px;display: none;" id="eventLogName_1"></el-tag>
						      		<a id="cancelEventLog_1" style="display: none;margin-left:20px;" @click.stop='cancelSelectedEventLog_1()'><i class="fa fa-close"></i></a>
						      </div>
						    </template>
						    <div>
						    	<el-card>
									<el-table 
									 	:height="tableHeight"
									 	v-loading="loading"
									 	element-loading-text="加载中..."
									    :data="log"
									    tooltip-effect="dark"
									    highlight-current-row
									    style="width: 100%"
									    @selection-change="selsChange"
									    @cell-mouse-enter=""
									    @row-click="rowClick"
									    @select-all="selectAll"
									    @current-change="handleCurrentEventLog_1"
									>
									    <el-table-column
									      type="index"
									      width="100">
									    </el-table-column>
									    <el-table-column
									      prop="eventLog"
									      label="事件日志"
									        width="220"
									      show-overflow-tooltip
									      sortable
									    >
									    </el-table-column> 
									     <el-table-column
									      prop="createdTime"
									      label="创建时间"
									       sortable
									        width="220"
									      show-overflow-tooltip>
									    </el-table-column>
									    <el-table-column
									      prop="rawLog"
									      label="原始日志"
									      width="220"
									      sortable
									    >
									    </el-table-column>
									   	<el-table-column
									      prop="normalizedLog"
									      label="规范日志"
									      width="220"
									      show-overflow-tooltip
									      sortable
									    >
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
						    </div>
					  	</el-collapse-item>
					  	<el-collapse-item  name="2" >
						  	<template slot="title" >
						      <div style="font-size: 16px;color:#A1A1A1;" id="selectEvenLogDiv_2">选择事件日志 - 2
						      	<i class="fa fa-file-o" style="margin-left:30px;"></i>
						      	<el-tag style="margin-left: 100px;display: none;" id="eventLogName_2"></el-tag>
						      	<a id="cancelEventLog_2" style="display: none;margin-left:20px;" @click.stop='cancelSelectedEventLog_2()'><i class="fa fa-close"></i></a>
						      </div>
						    </template>
						    <div>
						    	<el-card>
									<el-table 
									 	:height="tableHeight"
									 	highlight-current-row
									 	v-loading="loading"
									 	element-loading-text="加载中..."
									    :data="log"
									    tooltip-effect="dark"
									    style="width: 100%"
									    @current-change="handleCurrentEventLog_2"
									>
									    <el-table-column
									      type="index"
									      width="100">
									    </el-table-column>
									    <el-table-column
									      prop="eventLog"
									      label="事件日志"
									        width="220"
									      show-overflow-tooltip
									      sortable
									    >
									    </el-table-column> 
									     <el-table-column
									      prop="createdTime"
									      label="创建时间"
									       sortable
									        width="220"
									      show-overflow-tooltip>
									    </el-table-column>
									    <el-table-column
									      prop="rawLog"
									      label="原始日志"
									      width="220"
									      sortable
									    >
									    </el-table-column>
									   	<el-table-column
									      prop="normalizedLog"
									      label="规范日志"
									      width="220"
									      show-overflow-tooltip
									      sortable
									    >
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
						    </div>
					  	</el-collapse-item>
					</el-collapse>
				</div>
			</el-card>
		</el-col>
		<el-col :span="24">
				<div class="toolbar">
					 <el-button class="start-merge-btn" icon="el-icon-check" circle @click="mergeEventLogs()" title="开始融合" :loading="mergeLoaing"></el-button>
				</div>
				
		</el-col>
	</div>
</template>
<script>
import {queryEventLog} from '../../api/api'
import {mergeEventLogs} from '../../api/api'
import {timestamp2Time} from '../../common/common'
export default {
		data() {
			return {
				currentEventLog_1:-1,
				currentEventLog_2:-1,
				currentProject:-1,
				sles:[],
				log:[],
				radio:'1',
				loading:true,
				total:0,
				currentPage:0,
				tableHeight:300,
				currentAlgorithmIndex:-1,
				lastAlgorithmIndex:-1,
				lastCheckIndex:-1,
				currentAlgorithm:-1,
				mergeLoaing:false,
				mergelAgorithms:[
					{
						id:'9',
						name:'AIA-融合算法',
					},
				],
				//折叠面板默认打开页面，当前无默认打开
				activeNames: '0',
			}
		},
		methods: {
			handleSelectAlgorithm(a,i){
				this.currentAlgorithmIndex = i
				this.currentAlgorithm = a
				let id = 'algorithm_'+i
				let algorithm = document.getElementById(id)	
				let check = document.getElementById('check_'+i)	
				//取消选择
				if(algorithm.className.indexOf('clickedAlgorithm') > -1){
					//clickedBox前面必须加空格
        			algorithm.setAttribute('class','algorithm-box')
        			check.style.opacity = '0'
        			this.currentAlgorithm = -1
				}else{
					algorithm.className += ' clickedAlgorithm'
					check.style.opacity = '100'
					this.currentAlgorithm = a
				}
        		if(this.lastAlgorithmIndex != -1 && this.lastAlgorithmIndex != i){
        			let lastAlgorithm = document.getElementById('algorithm_'+this.lastAlgorithmIndex)
        			let lastCheck = document.getElementById('check_'+this.lastCheckIndex)
        			lastCheck.style.opacity = '0'
        			lastAlgorithm.setAttribute('class','algorithm-box')	
        		}
        		this.lastAlgorithmIndex = i
        		this.lastCheckIndex = i
        		console.log(this.currentAlgorithm)
			},
			//获取算法更多信息
			handleGetMoreDetail(a,i){
			},
			//设置算法参数
			handleSettingParams(a,i){

			},
			//折叠面板改变事件
			handleChange(val) {
        		
     	 	},
     	 	//当前页面
		    handleCurrentChange(val) {
		    	
      		},
      		//处理当前选择事件日志-1
		    handleCurrentEventLog_1(val) {
		    	this.currentEventLog_1 = val
		    	document.getElementById('eventLogName_1').style.display = 'inline-block'
		    	document.getElementById('cancelEventLog_1').style.display = 'inline-block'
		    	document.getElementById('eventLogName_1').innerHTML = val.eventLog
		    	//模拟关闭折叠面板
		    	//document.getElementById('selectEvenLogDiv_1').click()
      		},
      		//处理当前选择事件日志-2
		    handleCurrentEventLog_2(val) {
		    	this.currentEventLog_2 = val
		    	document.getElementById('eventLogName_2').style.display = 'inline-block'
		    	document.getElementById('cancelEventLog_2').style.display = 'inline-block'
		    	document.getElementById('eventLogName_2').innerHTML = val.eventLog
		    	//模拟关闭折叠面板
		    	//document.getElementById('selectEvenLogDiv_2').click()
      		},
      		//取消选择事件日志-1
      		cancelSelectedEventLog_1(){
      			document.getElementById('eventLogName_1').style.display = 'none'
      			document.getElementById('cancelEventLog_1').style.display = 'none'
      			this.currentEventLog_1 = -1
      		},
      		//取消选择事件日志-2
      		cancelSelectedEventLog_2(){
      			document.getElementById('eventLogName_2').style.display = 'none'
      			document.getElementById('cancelEventLog_2').style.display = 'none'
      			this.currentEventLog_2 = -1
      		},
      		//获取当前所选项
	        selsChange(sels){
				this.sels = sels
			//	console.log(sels)
			},
			//选中所有行
			selectAll(sels){
				
			},
			//选中某行的时候
			rowClick(row,event,column){
				//console.log(row.eventLogId)
			},
			//设置第一行的多选框按钮不可勾选
			checkboxInit(row,index){
		      if (index === -1) 
		        return 0//不可勾选
		      else
		        return 1 //可勾选
    		},
     	 	//根据关键字查询相关日志
			queryEventLogByKeyWord(keyWord){	
				//如果当前项目不为空
				if(this.currentProject !== null){
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
			            	this.loading = false	
			            } else {
			            	this.loading = false
			            }
			           
		            })
	            }else{
	            	
	            }
			},
			//合并事件日志
			mergeEventLogs(){
				let message = ''
				if(this.currentAlgorithm === -1){
					message = '请选择融合算法！'
				}else{
					if(this.currentEventLog_1 === -1){
						message = '请选择事件日志-1！'
					}else{
						if(this.currentEventLog_2 === -1){
							message = '请选择事件日志-2！'
						}
					}
				}
				//开始融合
				if(message == ''){
					this.mergeLoaing = true
					let params = {el1Id:this.currentEventLog_1.eventLogId,el2Id:this.currentEventLog_2.eventLogId,algoId:this.currentAlgorithm.id,projectId:this.currentProject.pid}
					mergeEventLogs(params).then(data => {
		            	//连接失败
		            	if (typeof(data) == "undefined")
		            		return
			            if (data.code===1) {
			            	this.mergeLoaing = false
			            } else {
			            	if(data.code === -1){
			            		this.$message({  
				                    message: data.msg,  
				                    type: 'error'  
				                })
			            	}
			            	this.mergeLoaing = false
			            }
			           
		            })
				}else{
					this.$message({  
	                    message: message,  
	                    type: 'info'  
	                })
				}
			},
			
		},
		//页面刷新,重新获取当前项目信息
		created(){	
			this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
			this.queryEventLogByKeyWord('')
				
		},
		mounted() {	
		}
	}
</script>

<style scoped>
	.root{
		height:100%;
	}
	.algorithm-card{
		margin-top:20px;
		height:200px;
		padding:5px;
	}
	.algorithm-box{
		width:98%;
		height:60px;
		border:2px solid #fff;
		border-bottom:2px solid #e1e1e1;
		box-sizing:content-box;
  		border-radius:2px;
  		cursor:pointer;
  		padding:5px;
  		line-height:60px;
  		color:#A1A1A1;
  		position: relative;
	}
/*	.algorithm-box:hover{
		border-bottom:2px solid #FFE4B5;
		color:#FFD700;
	}*/
	.algorithm-box:before{
		content: "";
            position: absolute;
            left: 0;
            bottom: -2px;
            height: 3px;
            width: 100%;
            background: #4F94CD;
            transform: scale(0);
            transition: all 0.8s;
	}
	.algorithm-box:hover:before{
		transform: scale(1);
	}
	.algorithm-box:hover{
		color:#4F94CD;
	}
	.algorithm-box:hover .algorithm-setting{
		display:inline-block;
	}
	.clickedAlgorithm{
		border-bottom:2px solid #9AC0CD;
		color:#4F94CD;
	}
	.algorithm-tag{
		color:#e6a23c;
		font-size:18px;
	}
	.algorithm-check{
		margin-left:2%;
		margin-top:30px;
		font-size:20px;
		color:#FFC125;
		opacity:0;
	}
	.algorithm-setting{
		display: none;
		float:right;
		margin-top: 10px;
	}
	.algorithm-setting-btn{
		cursor: pointer;
		height: 26px;
		width:26px;
		font-size: 16px;
		border-radius: 13px;
		margin-left: 20px;
		color:#8c8c8c;
	}
	.log-tag{
		color:#5daf34;
		font-size:18px;
	}
	.toolbar{
		margin-top:30px;
		text-align:center;
	}
	.start-merge-btn{
		width:60px;
		height:60px;
		font-size:20px;
	}
</style>