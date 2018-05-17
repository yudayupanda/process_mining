<template>
 	<div class="main">	
 	</div>
</template>

<script>
import d3 from 'd3'  
export default {
	data() {
        return {
        }
    },
    methods:{  
    },
    created(){
    		var node_height = 20
    		var node_width = 20
    	//结点
        	var nodes=[ 
        	  { name: "桂林",type:'0'}, { name: "广州" ,type:'0'},
              { name: "厦门" ,type:'1'}, { name: "杭州",type:'0' },
              { name: "上海" ,type:'1'}, { name: "青岛" ,type:'0'},
              { name: "天津",type:'1' } 
            ]
            //边
 			var links=[ 
 			  //源->目标
 			  { source : 0 , target: 1 } , { source : 0 , target: 2 ,type: "arrow"} ,
              { source : 0 , target: 3 } , { source : 1 , target: 4 ,type: "arrow"} ,
              { source : 1 , target: 5 } , { source : 1 , target: 6 ,type: "arrow"} 
            ]
		  

		  
		var w = 960,  
		    h = 800;  
		  
		var force = d3.layout.force()  
		    .nodes(d3.values(nodes))  
		    .links(links)  
		    .size([w, h])  
		    .linkDistance(60)  
		    .charge(-300)  
		    .on("tick", tick)  
		    .start();  
		  
		var svg = d3.select("body").append("svg:svg")  
		    .attr("width", w)  
		    .attr("height", h);  
		var color = d3.scale.category20()  
		//(1)创建箭头  
		svg.append("svg:defs").selectAll("marker")  
		    .data(["arrow"])  
		  .enter().append("svg:marker")  
		    .attr("id", String)  
		    .attr("viewBox", "0 -5 10 10")  
		    //refx和refy调箭头的位置
		    .attr("refX", 10)  
		    .attr("refY", 0)  
		    .attr("markerWidth", 6)  
		    .attr("markerHeight", 6)  
		    .attr("orient", "auto")  
		    .append("svg:path")  
		    .attr("d", "M0,-5 L10,0 L0,5");
 
		//(2)根据连线类型引用上面创建的标记  
		var path = svg.append("svg:g").selectAll("path")  
		    .data(force.links())  
		    .enter().append("svg:path")  
		    .attr("class", "link")  
		//    .attr("marker-end", function(d) { return "url(#" + "arrow" + ")"; });  
		 
		// var circle = svg.append("svg:g").selectAll("circle")  
		// 	//绑定数据
		//     .data(force.nodes())  
		//     .enter()
		//     //添加类型
		//     .append("svg:circle")  
		//     .attr("r", 6)
		//     .style("fill",function(d,i){
  //        		return color(i);
  //    		})
		//     .attr("class","circle")
		//     .call(force.drag)


		var rect = svg.append("svg:g").selectAll("rect")  
			//绑定数据
		    .data(force.nodes())  
		    .enter()
		    //添加类型
		    .append("svg:rect")  
		    .attr("width", node_width)
		    .attr("height",node_height)
		 	.attr("rx",function(d){
		 		var rx_t = 0
		 		switch(d.type){
		 			case '0':
		 				rx_t = node_width/2
		 			break;
		 			case '1':
		 				rx_t = 0
		 			break
		 			case '2':
		 				rx_t = 0
		 			break
		 			default:
		 			break
		 		}
		 		
         		return rx_t
     		})
		 	.attr("ry",function(d){
		 		var rx_t = 0
		 		switch(d.type){
		 			case '0':
		 				rx_t = node_height/2
		 			break;
		 			case '1':
		 				rx_t = 0
		 			break
		 			case '2':
		 				rx_t = 0
		 			break
		 			default:
		 			break
		 		}
		 
         		return rx_t
     		})
		 	.style("fill",function(d,i){
         		return color(i);
     		})
		    .call(force.drag)

		  
		var text = svg.append("svg:g").selectAll("g")  
		    .data(force.nodes())  
		  .enter().append("svg:g");  
		  
		// A copy of the text with a thick white stroke for legibility.  
		text.append("svg:text")  
		    .attr("x", 8)  
		    .attr("y", ".31em")  
		    .attr("class", "shadow")  
		    .text(function(d) { return d.name; });  
		  
		text.append("svg:text")  
		    .attr("x", 8)  
		    .attr("y", ".31em")  
		    .text(function(d) { return d.name; });  
  
		// 使用椭圆弧路径段双向编码。  
		function tick() {  
		//(3)打点path格式是：Msource.x,source.yArr00,1target.x,target.y  
		  path.attr("d", function(d) {
		  	var t_x = d.target.x
		  	var t_y = d.target.y
		  	var four_mid_points = [
		  		{x:(t_x+6),y:t_y},
		  		{x:(t_x+12),y:(t_y+6)},
		  		{x:(t_x+6),y:(t_y+12)},
		  		{x:(t_x),y:(t_y+6)},
		  	]
		  	var d_x = d.source.x
		  	var d_y = d.source.y
		  	var min = -1
		  	var c_p = -1
		  	for(var i in four_mid_points){
		  		var point = four_mid_points[i]
		  		var dxx = point.x - d_x
		  		var dyy = point.y - d_y
		  		var distance = Math.sqrt(dxx * dxx + dyy * dyy)
		  		if(min === -1){
		  			min = distance
		  			c_p = point
		  		}else{
		  			if(distance<min){
		  				min = distance
		  				c_p = point
		  			}
		  		}
		  	}
		
		  	
		    var dx = d.target.x - d.source.x,//增量  
		        dy = d.target.y - d.source.y,  
		        dr = Math.sqrt(dx * dx + dy * dy);  
		    // return "M" + d.source.x + ","   
		    // + (d.source.y+node_height/2) + "A" + dr + ","   
		    // + dr + " 0 0,1 " + c_p.x + ","   
		    // + (c_p.y); 
		     return "M" + d.source.x + ","   
		    + (d.source.y) + "A" + dr + ","   
		    + dr + " 0 0,1 " + d.target.x + ","   
		    + (d.target.y);  
		  });  
		  
		  // circle.attr("transform", function(d) {  
		  //   return "translate(" + d.x + "," + d.y + ")";  
		  // });
		  //更新节点坐标
		//圆
  // rect.attr("x", function(d) {
  //   return d.x
  // }).attr("y", function(d) {
  //   return d.y
  // })
  		rect.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
		  
		  text.attr("transform", function(d) {  
		    return "translate(" + d.x + "," + d.y + ")";  
		  });  
		}  
    },
   	mounted(){
   		this.$nextTick(function() {
   			
   		})
   		
	}
}
</script>

<style>
.main{
}
path.link {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}

/*marker#licensing {
  fill: green;
}*/

/*path.link.licensing {
  stroke: green;
}

path.link.resolved {
  stroke-dasharray: 0,2 1;
}*/

circle {
  fill: #ccc;
  stroke: #333;
  stroke-width: 1.5px;
}

text {
  font: 10px sans-serif;
  pointer-events: none;
}

text.shadow {
  stroke: #fff;
  stroke-width: 3px;
  stroke-opacity: .8;
}
</style>
