<template>
  <el-row class="container" id="container">
    <el-col :span="24" class="header">
      <el-col :span="4" v-bind:class="[isFolded ? 'hidden' :'logo']">
        <div  class="logoImage"> 
        </div>
      </el-col>
      <el-col :span="2">
        <div class="tools" id="fold" @click.prevent="isFolded=!isFolded">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="14">
        <!--导航菜单-->
        <!--单个激活 并以 index 作为 path 进行路由跳转-->
        <el-menu  mode="horizontal" class="el-menu-vertical-demo"  :default-active="$route.path" unique-opened background-color="#2e363f"  text-color="#DCDFE6" active-text-color="#57b382" router>
          <!--动态路由到子组件 将不可见的路径隐藏-->
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <!--用el ui 的title进行solt分发菜单-->
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <!--item.name和item.children.name来配置菜单栏和子菜单栏的名称-->
              <el-menu-item  v-for="child in item.children"  :index="''" :key="child.path"
                :route="{name:child.name,params: {id:(currentProject === -1 || typeof(currentProject) === 'undefined' ? 'empty':currentProject.index+1),project:(currentProject === -1 || typeof(currentProject) === 'undefined' ? -1:currentProject)}}">{{child.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
      <div class="userInfo">
        <el-dropdown  trigger="hover" >
              <div  class="el-dropdown-link userinfo-inner">
                <i class="fa fa-user fa-fw "></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><i class="fa fa-user fa-fw"></i>&nbsp;{{userName}}</el-dropdown-item>
                <el-dropdown-item ><i class="fa fa-envelope-o fa-fw"></i>&nbsp;{{email}}</el-dropdown-item>
                <el-dropdown-item :divided="true" @click.native = "showConfig()">
                  <span>
                    <i class="fa fa-cog fa-fw"></i>&nbsp;设置
                  </span>
                </el-dropdown-item>
                <el-dropdown-item :divided="true" @click.native = "logOut()"><span><i class="fa fa-power-off fa-fw"></i>&nbsp;注销</span></el-dropdown-item>
              </el-dropdown-menu>
        </el-dropdown>
        <div class="fullScreen" @click="fullScreen">
          <i class="fa fa-fw fa-arrows-alt"></i>
        </div>
      </div>
    </el-col>

    <el-col :span="24" class="main">
      <div v-bind:class="[isFolded ? 'hidden' :'sidebar']"  id="sidebarDiv">
        <div class="info" id="infoDiv">  
          <div class="myProjectLogo"><label style="cursor:pointer" @click="queryProjectByKeyWord('')">我的项目</label>
            <span  @click="showAddProject()" title="新添项目">
              <i class="fa fa-plus fa-fw"></i>&nbsp;
            </span>
            <!--排序选项-->
            <el-popover
              ref="popover"
              width="200"
              trigger="click"
              placement="bottom-start"
              v-model="sortWayVisible"
            >
              <div style="">
                <div style="float:left;color:#ababab">
                  排序方式
                </div>
                <el-radio-group v-model="projectSortWay" @change="changeProjectSortWay()">
                  <el-radio :label='0' class="sortWayRadio">创建日期（最早优先）</el-radio>
                  <el-radio :label='1' class="sortWayRadio">创建日期（最新优先）</el-radio>
                  <el-radio :label='2' class="sortWayRadio">标题（升序排列）</el-radio>
                  <el-radio :label='3' class="sortWayRadio">标题（降序排列）</el-radio>
                </el-radio-group>
              </div>
              <span  slot="reference" title="排序">
                <i class="fa fa-sort-amount-asc fa-fw"></i>&nbsp;
              </span>
            </el-popover>
            
            <div class="projectCount">总计 : {{this.projectCount}}个</div>
          </div>
        </div>
        <div class="searchBlock" id="searchDiv">
            <div style="width:250px;margin:0 auto;">
            <el-input type="text"  prefix-icon="el-icon-search"
            placeholder="查找项目" v-model="searchKeyWord" @keyup.enter.native="queryProjectByKeyWord(searchKeyWord)"></el-input>
            <i class="fa fa-sort-amount-asc fa-fw"></i>
            </div>
        </div>
      </div>
      <div   v-bind:class="[isFolded ? 'hidden' :'projectList']" id="projectList" >
        <div v-for="(project,index) in projects" @click="handleProjectBoxClick(project,index)" >
            <span style="float:left;margin-left:2px;color:#000" >{{index+1}}</span>
            <div  :class="index==0?'projectBox clickedBox':'projectBox'" :id="'box'+index">
                <div class="btnGroup">
               <!--    <span  @click=""><i class="fa fa-eye fa-fw hidden"></i></span> -->
                  <span  @click.stop="showUpdateProject(project)" title="修改"><i class="fa fa-pencil fa-fw hidden"></i></span>
                  <span  @click.stop="deleteProject(project)" title="删除"><i class="fa fa-trash-o fa-fw hidden"></i></span>
                </div>
                <div class="projectName">
                  {{project.name}}
                </div>
                <div class="projectDate">
                  {{project.date}}
                </div>
                <div class="projectDescription">
                  {{project.description}} 
                </div>
            </div>
        </div>
        <div v-show="projects.length === 0" class="emptyProject">
          暂无数据
        </div>
      </div>
      <div  v-bind:class="[isFolded ? 'hidden' :'location']">
        当前位置 {{this.currentBoxIndex+1}}/{{this.projects.length}}
      </div>
      <div class=""  v-bind:class="[isFolded ? 'contentFolded' :'content']">
        <el-col :span="24">
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{item.name}}
              </el-breadcrumb-item>
            </el-breadcrumb>
            <transition name="fade" mode="out-in" >
                <router-view v-if="isRouterAlive"></router-view>
            </transition>
        </el-col>
      </div>
    </el-col>
     <el-dialog title="编辑项目"  element-loading-text="保存中" :visible.sync="updateProjectForm.visible" :width="formAttr.dialogWidth"  >
        <el-form :model="updateProjectForm" :rules="updateProjectRules" ref="updateProjectForm">
          <el-form-item label="项目名称" :label-width="formAttr.formLabelWidth" prop="projectName" >
            <el-input v-model="updateProjectForm.projectName" :maxlength=20 auto-complete="off" ></el-input>
          </el-form-item>

          <el-form-item label="项目描述" :label-width="formAttr.formLabelWidth" prop="projectDescription">
            <el-input  type="textarea" :rows="4" v-model="updateProjectForm.projectDescription" auto-complete="off"></el-input>
          </el-form-item>   
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateProjectForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="updateProject()">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="新建项目" :visible.sync="addProjectForm.visible" :width="formAttr.dialogWidth">
        <el-form :model="addProjectForm" :rules="addProjectRules" ref="addProjectForm">
          <el-form-item label="项目名称" prop="projectName"  :label-width="formAttr.formLabelWidth" >
            <el-input v-model="addProjectForm.projectName" :maxlength=20 :minlength=1 auto-complete="off"  clearable></el-input>
          </el-form-item>
          <el-form-item label="项目描述" :label-width="formAttr.formLabelWidth"  prop="projectDescription">
            <el-input  type="textarea" :rows="4" v-model="addProjectForm.projectDescription" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addProjectForm.visible = false">取 消</el-button>
          <el-button type="primary" @click="addProject('addProjectForm')">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="设置"   :visible.sync="accountCogForm.visible" width="35%" >
      <el-tabs v-model="accountCogForm.activeName" :tab-position="accountCogForm.tabPosition" style="height:auto;">
        <el-tab-pane label="账户设置" name="0">
          <el-form :model="accountCogForm" label-width="80px">
            <el-form-item label="帐号">
              <el-input v-model="email":disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="userName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;">
              <el-button type="primary" style="width:100%">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="密码设置" name="1">
          <el-form :model="accountCogForm" label-width="90px">
            <el-form-item label="旧密码">
              <el-input type="password" v-model="accountCogForm.oldPass"></el-input>
            </el-form-item>
            <el-form-item label="新密码">
              <el-input type="password" v-model="accountCogForm.newPass"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码">
              <el-input type="password" v-model="accountCogForm.newPassCheck"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px;">
              <el-button type="primary" style="width:100%">保存</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </el-row>

</template>

<script>
import Vue from 'vue'
import {addProject} from '../api/api'
import {queryProject} from '../api/api'
import {updateProject} from '../api/api'
import {deleteProject} from '../api/api'
import {checkProjectName} from '../api/api'
import {compareUp} from '../common/common'
import {compareDown} from '../common/common'
export default {
    data() {  
    //检验项目的项目名称，以防重复
      let  validateProjectName = (rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入项目名称'))
        }else{
          if( this.updateProjectForm.projectName===value){
           callback()
          }
          let params={projectName:value,userId:this.uid}
          checkProjectName(params).then(data => { 
            if(data.code===1) {
              callback()
            }else if(data.code===-1){
               callback(new Error('项目名称已存在，请更换项目名称'))
            }
          })
        }
      } 
     return{
        //项目计数
        projectCount:0,
        //项目搜索的关键字
        searchKeyWord:'',
        //是否折叠
        isFolded:false,
        //项目默认的排序方式,要用整数！！！不能用字符串！！！
        projectSortWay:0,
        sortWayVisible:false,
        //记录上一次按下的项目box
        lastClickedBox:"box0",
        //当前点击项目Box位置
        currentBoxIndex:0,
        addProjectForm:{
          projectName:'',
          projectDescription:'',
          visible:false
        },
        updateProjectForm:{
          projectId:'',
          projectName:'',
          projectDescription:'',
          visible:false,
          index:0,
        },
        formAttr:{
          formLabelWidth: '120px',
          dialogWidth:'800px'
        },
         addProjectRules:{
          projectName:[
            { validator: validateProjectName, trigger: 'blur' }
          ],
        },
        updateProjectRules:{
          projectName:[
            { validator: validateProjectName, trigger: 'blur' }
          ],
        },
        //帐号设置
        accountCogForm:{
          visible:false,
          activeName:'0',
          //选项卡位置
          tabPosition:'left',
          oldPass:'',
          newPass:'',
          newPassCheck:'',
        },
        projects:[],
        //当前所选项目
        currentProject:-1,
        uid:'',
        isCollapse:true,
        userName:"",
        email:"",
        sysName:"流程挖掘平台",
        sysUserName: '',
        log:[],
        isRouterAlive:true,
        isShowingUpdateOrDelete:false,
        isSorted:false,
     }
    },
    created(){ 
    },
    //页面加载调用获取cookie值
    mounted() {
      this.$nextTick(function() {
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.userName = user.nickname
        this.email = user.email
        this.uid=user.id
        //查询所有的项目
        let keyWord=''
        this.queryProjectByKeyWord(keyWord)   
      })  
    },
    methods: {
       //根据关键词搜索相关项目
      queryProjectByKeyWord(keyWord){
        let params={keyWord:keyWord,userId:this.uid} 
        queryProject(params).then(data => {
          if (typeof(data) === "undefined")
              return
          if(data.code === 1){
              this.projects=[]
              let projectCount=data.data.length
              if(keyWord === ''){
                this.projectCount = projectCount
              }
              let i=0
              for(;i<projectCount;i++){
                let pName=data.data[i].projectName
                let pDesc=data.data[i].projectDescription
                let pid=data.data[i].projectId
                let index=i
                let project={name:pName,description:pDesc,pid:pid,index:index}
                this.projects.push(project)
              }
              if(projectCount!=0){
                this.currentProject = this.projects[0]
                let currentRoute = this.$router.history.current.name
                //第一次进来
                if(currentRoute === '主页'){
                  this.$router.push({name: '原始日志',params: {id:1,project:this.projects[0]}})
                  this.currentProject = this.projects[0]
                  sessionStorage.removeItem('currentProject')
                  sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
                }
                else
                  this.$router.push({name: currentRoute,params: {id:1,project:this.projects[0]}})
                //刷新路由
                this.reload()
              }
          }
          if(data.code === -1){
            this.$router.push({name: '原始日志',params: {id:'empty',project:-1}})
            if(data.msg === '没有要搜索的项目'){
              this.projects = []
              this.currentBoxIndex = -1
              this.reload()
            }
          }

        })
 
            
      },
      search(){
    
      },
      //删除项目
      deleteProject(project){
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = []
          ids.push(project.pid)
          //数组要转换成字符串之后再传递
          let params={ids:ids.toString()}
          deleteProject(params).then(data => {
            if(data.code===1){
              //删除成功
              let length = this.projects.length      
              let deletedProjectIndex = -1
              for(let i=0; i<length; i++) {
                if(this.projects[i].name === project.name) {  
                  this.projects.splice(i, 1);
                  deletedProjectIndex = i
                  break;
                }
              }
              if (this.projects.length === 0) {
                this.$router.push({name: '原始日志',params: {id:'empty',project:-1}})
              }
              this.projectCount = this.projects.length     
              //如果删除的是最后一个
              if(deletedProjectIndex === length-1 && this.projectCount != 0){
                this.lastClickedBox = ''
                this.handleProjectBoxClick(this.projects[this.projectCount-1],this.projectCount-1)
              }
            }
        })
        }).catch(() => {
         
        })
      },
      //展示添加项目页
      showAddProject(){
        this.addProjectForm.visible=true
        this.$nextTick(function() {
          //由于dialog还没有加载出来，没有nextTick的话会出错
          this.$refs.addProjectForm.resetFields()
        })   
      },
       //新建项目
      addProject(){
        this.$refs.addProjectForm.validate((valid) => {    
          if (valid) {
            const loading = this.$loading({
            lock: true,
            text: '正在保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            })
            let projectName = this.addProjectForm.projectName
            let projectDescription = this.addProjectForm.projectDescription
            let userId = this.uid
            let params = {projectName: projectName, projectDescription: projectDescription,userId:userId}
            let project={name:projectName,description:projectDescription,pid:0}
            addProject(params).then(data => {
              this.logining = false;
              if (data.code===1) {   
                project.pid=data.data.projectId
                this.addProjectForm.visible=false  
                this.projects.push(project) 
                this.projectCount = this.projects.length
                this.$notify({
                    title: '提示',
                    message: '添加项目成功！',
                    type: 'success'
                })
                let length = this.projects.length
                //等待页面加载结束，跳转到最先创建的项目
                this.$nextTick(function() { 
                  this.currentProject = this.projects[length-1]
                  sessionStorage.removeItem('currentProject')
                  sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
                  this.handleProjectBoxClick(this.projects[length-1],length-1)
                })
               
              } else {
                  if(data.code===-1){ 
                  }else{

                  }
                }
                loading.close()
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //展示更新项目
      showUpdateProject(project){ 
        let pName=project.name
        let pDesc=project.description
        let pid=project.pid
        let index=project.index
        this.updateProjectForm.projectId=pid
        this.updateProjectForm.projectName=pName
        this.updateProjectForm.projectDescription=pDesc
        this.updateProjectForm.index=index
        this.updateProjectForm.visible= true  
        //对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        this.$nextTick(function() {
          //由于dialog还没有加载出来，没有nextTick的话会出错
          this.$refs.updateProjectForm.resetFields() 
        })
 
      },
       //更新项目
      updateProject(){
        this.$refs.updateProjectForm.validate((valid) => { 
          if (valid) {
            this.loading=true
            let projectName=this.updateProjectForm.projectName
            let projectDescription=this.updateProjectForm.projectDescription
            let projectId=this.updateProjectForm.projectId
            let index=this.updateProjectForm.index
            let params={projectName:projectName,projectDescription:projectDescription,projectId}
            updateProject(params).then(data => {
              this.loading=false
              if(data.code===1){
                this.updateProjectForm.visible=false
                let pid=this.projects[index].pid
                let project={pName:projectName,pDesc:projectDescription,pid:pid,index:index}
                Vue.set(this.projects,index,project)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      //展示设置界面
      showConfig(){
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.userName = user.nickname
        this.accountCogForm.activeName='0'
        this.accountCogForm.oldPass=''
        this.accountCogForm.newPass=''
        this.accountCogForm.newPassCheck=''
        this.accountCogForm.visible=true
      },
      //改变项目的排序方式
      changeProjectSortWay(){
        switch(this.projectSortWay){
          case 0:
          break
          case 1:
          break
          case 2:
            this.projects.sort(compareUp('name'));  
          break
          case 3:
             this.projects.sort(compareDown('name')) 
          break
          default:
          break
        }
        this.isSorted = true
        //更新视图
        if(this.projects.length !== 0){
          this.handleProjectBoxClick(this.projects[0],0)
        
        }
        this.sortWayVisible = false
        
      },
      //记录当前所点击的项目box
      handleProjectBoxClick(project,index){ 
        //保留当前项目信息
        this.currentProject = project
        sessionStorage.removeItem('currentProject')
        sessionStorage.setItem('currentProject', JSON.stringify(this.currentProject))
        //进行排序后刷新页面
        // if(this.isSorted){
        //   this.reload()
        //   this.isSorted = false
        //   let currentRoute = this.$router.history.current.name
        //   this.$router.push({name: currentRoute,params: {id:'sort-'+this.projectSortWay+'-'+(index+1),project:this.currentProject}})
        // }else{
        //   let currentRoute = this.$router.history.current.name
        //   this.$router.push({name: currentRoute,params: {id:index+1,project:this.currentProject}})
        // }
        this.reload()
        this.currentBoxIndex = index
        let id= "box"+index
        //重复按下
        if(id===this.lastClickedBox)
          return
        //clickedBox前面必须加空格
        document.getElementById(id).className += ' clickedBox'
        if(this.lastClickedBox !== '')
          document.getElementById(this.lastClickedBox).setAttribute('class','projectBox')
        this.lastClickedBox=id

      },
       //退出
      logOut(){
          let _this = this
          this.$confirm('是否退出?', '提示', {   
          }).then(() => {
            sessionStorage.removeItem('user')  
            sessionStorage.removeItem('currentProject') 
            _this.$router.push({path: 'process-mining/signin' })
          }).catch(() => {
            
          })
      },
      //刷新路由页面
      reload() {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      }, 
      //全屏
      fullScreen(){
        let ele = document.getElementById("container")
        // going full-screen
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        }
        else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
        }
        else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
        else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        }
         // exit full-screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } 
        else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }                         
      }
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.header{
  background-color: rgb(46, 54, 63);
  height: 60px;
}
.logo {
  font-family:gotham, helvetica, arial, sans-serif;
  width:280px;
  height:60px;
  font-size: 22px;
  text-align: center;
  border-color: rgba(238,241,146,0.3);
  border-right-width: 1px;
  border-right-style: solid;
  line-height: 60px;
  color: #EBEEF5;
}
.logoImage{
  cursor: pointer;
  width: 48px;
  height: 48px;
  margin:0 auto;
  line-height: 48px;
  margin-top: 6px;
  background-image:url('../assets/logo.png');
  background-size:100% 100%;
  background-repeat:no-repeat;
}
.tools{
  padding: 0px 23px;
  width:14px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  color:#EBEEF5;
}
.projectCount{
  font-size:16px;
  margin-top:-20px;
}
.searchBlock{
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #DCDFE6;
}
.searchBlock el-input{
  border:1px solid #e1e1e1;
  border-radius:2px;
  padding:10px 40px 9px 8px;
  margin-left:20px;
  height: 10px;
  line-height: 10px;
  
}
.searchBlock i{
  float: left;
  margin-top: -25px;
  margin-left:30px;
  color: #000;
}
input::-ms-input-placeholder{text-align: center;font-size: 13px;}
input::-webkit-input-placeholder{text-align: center;font-size: 13px;}
.userInfo{
  float: right;
  margin-right: 40px;
  cursor: pointer;
  height: 60px;
  color: #EBEEF5;
}
.myProjectLogo{
  height:60px;
  font-size:21px;
  letter-spacing:0.5px;
  text-transform:uppercase;
  font-family:gotham, helvetica, arial, sans-serif;
  font-weight:300;
  line-height: 60px;
  text-align: left;
  padding-left:20px;
  color: #303133;

}
.myProjectLogo span{
  cursor: pointer;
  float:right;
  color:#606266;
}
.userinfo-inner {
  cursor: pointer;
  color:#EBEEF5;
  margin-top: 20px;
  width:40px;
  height:40px;
  font-size: 30px; 
  line-height: 30px;
}
.fullScreen{
  margin-left:60px;
  line-height: 30px;
  font-size: 30px;
  margin-top: -40px;
}
.sidebar{
  display:block;
  position:absolute;
  width:280px;
  height:auto;
  left:0;
  top: 60px;
  background: #D9D9D9;
  border-right:1px solid #EBEEF5;
}
.projectList{
  overflow-x:hidden;
  overflow-y: scroll;
  border-top:1px solid #fff;
  border-bottom:1px solid #DCDFE6;
  display:block;
  width: 280px;
  position:absolute;
  left:0;
  top:216px;
  bottom: 40px;
  box-sizing:border-box;  
  background-color: #D9D9D9;
}
.emptyProject{
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  color:#909399;
  font-size:14px;
}
.projectBox{
  padding-left:10px;
  padding-right:10px;
  margin:10px auto;
  width:90%;
  height:25%;
  box-sizing:border-box; 
  border:2px solid transparent;
  cursor: pointer;
  color:#000;
  background-color: #fff;

}

.clickedBox{
  border:2px solid #67c23a;
}

.projectBox:hover{
  border:2px solid #e6a23c;
  color:#000;
}
.projectBox:hover i{
  display:block;
  color:#EE6A50;
}

.projectName{
  font-size: 20px;
  width:120px;
  text-overflow:ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.projectDate{
  margin-top: 3px;
  font-size:14px;
  height:14px;
  line-height: 14px;
}
.projectDescription{
  margin-top: 3px;
  font-size:14px;
  width:auto;
  display: -webkit-box; 
  height:80px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.location{
  display: block;
  position: fixed;
  float:left;
  bottom:0;
  width:280px;
  text-align: center;
  color:#606266;
  line-height: 40px;
  background-color:  #D9D9D9;
  border-top:1px solid #fff;
  font-family:gotham, helvetica, arial, sans-serif;
}
.hidden{
  display: none;
}
/*
项目右上角图标
*/
.btnGroup{
  float:right;
  margin-top: 5px;
  display: inline-block;
}
.btnGroup span{
  display: inline-block;
}
.info{
  width:280px;
  height:100px;
  color: #f5f5f5;
  font-size: 14px;
}
.sortWayRadio{
  margin-left:0;
  margin-top:10px;
  height:25px;
  line-height:25px;
}
.el-radio__input{
  color:#67c23a !important;
}
.content{
  background: none repeat scroll 0 0 #fff;
  position: absolute;
  left: 280px;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;
  padding: 40px;
  box-sizing: border-box;
  overflow-y: auto;
}
.contentFolded{
  background: none repeat scroll 0 0 #fff;
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;
  padding: 40px;
  box-sizing: border-box;
  overflow-y: auto;
}
</style>
