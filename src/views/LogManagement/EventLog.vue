<template>
	<div>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-col :span="12">
				<div style="margin-left:15px;">
				<el-form :inline="true">	
					<el-button-group>
					  <el-button icon="el-icon-upload" @click="uploadForm.visible=true">上传</el-button>
					 
					  <el-button icon="el-icon-delete">删除</el-button>
					</el-button-group>
				</el-form>
				</div>
			</el-col>
			<el-col :span="12">
				<el-input placeholder="请输入内容" v-model="searchInput" class="input-with-select">
				    <el-select v-model="searchType" slot="prepend" placeholder="请选择">
				      <el-option label="日志名称" value="1"></el-option>
				      <el-option label="创建时间" value="2"></el-option>
				    </el-select>
				    <el-button slot="append" icon="el-icon-search"></el-button>
  				</el-input>
			</el-col>
		</el-col>
		<el-col :span="24">
			<el-card style="margin-top:20px;height:100%;">
				<el-table 
				    :data="log"
				    tooltip-effect="dark"
				    style="width: 100%"
				    @selection-change="">
				    <el-table-column
				      type="selection"
				      width="55">
				    </el-table-column>
				    <el-table-column
				      type="index"
				      width="60">
				    </el-table-column>
				    <el-table-column
				      prop="rawLog"
				      label="原始日志"
				      width="175">
				    </el-table-column>
				    <el-table-column
				      prop="specificationlog"
				      label="规范化日志"
				        width="175"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="eventLog"
				      label="事件化日志"
				        width="175"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      prop="createTime"
				      label="创建时间"
				        width="160"
				      show-overflow-tooltip>
				    </el-table-column>
				    <el-table-column
				      label="操作"
				      width="160">
				      <template slot-scope="scope">
				        <el-button size="mini">挖掘</el-button>
				        <el-button size="mini">删除</el-button>
				      </template>
				    </el-table-column>
				</el-table>
				<div style="auto;height:auto;padding：0 auto;text-align:center;">
					<el-pagination layout="prev, pager, next"   style=""  :total="total">
					</el-pagination>
				</div>
				
			</el-card>
		</el-col>
		<!--上传文件-->
		<el-dialog title="上传文件" :visible.sync="uploadForm.visible" :width="uploadForm.dialogWidth">
        <el-form :model="uploadForm" ref="uploadForm" style="margin: 0 auto;text-align:center;">
         	<el-upload
			  class="upload-demo"
			  style="margin: 0 auto;"
			  drag
			  :auto-upload="true"
			  action=""
			  accept="txt"
			  multiple
			  :file-list="fileList"
			  :beforeUpload="beforeUpload"
			  >
			  <i class="el-icon-upload"></i>
			  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			  <div class="el-upload__tip" slot="tip">Tips：只能上传txt文件</div>
			</el-upload>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="uploadForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="">确 定</el-button>
        </div>
    </el-dialog>
	</div>
</template>
<script>
export default {
		data() {
			return {
				searchInput:"",
				searchType:"日志名称",
				log:[
				{rawLog:"1.txt",specificationlog:"2.txt",eventLog:"3.txt"}
				],
				total:20,
				uploadForm:{
					visible:false,
					dialogWidth:"30%",
				},
				fileList: []
			}
		},
		methods: {
			uploadFile(){
			},
		    beforeUpload(file) {                
	            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)                 
	            const extension = testmsg === 'txt'  
	            const extension2 = testmsg === 'xes'  
	            const isLt2M = file.size / 1024 / 1024 < 10  
	            if(!extension && !extension2) {  
	                this.$message({  
	                    message: '上传文件只能是txt、xes!',  
	                    type: 'warning'  
	                });  
	            }  
	            if(!isLt2M) {  
	                this.$message({  
	                    message: '上传文件大小不能超过 10MB!',  
	                    type: 'warning'  
	                });  
	            }  
	            return extension || extension2 && isLt2M  
	        },  
		},
		mounted() {	
		}
	}
</script>

<style scoped>
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