var ViewModel = function(options, selectedIndex){
    this.options = options;
    this.selectedIndex = ko.observable(selectedIndex);
    
    this.selectedMetric = ko.computed(function(){
	return this.options[this.selectedIndex()];
    }, this);
    
    this.title = ko.computed(function(){
	var titleStr = this.selectedMetric().displayName;
	return titleStr;
    }, this);
    
}


$(document).ready(function() {
    // color background, better labels
    // var map = new L.Map("map").setView([42.355, -71.095], 12)
    // 	.addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));

    // http://maps.stamen.com/#toner/10/42.3810/-71.5113
    var layer = new L.StamenTileLayer("toner-lite");
    var map = new L.Map("map", {
	center: new L.LatLng(42.355, -71.11),
	zoom: 12
    });
    map.addLayer(layer);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
   
    // options should include
    // display name, min and max, color scheme, function for lookup of metric?
    var options = [
	{"varName": "MPDPP", "displayName": "Miles Per Day Per Person",
	 "min": 0,  "minColor": "white", 
	 "max": 50, "maxColor": "blue",
	 "brewColor": "YlOrRd", 
	 "brewCutoffs": [5, 10, 20, 30, 50, 60, 80, 100] // should specify 8 at most
	},
	{"varName": "pop10", "displayName": "Population 2010",
	 "min": 0,   "minColor": "white", 
	 "max": 2000, "maxColor": "blue",
	 "brewColor": "Blues", 
	 "brewCutoffs": [5, 50, 100, 500, 1000, 2000, 3000]
	},
    ];

    var colorScales = [];
    var colorScalesDiscrete = [];
    for(var i = 0; i < options.length; i++){
	var tmp = options[i];
	options[i]['getMetric'] = function(d){
	    return d[tmp.varName];
	}
	
    }

    d3.select("#metricSelection")
	.selectAll("option")
	.data(options)
	.enter()
	.append("option")
	.attr("value", function(d,i){ return i;})
	.text(function(d){ return d.displayName;});
    
    window.view_model = new ViewModel(options, 1);
    
    ko.computed(function(){
	console.log("changed " +  view_model.title());
	$("#mapTitle").text(view_model.title());
    })
    
    var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("a simple tooltip");

    
    // using this tutorial: http://bost.ocks.org/mike/leaflet/
    var file = "../../proc/ma_municipalities.geojson";
 //   var file = "../../proc/grid_attr.geojson";
    var file = "data/grid_attr_filtBOS2.geojson";

    ko.applyBindings(view_model); // ko gets to work
    
    d3.json(file, function(collection){
	
	// vehicles/person
	// function getMetric(d){
	//     return d.properties.pass_veh/d.properties.pop10;
	// }
	// console.log(collection.features);
	// var metricArray = _(collection.features).map(getMetric);
	
	// var colorScale = d3.scale.linear()
	//     .domain([_(metricArray).min(), 1])//_(metricArray).max()])
	//     .interpolate(d3.interpolateHcl)
	//     //.range(["#E7F670", "#371C11"]); // orange
	// //.range([ "#8DF69F", "#6DC884", "#0C2519"]); // greens
	//     .range(['white','blue']);// 'red']);

	function tooltipText(d){
	    var p = d.properties;
	    var s = "# Pop10 " + p.pop10 + 
		"  # Vehicles" + p.pass_veh +
		"  Vehilces Per Person" +p.pass_veh/p.pop10;
	    return s;
	    
	}

	for(var i = 0; i < options.length; i++){
	    var desired = options[i]['varName'];
	    var metricArray = _(collection.features).map(function (d){ 
		//console.log(d.properties[desired]);
		return d.properties[desired];});

	    var minV = _(metricArray).min();
	    var maxV = _(metricArray).max();
	    console.log([options[i]["varName"],"min", minV,"max", maxV].join(' '));
	    
	    // create a color scale for each display option
	    var cs = d3.scale.linear()
		.domain([options[i].min, options[i].max])
		.interpolate(d3.interpolateHcl)
		.range([options[i].minColor, options[i].maxColor]);
	    
	    // var lowEnd = 1;
	    // var highEnd = 25;
	    // var arr = [];
	    // while(lowEnd <= highEnd){
	    //    arr.push(lowEnd++);
	    // }
	    colorScales.push(cs);
	    var bstr = "colorbrewer."+options[i].brewColor+"[9]";
	    console.log(bstr);
	    var csd = d3.scale.ordinal()
		.domain([0,1,2,3,4,5,6,7,8])
		.range(eval(bstr));
	    colorScalesDiscrete.push(csd);

	}

	


	function tooltipText(d){
	    var p = d.properties;
	    var s = "# Pop10 " + p.pop10 + 
		"  mipdaybest " + p.mipdaybest +
		" MPDPP " +p.MPDPP;
	    return s;
	    
	}

	
	var transform = d3.geo.transform({point: projectPoint}),
	path = d3.geo.path().projection(transform);

	var feature = g.selectAll("path")
	    .data(collection.features)
	    .enter().append("path");

	map.on("viewreset", reset);
	reset();

	ko.computed(function(){
	    view_model.selectedIndex();
	    reset();
	});
	// Reposition the SVG to cover the features.
	function reset() {
	
	    var ind = view_model.selectedIndex()
	    console.log("reset" + ind);
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
		    var value = d.properties[options[ind]["varName"]];
		    
		    var bcs = options[ind]["brewCutoffs"];
		    var dInt = bcs.length;
		    for(var i = 0; i < bcs.length; i++){
			if(value < bcs[i]){
			    dInt = i;
			    break;
			}
		    }
		    
		    return colorScalesDiscrete[ind](dInt);
		    return colorScales[ind](value);
		    
		})
		.on("mouseover", function(d){
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
