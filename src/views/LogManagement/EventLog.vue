<template>
  <div class="main">
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-col :span="16">
        <div style="margin-left:15px;">
          <el-form :inline="true">
            <el-button icon="el-icon-upload" @click="uploadForm.visible=true" type="primary" :disabled="currentProject === -1" plain>上传</el-button>
            <el-button icon="el-icon-delete" type="primary" plain :disabled="this.sels.length===0" @click="batchRemove()">删除</el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入内容进行搜索" @change="searchAlgorithmChange" v-model="searchInput" :disabled="currentProject === -1" class="input-with-select" >
          <template slot="prepend" style="cursor: pointer;">搜索</template>
         <!--  <el-button slot="append" icon="el-icon-search" @click="queryEventLogByKeyWord(searchInput)" :disabled="currentProject === -1"></el-button> -->
        </el-input>
      </el-col>
    </el-col>

<!--        :data="log.filter(data => !searchInput || data.eventLog.toLowerCase().includes(searchInput.toLowerCase()))" -->
    <el-col :span="24">
      <el-card class="table-div" id="table_card">
        <el-table :height="tableHeight" v-loading="loading" element-loading-text="加载中..." 
          :data="logTable"
          tooltip-effect="dark" style="width: 100%" @selection-change="selsChange" >
          <el-table-column
            type="selection"
            :selectable="tableCheckboxInit"
            width="60">
          </el-table-column>
          <el-table-column type="index" width="60">
          </el-table-column>
          <el-table-column prop="eventLog" label="事件日志" sortable show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" sortable  show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="rawLog" label="原始日志" sortable>
          </el-table-column>
          <el-table-column prop="normalizedLog" label="规范日志" show-overflow-tooltip sortable>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <span slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="mine(scope.row)"><i class="fa fa-caret-square-o-right"></i> 挖掘</el-button>
              <el-button size="mini" type="primary" plain @click="download(scope.row)"><i class="fa fa-download"></i> 下载</el-button>
              <el-button size="mini" type="primary" plain @click="deleteSingleEventLog(scope.row)"><i class="fa fa-trash-o fa-lg"></i> 删除</el-button>
            </span>
          </el-table-column>
        </el-table>
        <div style="auto;height:auto;padding：0 auto;text-align:center;">
          <el-pagination layout="total,prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" :current-page.sync="currentPage" style="margin-top:10px;">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <!--上传文件-->
    <el-dialog title="上传文件" :visible.sync="uploadForm.visible" :width="uploadForm.dialogWidth">
      <el-form :model="uploadForm" ref="uploadForm" style="margin: 0 auto;text-align:center;">
        <el-upload ref="upload" class="upload-demo" style="margin: 0 auto;" drag action=";" :limit="uploadForm.limit" accept="txt" multiple :auto-upload="false" :file-list="fileList" :beforeUpload="beforeUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">提示：只能上传单个txt或xes文件</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="mineForm.title" :visible.sync="mineForm.visible" width="62%">
      <el-steps :active="mineForm.active" finish-status="success" simple>
        <el-step title="1.算法选择"></el-step>
        <el-step title="2.参数设置"></el-step>
        <el-step title="3.查看结果"></el-step>
      </el-steps>

      <div id="step1" style="margin-top: 20PX;">
        <el-card style="">
          <el-table  ref="minerAlgorithmTable":height="mineForm.algorithmTableHeight" highlight-current-row v-loading="mineForm.loading" element-loading-text="加载中..."
          :data="mineForm.mineAlgorithms.filter(data => !mineForm.searchMineAlgorithm || data.algorithmName.toLowerCase().includes(mineForm.searchMineAlgorithm .toLowerCase())||data.algorithmInformation.toLowerCase().includes(mineForm.searchMineAlgorithm .toLowerCase()))"
         
          tooltip-effect="dark" 
          style="width: 100%" 
          @current-change="handelCurrentMineAlgorithm">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="algorithmName" label="算法名称"  show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="algorithmInformation" label="算法描述"  show-overflow-tooltip >
            </el-table-column>
            <el-table-column prop="algorithmOutputType" label="输出类型"  show-overflow-tooltip >
            </el-table-column>
          <!--   <el-table-column prop="packageName" label="包名" sortable show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="className" label="类名"  sortable>
            </el-table-column>
            <el-table-column prop="methodName" label="方法名"  show-overflow-tooltip sortable>
            </el-table-column> -->
            <el-table-column
              align="right"
              width="200"
            >
            <template slot="header" slot-scope="scope">      
              <el-input
              class="input-new"
              v-model="mineForm.searchMineAlgorithm"
              size="mini"
              placeholder="输入关键字搜索"/>
           </template>
            <template slot-scope="scope">
                <el-radio :label="scope.$index" v-model="mineForm.selectMineAlgorithmRadio" >&nbsp;</el-radio>
            </template>
        </el-table-column>
           <!--  <el-table-column  width="100">
              <span slot-scope="scope">
                <el-radio v-model="mineForm.selectedMineAlgorithm" label="1"></el-radio>
              </span>
            </el-table-column> -->
          </el-table>
         <!--  <div style="auto;height:auto;padding：0 auto;text-align:center;">
            <el-pagination layout="total,prev, pager, next, jumper" :total="mineForm.algorithmTotal" @current-change="" :current-page.sync="mineForm.currentAlgorithmPage" style="margin-top:10px;">
            </el-pagination>
          </div> -->
        </el-card>
      </div>
      <div id="step2" style="margin-top: 20PX;">
        <el-card>
        <!--   <div style="width:100%;">
            <div class="toolbar">
              <span style="margin-left: 15px;color:#606266;">可视化方式 ： </span>
              <el-select style="width:290px;" v-model="mineForm.visualizationSelected" placeholder="请选择">
                <el-option v-for="item in mineForm.visualization" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </div>
          </div> -->
          <div class="tip-label" style="margin-top: 10px;" v-if="mineForm.dontNeedParams">
            无需配置参数
          </div>
          <!-- <el-table :height="mineForm.algorithmTableHeight" v-loading="mineForm.algorithmParamsForm.loading" element-loading-text="加载中..." :data="mineForm.algorithmParamsForm.params" tooltip-effect="dark" style="width: 100%;margin-top: 20px;" @current-change="handelCurrentMineAlgorithm">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="paramName" label="参数名" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="paramTypeName" label="类型"  show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="defaultValue" label="默认值" >
            </el-table-column>
            <el-table-column label="参数名">
                  <template slot-scope="scope" >
                    <el-form :model="scope.row" >
                      <el-form-item prop="parameterName" size=style="margin-bottom: 16px;" >
                        <el-input v-model="scope.row.parameterName"  placeholder="请输入参数名称"/>
                      </el-form-item>
                    </el-form>
                  </template>
            </el-table-column>
            <el-table-column label="实际值" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-form :model="scope.row" :rules="mineForm.checkParamsRule" ref="paramInput" style="">
                    <el-form-item prop="paramValue" v-if="scope.row.inputShow">
                      <el-input v-if="scope.row.inputShow"  v-model="scope.row.paramValue" ></el-input>
                    </el-form-item>
                    <el-form-item ref="boolForm" v-if="!scope.row.inputShow">
                      <el-select v-model="scope.row.paramValue">
                        <el-option v-for="item in mineForm.algorithmParamsForm.boolTypeParamName" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
          </el-table> -->
          <el-table style="width=100%;" :data="mineForm.algorithmParamsForm.params">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column label="参数名" prop="parameterName" >
            </el-table-column>
            <el-table-column label="参数类型" prop="parameterType" >
            </el-table-column>
            <el-table-column label="默认值" prop="defaultValue">
            </el-table-column>
            <el-table-column label="实际值">
                  <template slot-scope="scope" >
                    <el-form :model="scope.row"  :rules="mineForm.checkParamsRule" ref="paramInput" >
                      <el-form-item v-if="scope.row.inputShow" prop="paramValue" style="margin-bottom: 0px;">
                        <el-input v-model="scope.row.paramValue" ></el-input>
                      </el-form-item>
                      <el-form-item ref="boolForm" style="margin-bottom: 0px;">
                        <el-select v-model="scope.row.paramValue"  v-if="!scope.row.inputShow" style="width: 100%">
                          <el-option v-for="item in mineForm.algorithmParamsForm.boolTypeParamName" :key="item.value" :label="item.label" :value="item.value">
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
          <div style="height: 500px;" id="canvas" />
        </el-card>
      </div>
      <div class="step-div">
        <div style="height: 20px;width: 100%;"></div>
        <!-- <span class="step-label" v-if="(mineForm.active != 1) && !(mineForm.isMining)" id="previous_step" @click="backToPreviousStep()">
          上一步
        </span> -->
        <el-button plain size="medium" v-if="(mineForm.active != 1) && !(mineForm.isMining)" id="previous_step" @click="backToPreviousStep()">上一步</el-button>
        <el-button plain size="medium" v-if="(mineForm.active != 3) && !(mineForm.isMining)" id="next_step" @click="goToNextStep()"
          :disabled="mineForm.currentMineAlgorithm == -1||mineForm.currentMineAlgorithm==null"
        >
          下一步
        </el-button>
       <!--  <span class="step-label" v-if="(mineForm.active != 3) && !(mineForm.isMining)" id="next_step" @click="goToNextStep()">
          下一步
        </span> -->
        <el-button plain size="medium" v-if="mineForm.isMining" @click="mineForm.isMining = false">取消
        </el-button>
        <el-button plain size="medium" v-if="mineForm.isMining" :loading="true">挖掘中</el-button>
       <!--  <span class="step-label" v-if="mineForm.isMining" @click="mineForm.isMining = false">
          取消
        </span>
        <span class="step-label loading-label" v-if="mineForm.isMining">
          <i class="fa fa-refresh fa-spin fa-3x fa-fw" style="font-size: 13px;"></i>挖掘中
        </span> -->
      </div>
    </el-dialog>
  </div>
