<template>
  <div class="main">

    <el-col :span="24">
      <div class="my_card">
        <div class="my_card_heard" style="">
          
          <i class="fa fa-area-chart"></i>
          <label style="margin-left: 10px;">{{graphTitle}}</label>
          <el-input type="file" id="select_json_btn" style="display:none" @change="uploadJson()"/>
        
          <span style="float:right;border-left:1px solid #c5c5c5;">
            <span class="graph-btn" id="importData" title="导入" @click="openImportJsonDialog()"></span>
            <span class="graph-btn" id="exportData" title="导出"></span>
            <span class="graph-btn" id="clear" title="擦除" @click="clearGraph()"></span>
          </span>
          <el-select v-model="layoutValue" placeholder="请选择" size="mini" style="float: right;margin-right: 10px;" @change="changeLayout()"> 
            <el-option
                v-for="item in layoutOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="my_card_body">
          <div id="graph" >
          </div>
          <transition name="el-fade-in-linear">
          <div id="coverLayer" v-if="isDrawing">  
            <el-progress style="left: 50%;top:50%;margin-left:-63px;margin-top:-63px;" type="circle" :percentage="drawingProgresValue"></el-progress>
          </div>
        </transition>
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
        isDrawing:false,
        graphTitle:"",
        drawingProgresValue:0,
        layoutValue:"LR",
        layoutOptions: [{
          value: 'UD',
          label: '自顶向下',
        },
        {
          value: 'DU',
          label: '自底向上',
        },
        {
          value: 'LR',
          label: '自左向右',
        },
        {
          value: 'RL',
          label: '自右向左',
        },
        ],

        layoutSelected: 'left_right',
        nodes: [],
        edges: [],
        options:{
          autoResize: true,
          //节点配置
          nodes: {//节点配置
            // shape: 'box',
            borderWidth: 1,//节点边框的宽度,单位为px
            borderWidthSelected: 2,//节点被选中时边框的宽度，单位为px
            color: {
              border: '#00000',//节点边框颜色
              background: '#ffffff',//节点背景颜色
              highlight: {//节点选中时状态颜色
                border: '#2B7CE9',
                background: '#D2E5FF'
              },
              hover: {//节点鼠标滑过时状态颜色
                border: '#2B7CE9',
                background: '#D2E5FF'
              }
            },
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
         //   randomSeed: 1,//配置每次生成的节点位置都一样，参数为数字1、2等
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
        },
        network:null,
      }
    },
    methods: {
      //导入json配置文件
      openImportJsonDialog(){
          document.getElementById("select_json_btn").click()
      },
        //上传json配置文件，直接在前端读取
        uploadJson(){
          let _this = this
          let objFile = document.getElementById("select_json_btn");
          if(objFile.files.length!=0){
            let file = objFile.files[0]
            let name = file.name.substring(file.name.lastIndexOf('.') + 1)
            if(name != 'json'){
              this.$message.error('错误，文件格式只能为json.')
              //清空
            }else{

                //新建一个FileReader
                let reader = new FileReader()
                //读取文件 
                reader.readAsText(objFile.files[0], "UTF-8")
                //读取完文件之后会回来这里
                reader.onload = function(evt){ 
                  try{
                    // 读取文件内容
                    let jsonString = evt.target.result 
                    let graph = JSON.parse(jsonString)
                    _this.nodes = graph.nodes
                    console.log(_this.nodes)
                    _this.edges = graph.edges
                    _this.graphTitle = graph.title
                    _this.draw()
                  }catch(e){
                      _this.isDrawing = false
                       _this.graphTitle = ""
                      _this.$message.error(`Error，${e.message}.`)
                      console.log(e.message)
                  }
                  
              }
            }       
          }
      },
      //改变布局方式
      changeLayout(){
        if(this.network!=null){
          this.options.layout.hierarchical.direction = this.layoutValue
          this.draw()
        }
      },
      getOptions() {
        let _this = this
        //可选项
        let options = {
          autoResize: true,
          //节点配置
          nodes: {//节点配置
            // shape: 'box',
            borderWidth: 1,//节点边框的宽度,单位为px
            borderWidthSelected: 2,//节点被选中时边框的宽度，单位为px
            color: {
              border: '#E0EEE0',//节点边框颜色
              background: '#000000',//节点背景颜色
              highlight: {//节点选中时状态颜色
                border: '#2B7CE9',
                background: '#D2E5FF'
              },
              hover: {//节点鼠标滑过时状态颜色
                border: '#2B7CE9',
                background: '#D2E5FF'
              }
            },
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
              direction: this.layoutValue,//UD:上下 DU:下上 LR:左右 RL:右左
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
      //清空图形
      clearGraph(){
        if(this.network!=null){
          this.network.destroy()
          this.network = null
          this.nodes = []
          this.edges = []
          this.graphTitle=""
        }
      },
      draw(){
            this.isDrawing = true 
           let nodes = this.nodes
            let edges = this.edges
            console.log(this.nodes.length)
            // vis数据
            let data = {
              nodes: new DataSet(nodes),
              edges: new DataSet(edges)
            }
            let options = this.getOptions()
            this.options.layout.hierarchical.direction = this.layoutValue
            // 创建一个网络
            let container = document.getElementById('graph')
            // 初始化网络
            this.network = new Network(container, data, this.options)
           
            this.network.on("stabilizationProgress", function(params) {
                let factor = params.iterations/params.total;
                 _this.drawingProgresValue = Math.round(factor*100)
            
                // document.getElementById('bar').style.width = width + 'px';
                // document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%';
            })
            let _this = this
             this.network.once("stabilizationIterationsDone", function() {
              _this.isDrawing = false
            }
            )
            // 重新渲染后需要重新添加事件
            // network.on("click", (params) => {
            //   params.event = "[original event]"
            // })

            // network.on("doubleClick", (params) => {
            //   params.event = "[original event]"
            //   if (params.nodes.length > 0) {
            //     let click_node_id = params.nodes[0]
            //     this.$emit('node_double_click', click_node_id)
            //   }
            // });
      },
      // 按照现有属性重新渲染页面
      async creategraph() {
        this.$nextTick(
          () => {
    
          })
      },
    },
    mounted() {
      this.$nextTick(function () {
        document.getElementById('fold').click()
       // let evenlogMineResult = JSON.parse(sessionStorage.getItem('eventLogResult'))
       let evenlogMineResult = this.$route.params.eventLogResult
         console.log(evenlogMineResult)
        //上一个页面
        let from = sessionStorage.getItem('from')
        if(evenlogMineResult!=null&&from=='事件日志'){
          this.nodes = evenlogMineResult.nodes

          this.edges = evenlogMineResult.edges
          this.graphTitle = evenlogMineResult.title

          this.draw()
        }
       
      }
      )
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
  #graph {
    border: 1px solid lightgray;
    position: relative;
    height: 700px;
    z-index:2;
  }
  #coverLayer{
    border: 1px solid lightgray;
    position:absolute;
    top:0px;
    left:0px;
    height: 700px; 
    z-index:2000;
    background-color:#fff;
    width: 100%;
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
    -webkit-box-shadow:0 2px 12px 0 rgba(0,0,0,.1);                                                                            
    box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #ebeef5;
    color: #303133;
    -webkit-transition: 0.3s;
    transition: 0.3s;
    overflow: hidden;
    margin-top: 20px;
    height: auto;
   /* position: fixed;
    bottom:30px;
    right: 40px;
    left: 320px;
    top:120px;*/
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
    height: auto;
    position:relative;
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
