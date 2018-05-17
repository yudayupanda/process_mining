<template>
 	<div class="main">
 		
 	</div>
</template>

<script>
import d3 from 'd3'  
export default {
	data() {
        return {
        	var links:[  
			  {source: "Microsoft", target: "Amazon", type: "licensing"},  
			  {source: "Microsoft", target: "HTC", type: "licensing"},  
			  {source: "Samsung", target: "Apple", type: "suit"},  
			  {source: "Motorola", target: "Apple", type: "suit"},  
			  {source: "Nokia", target: "Apple", type: "resolved"},  
			  {source: "HTC", target: "Apple", type: "suit"},  
			  {source: "Kodak", target: "Apple", type: "suit"},  
			  {source: "Microsoft", target: "Barnes & Noble", type: "suit"},  
			  {source: "Microsoft", target: "Foxconn", type: "suit"},  
			  {source: "Oracle", target: "Google", type: "suit"},  
			  {source: "Apple", target: "HTC", type: "suit"},  
			  {source: "Microsoft", target: "Inventec", type: "suit"},  
			  {source: "Samsung", target: "Kodak", type: "resolved"},  
			  {source: "LG", target: "Kodak", type: "resolved"},  
			  {source: "RIM", target: "Kodak", type: "suit"},  
			  {source: "Sony", target: "LG", type: "suit"},  
			  {source: "Kodak", target: "LG", type: "resolved"},  
			  {source: "Apple", target: "Nokia", type: "resolved"},  
			  {source: "Qualcomm", target: "Nokia", type: "resolved"},  
			  {source: "Apple", target: "Motorola", type: "suit"},  
			  {source: "Microsoft", target: "Motorola", type: "suit"},  
			  {source: "Motorola", target: "Microsoft", type: "suit"},  
			  {source: "Huawei", target: "ZTE", type: "suit"},  
			  {source: "Ericsson", target: "ZTE", type: "suit"},  
			  {source: "Kodak", target: "Samsung", type: "resolved"},  
			  {source: "Apple", target: "Samsung", type: "suit"},  
			  {source: "Kodak", target: "RIM", type: "suit"},  
			  {source: "Nokia", target: "Qualcomm", type: "suit"}  
			],
			nodes:{}, 
            width:600,
            height:600,

		}
    },
    methods:{
    	
    },
   	mounted(){
   		//创建箭头标记（marker）
   		svg.append("svg:defs").selectAll("marker")  
		    .data(["suit", "licensing", "resolved"])  
		  	.enter().append("svg:marker")  
		    .attr("id", String)  
		    .attr("viewBox", "0 -5 10 10")  
		    .attr("refX", 15)  
		    .attr("refY", -1.5)  
		    .attr("markerWidth", 6)  
		    .attr("markerHeight", 6)  
		    .attr("orient", "auto")  
		  	.append("svg:path")  
		    .attr("d", "M0,-5L10,0L0,5")
		//根据连线类型引用上面创建的标记
		var path = svg.append("svg:g").selectAll("path")  
		    .data(force.links())  
		  	.enter().append("svg:path")  
		    .attr("class", function(d) { return "link " + d.type; })  
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
		//打点path,格式是：Msource.x,source.yArr00,1target.x,target.y
		path.attr("d", function(d) {  
			  var dx = d.target.x - d.source.x,//增量  
			      dy = d.target.y - d.source.y,  
			      dr = Math.sqrt(dx * dx + dy * dy);  
			  return "M" + d.source.x + ","   
			  + d.source.y + "A" + dr + ","   
			  + dr + " 0 0,1 " + d.target.x + ","   
			  + d.target.y;  
		})
		this.links.forEach(function(link) {  
		  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});  
		  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});  
		});   			
   	}

}
</script>

<style scoped>
.main{
}
path.link {  
  fill: none;  
  stroke: #666;  
  stroke-width: 1.5px;  
}  
  
marker#licensing {  
  fill: green;  
}  
  
path.link.licensing {  
  stroke: green;  
}  
  
path.link.resolved {  
  stroke-dasharray: 0,2 1;  
}  
  
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