</template>
<script src="../../../lib/qunee-min.js"></script>
<script>
  import { timestamp2Time } from '../../common/common'
  import { isNumber } from '../../common/common'
  import { queryEventLog } from '../../api/api'
  import { uploadEventLog } from '../../api/api'
  import { base } from '../../api/api'
  import { deleteEventLog } from '../../api/api'
  import { queryMineAlgorithms } from '../../api/api'
  import { getAlgorithmInfo } from '../../api/api'
  import { mineEventLog } from '../../api/api'

  export default {
    data() {
      /* 验证器 */

      //验证挖掘算法输入的参数类型是否正确
      var validateMineParamsValueInput = (rule, value, callback) => {
        //输入为空
        if (!value) {
          return callback(new Error('请输入参数'))
        } else {
          if (!isNumber(value)) {
            return callback(new Error('请输入数字'))
          }
          callback()
        }
      }
      return {
        loading: true,
        currentProject: '',
        projectId: '',
        currentPage: 0,
        currentEventLog: -1,
        searchInput: "",
        searchType: "日志名称",
        tableHeight: 200,
        log: [
        ],
        sels: [],//列表选中列
        total: 0,
        uploadForm: {
          file: "",
          visible: false,
          dialogWidth: "30%",
          limit: 1,
          //上传文件时要上传的额外参数
          upLoadData: {
            format: '',
            projectId: '',
          }
        },
        //上传的文件列表，注:目前只允许上传单条日志
        fileList: [],
        //挖掘
        paramInput: '',
        mineForm: {
          title:"",
          //选择算法单选框
          selectMineAlgorithmRadio:"",
          //搜索算法输入框
          searchMineAlgorithm:"",
          //选择的算法
          selectedMineAlgorithm:"",
          //所选择的算法是否需要参数
          dontNeedParams:true,
          isMining: false,
          active: 1,
          currentMineAlgorithm: -1,
          visible: false,
          algorithmTableHeight: 300,
          mineAlgorithms: [],
          algorithmTotal: 0,
          currentAlgorithmPage: 1,
          loading: true,
          //算法参数
          algorithmParamsForm: {
            params: [
            ],
            loading: true,
            boolTypeParamName: [
              {
                value: 'true',
                label: 'true',
              },
              {
                value: 'false',
                label: 'false',
              },
            ]
          },
          checkParamsRule: {
            paramValue: [
              { validator: validateMineParamsValueInput, trigger: 'blur' }
            ],
          },
          visualization: [
            {
              value: 'Workflow network',
              label: '工作流网',
            },
            {
              value: 'Flow chart',
              label: '流程图',
              disabled: true
            },
            {
              value: 'Sankey diagram',
              label: '桑基图',
              disabled: true
            },
            {
              value: 'Force guide graph',
              label: '力导向图',
              disabled: true
            },
          ],
          visualizationSelected: '工作流网',
          graph: '',
          logsMineResult: [

          ],
        },
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
      //根据关键字查询相关日志
      queryEventLogByKeyWord(keyWord) {
        this.loading = false
        this.log = []
        //如果当前项目不为空
        if (this.currentProject !== null) {
          //this.uploadForm.upLoadData.projectId = this.currentProject.pid
          //加载完成
          let params = { currentPage: 1, lineSize: 10, keyWord: keyWord, projectId: this.currentProject.pid }
          queryEventLog(params).then(data => {
            //连接失败
            if (typeof (data) == "undefined")
              return
            if (data.code === 1) {
              let all = data.data.allEventlogs
              this.total = data.data.eventlogCount
              let i = 0, length = all.length
              for (; i < length; i++) {
                let createdTime = timestamp2Time(all[i].eventlogCreatetime)
                let eventLogName = all[i].eventlogName
                //提示：在返回的信息中，并未有原始日志的信息
                let rawLog = ''
                let normalizedLog = (all[i].normalizedlog === null ? '' : all[i].normalizedlog.normalizedlogName)
                let log = { eventLogId: all[i].eventlogId, rawLog: rawLog, eventLog: eventLogName, normalizedLog: normalizedLog, createdTime: createdTime }
                this.log.push(log)
              }
            } else {
            }
            this.loading = false
          })
        } else {
          this.loading = false
        }
      },
      //获取路由参数,未用
      getRouterParams() {
        this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
        // let routerParams = this.$route.params
        // this.currentProject = routerParams.project
        if (this.currentProject != -1 && typeof (this.currentProject) != "undefined") {
          //this.queryEventLogByKeyWord('')
        } else {
          //如果当前项目为空
          this.loading = false
          this.log = []
        }
      },
      //上传文件
      submitUpload() {
        this.$refs.upload.submit()
      },
      //判断上传的文件格式,在判断格式里上传文件
      beforeUpload(file) {
        this.uploadForm.file = file
        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'txt'
        const extension2 = testmsg === 'xes'
        const isLt2M = file.size / 1024 / 1024 < 10
        if (file.size === 0) {
          this.$message({
            message: '上传的文件为空，请检查',
            type: 'warning'
          })
          return
        }
        if (!extension && !extension2) {
          this.$message({
            message: '上传的文件格式只能是txt或xes，请检查',
            type: 'warning'
          })
        } else {
          let formData = new FormData()
          formData.append('file', file)
          formData.append('format', testmsg)
          formData.append('projectId', this.currentProject.pid)
          uploadEventLog(formData).then(data => {
            if (typeof (data) == "undefined") {
              return
            }
            if (data.code == 1) {
              this.$notify({
                title: '提示',
                message: '上传事件日志成功！',
                type: 'success'
              })
              this.uploadForm.visible = false
              let createdTime = timestamp2Time(data.data.EventLogCreatetime)
              let EventLog = { eventLogId: data.data.eventlogId, EventLog: data.data.EventLogName, rawLog: data.data.rawlog, eventLog: data.data.eventlog, createdTime: createdTime }
              this.log.push(EventLog)
            }
            if (data.code == -1) {
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
      download(row) {
        let eventLogId = row.eventLogId
        if (eventLogId) {
          window.open(`${base}/eventlogAction/download?eventlogId=${eventLogId}`)
        }
      },
      //选择挖掘算法的事件处理函数
      handelCurrentMineAlgorithm(currentRow, oldCurrentRow) {
        this.mineForm.currentMineAlgorithm = currentRow
        let index = this.mineForm.mineAlgorithms.indexOf(currentRow)
        this.mineForm.selectMineAlgorithmRadio = index
      },
      //挖掘
      mine(row) {
        //初始化界面
        this.mineForm.visible = true
        this.mineForm.title = `挖掘 - ${row.eventLog}`
        this.mineForm.isMining = false
        this.mineForm.currentMineAlgorithm = -1
        this.mineForm.dontNeedParams = false
        this.mineForm.algorithmParamsForm.params = []

        this.$nextTick(function () {
          document.getElementById('step1').style.display = ''
         
          if (document.getElementById('step2') != null) {
            document.getElementById('step2').style.display = 'none'
          }
          if (document.getElementById('step3') != null) {
            document.getElementById('step3').style.display = 'none'
          }
          this.mineForm.active = 1
          this.mineForm.loading = true
          this.currentEventLog = row

          //初始化
          this.mineForm.mineAlgorithms = []
          // let params = { currentPage: 1, lineSize: 10, keyWord: '' }
          queryMineAlgorithms().then(data => {
          
            //连接失败
            if (typeof (data) == "undefined")
              return
            if (data.code === 1) {
              let all = data.data.allAlgorithms
              let count = all.length
              let i = 0
              let algorithmId, algorithmName, packageName, className, methodName
              for (; i < count; i++) {
                //如果为挖掘算法
                if (all[i].algorithmType) {
                  this.mineForm.mineAlgorithms.push(all[i])
                }
              }
               this.mineForm.currentMineAlgorithm = this.mineForm.mineAlgorithms[0]
              this.$refs.minerAlgorithmTable.setCurrentRow(this.mineForm.currentMineAlgorithm)
              this.mineForm.loading = false
            } else {
              this.mineForm.loading = false
            }
            this.loading = false
          })
        })
      },
      //挖掘界面返回上一个界面
      backToPreviousStep() {
        let active = this.mineForm.active
        document.getElementById('step' + active).style.display = 'none'
        document.getElementById('step' + (active - 1)).style.display = ''
        this.mineForm.active = active - 1
      },
      //挖掘界面跳转下一个界面
      goToNextStep() {
        let active = this.mineForm.active
        switch (active) {
          //算法选择步骤
          case 1:
            //未选择挖掘算法
            if (this.mineForm.currentMineAlgorithm === -1 || this.mineForm.currentMineAlgorithm === null) {
              this.$message({
                message: '请选择挖掘算法！',
                type: 'info'
              })
            } else {
              document.getElementById('step' + active).style.display = 'none'
              this.mineForm.active += 1
              //显示第二步骤界面
              document.getElementById('step2').style.display = ''
              //获取算法参数信息
              //获取算法参数
              let algoId = this.mineForm.currentMineAlgorithm.algorithmId
              let params = { algoId: algoId }
              getAlgorithmInfo(params).then(data => {
                this.mineForm.algorithmParamsForm.params = []
                if (data.code === 1) {
                  if (data.data == null) {
                    this.$message({
                      message: "请求失败",
                      type: 'error'
                    })
                    this.mineForm.algorithmParamsForm.loading = false
                    return
                  }
                  //无参算法
                  if(data.data.params==null){
                    this.mineForm.dontNeedParams = true
                    this.mineForm.algorithmParamsForm.loading = false
                    this.mineForm.algorithmParamsForm.params = []
                    return
                  }
                  let params = data.data.params
                  let length = params.length
                  if (params != null && length != 0) {
                    //this.mineForm.algorithmParamsForm.params = params
                    // this.mineForm.algorithmParamsForm.params = []
                    // let paramsCount = params.length
                    // let i = 0
                    // let paramName, paramTypeName, defaultValue, displayName, paramValue
                    let paramMap = {
                      0: '整型',
                      1: '浮点型',
                      2: '字符串',
                      3: '布尔型',
                    }

                    for(let i=0;i<length;i++){
                      let type = params[i].parameterType
                      params[i].parameterType = paramMap[type]
                      params[i].inputShow = true
                      params[i].paramValue = params[i].defaultValue
                      //布尔型
                      if(type == 3){
                        params[i].inputShow = false
                      }
                    }
                    this.mineForm.algorithmParamsForm.params = params
                  }
                  this.mineForm.algorithmParamsForm.loading = false
                } else {
                  if (data.code === -1) {
                    this.$message({
                      message: data.msg,
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
            let isValid = false
            let params
            //验证算法参数是否填写正确
            if (this.mineForm.algorithmParamsForm.params.length == 0) {
              params = []
              isValid = true
            } else {
              this.$refs.paramInput.validate((valid) => {
                if (valid) {
                  isValid = true
                } else {
                }
              })
            }
            if (isValid) {
              this.mineForm.isMining = true
              let logId, methodId, imageType
              let paramList = []
              let originParams = this.mineForm.algorithmParamsForm.params
              let i = 0, paramsCount = originParams.length
              let param
              let paramMap = {
                     '整型':0,
                    '浮点型':1,
                    '字符串':2,
                    '布尔型':3,
              }
              for (; i < paramsCount; i++) {
                let type = paramMap[originParams[i].parameterType]
                param = { name: originParams[i].parameterName, value: originParams[i].paramValue, type:type  }
                paramList.push(param)
              }
              logId = this.currentEventLog.eventLogId
              methodId = this.mineForm.currentMineAlgorithm.algorithmId
              imageType = 1
              //日志ID,算法ID,参数列表
              params = { logId: logId, methodId: methodId, paramList: paramList,imageType:imageType}
              mineEventLog(params).then(data => {
                //挖掘成功
                if (data.code == 1) {
                   this.$router.push({ name: '图形展示', params: { eventLogResult: data.data} })
                  //挖掘时间
                  // let mineUseTime = data.data.mineUsetime
                  // let netElementList = data.data.netElementList
                  // let result = data.data
                  // //保存事件日志挖掘结果，包含日志id，算法id，可视化类型，以及挖掘结果信息
                  // var date = new Date()
                  // let mineTime = date.toLocaleString()  //获取当前日期和时间
                  // let logName = this.currentEventLog.eventLog
                  // let user = JSON.parse(sessionStorage.getItem('user'))
                  // let algorithmName = this.mineForm.currentMineAlgorithm.algorithmName
                  // let logMineResult = { mineTime: mineTime, user: user, logName: logName, logId: logId, algorithmName: algorithmName, methodId: methodId, imageType: imageType, result: result }
                  //sessionStorage.setItem('eventLogResult', JSON.stringify(logMineResult))

           //        this.mineForm.logsMineResult.push(logMineResult)
           //        let netElementList = result.netElementList
           //        this.mineForm.active += 1
           //        document.getElementById('step2').style.display = 'none'
           //        //document.getElementById('step3').style.display = ''
           //        //this.$router.push({name: '工作流图' })
           //        this.$router.push({ name: '图形测试', params: { eventLogResult: logMineResult } })
           //        this.mineForm.isMining = false
                 
                  
                } else {
                  //挖掘失败
                  if (data.code === -1) {
                    this.$message({
                      message: data.msg,
                      type: 'error'
                    })
                  }
                  this.mineForm.isMining = false
                }
              })
            } else {

            }
            break
          default:
            break
        }
      },
      //添加结点
      createNode(name) {
        let graph = this.mineForm.graph
        let node = graph.createNode(name)
        node.image = customDraw
        node.size = { width: 25 }
        return node
      },
      //获取当前所选项
      selsChange(sels) {
        this.sels = sels
      },
      //删除单条事件日志
      deleteSingleEventLog(eventLog) {
        this.$confirm(
          '此操作将永久删除所选中事件日志，是否继续?',
          '提示',
          { type: 'warning' }
        ).then(() => {
          let ids = []
          ids.push(eventLog.eventLogId)
          let params = { ids: ids.toString() }
          deleteEventLog(params).then(data => {
            if (typeof (data) === "undefined")
              return
            if (data.code === 1) {
              //删除成功
              let length = this.log.length
              for (let i = 0; i < length; i++) {
                if (this.log[i].eventLogId === eventLog.eventLogId) {
                  this.log.splice(i, 1);
                  break;
                }
              }
            } else {
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
      batchRemove() {
        this.$confirm(
          '此操作将永久删除所选中' + this.sels.length + '条事件日志，是否继续?',
          '提示',
          { type: 'warning' }
        ).then(() => {
          let ids = []
          let i = 0
          let length = this.sels.length
          for (; i < length; i++) {
            ids.push(this.sels[i].rawlogId)
          }
          let params = { ids: ids.toString() }
          deleteEventLog(params).then(data => {
            if (typeof (data) === "undefined")
              return
            if (data.code === 1) {
              //删除成功
              let i = 0
              let oldLodLength = this.log.length
              let newLog = []
              for (; i < oldLodLength; i++) {
                if (ids.indexOf(this.log[i].eventLogId) === -1) {
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
      uploadSuccess(response, file, fileList) {
        console.log('上传文件', response)
      },
      // 上传错误
      uploadError(response, file, fileList) {
        console.log('上传失败，请重试！')
      },
      //当前页面
      handleCurrentChange(val) {
      },
      //自定义文件上传的方式
      upload(item) {
      },
      //表格中的多选框是否可选
      tableCheckboxInit(row,index){
        return 1 //可勾选
      },
      searchAlgorithmChange(){
        
   
      },
    },

    //页面刷新,重新获取当前项目信息
    created() {
      this.currentProject = JSON.parse(sessionStorage.getItem('currentProject'))
      this.queryEventLogByKeyWord('')

    },
    watch: {
      //监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      //'$route': 'getRouterParams'
    },
    mounted() {
      this.$nextTick(function () {
        this.tableHeight = document.getElementById('table_card').offsetHeight * 0.82
        //this.tableHeight = document.getElementById('table_card').scrollHeight*0.82
      })
    }
  }
</script>

<style scoped>
  .main {
    overflow-y: auto;
  }
  .scroll-table {
    overflow: auto;
  }
  .el-upload {
    width: 100px !important;
  }
  .toolbar {
    background-color: #ebeef5;
    height: 60px;
    margin-top: 15px;
    line-height: 60px;
  }
  .table-div {
    position: absolute;
    bottom: 20px;
    top: 150px;
    right: 40px;
    left: 40px;
  }
  .el-input-group {
    float: right;
    margin-right: 20px;
    margin-top: 10px;
  }
  .el-select {
    width: 120px;
  }
  .table-cell-input {
    height: 40px;
    width: 100%;
    outline: none;
    border: none;
    background: none;
    font-size: 14px;
    color: #606266;
  }
  .add-cog {
    font-size: 25px;
    color: #445f93;
    width: 100%;
    background-color: #ebeef5;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 5px;
    margin-bottom: 10px;
  }
  .cog-icon {
    cursor: pointer;
    margin-left: 10px;
  }
  .algorithmTitle {
    font-size: 18px;
  }
  .step-div {
    text-align: right;
    height: 40px;
    display: block;
  }
  .step-label {
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 20px;
    margin-left: 15px;
    line-height: 30px; 
    font-size: 14px;
    display: inline-block;
    height: 30px;
    text-align:center;
    width: 60px;
    color:    #606266;
    cursor: pointer;
    border:1px solid #dcdfe6;
    background-color: #fff;
    border-radius:4px;
    transition:.1s;
  }
  .step-label:hover{
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .loading-label:hover{
    color:#606266;
    background-color: #fff;
    border:1px solid #dcdfe6;
    cursor: default;
  }
.tip-label{
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    margin: 20px 0;
    display: block;
    font-size: 14px;
    height: 10px;
    line-height:10px;
}
</style>
