

$(document).ready(function() {
    var map = new L.Map("map").setView([42.355, -71.095], 12)
	.addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
   
    
    var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");

    function tooltipText(d){
	var p = d.properties;
	var s = "# Households " + p.hh10 + 
	    "  # Vehicles" + p.veh_tot +
	    "  Vehilces Per Household" +p.veh_tot/p.hh10;
	return s;
	
    }

    // using this tutorial: http://bost.ocks.org/mike/leaflet/
    var file = "../../proc/ma_municipalities.geojson";
 //   var file = "../../proc/grid_attr.geojson";
    var file = "data/grid_attr_filtBOS.geojson";

    d3.json(file, function(collection){

	function getMetric(d){
	    return d.properties.pass_veh/d.properties.hh10;
	}
	console.log(collection.features);
	var metricArray = _(collection.features).map(getMetric);
	
	var colorScale = d3.scale.linear()
	    .domain([_(metricArray).min(), 1, 3])//_(metricArray).max()])
	    .interpolate(d3.interpolateHcl)
	    //.range(["#E7F670", "#371C11"]); // orange
	//.range([ "#8DF69F", "#6DC884", "#0C2519"]); // greens
	    .range(['blue', 'white', 'red']);
	function getColor(d){
	    return colorScale(getMetric(d));
	}
	var transform = d3.geo.transform({point: projectPoint}),
	path = d3.geo.path().projection(transform);

	var feature = g.selectAll("path")
	    .data(collection.features)
	    .enter().append("path");

	map.on("viewreset", reset);
	reset();

	// Reposition the SVG to cover the features.
	function reset() {
	    var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

	    svg .attr("width", bottomRight[0] - topLeft[0])
		.attr("height", bottomRight[1] - topLeft[1])
		.style("left", topLeft[0] + "px")
		.style("top", topLeft[1] + "px");

	    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

	    feature.attr("d", path);
	    feature
		.style("fill", function(d){
		    //console.log(d);
		    return getColor(d);
		    return (d.properties.hh10>100)?"red":"blue";
		})
		.on("mouseover", function(d){
		    //console.log(d);
		    tooltip.style("visibility", "visible");
		    tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		    tooltip.text(tooltipText(d));

		})
		.on("mouseout", function(d){
		    tooltip.style("visibility", "hidden");
		});
	}

	// Use Leaflet to implement a D3 geometric transformation.
	function projectPoint(x, y) {
	    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	    this.stream.point(point.x, point.y);
	}
    });
});
