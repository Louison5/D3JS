var slider = document.getElementById("myRange");
const computedStyle = getComputedStyle(slider);
const width = parseInt(computedStyle.width, 10)*0.82;
const enlarge_ratio = width/962
// var width = 962,
rotated = 0,
height = 502*enlarge_ratio;
var on_ratio = false
var year_str = "1985"

var colourList = ['lightgreen', 'green', 'blue', 'palevioletred', 'red', 'yellow']

//Store parsed data
// var parsedData;
// d3.json("https://jeremydavidfriesen.github.io/stackoverflow-2019-survey-world-map-d3/data.json", function(data) {
//   parsedData = data;
// });
const button1 = d3.select("#button1");
const button2 = d3.select("#button2");
button1.on("click", ()=>{on_ratio=false; parse_update_data(year_str);});
button2.on("click", ()=>{on_ratio=true; parse_update_data(year_str); });

//track where mouse was clicked
var initX;
//track scale only rotate when s === 1
var s = 1;
var mouseClicked = false;

// contains the path references for each country
var countries;

//This variable will be used to store the country name when the user clicks on a country
var countryClicked = '';

// Adapted from "d3 map with states and countries", http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668
var projection = d3.geo.mercator()
  .scale(153*enlarge_ratio)
  .translate([width / 2, height/ 1.5])
  .rotate([rotated, 0, 0]);
// Adapted from "d3 map with states and countries", http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668
var zoom = d3.behavior.zoom()
  .scaleExtent([1, 20])
  .on("zoom", zoomed);
// Adapted from "d3 map with states and countries", http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668
var svg = d3.select("body").append("svg")
  // .attr("width", width+200)
  .attr("width", width)
  // .attr("height", height+100)
  .attr("height", height)
  //track where user clicked down
  .on("mousedown", function () {
    d3.event.preventDefault();
    //only if scale === 1
    if (s !== 1) return;
    initX = d3.mouse(this)[0];
    mouseClicked = true;
  })
  .on("mouseup", function () {
    if (s !== 1) return;
    rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * width));
    mouseClicked = false;
  })
  .call(zoom);

// Adapted from "d3 map with states and countries", http://bl.ocks.org/MaciejKus/61e9ff1591355b00c1c1caf31e76a668
function rotateMap(endX) {
  projection.rotate([rotated + (endX - initX) * 360 / (s * width), 0, 0])
  g.selectAll('path')
    .attr('d', path);
}

//for tooltip
var offsetL = document.getElementById('map').offsetLeft ;
var offsetT = document.getElementById('map').offsetTop ;
// var offsetT = document.getElementById('map').offsetTop +10;

var path = d3.geo.path()
  .projection(projection);

var tooltip = d3.select("#map")
  .append("div")
  .attr("class", "tooltip hidden");

var g = svg.append("g");

var languageColours = {};
d3.json("colours.json", function(error, data){
  for(var lang in data){
    languageColours[lang] = data[lang].color;
  }
});

var topLanguages = [];
var topLanguagesColours = [];
var topPlatforms = [];
var topDeveloperTypes = [];

countryTops = {};

// parse country data
var countryData = {};
// var suicideData = {};

var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

var data_cty_yr; 
var data_cty_sex_age; 
// Update the current slider value (each time you drag the slider handle)

function parse_update_data(year_str){
  d3.json("suicide_data.json", function(error, data){
    var suicideData ={}
    data_cty_sex_age = {}
    for(var country in data){
      if (data[country][year_str] != undefined){
        if (on_ratio == false){
            suicideData[country] = data[country][year_str]["num"];
        } else{
            suicideData[country] = data[country][year_str]["sex"]["male"]/data[country][year_str]["sex"]["female"];
        }
      }
    }
    for(var country in data){
      data_cty_sex_age[country] = data[country][year_str];
    }
    suicideData = renameKeysUsingMap(suicideData, rename)
    updateMapColours(suicideData);
    data_cty_yr = data;
  })

}
parse_update_data(year_str);
slider.oninput = function() {
  output.innerHTML = this.value;
  year_str = String(this.value)
  parse_update_data(year_str)

}



var colorScale1 = d3.scale.linear()
  .domain([0, 10000]) // Set the domain of your continuous data
  .range(["white", "orange"]);
  // .interpolator(d3.interpolateViridis); // Choose an interpolator for color mapping (e.g., interpolateViridis)

var colorScale2 = d3.scale.linear()
.domain([0.1, 10]) // Set the domain of your continuous data
.range(["blue", "red", ]);
// .interpolator(d3.interpolateViridis); // Choose an interpolator for color mapping (e.g., interpolateViridis)

