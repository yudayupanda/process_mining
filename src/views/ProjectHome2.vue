<template>
  <el-row class="container" id="container">
    <el-col :span="24" class="header">
      <el-col :span="22" class="logo" >
        {{sysName}}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="isCollapse=!isCollapse">
          <i class="fa fa-align-justify"></i>
        </div>
      </el-col>
      <el-col :span="2" class="userInfo">
        <el-dropdown  trigger="click">
              <div  class="el-dropdown-link userinfo-inner">
                <i class="fa fa-user fa-fw "></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><i class="fa fa-user fa-fw"></i>&nbsp;{{userName}}</el-dropdown-item>
                <el-dropdown-item ><i class="fa fa-envelope-o fa-fw"></i>&nbsp;{{email}}</el-dropdown-item>
                <el-dropdown-item :divided="true" >
                  <span  @click="goToProjects()">
                    <i class="fa fa-sitemap fa-fw"></i>&nbsp;我的项目
                  </span>
                </el-dropdown-item>
                <el-dropdown-item :divided="true"><span  @click=""><i class="fa fa-power-off fa-fw"></i>&nbsp;注销</span></el-dropdown-item>
              </el-dropdown-menu>
        </el-dropdown>
        <div class="fullScreen" @click="fullScreen">
          <i class="fa fa-fw fa-arrows-alt"></i>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <div class="sidebar">
        <div class="info">  
          <div style="margin-left:30px;margin-top:20px;">{{userName}}</div>
          <div style="margin-left:30px;margin-top:20px;">{{projectName}}</div> 
        </div>
        <div style="height:8px;background-color:#424242;width:300px;">   
        </div>

        <!--导航菜单-->
        <!--单个激活 并以 index 作为 path 进行路由跳转-->
        <el-menu  class="el-menu-vertical-demo"  :default-active="$route.path" unique-opened background-color="#2e363f"  text-color="#DCDFE6" active-text-color="#57b382" router>
          <!--动态路由到子组件 将不可见的路径隐藏-->
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf">
              <!--用el ui 的title进行solt分发菜单-->
              <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
              <!--item.name和item.children.name来配置菜单栏和子菜单栏的名称-->
              <el-menu-item  v-for="child in item.children"  :index="child.path" :key="child.path" :route="child.path">{{child.name}}</el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </div>
      <div class="content">
        <el-col :span="24">
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                {{item.name}}
              </el-breadcrumb-item>
            </el-breadcrumb>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
        </el-col>
      </div>

    </el-col>
  </el-row>

</template>

<script>
import Vue from 'vue'
import {addProject} from '../api/api'
import {queryProject} from '../api/api'
import {updateProject} from '../api/api'
export default {
    data() {   
     return{
        isRouter:true,
        isCollapse:true,
        userName:"Yu",
        projectName:"test",
        email:"875457146@qq.com",
        sysName:"流程挖掘平台",
        sysUserName: '',
        log:[],
     }
    },

    //页面加载调用获取cookie值
    mounted() {
     // console.log(this.$router.params)
    },
    methods: {
      goToProjects(){
        this.$router.push({path: '/Home' })
      },
      fullScreen(){
          var el=document.documentElement
          var isfullScreen=document.fullScreen||document.mozfullScreen||document.webkitIsfullScreen;
          if(!isfullScreen){//进入全屏,多重短路表达式
          (el.requestfullScreen&&el.requestfullScreen())||
          (el.mozRequestfullScreen&&el.mozRequestfullScreen())||
          (el.webkitRequestfullScreen&&el.webkitRequestfullScreen())||(el.msRequestfullScreen&&el.msRequestfullScreen());

          }else{ //退出全屏,三目运算符
          document.exitfullScreen?document.exitfullScreen():
          document.mozCancelfullScreen?document.mozCancelfullScreen():
          document.webkitExitfullScreen?document.webkitExitfullScreen():'';
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
}
.header{
  background-color: #464b59;
  height: 60px;
}
.logo {
  width:300px;
  height:60px;
  font-size: 22px;
  padding-left:20px;
  padding-right:20px;
  border-color: rgba(238,241,146,0.3);
  border-right-width: 1px;
  border-right-style: solid;
  line-height: 60px;
  color: #EBEEF5;
}

.tools{
  padding: 0px 23px;
  width:14px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  color:#EBEEF5;
}
.userInfo{
  float: right;
  margin-left: 100px;
  cursor: pointer;
  height: 60px;
  color: #EBEEF5;
}
.userinfo-inner {
  cursor: pointer;
  color:#fff;
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
  width:300px;
  left:0;
  top: 60px;
  bottom: 0;
  background:#2e363f;
}

.info{
  width:300px;
  height:100px;
  color: #f5f5f5;
  font-size: 14px;
}
.content{
  background: none repeat scroll 0 0 #fff;
  position: absolute;
  left: 300px;
  right: 0;
  top: 60px;
  bottom: 0;
  width: auto;
  padding: 40px;
  box-sizing: border-box;
  overflow: auto;
}
</style>
