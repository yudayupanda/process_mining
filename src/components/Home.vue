<template>
  <div class="root">
    <div class="header">
      <div class="top">
        <el-row>
          <el-col :span="4"><div class="title">流程挖掘平台</div></el-col>
          <el-col :span="16"><div class="title"></div></el-col>
          <el-col :span="4">
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
        <div class="logo" id="logo-div">
        </div>
        <input id="searchInput"v-model="searchProject" placeholder="请输入项目名称" class="search-input" @focus="searchInputFoucs()"  @blur="searchInputBlur()" @oninput="" v-on:input="searchInputChange()"/>
        <div class="searchButtonDiv">
          <input type="button"  value=""  class="search-button" id="searchButton" style="display:none" />
        </div>
      </div> 
    </div>
    <div class="main">
      <div class="myProject">
        <div class ="myProjectTab">
          我的项目
        </div>
      </div>
     
        <div class="boxDiv" >
          <div class="box add-box"  @click="showAddProject()"></div> 
          <div v-for="project in newProjects" >
            <div class="box project-box">
              <i class="fa fa-remove fa-fw delete-icon" @click="deleteProject(project)"></i>
              <div class="project-logo">   
              </div>
              <div class="project-name" v-model="project.pName">
                {{project.pName}}
              </div>
              <div class="enter-project" value="project.pName">
                <a class="enter-button">
                  <i class="fa fa-unlock fa-fw"></i>&nbsp;&nbsp;&nbsp;进入项目
                </a>
                <a class="update-button" title="编辑项目" @click="showUpdateProject(project)">
                  <i class="fa fa-cog fa-fw"></i>
                </a>
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
    <div class="footer">
        <span class="copyright">
               <!-- Copyright &copy;2018 SCUT All Rights Reserved SCUT B8-311 版权所有  -->
                &copy;SCUT B8-311
        </span>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import {addProject} from '../api/api'
import {queryProject} from '../api/api'
import {updateProject} from '../api/api'
export default {
    data() {
      //检验项目的项目名称，以防重复
      var  validateProjectName = (rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入项目名称'))
        }else{
          callback()
        }
      }

      return {
        loading:false,
        uid:'',
        nickname:'',
        projects:[
        ],
        searchProject:'',
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
        }
       
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
        let params={keyWord:'',userId:this.uid}
        queryProject(params).then(data => {
          if(data.code===1){
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
      })
     
    },
    methods: {
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
            let projectName = this.addProjectForm.projectName
            let projectDescription = this.addProjectForm.projectDescription
            let userId = this.uid
            var params = {projectName: projectName, projectDescription: projectDescription,userId:userId}
            let project={pName:projectName,pDesc:projectDescription,pid:0}
            this.projects.push(project)
            addProject(params).then(data => {
            this.logining = false;
            if (data.code===1) {   
              this.addProjectForm.visible=false   
            } else {
                if(data.code===0)
                  console.log("fail")
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
      deleteProject(project){
        alert(2)
      },
      //退出
      exit(){
          sessionStorage.removeItem('user')   
          this.$router.push({path: '/signin' })
          //window.location.reload()
      },
      //搜索输入框得到焦点
      searchInputFoucs(){
        var input=document.getElementById("searchInput")
        input.placeholder=""
        var logo_div=document.getElementById("logo-div")
        logo_div.className = "logo-focus"
      },
      //搜索输入框失去焦点
      searchInputBlur(){
        var input=document.getElementById("searchInput")
        input.placeholder="请输入项目名称"
        var logo_div=document.getElementById("logo-div")
        logo_div.className = "logo"
      },
      //搜索输入框内容改变
      searchInputChange(){
        var searchButton = document.getElementById("searchButton")
          
           console.log(this.searchProject)
        if(this.searchProject.length!=0){
          searchButton.style.display=""
          console.log(this.searchProject)
          searchButton.value= "搜\""+this.searchProject+"\"相关项目"
        }else{
          searchButton.style.display="none"
        } 
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
   
  }
  .header{
    width:100%;
    height:510px;
    background-image:url('../assets/home2.jpeg');
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
    margin-top: 20px;
    height: auto;
    font-size: 30px;
    color:#C3CADA;
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
    width: 1000px;
  }
  .logo{
    width: 80px;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    background-image:url('../assets/logo.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }
  .logo-focus{
    width: 80px;
    height: 80px;
    margin-left: auto;
    margin-right: auto;
    background-image:url('../assets/logo-focus.png');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }
  /*搜索输入框*/
  .search-input{
    margin-top: 40px;
    height: 60px;
    line-height: 50px;
    font-size: 18px;
    width: 800px;
    border: 0 none;
    border-bottom-width: 1px solid red;
    border-radius: 25px;
    text-align:center;
    font-size: 30px;
    animation:home-fade .6s ease-in-out 1;
  
  }
  .search-input::placeholder{
    color:#992e2e;
    text-align: center;
    font-size: 20px;
  }
 /* .search-input:hover{
    border: 2px  solid red;
  }*/
  .search-button{
  /*  display: none;*/
    width:auto;
    height: 50px;
    border: 0 none;
    margin-top: 280px;
    left: -5px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 20px;
    background-color:#38f;
    color: #fff;
    cursor: pointer;
    border-radius: 23px;
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
