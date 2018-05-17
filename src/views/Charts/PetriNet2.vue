<template>
 	<div class="main">
 		
 	</div>
</template>

<script>
/**
*	圆的起始：cx，cy；矩形的起始：x，y
*
*
*/
import d3 from 'd3'  
export default {
	data() {
        return {
        	//结点
        	nodes:[ 
        	  { name: "桂林" }, { name: "广州" },
              { name: "厦门" }, { name: "杭州" },
              { name: "上海" }, { name: "青岛" },
              { name: "天津" } 
            ],
            //边
 			edges:[ 
 			  //源->目标
 			  { source : 0 , target: 1 } , { source : 0 , target: 2 ,type: "resolved"} ,
              { source : 0 , target: 3 } , { source : 1 , target: 4 ,type: "resolved"} ,
              { source : 1 , target: 5 } , { source : 1 , target: 6 ,type: "resolved"} 
            ],
            width:600,
            height:600,
		}
    },
    methods:{
    	
    },
   	mounted(){
   		var svg = d3.select('body')
					.append("svg")
					.attr("width",this.width)
					.attr("height",this.height);
   		//定义一个力导向图的布局
  		var force = d3.layout.force()
	      .nodes(this.nodes) //指定节点数组
	      .links(this.edges) //指定连线数组
	      .size([this.width,this.height]) //指定作用域范围
	      .linkDistance(150) //指定连线长度
	      .charge([-400]) //相互之间的作用力
	    //使力学作用生效
	    force.start()
	    console.log(this.nodes)
		console.log(this.edges)
		var defs = svg.append("defs")
		
		var color = d3.scale.category20()
		//箭头
		var marker=
		    svg.append("marker")
		    //.attr("id", function(d) { return d; })
		   	.attr("id", "resolved")
		    .attr("markerUnits","strokeWidth")//设置为strokeWidth箭头会随着线的粗细发生变化
		    .attr("markerUnits","userSpaceOnUse")
		    .attr("viewBox", "0 -5 10 10")//坐标系的区域
		    .attr("refX",10)//箭头坐标
		    .attr("refY", -1)
		    .attr("markerWidth", 6)//标识的大小
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
		    .attr("stroke-width",1)//箭头宽度
		    .append("path")
		    .attr("d", "M0,-5L10,0L0,5")//箭头的路径
		    .attr('fill','#000000');//箭头颜色
		//添加连线 
		var svg_edges = svg.selectAll("line")
		     .data(this.edges)
		     .enter()
		     .append("line")
		      .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y+10; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y+10; })
		     .style("stroke","#ccc")
		     .style("stroke-width",1)
		      .attr("marker-end", "url(#resolved)" );//根据箭头标记的id号标记箭头

		//添加节点			
		// var svg_nodes = svg.selectAll("circle")
		// 					.data(this.nodes)
		// 					.enter()
		// 					.append("circle")
		// 					.attr("r",20)
		// 					.style("fill",function(d,i){
		// 						return color(i);
		// 					})
		// 					.call(force.drag);	//使得节点能够拖动
		//矩形
		var svg_nodes = svg.selectAll("rect")
							.data(this.nodes)
							.enter()
							.append("rect")
							.attr("width",20)
							.attr("height",20)
							.attr("cx",function(d){
								return d.x
							})
							.attr("cy",function(d){
								return d.y
							})
							.style("fill",function(d,i){
								return color(i);
							})
							.call(force.drag);	//使得节点能够拖动
		
		//添加描述节点的文字
		var svg_texts = svg.selectAll("text")
							.data(this.nodes)
							.enter()
							.append("text")
							.style("fill", "black")
							.attr("dx", 20)
							.attr("dy", 8)
							.text(function(d){
								return d.name;
							});
		force.on("tick", function(){	//对于每一个时间间隔
			 //更新连线坐标
			 svg_edges.attr("x1",function(d){ return d.source.x; })
			 		.attr("y1",function(d){ return d.source.y+10; })
			 		.attr("x2",function(d){ return d.target.x; })
			 		.attr("y2",function(d){ return d.target.y+10; });
			 
			 //更新节点坐标
			 svg_nodes.attr("x",function(d){ return d.x; })
			 		.attr("y",function(d){ return d.y; });

			 //更新文字坐标
			 svg_texts.attr("x", function(d){ return d.x; })
			 	.attr("y", function(d){ return d.y; });
		})	
   	}

}
</script>

<style scoped>
.main{
}

</style>
