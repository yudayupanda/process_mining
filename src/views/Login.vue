<template>
  <div class="root">
  
    <div class="title">
      流程挖掘平台
    </div>
    <div >
      <el-card class="box-card" id="login-card" style="">
        <div slot="header" class="clearfix">
          <span class="card-title">登录</span>
        </div>  
        <div id="login" style=""> 
          <div class="login-input">
            <el-form :model="loginRuleForm" :rules="loginRules" ref="loginRuleForm" >
              <el-form-item prop="loginEmail">
                <el-input v-model="loginRuleForm.loginEmail" class="input" 
                placeholder="邮箱" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginRuleForm.password" class="input"  type="password" id="passwordInput"
                placeholder="密码" >
                <i class="fa fa-eye fa-2x i-label" slot="suffix" id="eyeLabel" @click="changePassView"></i>
              </el-input>
            </el-form-item>
            <div class="login-options">
              <el-checkbox v-model="loginRuleForm.rememberPass">记住密码</el-checkbox>
              <input type="button" onclick="" value="忘记密码？" class="login-cannotLogin" /> 
            </div>
            <el-form-item >
              <el-button type="primary" @click="handleLoginSubmit('loginRuleForm')" :loading="logining" class="login-button">登录</el-button>
            </el-form-item>

          </el-form>
        </div>

      </div>
      <div class="switch" id="login-switch" style="">
        没有账号？
        <span style="color: #175199;cursor: pointer;" @click="goToRegister()">注册</span>
      </div>
    </el-card> 
    <el-card class="box-card" id="register-card" style="display:none">
      <div slot="header" class="clearfix">
        <span class="card-title">注册</span>
      </div>  
      <div id="register" style=""> 
        <div class="login-input">
          <el-form :model="registerRuleForm" :rules="registerRules" ref="registerRuleForm" >
            <el-form-item prop="registerEmail">
              <el-input v-model="registerRuleForm.registerEmail" class="input" 
              placeholder="邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="verificationCode">
              <el-input v-model="registerRuleForm.verificationCode" :maxlength=6 class="input" 
              placeholder="验证码">
              <el-button slot="append" id="getCodeBtn" @click="getCode">获取验证码</el-button>
            </el-input>
          </el-form-item>
          <div class="login-options">
            <el-checkbox v-model="registerRuleForm.allowProtocol">同意《挖挖平台协议》</el-checkbox>
          </div>
          <el-form-item >
            <el-button type="primary" :loading="registering" @click="handleStartRegisterSubmit('registerRuleForm')" class="login-button">注册</el-button>
          </el-form-item>
        </el-form>
      </div>   
    </div>
    <div class="switch" id="register-switch" style="">
      已有账号？
      <span id="goToLogin" style="color: #175199;cursor: pointer;" @click="goToLogin"> 登录</span>
    </div>
  </el-card>
    <el-card class="box-card" id="comfirm-register-card" style="display:none">
      <div slot="header" class="clearfix">
        <span class="card-title">注册</span>
      </div>  
      <div id="register" style=""> 
        <div class="login-input">
          <el-form :model="registerDetailRuleForm" :rules="registerDetailRules" ref="registerDetailRuleForm" >
            <el-form-item prop="nickname">
              <el-input v-model="registerDetailRuleForm.nickname" class="input"  :maxlength=10
              placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password" :showMessage="showMessage">
              <el-input v-model="registerDetailRuleForm.password" type="password" class="input" :maxlength=16  placeholder="密码" @focus="registerPassFocus">
            </el-input>
          </el-form-item>
          <transition name=".el-zoom-in-top">
          <div v-show="!showMessage" style="margin-top:-20px;text-align:left;display:none" id="passInfo" >
            <div>
              <i class="fa fa-info-circle pass-i" style=""></i> 
              <span class="pass-info">不能包含空格</span>
            </div>
            <div>
              <i class="fa fa-info-circle pass-i" ></i> 
              <span class="pass-info" >6-16位字符</span>
            </div>
          </div>
           </transition>
          
          <el-form-item prop="checkPass">
              <el-input v-model="registerDetailRuleForm.checkPass" class="input" type="password" :maxlength=16 
              placeholder="再次输入密码">
            </el-input>
          </el-form-item>
         
          <el-form-item  style="margin-top:-16px;">
            <el-button type="primary" @click="handleConfirmRegisterSubmit('registerDetailRuleForm')" :loading="registering" class="login-button">确定</el-button>
          </el-form-item>
        </el-form>
      </div>   
    </div>
    <div class="switch" id="register-switch" style="">
      已有账号？
      <span id="goToLogin" style="color: #175199;cursor: pointer;" @click="goToLogin"> 登录</span>
    </div>
  </el-card> 
