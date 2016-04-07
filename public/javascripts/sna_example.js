var data = {"nodes":[], "links":[]};
var nodes = [];
var relations = {};
var param = {"tw":"950", "th":"500"};
var svg = d3
    .select("body #chart")
    .append("svg")
    .attr("width", param.tw).attr("height", param.th)

    

var force = d3.layout.force()
            .nodes(data.nodes)
            .links(data.links)
            .gravity(.05)
            .distance(100)
            .charge(-100)
            .size([param.tw, param.th]);

   
var link = svg
    .selectAll("graph.link");

var node = svg
    .selectAll("graph.node");

//Toggle stores whether the highlighting is on
var toggle = 0;
//Create an array logging what is connected to what
var linkedByIndex = {};
            
var socket = io.connect("http://localhost:3000/"); 

socket.on("add", function(ds){
    
    var newdata = datatreatment(ds); // see datatreatment function at the bottom of this script
    var newlinks = newdata[1];
    
    console.log("data ", data);
    console.log("newdata ", newdata);

    for (i = 0; i < data.nodes.length; i++) {
        linkedByIndex[i + "," + i] = 1;
    };
    data.links.forEach(function (d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });
    
    // brute-force: removing existing circles, lines and texts
    $("circle").remove()
    $("text").remove()
    $("line").remove()



    // update links
    
    link = link.data(data.links)
    
    link
      .enter()
      .append("g")
      
    link
        .attr({
          class : function(d){return "graph link "+data.links.indexOf(d);},
        })
        
    link
      .insert("line", ".node")
      .style("stroke-width", ".7px")
      .style("stroke", "#aaa");

  
    
    // update nodes
    
    node = node.data(data.nodes);
    
    node
      .enter()
      .append("g")
    
    node
      .attr({
        "class" : function(d){return "graph node "+d.name},
      })
      .call(force.drag)
      .on("dblclick", connectedNodes); // connected Nodes functionality at the bottom of this function...
    
    
    node
      .append("circle")
      .attr({
        r : function(d){return d.size.toString()},
        fill :function(d){return d.colour},
      })

    node
      .append("text")
      .attr({
        "dx" : "12",
        "dy" : ".35em"
      })
      .style("font-size","11px")
      .text(function(d) { return d.name })
    
    
    // for the ticking function had to use jQuery so a bit of "brute force"
    
    force.on("tick", function() {
        $("line").each(function( index ){
          //console.log( data.links[ index ].source.x );
          $(".link."+index).children("line").attr("x1",data.links[ index ].source.x)
          $(".link."+index).children("line").attr("x2",data.links[ index ].target.x)
          $(".link."+index).children("line").attr("y1",data.links[ index ].source.y)
          $(".link."+index).children("line").attr("y2",data.links[ index ].target.y)          
          
        })
        
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
    });


    // This function looks up whether a pair are neighbours
    function neighboring(a, b) {
        return linkedByIndex[a.index + "," + b.index];
    }

    // This function will connect-disconnect links associated to a selected node
    function connectedNodes() {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes and links
            d = d3.select(this).node().__data__;
            node.style("opacity", function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
            });
            link.style("opacity", function (o) {
                return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
            });
            toggle = 1;
        } else {
            //Put them back to opacity=1
            node.style("opacity", 1);
            link.style("opacity", 1);
            toggle = 0;
        }
    }

  
  force.start();
        
});


// A function that will take the data used for this project (defined in a global function) and re-start/update with data coming from server
// OBS: Brute force and INCOMPLETED !!! But OK for demo...
var datatreatment = function(ds){

    var lll = [];
    var nn = null;
    var nnn = [];
    
    nodes.forEach(function(v,i){data.nodes[i].colour = "#555";})
    
    if (nodes.indexOf(ds.name) == -1){
        nodes.push(ds.name);
        relations[ds.name] = [];
        nn = {"name":ds.name, "group":nodes.indexOf(ds.name), colour:"blue", size:5};
        nnn.push(nn);
        for (var ii = 0; ii < ds.mentions.length; ii++) {
            console.log("in mentions ", ds.mentions[ii]);
            var l = ds.mentions[ii];
            if (relations[ds.name].indexOf(l) == -1) {
                if (nodes.indexOf(l) == -1) {
                    nodes.push(l);
                    relations[l] = [];
                    nn = {"name":l, "group":nodes.indexOf(l), colour:"red", size:5};
                    nnn.push(nn);
                }
                relations[ds.name].push(l);
                lll.push({"source":nodes.indexOf(ds.name), "target":nodes.indexOf(l), "weigth": 8})
            }else{
              data.nodes[nodes.indexOf(l)].colour = "red";
            };
        }
        
    }else{
        data.nodes[nodes.indexOf(ds.name)].size++;
        data.nodes[nodes.indexOf(ds.name)].colour = "blue";
        for (var ii = 0; ii < ds.mentions.length; ii++) {
            console.log("in mentions ", ds.mentions[ii]);
            var l = ds.mentions[ii];
            if (relations[ds.name].indexOf(l) == -1) {
                if (nodes.indexOf(l) == -1) {
                    nodes.push(l);
                    relations[l] = [];
                    nn = {"name":l, "group":nodes.indexOf(l), colour:"red", size:5};
                    nnn.push(nn);
                }
                relations[ds.name].push(l);
                lll.push({"source":nodes.indexOf(ds.name), "target":nodes.indexOf(l), "weigth": 8})
            }else{
              data.nodes[nodes.indexOf(l)].colour = "red";
            };
        }     
    };
    console.log(nodes, relations);
    if (nnn) {
        for (var kk = 0; kk < nnn.length; kk++) {
            data.nodes.push(nnn[kk]);
        }
    };
    for (var jj = 0; jj < lll.length; jj++) {
        data.links.push(lll[jj]);
    };
    return [nnn, lll]
}