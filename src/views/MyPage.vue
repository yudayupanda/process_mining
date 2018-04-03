<template>
	<el-container class="root">
		<el-header class="root_header">
			<el-col :span="4" push="19" class="dropdown_container">
			    <el-dropdown trigger="hover">
			    	<span class="el-dropdown-link user_info_dropdown">
			        	我的项目<i class="el-icon-arrow-down el-icon--right"></i>
			    	</span>
				    	<el-dropdown-menu slot="dropdown">
				        <el-dropdown-item>姓名</el-dropdown-item>
				        <el-dropdown-item>邮箱</el-dropdown-item>
				        <el-dropdown-item>我的项目</el-dropdown-item>
				        <el-dropdown-item>注销</el-dropdown-item>
			    	</el-dropdown-menu>
			    </el-dropdown>
			</el-col>
		</el-header>
		<el-container class="main_container">
			<el-aside width="230px" class="sidebar">
				<el-row class="user_info">
					<el-row><label class="user_name">姓名:hhhh</label></el-row>
					<el-row><a class="project_name">项目名:</a></el-row>
				</el-row>
				<el-row class="project_operation">
					<!-- <div><span>日志管理</span></div>
					<div><span>原始日志</span></div>
					<div><span>规范化日志</span></div>
					<div><span>事件日志</span></div> -->
					<el-col :span="24" class="project_operation_menu_container">
						<!-- <h5>自定义颜色</h5> -->
						<el-menu
						default-active="2"
						class="el-menu-vertical-demo project_operation_menu"
						@open="handleOpen"
						@close="handleClose"
						background-color="#424242"
						text-color="#fff"
						active-text-color="#ffd04b">
							<el-submenu index="1">
								<template slot="title">
									<!-- <i class="el-icon-location"></i> -->
									<span>日志管理</span>
								</template>
								<!-- <el-menu-item-group> -->
									<!-- <template slot="title">分组一</template> -->
								<el-menu-item index="1-1">源生日志</el-menu-item>
								<el-menu-item index="1-2">规范化日志</el-menu-item>
								<el-menu-item index="1-3">事件日志</el-menu-item>
							</el-submenu>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
	    	<el-main>
	    	</el-main>
		</el-container>
	</el-container>
</template>
<style scoped>
.root {
  	height: 717px;
}
.root_header{
    background-color: #353644;
    color: #333;
    /*text-align: right;*/
    line-height: 60px;
}
.dropdown_container{

}
.el-dropdown-item{

}
.user_info_dropdown {
	font-size: 20px;
}

.sidebar {
    background-color: #424242;
    color: #fff;
    text-align: center;
    height: 657px;
}

.user_info {
	line-height:45px;
	/*text-align: center;*/
}
.project_operation {
	/*border: solid;*/
	margin-top:5px; 
}
.project_operation_menu_container {

}
.project_operation_menu {
	/*margin-left: 20px;*/
	margin:3px; 
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
}
</style>
