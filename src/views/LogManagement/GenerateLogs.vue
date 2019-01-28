<template>
	<div id="generatelogs-root">
		<div id="the-main">
			<!-- <div id="title">
				<span>日志生成</span>&nbsp;&nbsp;
				<span>由自定义的Petri网生成事件日志文件</span>
			</div>-->
			<!-- 新增petri网信息 -->
			<form action class="content">
				<!-- 新增库所或变迁 -->
				<p>库所名称：
					<el-input class="width-300" size="small" v-model="place" placeholder="请输入库所名称"></el-input>&nbsp;&nbsp;
					<el-button size="small" type="primary" plain @click="addPlaceOrTransition('place')">添加库所</el-button>
				</p>
				<p>变迁名称：
					<el-input class="width-300" size="small" v-model="transition" placeholder="请输入变迁名称"></el-input>&nbsp;&nbsp;
					<el-button size="small" type="primary" plain @click="addPlaceOrTransition('transition')">添加变迁</el-button>
				</p>
				<!-- 插入流关系 -->
				<p>流关系方向：
					<el-select
						class="width-160"
						size="small"
						v-model="flowRelation.direction"
						placeholder="请选择流关系方向"
						@change="changeDirection"
					>
						<el-option label="库所到变迁" value="from place to transition"></el-option>
						<el-option label="变迁到库所" value="from transition to place"></el-option>
					</el-select>&nbsp;&nbsp;从&nbsp;&nbsp;
					<el-select
						class="width-160"
						size="small"
						v-model="flowRelation.from"
						:disabled="!flowRelation.directionFlag"
						:placeholder="flowRelation.fromPlaceholder"
					>
						<div v-show="flowRelation.fromPlaceToTransition">
							<el-option
								v-for="item in places"
								:key="item.placeId"
								:label="item.placeId"
								:value="item.placeId"
							></el-option>
						</div>
						<div v-show="flowRelation.fromTransitionToPlace">
							<el-option
								v-for="item in transitions"
								:key="item.transitionId"
								:label="item.transitionId"
								:value="item.transitionId"
							></el-option>
						</div>
					</el-select>&nbsp;&nbsp;到&nbsp;&nbsp;
					<el-select
						class="width-160"
						size="small"
						v-model="flowRelation.to"
						:disabled="!flowRelation.directionFlag"
						:placeholder="flowRelation.toPlaceholder"
					>
						<div v-show="flowRelation.fromPlaceToTransition">
							<el-option
								v-for="item in transitions"
								:key="item.transitionId"
								:label="item.transitionId"
								:value="item.transitionId"
							></el-option>
						</div>
						<div v-show="flowRelation.fromTransitionToPlace">
							<el-option
								v-for="item in places"
								:key="item.placeId"
								:label="item.placeId"
								:value="item.placeId"
							></el-option>
						</div>
					</el-select>&nbsp;&nbsp;
					<el-button size="small" type="primary" plain @click="addFlowRelation">添加流关系</el-button>
				</p>
			</form>

			<!-- petri网展示 -->
			<div id="network-outline">
				<div id="network"></div>
				<div
					id="network-corner"
					v-bind:class="{'corner-small':chosenPlace.start || chosenPlace.end || chosenFlowRelation.flag,'corner-normal':(chosenPlace.flag && !chosenPlace.start && !chosenPlace.end) || chosenTransition.flag}"
				>
					<!-- 选择库所 -->
					<div class="network-corner-content" v-show="chosenPlace.flag">
						<div v-if="chosenPlace.start">
							<p class="padding-left-15">库所编号：0</p>
							<p class="padding-left-15">开始库所 start</p>
						</div>
						<div v-else-if="chosenPlace.end">
							<p class="padding-left-15">库所编号：1</p>
							<p class="padding-left-15">结束库所 end</p>
						</div>
						<div v-else>
							<p class="padding-left-15">库所编号：1</p>
							<p class="padding-left-15">库所名称：</p>
							<el-input size="small" v-model="chosenPlace.name"></el-input>
							<p class="text-align-center">
								<el-button size="small" type="primary" plain @click="editPlaceOrTransition(chosenPlace)">修改</el-button>&nbsp;
								<el-button
									size="small"
									type="danger"
									plain
									@click="deletePlaceOrTransition(chosenPlace.id)"
								>删除</el-button>
							</p>
						</div>
					</div>
					<!-- 选择变迁 -->
					<div class="network-corner-content" v-show="chosenTransition.flag">
						<p class="padding-left-15">变迁编号：1</p>
						<p class="padding-left-15">变迁名称：</p>
						<el-input size="small" v-model="chosenTransition.name"></el-input>
						<p class="text-align-center">
							<el-button
								size="small"
								type="primary"
								plain
								@click="editPlaceOrTransition(chosenTransition)"
							>修改</el-button>&nbsp;
							<el-button
								size="small"
								type="danger"
								plain
								@click="deletePlaceOrTransition(chosenTransition.id)"
							>删除</el-button>
						</p>
					</div>
					<!-- 选择流关系 -->
					<div class="network-corner-content text-align-center" v-show="chosenFlowRelation.flag">
						<p>流关系从 {{chosenFlowRelation.from}} 到 {{chosenFlowRelation.to}}</p>
						<el-button size="small" type="danger" plain @click="deleteFlowRelation">删除</el-button>
					</div>
				</div>
				<img id="petriNetImg" src="../../assets/petriNet.png" alt>
			</div>

			<form action>
				<p>
					轨迹个数：
					<el-input class="width-300" size="small" v-model="traceNumber" placeholder="请输入事件日志中的轨迹个数"></el-input>&nbsp;&nbsp;
					噪声率：
					<el-input
						class="width-300"
						size="small"
						type="number"
						v-model="noiseRatio"
						min="0"
						max="100"
						placeholder="请输入事件日志中的噪声比率"
					>
						<template slot="append">&nbsp;%&nbsp;</template>
					</el-input>
				</p>
				<p>日志名称：
					<el-input class="width-300" size="small" v-model="eventlogName" placeholder="请输入事件日志中的轨迹个数"></el-input>&nbsp;
				</p>
				<div id="submit">
					<el-button size="small" type="primary" @click="submitPetri">提交</el-button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
	import { DataSet, Network } from "vis/index-network";
	import "vis/dist/vis-network.min.css";
	import { base } from "../../api/api";
	import { generateEventLog } from "../../api/api";

	export default {
		data: function() {
			return {
				place: "", //库所
				transition: "", //变迁
				flowRelation: {
					//流关系
					directionFlag: false, //是否已经选择流关系方向
					direction: "", //流关系方向
					fromPlaceToTransition: false, //流关系方向从库所到变迁
					fromTransitionToPlace: false, //流关系方向从变迁到库所
					from: "",
					to: "",
					fromPlaceholder: "请选择流关系方向", //源占位符
					toPlaceholder: "请选择流关系方向" //目标占位符
				},
				places: [
					//库所集
					{
						placeId: 0,
						placeName: "start"
					},
					{
						placeId: 1,
						placeName: "end"
					}
				],
				transitions: [
					//变迁集
				],
				flowRelations: [
					//流关系集
				],
				nodes: {},
				edges: {},
				chosenPlace: {
					//选择的库所
					id: 1,
					name: "",
					flag: false,
					start: false,
					end: false
				},
				chosenTransition: {
					//选择的变迁
					id: 2,
					name: "this",
					flag: false
				},
				chosenFlowRelation: {
					//选择的流关系
					id: "",
					from: "",
					to: "",
					flag: false
				},
				traceNumber: "",
				noiseRatio: "",
				eventlogName: "",
				currentProject: "" //当前的项目
			};
		},
		components: {},
		created: function() {
			this.getProjects();
		},
		mounted: function() {
			this.$nextTick(function() {
				this.draw();
			});
		},
		methods: {
			//查询元素在数组中的位置
			indexOf: function(arr, val) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] == val) {
						return i;
					}
				}
				return -1;
			},

			//删除数组中的元素
			remove: function(arr, val) {
				var index = indexOf(arr, val);
				if (index > -1) {
					arr.splice(index, 1);
				}
			},

			//绘制图形
			draw: function() {
				//创建结点数据集
				this.nodes = new DataSet([
					{ id: 0, label: "start", group: "start", title: "id:0" },
					{ id: 1, label: "end", group: "dots", title: "id:1" }
				]);

				// 创建边数据集
				this.edges = new DataSet();

				// 创建petri网
				var container = document.getElementById("network");
				var data = {
					nodes: this.nodes,
					edges: this.edges
				};
				var options = {
					nodes: {
						chosen: {
							node: function(values, id, selected, hovering) {
								values.color = "white";
								values.borderWidth = 2;
								if (id == 0) {
									values.borderColor = "white";
								} else {
									values.borderColor = "black";
								}
							}
						}
					},
					edges: {
						arrows: "to"
					},
					groups: {
						squares: {
							color: { background: "white", border: "black" },
							shape: "square"
						},
						dots: {
							color: { background: "white", border: "black" },
							shape: "dot"
						},
						start: {
							borderWidth: 0,
							color: { background: "white", border: "black" },
							size: 30,
							shape: "circularImage",
							image: require("../../assets/circle.png")
						}
					}
				};
				var network = new Network(container, data, options);
				var _this = this;

				//选择结点或者边
				network.on("select", function(event) {
					console.log(event);
					if (event.nodes.length != 0) {
						//选择结点
						var node = _this.nodes.get(event.nodes[0]);
						_this.chosenFlowRelation.flag = false;
						if (node.id == 0) {
							//选择的是开始库所
							_this.chosenTransition.flag = false;
							_this.chosenPlace = {
								flag: true,
								start: true,
								end: false
							};
						} else if (node.id == 1) {
							//选择的是结束库所
							_this.chosenTransition.flag = false;
							_this.chosenPlace = {
								flag: true,
								start: false,
								end: true
							};
						} else if (node.group == "dots") {
							//选择的结点是库所
							_this.chosenTransition.flag = false;
							_this.chosenPlace = {
								id: node.id,
								name: node.label,
								flag: true,
								start: false,
								end: false
							};
						} else if (node.group == "squares") {
							//选择的结点是变迁
							_this.chosenPlace.flag = false;
							_this.chosenTransition = {
								id: node.id,
								name: node.label,
								flag: true
							};
						}
					} else if (event.edges.length != 0) {
						//选择的边
						var edge = _this.edges.get(event.edges[0]);
						_this.chosenTransition.flag = false;
						_this.chosenPlace.flag = false;
						_this.chosenFlowRelation = {
							id: edge.id,
							from: edge.from,
							to: edge.to,
							flag: true
						};
					}
				});
			},

			//新增库所或变迁
			addPlaceOrTransition: function(placeOrTransition) {
				var numbers = this.nodes.getIds();
				var id = 0;
				for (var i = 0, numberTest = 1; i < numbers.length; i++) {
					if (numbers[i] > numberTest) {
						//id数组未按顺序递增
						id = numbers[i];
						break;
					}
					numberTest++;
				}
				if (i == numbers.length) {
					//id数组按顺序递增
					id = numbers.length;
				}
				if (placeOrTransition == "place") {
					//如果添加的是库所
					this.places.push({ placeId: id, placeName: this.place });
					this.nodes.add({
						id: id,
						label: this.place,
						group: "dots",
						title: "id:" + id
					});
				} else if (placeOrTransition == "transition") {
					//如果添加的是变迁
					this.transitions.push({
						transitionId: id,
						transitionName: this.transition
					});
					this.nodes.add({
						id: id,
						label: this.transition,
						group: "squares",
						title: "id:" + id
					});
				}
			},

			//编辑库所或变迁
			editPlaceOrTransition: function(chosenItem) {
				if (this.nodes.get(chosenItem.id).group == "squares") {
					//编辑的是变迁
					for (var i = 0; i < this.transitions.length; i++) {
						if (this.transitions[i].transitionId == chosenItem.id) {
							this.transitions[i].transitionName = chosenItem.name;
							break;
						}
					}
				} else if (this.nodes.get(chosenItem.id).group == "dots") {
					//编辑的是库所
					for (var i = 0; i < this.places.length; i++) {
						if (this.places[i].placeId == chosenItem.id) {
							this.places[i].placeName = chosenItem.name;
							break;
						}
					}
				}
				this.nodes.update({
					id: chosenItem.id,
					label: chosenItem.name
				});
			},

			//删除库所或变迁
			deletePlaceOrTransition: function(id) {
				var index = 0;
				if (this.nodes.get(id).group == "squares") {
					//删除的是变迁
					for (var i = 0; i < this.transitions.length; i++) {
						if (this.transitions[i].transitionId == id) {
							index = i;
							break;
						}
					}
					this.transitions.splice(index, 1);
				} else if (this.nodes.get(id).group == "dots") {
					//删除的是库所
					for (var i = 0; i < this.places.length; i++) {
						if (this.places[i].placeId == id) {
							index = i;
							break;
						}
					}
					this.places.splice(index, 1);
				}
				this.nodes.remove(id);
			},

			//选择边的方向（从库所到变迁或从变迁到库所）
			changeDirection: function(value) {
				console.log(value);
				this.flowRelation.directionFlag = true;
				if (this.flowRelation.direction == "from place to transition") {
					//选择从库所到变迁
					this.flowRelation.fromPlaceToTransition = true;
					this.flowRelation.fromTransitionToPlace = false;
					this.flowRelation.fromPlaceholder = "请选择库所";
					this.flowRelation.toPlaceholder = "请选择变迁";
				} else if (
					this.flowRelation.direction == "from transition to place"
				) {
					//选择从变迁到库所
					this.flowRelation.fromPlaceToTransition = false;
					this.flowRelation.fromTransitionToPlace = true;
					this.flowRelation.fromPlaceholder = "请选择变迁";
					this.flowRelation.toPlaceholder = "请选择库所";
				}
			},

			//添加流关系
			addFlowRelation: function() {
				this.edges.add({
					from: this.flowRelation.from,
					to: this.flowRelation.to
				});
				this.flowRelations.push({
					from: this.flowRelation.from,
					to: this.flowRelation.to
				});
			},

			//删除流关系
			deleteFlowRelation: function() {
				var index = 0;
				for (var i = 0; i < this.flowRelations.length; i++) {
					if (
						this.chosenFlowRelation.from ==
							this.flowRelations[i].from &&
						this.chosenFlowRelation.to == this.flowRelations[i].to
					) {
						index = i;
						break;
					}
				}
				this.flowRelations.splice(index, 1);
				this.edges.remove(this.chosenFlowRelation.id);
			},

			//获取项目信息
			getProjects: function() {
				this.currentProject = JSON.parse(
					sessionStorage.getItem("currentProject")
				);
			},

			//提交petri网信息
			submitPetri: function() {
				if (this.traceNumber == "") {
					this.$notify({
						title: "警告",
						message: "轨迹个数不能为空",
						type: "warning"
					});
					return;
				}
				if (this.noiseRatio == "") {
					this.$notify({
						title: "警告",
						message: "噪声率不能为空",
						type: "warning"
					});
					return;
				}
				if (this.eventlogName == "") {
					this.$notify({
						title: "警告",
						message: "日志名称不能为空",
						type: "warning"
					});
					return;
				}
				var placesTemp = {};
				for (var i = 0; i < this.places.length; i++) {
					placesTemp[this.places[i].placeId] = this.places[i];
				}
				var transitionsTemp = {};
				for (var i = 0; i < this.transitions.length; i++) {
					transitionsTemp[
						this.transitions[i].transitionId
					] = this.transitions[i];
				}
				var obj = {
					petriNet: {
						places: placesTemp,
						transitions: transitionsTemp,
						flowRelations: this.flowRelations
					},
					eventlogName: this.eventlogName,
					projectId: this.currentProject.pid,
					traceNumber: this.traceNumber,
					noiseRatio: this.noiseRatio / 100
				};
				console.log(obj);
				generateEventLog(obj).then(data => {
					console.log(data);
					if (data.code == -1) {
						this.$notify.error({
							title: "提示",
							message: "日志名已存在，请重新上传！"
						});
					} else {
						this.$notify({
							title: "成功",
							message: "恭喜你，成功生成事件日志！",
							type: "success"
						});
					}
				});
			}
		}
	};
