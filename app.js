//var map = new Datamap({element: document.getElementById('map')});

var mapUrl = "https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-50m.json";
var meteoriteUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json"

var width = 960,
    height = 500;

var projection = d3.geo.kavrayskiy7(),
    color = d3.scale.category20(),
    graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


var g = svg.append("g");

var path = d3.geo.path()
    .projection(projection);

g.selectAll("path")
      .attr("d", path);

  
//
//var g = g.selectAll("path")
//     .attr("d", path);

var tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
      return "<span>Name: " + d.properties.name + "<br>Year: " + d.properties.year.slice(0, 4) + "<br>Classification: " + d.properties.recclass + "<br>Mass: " + d.properties.mass + "g</span>";
    });



svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

svg.append("path")
    .datum(graticule.outline)
    .attr("class", "graticule outline")
    .attr("d", path);

d3.json(mapUrl, function(error, world) {
  var countries = topojson.feature(world, world.objects.countries).features,
      neighbors = topojson.neighbors(world.objects.countries.geometries);

svg.selectAll(".country")
      .data(countries)
    .enter().insert("path", ".graticule")
      .attr("class", "country")
      .attr("d", path)
      .style("fill", function(d, i) { return color(d.color = d3.max(neighbors[i], function(n) { return countries[n].color; }) + 1 | 0); });
});

svg.call(tip);



d3.json(meteoriteUrl, function(data){
//    var meteorArr = [];
//    data.features.forEach(function(elem){ meteorArr.push(elem.properties.mass)});
    
    var max = d3.max(data.features, function(d){ return d.properties.mass});
    var min = d3.min(data.features, function(d){ return d.properties.mass});
    console.log(min, max);
    
    var r = d3.scale.linear().clamp([true]).domain([min, max]).range([1, 5]);
    svg.selectAll("circle").data(data.features).enter().append("circle")
        .attr("cx", function(d){return projection([d.properties.reclong, d.properties.reclat])[0];})
        .attr("cy", function(d){return projection([d.properties.reclong, d.properties.reclat])[1];})
        .attr("r", function(d) {
          if (d.properties.mass === null) {
            return r(min);
          } else {
            return r(d.properties.mass);
          }
        })
        .attr("fill-opacity", .25).style("fill", "purple")
        .attr("stroke-width", .25)
        .attr("stroke", "#EAFFD0")
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
});

var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 
});



function zoomed() {
  projection
      .translate(zoom.translate())
      .scale(zoom.scale());
}
svg.call(zoom);