// update the colour of each country, by attribute parameter
function updateMapColours(country_color){
  if(countries != undefined){

    countries.attr("style", function (d) {
      var colour = "black";
      // var colour = "f0f0f0";
      if (d.properties.name != undefined && country_color[d.properties.name] != undefined){
        //countryData[d.properties.name][altName][0]
        // var value = Object.keys(countryData[d.properties.name][altName])[0];
        // if(value == "NA" && Object.keys(countryData[d.properties.name][altName])[1] != undefined)
        //   value = Object.keys(countryData[d.properties.name][altName])[1];

        var colour = "white"
        value = country_color[d.properties.name]
        colour = colorScale1(value)
        if (on_ratio) {
          colour = colorScale2(value)
        }
        if (value == "NA")
          colour = "white"
      }
      return "fill:" + colour + ";";
    })
  }
}



// get json data and draw it
d3.json("world-countries.json", function (error, world) {
  if (error) return console.error(error);

  countries = g.append("g")
    .attr("class", "boundary")
    .selectAll("boundary")
    .attr("width", width-200)
    .attr("height", height)
    .data(topojson.feature(world, world.objects.countries1).features)
    .enter()
    .append("path")
    .attr("name", function (d) { return d.properties.name; })
    .attr("id", function (d) { return d.id; })
    .on("mouseenter", selected)
    // .on("mousemove", selected)
    .on("mouseleave", function (d, i) {
      unselected(d)
      tooltip.classed("hidden", true);
    })
    .attr("d", path);
});

// tooltip
function showTooltip(d) {
  label = d.properties.name;
  data_yr = {};
  data_sex_age = {};
  for(var key in data_cty_yr[label]){
    (data_yr[key] = data_cty_yr[label][key]["num"]);
  }
  data_sex_age = data_cty_sex_age[label]["age"];

  var mouse = d3.mouse(svg.node())
    .map(function (d) { return parseInt(d); });
  tooltip.classed("hidden", false)
    // .attr("style", "left:" + (mouse[0] + width*0.1) + "px;top:" + (mouse[1] ) + "px")
    .attr("style", "left:" + (mouse[0]-offsetL) + "px;top:" + (mouse[1]-offsetT) + "px")
    // .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
    .html(label);
  var sub_svg = tooltip.append("svg")
    .attr("width", 500)
    .attr("height", 300);

  if (on_ratio){
    displaybarchart(sub_svg, data_sex_age);
  }else{
    displaylinechart(sub_svg, data_yr);
  }
}

// selection
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

//This functon will unhighlight the country and grab the country name 
function unselected(d) {
  countryClicked = '';
  d3.select('.selected').classed('selected', false);
}

//This functon will highlight the country pressed and grab the country name 
function selected(d) {


  // if (countryClicked != ''){ //clears the countryClicked variable when user presses new country 
  //     countryClicked = '';
  //     countryClicked += d.properties.name; //stores country name in variable 
  // }

  // if (countryClicked == d.properties.name){
  //   return;
  // }
  showTooltip(d)
  countryClicked = d.properties.name;  //stores country name in variable
  d3.select('.selected').classed('selected', false);
  d3.select(this).classed('selected', true);
  d3.select(this).moveToFront();
}

// zoom
function zoomed() {
  var t = d3.event.translate;
  s = d3.event.scale;
  var h = 0;

  t[0] = Math.min(
    (width / height) * (s - 1),
    Math.max(width * (1 - s), t[0])
  );

  t[1] = Math.min(
    h * (s - 1) + h * s,
    Math.max(height * (1 - s) - h * s, t[1])
  );

  zoom.translate(t);
  if (s === 1 && mouseClicked) {
    rotateMap(d3.mouse(this)[0])
    return;
  }

  g.attr("transform", "translate(" + t + ")scale(" + s + ")");

  //adjust the stroke width based on zoom level
  d3.selectAll(".boundary")
    .style("stroke-width", 1 / s);
}





// Additional charts

//Called when a country on the map is clicked
function displaylinechart(target_svg, data_yr){
  // from https://gist.github.com/mbostock/3883245
  var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });
  // Transform dictionary data into an array of objects
  var data = [];
  for (const year in data_yr) {
    data.push({ year: year, value: data_yr[year] });
  }
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  line_plot_width = target_svg.attr("width") - margin.left - margin.right,
  line_plot_height = target_svg.attr("height") - margin.top - margin.bottom;
  var x = d3.scaleLinear()
    .rangeRound([0, line_plot_width]);

  var y = d3.scaleLinear()
      .rangeRound([line_plot_height, 0]);
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));
  g = target_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + line_plot_height + ")")
    .call(d3.axisBottom(x)
            .tickFormat(d3.format(".0f")))
    .append("text")
      .attr("x", (line_plot_width / 2))
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .text("Year");

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", 10)
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "start")
      .text("Suicide per 100k");

  g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#FFFF33")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

}


