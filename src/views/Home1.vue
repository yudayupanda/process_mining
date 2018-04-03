<template>

  <div class="root">

    <div class="header">
      <div class="top">
        <el-row>
          <el-col :span="4">&nbsp;</el-col>
          <el-col :span="16"><div class="title"></div></el-col>
          <el-col :span="4" >
            <el-dropdown>
              <div class="user el-dropdown-link ">
                <i class="fa  fa-user fa-fw i_label"></i>{{nickname}}
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><i class="fa fa-cog fa-fw"></i>&nbsp;账户修改</el-dropdown-item>
                <el-dropdown-item><i class="fa fa-lock fa-fw"></i>&nbsp;密码修改</el-dropdown-item>
                <el-dropdown-item><span  @click="exit()"><i class="fa fa-power-off fa-fw"></i>&nbsp;注销</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <div class="search">
        <div class="logo" id="logo-div" style="display:inline-block"> 
        </div>
        <div class="title" style="display:inline-block">流程挖掘平台</div>

        <div class="searchForm">
            <span>
             <input id="searchInput"v-model="searchProject" placeholder="搜索我的项目" class="search-input" @focus="searchInputFocus()"  @blur="searchInputBlur()" @oninput="" v-on:input="searchInputChange()"/>
             </span>
            <span>
                <button  @click="searchProjects()" class="search-button" id="searchButton">搜索
                </button>  
            </span>
        </div>
       
       <!--  <div class="searchButtonDiv">
          <input type="button"  value="搜索"  @click="searchProjects()" class="search-button" id="searchButton"  />
        </div> -->
      </div> 
    </div>
    <div class="main">
      <div class="myProject">
        <div class ="myProjectTab" @click="queryProjectByKeyWord('')">
          我的项目
        </div>
      </div>
     
        <div class="boxDiv" >
          <div class="box add-box"  id="addProjectBtn" title="创建项目" @click="showAddProject()"></div> 
          <div v-for="project in newProjects" >
            <div class="box project-box">
              <i class="fa fa-remove fa-fw delete-icon" @click="deleteProject(project)"></i>
              <div class="project-logo">   
              </div>
              <div class="project-name" v-model="project.pName">
                {{project.pName}}
              </div>
              <div class="enter-project" value="project.pName">
                <a class="enter-button" @click="enterProject(project)">
                  <i class="fa fa-unlock fa-fw"></i>&nbsp;&nbsp;&nbsp;进入项目
                </a>
                <el-tooltip content="Bottom center" placement="bottom" effect="light">
                  <a class="update-button" title="编辑项目" @click="showUpdateProject(project)">
                    <i class="fa fa-cog fa-fw"></i>
                  </a>
                </el-tooltip>
              </div>
            </div>  
          </div>        
      </div>

    </div>
    <el-dialog title="编辑项目" v-loading="loading" element-loading-text="保存中" :visible.sync="updateProjectForm.visible" :width="formAttr.dialogWidth"  >
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
    <transition name="el-zoom-in-center">
      <div  class="page-component-up" style="display:none" id="page_component_up"  @click="pageUp()">
        <i class="el-icon-caret-top"></i>
      </div>
    </transition>
    <div class="footer">
        <span class="copyright">
               <!-- Copyright &copy;2018 SCUT All Rights Reserved SCUT B8-311 版权所有  -->
              
        </span>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import {addProject} from '../api/api'
import {queryProject} from '../api/api'
import {updateProject} from '../api/api'
import {deleteProject} from '../api/api'
import {checkProjectName} from '../api/api'
 // window.onscroll = function(){ 
 //  console.log(this.$router.path)
 //  if(document.documentElement.scrollTop>=300){
 //   document.getElementById("page_component_up").style.display=""
 //  }else{
 //    document.getElementById("page_component_up").style.display="none"
 //  }
 // }

