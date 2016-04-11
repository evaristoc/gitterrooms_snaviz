'use strict'

var socket = io.connect("http://localhost:3000/")
var counter = 0
var count = 0
var duration = 750
var n = 243
var now = new Date(Date.now() - duration)
var countAxis = d3.range(n).map(function() { return 0; });
var sstart = Date.now()

var w = $(".row").width()

var margin = {top: 6, right: 0, bottom: 20, left: 40},
    width = w - margin.right,
    height = 120 - margin.top - margin.bottom;

socket.on("add", function(ds){
	counter ++
	count ++
	$(".mc").html(counter)
	var mpm = Math.floor((counter / ((Date.now() - sstart) / 60000)) * 100) / 100
	$(".mpm").html(mpm)
})

var x = d3.time.scale()
    .domain([now - (n - 2) * duration, now - duration])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
    .y(function(d, i) { return y(d); });

var svg = d3.select("#map").append("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var axis = svg.append("g")
    .attr("class", "x_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(countAxis)
    .attr("class", "line");

var transition = d3.select({}).transition()
    .duration(750)
    .ease("linear");

ptick()

function ptick() {
  transition = transition.each(function() {
    // update the domains
    now = new Date();
    x.domain([now - (n - 2) * duration, now - duration]);
    y.domain([0, d3.max(countAxis)]);

    // push the accumulated count onto the back, and reset the count
    countAxis.push(Math.min(30, count));
    count = 0;

    // redraw the line
    svg.select(".line")
        .attr("d", line)
        .attr("transform", null);

    // slide the x-axis left
    axis.call(x.axis);

    // slide the line left
    path.transition()
        .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

    // pop the old data point off the front
    countAxis.shift();

  }).transition().each("start", ptick);
}
