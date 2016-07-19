//var map = new Datamap({element: document.getElementById('map')});

var mapUrl = "world-110m2.json";

var width = 1260,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .scale(200)
    .rotate([-180,0]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").append("g");

//g.append("rect")
//    .attr("class", "overlay")
//    .attr("x", -width / 2)
//    .attr("y", -height / 2)
//    .attr("width", width)
//    .attr("height", height);

// load and display the World
d3.json(mapUrl, function(error, topology) {
    if(error) return console.error(error);
    
    svg.append("path").datum(topojson.feature(topology, topology.objects.countries)).attr("d", d3.geo.path().projection(d3.geo.mercator()));
});

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
});

svg.call(zoom);