function displaybarchart(target_svg, input_data){
  // from https://gist.github.com/d3noob/8952219

  const orderedKeys = [
                      "5-14",
                      "15-24",
                      "25-34",
                      "35-54",
                      "55-74",
                      "75+"]

  var sorteddata = orderedKeys.map(key => {
    return {
    year: key,
    value1: input_data["female"][key + ' years'],
    value2: input_data["male"][key + ' years']
    };
  });

  margin = {top: 20, right: 50, bottom: 30, left: 45},
  bar_plot_width = target_svg.attr("width") - margin.left - margin.right,
  bar_plot_height = target_svg.attr("height") - margin.top - margin.bottom;

  var x = d3.scaleBand().range([0, target_svg.attr("width") - margin.right]).padding(0.1);

  var y = d3.scaleLinear().rangeRound([bar_plot_height, 0]);

  x.domain(sorteddata.map(function(d) { return d.year; }));
  y.domain([-d3.max(sorteddata, function(d) { return (d3.max([d.value1, d.value2]) * 1.15); }) , d3.max(sorteddata, function(d) { return d3.max([d.value1,d.value2]); })]);
  g = target_svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + bar_plot_height + ")")
    .call(d3.axisBottom(x))
    .append("text")
      .attr("x", (margin.left + bar_plot_width) / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .text("Age group");

  g.append("g")
    .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x",10)
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "start")
      .text("Suicide per 100k");

  g.selectAll("bar")
      .data(sorteddata)
    .enter().append("rect")
      .style("fill", "#FF0066")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value1); })
      .attr("height", function(d) { return bar_plot_height/2 - y(d.value1); });

  g.selectAll("bar")
      .data(sorteddata)
    .enter().append("rect")
      .style("fill", "#3366FF")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return bar_plot_height/2 - y(d.value2); });
  
  // Add legend
  // from https://blog.csdn.net/weixin_40444691/article/details/109469189
  var data_legend = [
    {
      "name":"Female",
      "color":"#FF0066"
    },
    {
      "name":"Male",
      "color":"#3366FF"
    }];
  var legend = target_svg.selectAll(".legend")
                .data(data_legend)
                .enter().append("g")
                .attr("transform", function(d, i){
                  return "translate(400," + (i * 15 + 30) + ")";
                });
  legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 30)
        .attr("height", 10)
        .style("fill", function(d){
          return d.color;
        });
  legend.append("text")
        .attr("x", 40)
        .attr("y", 8)
        .style("text-anchor", "start")
        .style("fill", "#fff")
        .style("font-size", 10)
        .text(function(d){return d.name;});

}


const rename = new Map([
    ['Antigua and Barbuda', 'Antigua and Barbuda'],
    ['Bahrain','Bahrain'],
    ['Barbados','Barbados'],
    ['Cabo Verde','Cabo Verde'],
    ['Dominica','Dominica'],
    ['Grenada','Grenada'],
    ['Kiribati','Kiribati'],
    ['Maldives','Maldives'],
    ['Mauritius','Mauritius'],
    ['Saint Kitts and Nevis','Saint Kitts and Nevis'],
    ['Saint Lucia','Saint Lucia'],
    ['Saint Vincent and Grenadines','Saint Vincent and Grenadines'],
    ['San Marino','San Marino'],
    ['Seychelles','Seychelles'],
    ['Singapore','Singapore'],
    ['Saint Vincent and the Grenadines','Saint Vincent and the Grenadines'],
    //Above this line are countries that are too small to show on the map. Listed for further research.
    //Below are countries that have different names in suicide_data.json and world-countries.json.
    ["China, Hong Kong SAR", "China"],
    ['Aruba','Netherland'],
    ['Macau','China'],
    ['North Macedonia','The former Yugoslav Republic of Macedonia'],
    ['Republic of Korea','North Korea'],
    ['Czechia','Czech Republic'],
    ['United States of America','United States']
])
function renameKeysUsingMap(dictionary, renameMap) {
  const renamedDictionary = {};

  for (const key in dictionary) {
    if (renameMap.has(key)) {
      renamedDictionary[renameMap.get(key)] = dictionary[key];
    } else {
      renamedDictionary[key] = dictionary[key];
    }
  }

  return renamedDictionary;
}