</div>
      <div class="footer">
        <span class="copyright">
              <!--  Copyright &copy;2018 SCUT All Rights Reserved SCUT B8-311 版权所有  -->
              &copy;SCUT B8-311
        </span>
      </div>
    </div>
  </template>

  <script>
  import {requestLogin } from '../api/api'
  import {requestVerificationCode} from '../api/api'
  import {requestRegister} from '../api/api'
  import {checkverificationCode} from '../api/api'
  export default {
    data () {
      //验证登陆邮箱
      var validateLoginEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入邮箱'))
        } else {
          if(!this.checkEmailForm(value)){
            return callback(new Error('邮箱格式不正确'))
          }
          callback()
        }
      }

      //验证登录密码
      var validateLoginPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
            // if (this.ruleForm2.checkPass !== '') {
            //   this.$refs.ruleForm2.validateField('checkPass');
            // }
            callback();
          }
      }
      //验证注册邮箱
      var validateRegisterEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入邮箱'))
        } else {
          if(!this.checkEmailForm(value)){
            return callback(new Error('邮箱格式不正确'))
          }
         
        }
        callback()
      }
      //验证码
      var validateVerificationCode=(rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入验证码'))
        }
        callback()
      }
      //验证用户名
      var validateNickname = (rule,value,callback)=>{
        if(!value){
          callback(new Error('请输入用户名'))
        }else{
          let regEx = /^(?!_)(?!.*?_$)[a-zA-Z0-9_u4e00-u9fa5]+$/
          if(!regEx.test(value)){
            callback(new Error('用户名只能包含中文、数字、英文和下划线'))
          }
          callback()
        }
      }
      //验证注册时的密码
      var validateRegisterPass = (rule,value,callback)=>{
        this.showMessage=true
        document.getElementById("passInfo").style.display="none"
        if(!value){
          callback(new Error('请输入密码'))
        }else{
          if(value.indexOf(" ")!=-1){
            callback(new Error('密码不能包含空格'))
          }
          if(value.length<6){
            callback(new Error('密码长度不能小于6位'))
          }
          callback()
        }
      }
      //验证注册时的重新输入密码
      var  validateCheckPass = (rule,value,callback)=>{
        if(!value){
          callback(new Error('请重新输入密码'))
        }else{
          if(value!=this.registerDetailRuleForm.password)
            callback(new Error('两次密码输入不一致'))
          callback()
        }
      }
     
      return {
        showMessage:false,
        logining: false,
        registering:false,
        loginRuleForm: {
          loginEmail:'',
          password:'',
          rememberPass:false,
        },
        registerRuleForm: {
          registerEmail: '',
          verificationCode:'',
          allowProtocol:true, 
        },
        registerDetailRuleForm: {
          nickname:'',
          password:'',
          checkPass:'',
        },
        loginRules:{
          loginEmail:[
            { validator: validateLoginEmail, trigger: 'blur' }
          ],
          password: [
            { validator: validateLoginPass, trigger: 'blur' }
          ],
        },
        registerRules:{
          registerEmail:[
            { validator: validateRegisterEmail, trigger: 'blur' }
          ],
          verificationCode:[
            { validator: validateVerificationCode, trigger: 'blur' }
          ],
        },
        registerDetailRules:{
          nickname:[
            { validator: validateNickname, trigger: 'blur' }
          ],
          password:[
            { validator: validateRegisterPass, trigger: 'blur' }
          ],
          checkPass:[
            { validator: validateCheckPass, trigger: 'blur' }
          ]

        },
      }
    },
    //页面加载调用获取cookie值
    mounted() {
        this.getCookie();
    },
    methods: {
      //登录事件
      handleLoginSubmit(formName) {
        // this.$refs.loginRuleForm.resetFields();
        this.$refs[formName].validate((valid) => {      
        if (valid) {
         this.logining = true;
         let email = this.loginRuleForm.loginEmail
         let password = this.loginRuleForm.password
         var loginParams = { email: email, password: password}
         requestLogin(loginParams).then(data => {
          this.logining = false
          if (typeof(data) == "undefined")
            return
          let retCode = data.code
          if (retCode === 1) {
        //  this.notify(1,"登录成功")
            if(this.loginRuleForm.rememberPass=true){
              //传入账号名，密码，和保存天数3个参数
              this.setCookie(email,password,7)
            }
            let id= data.data.id
            let nickname = data.data.nickname
            let userAttr ={id:id,email:email,nickname:nickname}
            sessionStorage.setItem('user', JSON.stringify(userAttr))
            this.$router.push({name: '主页' })
          } else {
               if (retCode ===-1){   
                  this.notify(2,"账号或密码错误，请重试")
               }

            }
          })
       } else {
        console.log('error submit!!')
        return false
        }
        })
      },
      //获取验证码
      getCode(){
        this.$refs.registerRuleForm.validateField('registerEmail',(error) => {
          if(error===""){
            var btn =document.getElementById("getCodeBtn")
            btn.setAttribute("disabled", true);
            let email = this.registerRuleForm.registerEmail
            var params = {email: email}
              requestVerificationCode(params).then(data => {
                let retCode = data.code
                if (retCode ===1) { 
                  this.notify(1,"验证码已发送，请查收")
                  var time = 60
                  btn.innerText=(time)+"秒"
                  var set=setInterval(function(){
                  btn.innerText=(--time)+"秒"
                  if(time==0){
                    btn.innerText="获取验证码"
                    btn.removeAttribute("disabled")
                  }
                  }, 1000)
                  setTimeout(function(){
                  clearInterval(set)
                  }, 61000)
                }else{
                  this.notify(2,"错误，请重试")
                }
            })          
          
              }
            })   
      },
      //开始注册
      handleStartRegisterSubmit(formName){
        this.$refs[formName].validate((valid) => {  
          if (valid) {
            this.registering = true;
            let email = this.registerRuleForm.registerEmail
            let verificationCode=this.registerRuleForm.verificationCode
            var Params = {email: email, verificationCode: verificationCode}

            checkverificationCode(Params).then(data => {
              this.registering = false;
              if (data ==="成功") {
                this.goToConfirmRegister()
              } else {

                }
            })

          } else {  

            console.log('error submit!!');
            return false;
          }
        });
      },
      //确定注册
      handleConfirmRegisterSubmit(formName){
        this.$refs[formName].validate((valid) => {    
          if (valid) {
            this.registering = true
            let email = this.registerRuleForm.registerEmail
            let nickname = this.registerDetailRuleForm.nickname
            let pass = this.registerDetailRuleForm.password
            var registerParams = {email: email, nickname: nickname,pass: pass}
            requestLogin(registerParams).then(data => {
            this.logining = false;
            if (data ==="成功") {
              this.notify(data,"登录成功")
              this.registering = false
                //  sessionStorage.setItem('user', JSON.stringify(user));
                //  this.$router.push({ path: '/table' });
              } else {


              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      //验证邮箱格式
      checkEmailForm(email){
        let ema = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        return  ema.test(email)
      },
      //密码是否可见
      changePassView(){
        let eyeLabel=document.getElementById("eyeLabel")
        let passwordInput=document.getElementById("passwordInput")
        if(eyeLabel.classList.contains('fa-eye')){
          eyeLabel.classList.remove("fa-eye")
          eyeLabel.classList.add("fa-eye-slash")
          passwordInput.type="text"
        }
        else{
          eyeLabel.classList.remove("fa-eye-slash")
          eyeLabel.classList.add("fa-eye")
          passwordInput.type="password"
        }
      },
      registerPassFocus(){
        this.showMessage=false
        document.getElementById("passInfo").style.display=""
      },
      goToLogin() {
        document.getElementById("register-card").style.display="none"
        document.getElementById("comfirm-register-card").style.display="none"
        document.getElementById("login-card").style.display=""
      },
      goToRegister() {
        document.getElementById("register-card").style.display=""
        document.getElementById("login-card").style.display="none"
        document.getElementById("login-card").style.display="none" 
      },
      goToConfirmRegister(){
        document.getElementById("comfirm-register-card").style.display=""
        document.getElementById("register-card").style.display="none"
        document.getElementById("login-card").style.display="none" 
      },
      notify(type,message){
        let typeMap={}
        typeMap[0]=['警告','warning']
        typeMap[1]=['成功','success']
        typeMap[2]=['错误','error']
        typeMap[3]=['提示','info']
        this.$notify({
          title:  typeMap[type][0],
          message: message,
          type:  typeMap[type][1],
        });
      },
      //设置cookie
      setCookie(c_name, c_pwd, exdays) {
          var exdate = new Date(); //获取时间
          exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
          //字符串拼接cookie
          window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
          window.document.cookie = "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
        },
      //读取cookie
      getCookie: function() {
        if (document.cookie.length > 0) {
                    var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('='); //再次切割
                        //判断查找相对应的值
                        if (arr2[0] == 'userName') {
                            this.loginRuleForm.loginEmail = arr2[1]; //保存到保存数据的地方
                          } else if (arr2[0] == 'userPwd') {
                            this.loginRuleForm.password = arr2[1];
                          }
                        }
                      }
                    },
      //清除cookie
      clearCookie: function() {
          this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      },

    }
}

  </script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .html{
    height: 100%;
  }
  .body{
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
  }
  .root{ 
    font-family: Helvetica, sans-serif,PingFang SC;
      height: 100%;
   /* height: 100%;*/
    position:absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    overflow:auto;
    text-align: center;
    background-image:url('../assets/background.jpg');
    background-size:100% 100%;
    background-repeat:no-repeat;
  }

  .box-card {
    width: 400px;
    height:auto;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

  }
  .switch{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    width: 400px;
    background-color: #f6f6f6;
    height: 58px;
    border-top: 1px solid #ebebeb;
    font-size: 16px;
    margin-left: -20px;
    margin-bottom : -20px;
  }
  .title{
    margin-top: 60px;
    color:#fff; 
    font-size:50px;
  }

  .card-title{
    color:#909399; 
    font-size:22px;
    text-align:left;
    margin-left: -314px;
  }
  .input{
    margin-top: 5px;
  }
  .login-button{
    width: 100%;
    margin-top: 20px;
  }
  .login-input{
    margin-top: 10px;
  }
  .login-options{
    margin-top: 12px;
    height: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background: #fff;
  }
  .login-cannotLogin{
    font-size: 14px;
    border:0;
    cursor:pointer;
    background-color: transparent;
    color: #8590a6;
    text-align: center;
    display: inline-block;
    height: auto;
    padding: 0;
    line-height: inherit;
    float: right;
  }
  .footer{
    /*position: absolute;
    bottom: 0px;*/
   /* left:50%;*/
   margin:0;
   padding: 0;
  /*  background-color: #DFE4ED;*/
    width: 100%;
    font-size: 12px;
    color: #666;
    height: 40px !important;
    text-align: center;
    margin-top: 10%;
  }
  .copyright{
    line-height: 45px;
    margin:  0 auto;
    width:600px;
    text-align:center;
    display:block;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .i-label{
    line-height: 1.5;
    cursor:pointer;
  }
  .pass-i{
    font-size:13px;
    color: rgb(130, 193, 195)
  }
  .pass-info{
    font-size:13px;
    line-height:1;
    color:#909399;
  }
  </style>