export default {
    data() {
      return {
        loading:false,
        uid:'',
        nickname:'',
        projects:[
        ],
        searchProject:'',
      }
    },
    computed:{
      newProjects:function(){
          return this.projects
      }
    },
    //页面加载调用获取cookie值
    mounted() {
      this.$nextTick(function() {
        let user = JSON.parse(sessionStorage.getItem('user'))
        this.nickname = user.nickname
        this.uid=user.id
        var keyWord=''
        this.queryProjectByKeyWord(keyWord)
        window.addEventListener('scroll', this.onScroll)
        
      })  
    },
    beforeDestroy(){
      window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
      onScroll(){
        if(document.documentElement.scrollTop>=300){
          document.getElementById("page_component_up").style.display=""
        }else{
          document.getElementById("page_component_up").style.display="none"
        }
      },
      showAddProject(){
        this.addProjectForm.visible=true
        this.$nextTick(function() {
          //由于dialog还没有加载出来，没有nextTick的话会出错
          this.$refs.addProjectForm.resetFields()
        })   
      },
      //搜索项目
      searchProjects(){
        this.projects.splice(0,this.projects.length)
        this.queryProjectByKeyWord(this.searchProject)
      },
      //根据关键词搜索相关项目
      queryProjectByKeyWord(keyWord){
        let params={keyWord:keyWord,userId:this.uid} 
        queryProject(params).then(data => {
          if(data.code===1){
             this.projects=[]
              let projectCount=data.data.length
              let i=0
              for(;i<projectCount;i++){
                let pName=data.data[i].projectName
                let pDesc=data.data[i].projectDescription
                let pid=data.data[i].projectId
                let index=i
                let project={pName:pName,pDesc:pDesc,pid:pid,index:index}
                this.projects.push(project)
              }
          }
        })
      },
      searchInputFocus(){
        if(this.searchProject===''){
          console.log("无输入")
        }
      },
      //新建项目
      addProject(){
        this.$refs.addProjectForm.validate((valid) => {    
          if (valid) {
            let projectName = this.addProjectForm.projectName
            let projectDescription = this.addProjectForm.projectDescription
            let userId = this.uid
            var params = {projectName: projectName, projectDescription: projectDescription,userId:userId}
            let project={pName:projectName,pDesc:projectDescription,pid:0}
            addProject(params).then(data => {
              this.logining = false;
              if (data.code===1) {   
                 project.pid=data.data.projectId
                this.addProjectForm.visible=false  
                this.projects.push(project) 
                console.log("add success")
              } else {
                  if(data.code===-1){
                    console.log("fail")
                  }
                }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //展示更新项目
      showUpdateProject(project){ 
        let pName=project.pName
        let pDesc=project.pDesc
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
                console.log(this.projects[index].pName)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      //删除项目
      deleteProject(project){
        let _this = this
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let ids = []
          ids.push(project.pid)
          //数组要转换成字符串之后再传递
          let params={ids:ids.toString()}
          deleteProject(params).then(data => {
          if(data.code===1){
            //删除成功
            let length = this.projects.length
            for(var i=0; i<length; i++) {
              if(this.projects[i].pName === project.pName) { 
                this.projects.splice(i, 1);
                break;
              }
            } 
          }
        })
        }).catch(() => {
          
        })
      },
      //当用户尚未拥有项目时提示创建项目
      showAddProjectMessage() {
        this.$confirm('您尚未拥有项目, 是否创建项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
      //    document.getElementById("addProjectBtn").click()
        }).catch(() => {
                 
        })
      },
      //进入项目
      enterProject(project){
        let projectMap={pid:project.pid,uid:this.userId}
        sessionStorage.setItem('project', JSON.stringify(projectMap))
        this.$router.push({path: '/RawLog'})
      },
      //退出
      exit(){
          sessionStorage.removeItem('user')   
          this.$router.push({path: '/signin' })
          //window.location.reload()
      },
      //
      pageUp(){
        document.documentElement.scrollTop=0
      },
      //搜索输入框得到焦点
      searchInputFoucs(){
        // var input=document.getElementById("searchInput")
        // input.placeholder=""
        // var logo_div=document.getElementById("logo-div")
        // logo_div.className = "logo-focus"
      },
      //搜索输入框失去焦点
      searchInputBlur(){
        // var input=document.getElementById("searchInput")
  
        // var logo_div=document.getElementById("logo-div")
        // logo_div.className = "logo"
      },
      //搜索输入框内容改变
      searchInputChange(){
        // var searchButton = document.getElementById("searchButton")
        //    console.log(this.searchProject)
        // if(this.searchProject.length!=0){
        //   searchButton.style.display=""
        //   console.log(this.searchProject)
        //   searchButton.value= "搜\""+this.searchProject+"\"相关项目"
        // }else{
        //   searchButton.style.display="none"
        // } 
      },
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .html{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;

  }
  .root{
    width: 100%;
    height: 100%;
    text-align:center;
  }
  .header{
    width:100%;
    height:380px;
  /*  background-image:url('../assets/home2.jpeg');*/
  background-color: #DCDFE6;
    background-size:100% 100%;
    background-repeat:no-repeat;
  }
  .top{

    height:80px;
    width:100%;
    border:2px red;
    color:#fff;
  }

  .title{
    line-height: 80px;
    height: 60px;
    font-size: 40px;
    color:#909399;
    padding-left:20px;
  
  }
  .i_label{
    color:red;
  }
  .user{
   /* margin-left:90%;*/
   float:right;
    margin-top: 30px;
    padding-top: 8px;
    height: 30px;
    width:auto;
    padding-left: 20px;
    padding-right: 20px;
    border:2px solid;
    border-radius:20px;
    color:#ff4530;
    font-size: 20px;
    cursor: pointer;
  }
  .search{
    margin-right: auto;
    margin-left: auto;
    margin-top: 80px;
    width: 820px;
  }
  .logo{
    width: 60px;
    height: 60px;
    margin-left: auto;
    margin-right: auto;
    background-image:url('../assets/logo.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }
/*  .logo-focus{
    width: 80px;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    background-image:url('../assets/logo-focus.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }*/
  span{
    float: left;
    display: inline-block;
    height: 40px;
  }
  /*搜索输入框*/
  .search-input{
    height: 60px;
    line-height: 50px;
    font-size: 18px;
    width: 700px;
    border: 0 none;
    border-bottom-width: 1px solid red;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
/*    text-align:center;*/
    padding-left:20px;
    font-size: 30px;
    animation:home-fade .6s ease-in-out 1;
  
  }
  .search-input::placeholder{
    color:#C0C4CC;

    font-size: 20px;
  }
  .searchForm{
    margin-top:40px;
    width: 820px;
  }


  .search-button{
  /*  display: none;*/
    width:100px;
    height:60px;
    border: 0 none;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 20px;
    background: #409EFF;
    color: #fff;
    cursor: pointer;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .searchButtonDiv{
    margin-right: auto;
    margin-left: auto;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border-bottom:3px solid #EBEEF5;
    margin-top: -250px;
  }
  .main{
    width: 100%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
  }
  .myProject{
    width: 150px;
    height:auto;
    margin-left: auto;
    margin-right: auto; 
    font-size: 30px;
    cursor: pointer;
  }
  .myProjectTab{
   /* border-bottom: 3px solid #ff4530;*/
    margin-right: auto;
    margin-left: auto;
    width:300px;
    height:100px;
    margin-left: -80px;
    margin-top:20px;
    line-height: 100px;
    background: #ff4530;
    border-radius: 10px;
    color: #fff;
  }
  .boxDiv{
    width: 80%;
    height: auto;
    margin-right: auto;
    margin-left: auto;
    margin-top: 50px;
    padding-left:12%;
    float: left;
  }
  .box{
    height:260px;
    width:250px;
    border:1px solid #ddd;
    border-radius:5px;
    margin-left: 30px;
    float: left;
    margin-top: 40px; 
    transition: all .3s ease-in-out;
  }
  .add-box{
    background-image:url('../assets/add.png');
    background-size:60% 60%;
    background-position:center;
    background-repeat:no-repeat;

    cursor: pointer;
  }
  .project-box{
    display: inline-block;
    position: relative;
  }
  .project-box:hover i{
    display: inline-block !important; 
  }
  .box:hover{
    border:1px solid red;
  }
  .add-box:hover{
    transform:scale(1.05);
  }
  .project-logo{
    width:64px;
    height:64px;
    background-image:url('../assets/project-logo.png');
    background-position:center;
    background-repeat:no-repeat;
    margin-right: auto;
    margin-left:auto;
    margin-top: 20px;
  }
  .delete-icon{
    float:right;
    margin-right:5px;
    margin-top:5px;
    display:none;
    color:red;
    cursor: pointer;
  }
  .project-name{
    margin-right: auto;
    margin-left:auto;
    margin-top: 15px;
    width:200px;
    height:80px;
    font-size: 16px;
   /* border: 1px solid red;*/
  }
  .enter-project{
    height:40px;
    width:200px;
    margin-right: auto;
    margin-left:auto;
    margin-top: 20px;
  }
  .enter-button{
    width:150px;
    float:left;
    height:40px;
    border-radius: 5px;
    background-color: red;
    color:#fff;
    font-size: 16px;
    cursor: pointer;
    line-height: 40px;
  }
  .update-button{
    width:40px;
    height:40px;
    border-radius: 5px;
    cursor: pointer;
    float:right;
    background-color: grey;
    line-height: 40px;
  }
   .update-button i{
    color: white;
   }
  .page-component-up{

    background-color: #fff;
    position: fixed;
    right: 100px;
    bottom: 150px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 0 6px rgba(0,0,0,.12);
    z-index: 5;
  }
  .page-component-up i{
    color: #409eff;
    display: block;
    line-height: 50px;
    text-align: center;
    font-size: 25px;
  }
  .footer{
    float:left;
    margin:0;
    padding: 0;
    width: 100%;
    font-size: 12px;
    color: #666;
    height: 40px !important;
    text-align: center;
    margin-top: 100px !important;
    padding-top: 20%;
  }
  .copyright{
    line-height: 45px;
    margin:  0 auto;
    height: 45px;
    width:600px;
    text-align:center;
    display:block;
  }



 
  
</style>
