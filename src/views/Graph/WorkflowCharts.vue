<template>
  <div class="main">
    <!--工具条-->
    <el-col :span="24">
      <div class="my_card">
        <div class="my_card_heard" style="border:0px;" id="label_card">
          事件日志信息
          <span style="float: right;font-size: 22px;display: inline-block;">
            <i v-show="!isTableExpanded" class="fa fa-plus-square-o" style="cursor: pointer;" @click="isTableExpanded = !isTableExpanded"></i>
            <i v-show="isTableExpanded" class="fa fa-minus-square-o" style="cursor: pointer;" @click="isTableExpanded = !isTableExpanded"></i>
          </span>
        </div>
      </div>
      <transition name="el-zoom-in-top">
        <div v-show="isTableExpanded" class="my_card" id="event_info_card">
          <div class="my_card_body" id="eventLogInfo">
            <el-table :height="120" :data="logMineData" tooltip-effect="dark" style="width: 100%;" @cell-mouse-enter="">
              <el-table-column prop="eventLog" label="事件日志" width="210" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="mineTime" label="挖掘时间" width="200" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="mineAlgorithm" label="挖掘算法" width="210" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="miner" label="挖掘人" width="170" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="mineUseTime" label="挖掘使用时间" width="170" show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </transition>
    </el-col>
    <el-col :span="24">
      <div class="my_card">
        <div class="my_card_heard" style="">
          工作流图
          <i class="fa fa-area-chart"></i>
          <!-- <span style="">
			    		<el-select v-model="layoutSelected" placeholder="" style="margin-top: -25px;margin-left: 150px;">
						    <el-option
						      v-for="item in layout"
						      :key="item.value"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						 </el-select>
					</span> -->
          <span style="float:right;margin-top: 0px;">
            <span class="graph-btn" id="importData" title="导入"></span>
            <span class="graph-btn" id="exportData" title="导出"></span>
            <span class="graph-btn" id="clear" title="擦除"></span>
          </span>
        </div>
        <div class="my_card_body">
          <div id="workflowCharts">

          </div>
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
  import { test } from '../../api/api'
  import { DataSet, Network } from '../../common/vis.js'
  import 'vis/dist/vis.min.css'
  export default {
    data() {
      return {
        eventLogResult: -1,
        logMineData: [],
        layout: [{
          value: 'up_down',
          label: '自顶向下',
        },
        {
          value: 'down_up',
          label: '自底向上',
        },
        {
          value: 'left_right',
          label: '自左向右',
        },
        {
          value: 'right_left',
          label: '自右向左',
        },
        ],
        //是否扩展事件日志信息
        isTableExpanded: true,
        layoutSelected: 'left_right',
        nodes: [],
        edges: [],
        nodeDataSet: -1,
        edgeDataSet: -1,
      }
    },
    methods: {
      showInTable() {
        let eventLogResult = this.eventLogResult
        console.log(eventLogResult)
        let eventLog = eventLogResult.logName
        let mineTime = eventLogResult.mineTime
        let mineAlgorithm = eventLogResult.algorithmName
        let miner = eventLogResult.user.email
        let mineUseTime = eventLogResult.result.mineUsetime + 'ms'
        let data = { eventLog: eventLog, mineTime: mineTime, mineAlgorithm: mineAlgorithm, miner: miner, mineUseTime: mineUseTime }
        this.logMineData.push(data)
      },
      createNodes() {
        this.nodeDataSet = new DataSet(this.nodes)
      },
      createEdges() {
        this.edgeDataSet = new DataSet(this.edges)
      },
      getOptions() {
        //可选项
        let options = {
          autoResize: true,
          //节点配置
          nodes: {//节点配置
            // shape: 'box',
            borderWidth: 1,//节点边框的宽度,单位为px
            borderWidthSelected: 2,//节点被选中时边框的宽度，单位为px
            // color: {
            //   border: '#E0EEE0',//节点边框颜色
            //   background: '#B0B0B0',//节点背景颜色
            //   highlight: {//节点选中时状态颜色
            //     border: '#2B7CE9',
            //     background: '#D2E5FF'
            //   },
            //   hover: {//节点鼠标滑过时状态颜色
            //     border: '#2B7CE9',
            //     background: '#D2E5FF'
            //   }
            // },
            fixed: {
              x: false,
              y: false
            },
            scaling: {
              label: true
            },
            font: {//字体配置
              color: '#343434',//颜色
              size: 20, // 大小，单位px
              face: 'arial',//字体
              background: 'none',//背景
              align: 'center',//位置left right center
            },
            shadow: true
          },
          //在线显示配置
          // configure: {
          //     enabled: true,
          //     //filter: 'physics',
          //     container: undefined,
          //     //showButton: true
          // },
          //边
          edges: {
            color: {
              color: '#969696',
            },
            shadow: true,//连接线阴影配置
            smooth: true,//是否显示方向箭头
            arrows: { to: true }//箭头指向to节点
          },
          //布局
          layout: {
            randomSeed: 1,//配置每次生成的节点位置都一样，参数为数字1、2等
            hierarchical: {
              direction: 'LR',//UD:上下 DU:下上 LR:左右 RL:右左
              sortMethod: 'directed'
            }, //层级结构显示}
          },
          //交互
          interaction: {
            dragNodes: true,//是否能拖动节点
            dragView: true,//是否能拖动画布
            hideEdgesOnDrag: false,//拖动画布时是否隐藏连接线
            hideNodesOnDrag: false,//拖动画布时是否隐藏节点
            hover: true,//鼠标移过后加粗该节点和连接线
            keyboard: true,//
            multiselect: true,//按 ctrl 多选
            navigationButtons: true,//是否显示控制按钮
            selectable: true,//是否可以点击选择
            selectConnectedEdges: true,//选择节点后是否显示连接线
            hoverConnectedEdges: true,//鼠标滑动节点后是否显示连接线
            tooltipDelay: 200,
            zoomView: true//是否能缩放画布
          },
          physics: {
            forceAtlas2Based: {
              gravitationalConstant: -26,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18,
              avoidOverlap: 1.5
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: {
              enabled: true,
              iterations: 1000,
              updateInterval: 25
            }
          },
        }
        return options
      },
      // 按照 现有属性重新渲染页面
      async createWorkflowCharts() {
        this.$nextTick(
          () => {
            let nodes = this.nodes
            let edges = this.edges
            // vis数据
            let data = {
              nodes: nodes,
              edges: edges
            }
            let options = this.getOptions()
            // 创建一个网络
            let container = document.getElementById('workflowCharts')
            // 初始化网络
            let network = new Network(container, data, options)
            // 重新渲染后需要重新添加事件
            network.on("click", (params) => {
              params.event = "[original event]"
            })

            network.on("doubleClick", (params) => {
              params.event = "[original event]"
              if (params.nodes.length > 0) {
                let click_node_id = params.nodes[0]
                this.$emit('node_double_click', click_node_id)
              }
            });
          })
      },
      //创建点和边
      createNodesAndEdges() {
        //获取结点
        let mineResult = this.eventLogResult.result.nodes
        let i = 0, node
        let nodeCount = mineResult.length
        for (; i < nodeCount; i++) {
          let c = 'gray'
          let font1 = { color: '#c5c5c5' }
          let font2 = { color: '#000' }
          if (mineResult[i].inVisible === false) {
            c = 'white'
          }
          if (mineResult[i].shape === 'box') {
            node = { id: mineResult[i].id, label: mineResult[i].label, shape: mineResult[i].shape, color: c }
          } else if (mineResult[i].shape === 'circle') {
            node = { id: mineResult[i].id, title: mineResult[i].label, shape: mineResult[i].shape, color: c }
          }

          console.log(node)
          this.nodes.push(node)
          //console.log(node.id)
        }
        this.createNodes()
        //获取边
        // let p = 0, q = 0, nodeEdgeCount, output
        // let from, to
        // let edge
        // let outputName = []
        // for (; p < nodeCount; p++) {
        //   outputName = []
        //   from = mineResult[p].name
        //   console.log("from:" + from)
        //   output = mineResult[p].output
        //   nodeEdgeCount = output.length
        //   for (q = 0; q < nodeEdgeCount; q++) {
        //     to = output[q]
        //     //未包含
        //     if (outputName.indexOf(to) === -1) {
        //       outputName.push(output[q])
        //       edge = { from: from, to: to }
        //       console.log(from + "->" + to)
        //       this.edges.push(edge)
        //     }
        //   }

        // }
        let mrEdges = this.eventLogResult.result.links
        let j = 0
        for (; j < mrEdges.length; j++) {

          let f = mrEdges[j].source
          let t = mrEdges[j].target
          let edge = { from: f.id, to: t.id, width: mrEdges[j].weight, title: mrEdges[j].weight }
          this.edges.push(edge)
          console.log(edge)
        }
        this.createEdges()
      },
    },
    mounted() {
      // let param = { name: 'test' }
      // let paramList = []
      // let params = {
      //   logId: 16,
      //   methodId: 25,
      //   paramList: paramList,
      //   imageType: 1
      // }
      // let result = ""
      // test(params).then(data => {
      //   if (typeof (data) == "undefined")
      //     return
      //   let retCode = data.code
      //   if (retCode === 1) {


      //   } else {
      //   }
      // })

      this.$nextTick(function () {
        document.getElementById('fold').click()
      }
      )

      //获取保存的挖掘结果
      this.eventLogResult = this.$route.params.eventLogResult
      if (typeof (this.eventLogResult) != 'undefined') {
        //this.eventLogResult = JSON.parse(sessionStorage.getItem('eventLogResult'))
        this.showInTable()
        this.createNodesAndEdges()
        this.createWorkflowCharts()
      }



    }

  }
</script>

<style scoped>
  .main {
    overflow-y: auto;
  }
  .toolbar {
    background-color: #ebeef5;
    height: 60px;
    margin-top: 15px;
    line-height: 60px;
  }
  .table-div {
    height: 150px;
    margin-top: 15px;
    line-height: 60px;
  }
  .graph-div {
    position: absolute;
    top: 250px;
    bottom: 20px;
    right: 40px;
    left: 40px;
  }
  #workflowCharts {
    /* 	position: absolute;
                                                                                                                                                                                                                                                                                   	top:75px;
                                                                                                                                                                                                                                                                            		bottom: 0px;
                                                                                                                                                                                                                                                                            		right:0px;
                                                                                                                                                                                                                                                                            		left:0px;*/
    /*height:100%;
                                                                                                                                                                                                                                                                            		width: 100%;*/
    margin: -20px -20px;
    border: 1px solid lightgray;
    height: 600px;
  }
  .graph-btn {
    height: 25px;
    width: 25px;
    cursor: pointer;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: inline-block;
    margin-left: 15px;
  }
  #importData {
    background-image: url("../../assets/import.png");
  }
  #exportData {
    background-image: url("../../assets/export.png");
  }
  #clear {
    background-image: url("../../assets/clear.png");
  }
  .my_card {
    /*-webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
                                                                                                                                                                                                                                                                            		box-shadow:0 2px 12px 0 rgba(0,0,0,.1);*/
    border: 1px solid #ebeef5;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    overflow: hidden;
    margin-top: 20px;
    height: auto;
  }
  #event_info_card {
    margin-top: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    -webkit-box-shadow: 0 2px 0px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.1);
  }
  #label_card {
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    -webkit-box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .my_card_heard {
    padding: 15px 20px;
    height: 50px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
  }
  .my_card_body {
    padding: 20px;
    height: auto;
  }
  .empty-div {
    margin: 0 auto;
    height: 160px;
    width: 160px;
    background-image: url("../../assets/empty.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-top: 160px;
  }
</style>
