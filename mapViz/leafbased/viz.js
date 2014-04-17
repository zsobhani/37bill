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
function getMap(greyscale, zoom){
    if(greyscale){
	// http://maps.stamen.com/#toner/10/42.3810/-71.5113
	var layer = new L.StamenTileLayer("toner-lite");
	var map = new L.Map("map", {
	    center: new L.LatLng(42.355, -71.11),
	    zoom: zoom
	});
	map.addLayer(layer);
    }else{
	//color background, better labels
	var map = new L.Map("map").setView([42.355, -71.095], zoom)
		.addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));
    }

    return map;
}

$(document).ready(function() {
    var map = getMap(true, 11);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");
       
    // options should include
    // display name, min and max, color scheme, function for lookup of metric?
    var options = [
	{"varName": "MPDPP", "displayName": "Miles Per Day Per Person",
	 "tipfmt": 1,
	 "min": 0,  "minColor": "white", 
	 "max": 50, "maxColor": "blue",
	 "brewColor": "YlOrRd", 
	 "brewCutoffs": [2.5, 5, 10, 15, 20, 30, 50, 80] // should specify 8 at most
	},
	{"varName": "VehPP", "displayName": "Passenger Vehicles Per Person",
	 "tipfmt": 2,
	 "brewColor": "Oranges", 
	 "brewCutoffs": [0, 0.2, 0.4, 0.6, 0.8, 1, 2, 5] // should specify 8 at most
	},
	{"varName": "sidewlksqm", "displayName": "Length of Sidewalks",
	 "tipfmt": 0,
	 "brewColor": "Greens", 
	 "brewCutoffs": [100, 500, 1000, 1500, 2000, 3000, 4000] // should specify 8 at most
	},
	{"varName": "schwlkindx", "displayName": "School Walk Index",
	 "tipfmt": 2,
	 "brewColor": "Purples", 
	 "brewCutoffs": [0, 0.4, 0.6, 1, 2, 3, 5, 7] // should specify 8 at most
	},
	{"varName": "intsctnden", "displayName": "Intersection Density",
	 "tipfmt": 0,
	 "brewColor": "Oranges", 
	 "brewCutoffs": [25, 50, 100, 150, 200, 300, 400, 500] // should specify 8 at most
	},
	{"varName": "total_emp", "displayName": "Total Employment",
	 "tipfmt": 2,
	 "brewColor": "BuGn", 
	 "brewCutoffs": [25, 50, 100, 150, 200, 300, 400, 500] // should specify 8 at most
	},
	{"varName": "mipdaybest", "displayName": "Miles per Day per Vehicle",
	 "tipfmt": 2,
	 "brewColor": "OrRd", 
	 "brewCutoffs": [5, 10, 15, 20, 25, 30, 35, 50] // should specify 8 at most
	},

	{"varName": "co2eqv_day", "displayName": "CO2 Eqivalent per Day",
	 "tipfmt": 2,
	 "brewColor": "Reds", 
	 "brewCutoffs": [50, 100, 500, 1000, 1500, 2000, 3000] // should specify 8 at most
	},

	{"varName": "pop10", "displayName": "Population 2010",
	 "tipfmt": 0,
	 "min": 0,   "minColor": "white", 
	 "max": 2000, "maxColor": "blue",
	 "brewColor": "Blues", 
	 "brewCutoffs": [10, 50, 75, 100, 200, 300, 500, 1000]
	},
	{"varName": "ChildPct", "displayName": "Population % Children",
	 "tipfmt": 2,
	 "brewColor": "Greens", 
	 "brewCutoffs": [0.01, .02, .03, .04, 0.05, .1, 0.15, .20] // should specify 8 at most
	},
	{"varName": "SeniorPct", "displayName": "Population % over 65",
	 "tipfmt": 2,
	 "brewColor": "Purples", 
	 "brewCutoffs": [0.01, 0.05, .1, 0.15, .20, .25, .3] // should specify 8 at most
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
    
    window.view_model = new ViewModel(options, 0);
    
    ko.computed(function(){
	console.log("changed " +  view_model.title());
	$("#mapTitle").text(view_model.title());
    })
    
    var tooltipContainer = d3.select("#tooltipContainer");

    
    // using this tutorial: http://bost.ocks.org/mike/leaflet/
    var file = "../../proc/ma_municipalities.geojson";
 
    var file = "data/grid_attr_filtBOS4.geojson";
    // Too slow with the whole state: var file = "data/grid_attr_MA.geojson";
    
    ko.applyBindings(view_model); // ko gets to work
    
    d3.json(file, function(collection){

	
	for(var i = 0; i < options.length; i++){
	    var desired = options[i]['varName'];
	    var metricArray = _(collection.features).map(function (d){ 
		//console.log(d.properties[desired]);
		return d.properties[desired];});

	    // var minV = _(metricArray).min();
	    // var maxV = _(metricArray).max();
	    // console.log([options[i]["varName"],"min", minV,"max", maxV].join(' '));
	    
	    // // create a color scale for each display option
	    // var cs = d3.scale.linear()
	    // 	.domain([options[i].min, options[i].max])
	    // 	.interpolate(d3.interpolateHcl)
	    // 	.range([options[i].minColor, options[i].maxColor]);
	 
	    // colorScales.push(cs);
	    var bstr = "colorbrewer."+options[i].brewColor+"[9]";
	    
	    var csd = d3.scale.ordinal()
		.domain([0,1,2,3,4,5,6,7,8])
		.range(eval(bstr));
	    colorScalesDiscrete.push(csd);

	    // make a legend string
	    var bcs = options[i]["brewCutoffs"];
	    
	    var lstr = [];
	    lstr.push(" < " + bcs[0]);
	    for(var j = 1; j < bcs.length; j++){
		lstr.push(bcs[j-1] + " - " + bcs[j]);
	    }
	    lstr.push("   > " + bcs[bcs.length-1]);
	    
	    options[i]["legendStrings"] = lstr;

	    
	}

	var legend = d3.select("#legend").append("svg")
	    .attr("width", 150).attr("height", 250);


	function updateLegend(ind /*variable being plotted*/){
	    // make the discrete legend:
	    var lw = 20;
	    var lh = 20;
	    var lmargin = 3;
	    var lstr = options[ind]['legendStrings'];
	    // delete the rectangles, because can't figure out 
	    // appropriate compare function including the "ind"
	    // or rather deleting them is a simpler option
	    legend.selectAll("rect").remove();
	    var rects = legend.selectAll("rect")
		.data(lstr, function(d, i){ return d + i;});
	    rects
		.enter()
		.append("rect")
		.attr("x", 0)
		.attr("y", function(d, i){return i*(lh+lmargin);})
		.attr("width", lw)
		.attr("height", lh)
		.attr("fill", function(d, i){
		    return colorScalesDiscrete[ind](i);});
	    rects.exit().remove();
	    var labels = legend.selectAll("text")
	    	.data(lstr, function(d, i){ return d + i;});
	    labels
		.enter()
		.append("text")
		.attr("x", lw+10)
		.attr("y", function(d, i){return i*(lh+lmargin)+ lh -3;})
		.attr("width", lw)
		.attr("height", lh)
		.text(function(d){return d;});
	    labels.exit().remove();
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
	var simpleTooltip = d3.selectAll("#tooltipContainer");


	function getRectangularPathTopCenterPosition(d){
	    // hack here to calculate the top center of rectangular paths
	    pointA = d.geometry.coordinates[0][0];
	    pointB = d.geometry.coordinates[0][2];

	    var point1 = map.latLngToLayerPoint(
		new L.LatLng(pointA[1], pointA[0])); 
	    var point2 = map.latLngToLayerPoint(
		new L.LatLng(pointB[1], pointB[0])); 

	    // get middle x value and min y value
	    var x_pos = (point1.x + point2.x)/2;
	    var y_pos = Math.min(point1.y, point2.y);
	    
	    // get the offset of the map on the page, 
	    // using the overlay we are drawing on
	    var mapOffsets = $(map.getPanes().overlayPane).offset();
	    
	    return {"x": x_pos + mapOffsets.left, 
		    "y": y_pos + mapOffsets.top};
	}

	function updateTooltip(d, displayRequested){
	    
            if(!displayRequested){
		// hide the tooltip
		simpleTooltip
		    .style("opacity", 0.3);
            }else{ // show the tooltip
		
		// set the data to display:
		simpleTooltip.select(".tooltipTitle")
		    .text(d.properties.municipal);
		simpleTooltip.select(".tooltipSubtitle")
		    .text("[" + d.properties.g250m_id +"]");
		//simpleTooltip.selectAll(".tooltipMetricContainer").remove();
		
		for(var i = 0; i < options.length; i++){

		    var o = options[i];
		    var mc = simpleTooltip.select("#" +o['varName']);
		    
		    mc.select(".tooltipMetricName").text(o.displayName);
		    mc.select(".tooltipMetricValue").text(
			d.properties[o.varName].toFixed(o.tipfmt));

		}
		// get the dimensions dynamically if the size could change
		var h = $("#tooltipContainer").height();
		var w = $("#tooltipContainer").width()+10;
		
		// center the tail dynamically
		simpleTooltip.select(".tooltipTail-down")
		    .style("left", (w/2 - 29/2) + "px");
		
		// position of top of path rectangle relative to page
		// above the grid cell
		var offsets = getRectangularPathTopCenterPosition(d);
		// position with respect to mouse on mouseover
		// var offsets = {"x": d3.event.pageX, "y": d3.event.pageY };
		var offsets = {"x": 980, "y": 780};
		simpleTooltip 
		    .style("left", ( offsets.x- w/2) + "px")     
                    .style("top", ( offsets.y-h -36) + "px");
	
		// fade in the tooltip, note transition seems to result 
		// in the tooltip sometimes being left displayed...
		simpleTooltip//.transition()        
		    //.duration(200)      
                    .style("opacity", 0.95);      
            }
            
	}
	
	// Reposition the SVG to cover the features.
	function reset() {
	
	    var ind = view_model.selectedIndex()
	    updateLegend(ind);
	    
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
		    updateTooltip(d, true);
		})
		.on("mouseout", function(d){
		    updateTooltip(d, false);
		});
	
	}
	


		// Use Leaflet to implement a D3 geometric transformation.
	function projectPoint(x, y) {
	    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	    this.stream.point(point.x, point.y);
	    //console.log("this is point" + point);
	}
	    
    });

 
    var mfile = "data/ModelSimulation.json";
            
    d3.json(mfile, function(collection){
	console.log(collection);
    });
    
});