</script>

<!-- 增加"scoped"属性为了限制CSS仅限于当前文件使用 -->
<style scoped>
	p {
		margin: 16px 0;
	}

	#generatelogs-root {
		/* background-color: whitesmoke; */
		border-top: 1px solid #e8e8e8;
		margin-top: 10px;
	}

	#title {
		border-bottom: 1px solid #e8e8e8;
		padding-bottom: 15px;
	}

	#title > span:nth-child(1) {
		font-size: 20px;
		font-weight: 400;
		vertical-align: middle;
	}

	#title > span:nth-child(2) {
		font-size: 12px;
		vertical-align: middle;
		color: rgba(0, 0, 0, 0.45);
	}

	#the-main {
		background-color: white;
		padding: 0 15px;
		width: 800px;
		margin: 0 auto;
	}

	#network-outline {
		margin: 20px auto;
		width: 800px;
	}

	#network {
		border: 1px solid #ebeef5;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		height: 600px;
	}

	#petriNetImg {
		height: 80px;
		position: absolute;
		margin-top: -80px;
	}

	#network-corner {
		/* position: absolute;
																													    margin-top: -202px;
																													    margin-left: 498px;
																													    width: 200px;
																													    height: 200px; */
		border-top: 1px solid #ebeef5;
		border-left: 1px solid #ebeef5;
		border-bottom: 0px;
		border-right: 0px;
		box-shadow: -2px -2px 12px -3px rgba(0, 0, 0, 0.1);
		background-color: white;
		z-index: 2;
	}

	#submit {
		border-top: 1px solid #e8e8e8;
		padding-top: 15px;
	}

	.corner-small {
		position: absolute;
		margin-top: -102px;
		margin-left: 598px;
		width: 200px;
		height: 100px;
	}

	.corner-normal {
		position: absolute;
		margin-top: -202px;
		margin-left: 498px;
		width: 200px;
		height: 200px;
	}

	.network-corner-content {
		padding: 0 15px;
	}

	/* css样式类 */

	.width-300 {
		width: 300px !important;
	}

	.width-160 {
		width: 160px;
	}

	.width-80 {
		width: 80px;
	}

	.margin-bottom-16 {
		margin-bottom: 16px;
	}

	.text-align-center {
		text-align: center;
	}

	.padding-left-15 {
		padding-left: 15px;
	}

	/* 清除浮动的副作用 */

	.clearfix:after {
		content: "";
		display: table;
		clear: both;
	}

	.relative {
		position: relative;
	}
</style>
