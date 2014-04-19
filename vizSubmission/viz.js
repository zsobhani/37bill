var ViewModel = function(selectedIndex, selectedRegion){
    
    this.selectedIndex = ko.observable(selectedIndex);
    this.selectedRegion = ko.observable(selectedRegion);
    
}
function getMap(greyscale, zoom, startLoc){
    if(greyscale){
	// http://maps.stamen.com/#toner/10/42.3810/-71.5113
	var layer = new L.StamenTileLayer("toner-lite");
	var map = new L.Map("map", {
	    center: new L.LatLng(startLoc.lat, startLoc.lng),
	    zoom: startLoc.zoom
	});
	map.addLayer(layer);
    }else{
	//color background, better labels
	var map = new L.Map("map").setView([42.355, -71.095], zoom)
		.addLayer(new L.TileLayer("http://{s}.tiles.mapbox.com/v3/examples.map-vyofok3q/{z}/{x}/{y}.png"));
    }

    
    function printCoords(){
	console.log(map.getCenter());
    }
    map.on("dragend", printCoords);
    return map;
}

$(document).ready(function() {
var initialZoom = 8; // 11 for boston zoom up
var zoomThresh = 11;

var viewIsGrid = false;

var testing = false; 

var startRegion = 0;
    var startOption = 0;

    if(testing){
	startRegion = 0;
    }   

    var regions = [
   
    {'longName': "MA by Zip Code", "shortName": "zip",
     'startLoc': {'lat': 42.03297, 'lng': -71.52648, 'zoom':8},
     'fileName': "data/zip_attr.geojson"},
    {'longName': "Boston Metro Area by Grid", "shortName": "bos",
     'startLoc': {'lat': 42.355, 'lng': -71.11, 'zoom':11},
     'fileName': "data/grid_attr_filtBOSMetro.geojson"},
	{'longName': "MAPC by Grid", "shortName": "mapc",
     'startLoc': {'lat': 42.355, 'lng': -71.11, 'zoom':11},
     'fileName': "data/grid_attr_filtMAPC.geojson"},
    // {'longName': "Berkshires by Grid", "shortName": "BRPC",
    //  'startLoc': {'lat': 42.4061, 'lng': -72.611, 'zoom':9},
    //  'fileName': "data/grid_attr_filtBRPC.geojson"},

    // {'longName': "Cape and the Islands by Grid", "shortName": "Cape",
    //  'startLoc': {'lat': 41.9912, 'lng': -70.72448, 'zoom':9},
    //  'fileName': "data/grid_attr_filtCape.geojson"},

	// todo, combine with cape and islands
	{'longName': "South East MA by Grid", "shortName": "Southeast",
     'startLoc': {'lat': 41.722, 'lng': -70.6503, 'zoom':9},
     'fileName': "data/grid_attr_filtSoutheast.geojson"},
	
	{'longName': "North East MA by Grid", "shortName": "Northeast",
     'startLoc': {'lat': 42.65214, 'lng': -70.9867, 'zoom':10},
     'fileName': "data/grid_attr_filtNortheast.geojson"},
	
	{'longName': "Central MA by Grid", "shortName": "Central",
     'startLoc': {'lat': 42.322, 'lng': -71.84783, 'zoom':9},
     'fileName': "data/grid_attr_filtCentral.geojson"},
	
	{'longName': "Western MA by Grid", "shortName": "West",
     'startLoc': {'lat': 42.3382, 'lng': -72.7377, 'zoom':9},
     'fileName': "data/grid_attr_filtWestern.geojson"},



]



    var map = getMap(true, 8, regions[startRegion].startLoc);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    gGeoJSON = svg.append("g").attr("class", "leaflet-zoom-hide");
    
    // contents here cut and paste from varNames.json, because don't want to do a 
    // json load nesting...
    var varNames = {"total_emp": {"max": 18422.0, "description": "Total employment.", "min": 0.0, "varName": "total_emp", "median": 0.0, "source": "InfoGroup, 2011", "stdDev": 166.19, "longName": "Employment", "units": "jobs per grid", "shortName": "Employment", "mean": 18.358}, "prow_sqm": {"max": 62490.0, "description": "Total area of road and rail rights-of-way within this grid cell.", "min": -0.07, "varName": "prow_sqm", "median": 5161.7, "source": "MassGIS Level 3 Parcel Data, MAPC analysis", "stdDev": 7444.6, "longName": "Right of Way Area", "units": "sq meter", "shortName": "Road Area", "mean": 7103.9}, "far_agg": {"max": 14.38, "description": "Building floor area divided by lot area of fee parcels (non right-of-way).  A common measure of density.", "min": 0.0, "varName": "far_agg", "median": 0.03, "source": "MassGIS Level 3 Parcel Data, MAPC analysis.", "stdDev": 0.18831, "longName": "Floor Area Ratio", "units": "ratio", "shortName": "Floor Area Ratio", "mean": 0.081815}, "ppaved_sqm": {"max": 739200.0, "description": "Estimated paved area, in square meters, excluding roads within public rights-of-way.", "min": 0.0, "varName": "ppaved_sqm", "median": 2859.9, "source": "MassGIS Impervious Surface Data 2005, MassGIS Building Structures 2010, MassGIS Level 3 Parcels, MAPC analysis.", "stdDev": 5537.8, "longName": "Parking Lots and Driveways", "units": "sq meter", "shortName": "Parking Lots", "mean": 4391.7}, "pbld_sqm": {"max": 266480.0, "description": "Rooftop area (square meters) of all buildings in this grid cell, in square meters.", "min": 0.0, "varName": "pbld_sqm", "median": 1597.2, "source": "MassGIS Building Rooftops, 2011", "stdDev": 3295.8, "longName": "Building Footprint", "units": "sq meter", "shortName": "Building Footprint", "mean": 2716.9}, "co2eqv_day": {"max": "", "description": "Estimated CO2 Equivalence of green house gas emissions", "min": "", "varName": "co2eqv_day", "median": "", "source": "??", "stdDev": "", "longName": "CO2 Equivalent per day", "units": "", "shortName": "CO2 Eqv per day", "mean": ""}, "OwnPct": {"max": 1.0, "description": "Share of owned homes", "min": 0.0, "varName": "OwnPct", "median": 0.8, "source": "2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 0.30642, "longName": "Owned housing units as a percent of all housing units.", "units": "%", "shortName": "% Homeowners", "mean": 0.70547}, "MPDPP": {"max": 199.9, "description": "Mean miles per day per person, based on best matching inspection records and total registered passenger vehicles.", "min": 0.0, "varName": "MPDPP", "median": 12.539, "source": "Mass Vehicle Census, 2010, second quarter and 2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 22.646, "longName": "Miles of Driving per Day per Person", "units": "miles", "shortName": "Miles per Day Per Person", "mean": 17.105}, "HHIncBG": {"max": 250000.0, "description": "Median household income (2008-2012 average) of Census block group in which the grid is located.", "min": 2499.0, "varName": "HHIncBG", "median": 80197.0, "source": "ACS 2008-2012 block group summary file for Massachusetts.", "stdDev": 33853.0, "longName": "Median household income of block group", "units": "$", "shortName": "Median Household Income", "mean": 86174.0}, "ChildPct": {"max": 0.66, "description": "Share of children (age 5-17)", "min": 0.0, "varName": "ChildPct", "median": 0.0, "source": "2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 0.026787, "longName": "Population 5 to 17 as share of total", "units": "%", "shortName": "% Children", "mean": 0.017445}, "SeniorPct": {"max": 1.0, "description": "Share of seniors (65+)", "min": 0.0, "varName": "SeniorPct", "median": 0.09, "source": "2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 0.12391, "longName": "Population 65+ as share of total", "units": "%", "shortName": "% Seniors", "mean": 0.10581}, "exit_dist": {"max": 57313.0, "description": "On-road distance to nearest highway interchange (in meters?)", "min": 3.99, "varName": "exit_dist", "median": 7896.5, "source": "MassDOT Road Layer, MAPC Analysis", "stdDev": 7437.4, "longName": "Highway Exit Distance", "units": "?", "shortName": "Highway Exit Distance", "mean": 5677.1}, "hh10": {"max": 1778.9, "description": "Households based on 2010 U.S. Census", "min": 0.01, "varName": "hh10", "median": 6.5, "source": "2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 40.427, "longName": "Households, 2010", "units": "households per grid", "shortName": "Households", "mean": 18.178}, "SLD_D4c": {"max": 3535.0, "description": "Aggregate frequency of transit service within 0.25 miles of block group boundary per hour during evening peak period\u00a0", "min": 0.0, "varName": "SLD_D4c", "median": 0.0, "source": "EPA Smart Location Database, based on GTFS data for MBTA, Massport, and 9 of the 15 RTAs in Massachusetts.", "stdDev": 123.75, "longName": "Transit Frequency within 1/4 Mile", "units": "trips per hour", "shortName": "Transit Access", "mean": 25.783}, "pop10": {"max": 3867.0, "description": "Population based on 2010 U.S. Census", "min": 1.0, "varName": "pop10", "median": 18.0, "source": "2010 U.S. Census data as coded to grid by MAPC.", "stdDev": 95.14, "longName": "Total population, 2010", "units": "persons per grid", "shortName": "Population", "mean": 45.922}, "pttlasval": {"max": 1404500000.0, "description": "Total assessed value of all land, buildings, and other improvements in this grid cell, in dollars. Based on local assessing records from 2009 - 2014.", "min": 0.0, "varName": "pttlasval", "median": 2921200.0, "source": "MassGIS Level 3 Parcel Data, MAPC analysis.", "stdDev": 18385000.0, "longName": "Total Assessed Value of All Parcels", "units": "$", "shortName": "Assessed Value", "mean": 6238300.0}, "sidewlksqm": {"max": 6555.7, "description": "Linear length of sidewalks in this grid cell. Sidewalks on opposite sides of a roadway are counted separately.", "min": 0.0, "varName": "sidewlksqm", "median": 0.0, "source": "MassDOT Road Layer, MAPC Analysis", "stdDev": 683.49, "longName": "Sidewalk Density", "units": "sq meter", "shortName": "Sidewalks", "mean": 319.84}, "intsctnden": {"max": 695.0, "description": "Count of roadway intersections in this grid cell.", "min": 0.0, "varName": "intsctnden", "median": 34.0, "source": "MassDOT Road Layer, MAPC Analysis", "stdDev": 74.196, "longName": "Intersections", "units": "intersections per grid", "shortName": "Intersections", "mean": 60.331}, "schwlkindx": {"max": 9.78, "description": "Index of school walkability developed by MAPC, based on number of public, private, or charter school grades within one mile walking distance of grid centroid", "min": 0.0, "varName": "schwlkindx", "median": 0.0, "source": "MAPC", "stdDev": 0.76835, "longName": "Schools Within a Mile", "units": "?", "shortName": "Schools Nearby", "mean": 0.31206}}


    



    // order here specifies order in drop down menu on map
    var options = [
	{"varName": "MPDPP", 
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(1); },
	 "brewColor": "YlOrRd", 
	 "brewCutoffs": [2.5, 5, 10, 15, 20, 30, 50, 80] // should specify 8 at most
	},
	{"varName": "co2eqv_day",
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(2); },
	 "brewColor": "Reds", 
	 "brewCutoffs": [50, 100, 500, 1000, 1500, 2000, 3000] // should specify 8 at most
	},

	{"varName": "pop10", 
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(0); },
	 "brewColor": "Blues", 
	 "brewCutoffs": [10, 50, 75, 100, 200, 300, 500, 1000]
	},
	{"varName": "SeniorPct", 
	 "fmtFunc": function(d){ return (parseFloat(d)*100).toFixed(0); },

	 "brewColor": "Purples", 
	 "brewCutoffs": [0.01, 0.05, .1, 0.15, .20, .25, .3] // should specify 8 at most
	},
	{"varName": "ChildPct", 
	 "fmtFunc": function(d){ return (parseFloat(d)*100).toFixed(0); },

	 "brewColor": "Greens", 
	 "brewCutoffs": [0.01, .02, .03, .04, 0.05, .1, 0.15, .20] // should specify 8 at most
	},

	{"varName": "schwlkindx",
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(2); },
	 "brewColor": "Purples", 
	 "brewCutoffs": [0, 0.4, 0.6, 1, 2, 3, 5, 7] // should specify 8 at most
	},
	{"varName": "sidewlksqm", 
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(0); },
	 "brewColor": "Greens", 
	 "brewCutoffs": [100, 500, 1000, 1500, 2000, 3000, 4000] // should specify 8 at most
	},
	{"varName": "intsctnden", 
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(0); },
	 "brewColor": "Oranges", 
	 "brewCutoffs": [25, 50, 100, 150, 200, 300, 400, 500] // should specify 8 at most
	},

	
	{"varName": "total_emp",
	 "fmtFunc": function(d){ return (parseFloat(d)).toFixed(0); },
	 "brewColor": "BuGn", 
	 "brewCutoffs": [25, 50, 100, 150, 200, 300, 400, 500] // should specify 8 at most
	},

	{"varName": "HHIncBG", 
	 "fmtFunc": function(d){ return (parseFloat(d)/1000).toFixed(1) + "k"; },
	 "brewColor": "Greens", 
	 "brewCutoffs":[10000,20000, 30000, 50000,75000, 100000, 150000,200000] 
	},


]
var temp= [
	

	// {"varName": "VehPP", "displayName": "Passenger Vehicles Per Person",
	//  "tipfmt": 2,
	//  "brewColor": "Oranges", 
	//  "brewCutoffs": [0, 0.2, 0.4, 0.6, 0.8, 1, 2, 5] // should specify 8 at most
	// },
	
	
	// {"varName": "mipdaybest", "displayName": "Miles per Day per Vehicle",
	//  "tipfmt": 2,
	//  "brewColor": "OrRd", 
	//  "brewCutoffs": [5, 10, 15, 20, 25, 30, 35, 50] // should specify 8 at most
	// },


    ];
    
    var colorScales = [];
    var colorScalesDiscrete = [];
	for(var i = 0; i < options.length; i++){

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
    
    for(var i = 0; i < options.length; i++){
	var tmp = options[i];
	options[i]['getMetric'] = function(d){
	    return d[tmp.varName];
	}
	
    }
    // get long name from option
    function getLongName(d){
	if(!d) return
	return varNames[d.varName].longName;
    }

    function getShortName(d){
	if(!d) return
	return varNames[d.varName].shortName;
    }

    d3.select("#regionSelection")
	.selectAll("option")
	.data(regions)
	.enter()
	.append("option")
    .attr("value", function(d, i){return i;})
    .text(function(d){return d.longName;});

    d3.select("#metricSelection")
	.selectAll("option")
	.data(options)
	.enter()
	.append("option")
	.attr("value", function(d,i){ return i;})
	.text(getLongName);

	var legend = d3.select("#legend").append("svg")
	    .attr("width", 150).attr("height", 210);


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
    
    window.view_model = new ViewModel(startOption, startRegion);
    
    // ko.computed(function(){
    // 	console.log("changed " +  view_model.title());
    // 	$("#mapTitle").text(view_model.title());
    // })
    
    var tooltipContainer = d3.select("#tooltipContainer");

    // using this tutorial: http://bost.ocks.org/mike/leaflet/
    var fileZip = "data/zip_attr.geojson";
 
    var fileGrid = "data/grid_attr_filtBOSMetro.geojson";
    // Too slow with the whole state: var file = "data/grid_attr_MA.geojson";
    
    var zipJSON = null;
    var gridJSON = null;
    ko.applyBindings(view_model); // ko gets to work

    var simpleTooltip = d3.selectAll("#tooltipContainer");

    function updateTooltip(d, displayRequested){
	
        if(!displayRequested){
	    // hide the tooltip
	    simpleTooltip
		.style("opacity", 0.4);
        }else{ // show the tooltip
	    function getCode(d){
		if(viewIsGrid){
		    return("GRID # " + d.properties.g250m_id +"");
		}else{
		    return("Zip Code: "+ ("00000" +d.properties.zip_code).slice(-5));
		}
	    }
	    // set the data to display:
	    simpleTooltip.select(".tooltipTitle")
		.text(d.properties.municipal);
	    simpleTooltip.select(".tooltipSubtitle")
		.text(getCode(d));
	    
	    
	    popTooltipProgrammatically(d);
	    
	    // fade in the tooltip, note transition seems to result 
	    // in the tooltip sometimes being left displayed...
	    simpleTooltip//.transition()        
	    //.duration(200)      
                .style("opacity", 0.95);      
        }
        
    }

    function popTooltipProgrammatically(d){
	simpleTooltip.selectAll(".tooltipMetricContainer").remove();
	for(var i = 0; i < options.length; i++){
	    
	    var cc = simpleTooltip.select(".tooltipContentsContainer");
	    
	    var o = options[i];
	    var div = cc.append("div").attr("class", "tooltipMetricContainer");
	    div.append("span").attr("class","tooltipMetricName")
		.text(getShortName(o));
	    div.append("span").attr("class","tooltipMetricValue")
		.text( 
		    o.fmtFunc(d.properties[o.varName]) + " " + varNames[o.varName].units);
	    div.append("br")
	    
	}
	
    }
    var currentViewReset = null;

    var global_collection = null
    var global_feature = null;
    var global_path = null;
    
    ko.computed(function(){
	view_model.selectedIndex();
	//	    view_model.selectedRegion();
	if (global_collection && global_feature && global_path) {
	    resetWithCollection(global_collection, global_feature, global_path);
	}
    });

    function resetWithCollection(collection, feature, path){
	// Reposition the SVG to cover the features.
	
	    console.log("reset called!: " + map.getZoom());
	    var ind = view_model.selectedIndex();
	    
	    updateLegend(ind);
	    
	    var bounds = path.bounds(collection),
            topLeft = bounds[0],
            bottomRight = bounds[1];

	    svg .attr("width", bottomRight[0] - topLeft[0])
		.attr("height", bottomRight[1] - topLeft[1])
		.style("left", topLeft[0] + "px")
		.style("top", topLeft[1] + "px");

	    gGeoJSON   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

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
	
    function renderCollection(collection, region){
	map.setView(new L.LatLng(region.lat, region.lng), region.zoom);
	
	var transform = d3.geo.transform({point: projectPoint}),
	path = d3.geo.path().projection(transform);
	gGeoJSON.selectAll("path").remove();
	var feature = gGeoJSON.selectAll("path")
	    .data(collection.features)
	    .enter().append("path")
	    .attr("class", "mappath");

	global_collection = collection;
	global_feature = feature;
	global_path = path;

	if(currentViewReset){
	    map.off("viewreset", currentViewReset);
	}
	map.on("viewreset", reset);
	currentViewReset = reset;

	reset();
	
	function reset() {
	    resetWithCollection(collection, feature, path);
	}
	
	// Use Leaflet to implement a D3 geometric transformation.
	function projectPoint(x, y) {
	    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	    this.stream.point(point.x, point.y);
	    //console.log("this is point" + point);
	}
	
    }

    ko.computed(function(){
	var reg = view_model.selectedRegion();
	console.log("selected Region # " + reg);
	var region = regions[reg]
	viewIsGrid = reg !=0;
	d3.json(region.fileName, function(collection){
		renderCollection(collection, region.startLoc)
	});
    });

  //   // track which zoom level we are at, track if json has been loaded
 //    // switch bound features based on zoom level
 //    function renderZipJSON(){
 // 	if(zipJSON !=null){
 // 	    renderCollection(zipJSON);
 // 	}else{
 // 	    d3.json(fileZip, function(collection){
 // 		renderCollection(collection)
 // 		zipJSON = collection;
 // 	    });
	    
 // 	}
 //    }
    
 // // track which zoom level we are at, track if json has been loaded
 //    // switch bound features based on zoom level
 //    function renderGridJSON(){
 // 	if(gridJSON !=null){
 // 	    renderCollection(gridJSON);
 // 	}else{
 // 	    d3.json(fileGrid, function(collection){
 // 		renderCollection(collection)
 // 		gridJSON = collection;
 // 	    });
	    
 // 	}
 //    }
    
 //    renderZipJSON();
    // map.on("zoomend", function(){
	
    // 	if(map.getZoom() > zoomThresh){
    // 	    if(viewIsGrid){
    // 		// do nothing
    // 	    }else{
    // 		renderGridJSON();
    // 		viewIsGrid = true;
    // 	    }
    // 	    // not hysteresis on zoom, no change on threshold!
    // 	}else if (map.getZoom() < zoomThresh){
    // 	    if(viewIsGrid){
    // 		renderZipJSON();
    // 		viewIsGrid = false;
    // 	    }else{
    // 		// do nothing
    // 	    }
    // 	}
	
	
	
    // });
    // map.on("zoomstart", function(){

	
    // });
    
		  

    function createSmallMult(d,widthSmall, yaxisDesired, allowHigher, miny, maxy){
	
	var side = widthSmall;
	var axisFudge = 30*yaxisDesired;
	var topFudge = 40*allowHigher;
	var margin = {top: 10+topFudge, right: 5, bottom: 30, left: (30+axisFudge)},
	width = side - margin.left - margin.right + axisFudge,
	height = side - margin.top - margin.bottom + topFudge;
	var svgP = d3.select("#plotContainer").selectAll("."+d.varName)
	    .data([d])
	    .enter()
	    .append("svg")
	    .attr("class", d.varName)
	    .attr("width", width + margin.left +margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	var yC = d3.scale.linear().range([height, 0])
	    .domain([0, 50000]); // 145678 cells

	var lineAct = d3.svg.line()
	    .x(function(d) { return x(d.x); })
	    .y(function(d) { return y(d.yAct); });

	var linePred = d3.svg.line()
	    .x(function(d) { return x(d.x); })
	    .y(function(d) { return y(d.yModel); });

	var lineCount = d3.svg.area()
	    .x(function(d) { return x(d.x); })
	    .y(function(d) { return yC(d.count); });
	
	// set the same y axis for all metrics
	y.domain([miny, maxy]);
	x.domain([d.ranges.start, d.ranges.end]);
	
	svgP.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0, "+(height) +")")
	    .call(d3.svg.axis()
		  .ticks(3)
		  .orient("bottom")
		  //.tickSize([1,3])
		  .scale(x));
	if(yaxisDesired){
	    svgP.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate("-margin.left+", 0)")
		.call(d3.svg.axis()
		      .ticks(5)
		      .orient("left")
		      //.tickSize([1,3])
		      .scale(y));
	    svgP.append("text")
		.attr("transform", "rotate(-90)")
		.attr("class", "smallLabel")
		.attr("y", -margin.left/2) // don't use axis because x axis is different on each graph
		.attr("x", -height/2)
	    .style("text-anchor", "middle")
		.text("Miles Per Day Per Person");
	    
	}
	// Add the line path elements. Note: the x-domain is set per element.
	svgP.append("path")
	    .attr("class", "lineAct")
	    .attr("d", function(d) { 
		//x.domain([d.ranges.start, d.ranges.end]); 
		return lineAct(d.values); });
	// Add the line path elements. Note: the x-domain is set per element.
	// svgP.append("path")
	//     .attr("class", "lineCount")
	//     .attr("d", function(d) { 
	// 	//x.domain([d.ranges.start, d.ranges.end]); 
	// 	return lineCount(d.values); });
	svgP.append("path")
	    .attr("class", "linePred")
	    .attr("d", function(d) { 
		//x.domain([d.ranges.start, d.ranges.end]); 
		return linePred(d.values); });
	// Add a small label for the symbol name.
	
	svgP.append("text")
	    .attr("class", "smallLabel")
	    .attr("x", width/2)
	    .attr("y", (margin.top - topFudge)*1.5)
	    .style("text-anchor", "middle")
	    .text(function(d){return getShortName(d);});
	
	    
	}
 
    
    var mfile = "data/ModelSimulation.json";
    if(!testing){   //stop rendering this for now     
    d3.json(mfile, function(collection){
	console.log(collection);
	miny = 0; //d3.min(collection, function(d){ return d.ranges.minY;});
	maxy = 40;//d3.max(collection, function(d){ return d.ranges.maxY;});
	
	var small_width = 200;
	var num_per_row = 4;
	for(var i = 0; i<collection.length; i++){
	    var yaxisDesired = ((i%num_per_row) == 0);
	    var allowHigher = i<num_per_row;
	    createSmallMult(collection[i], small_width, yaxisDesired,allowHigher, miny, maxy);
	}


    });
}
    
});
