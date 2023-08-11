var slider = document.getElementById("myRange");
const computedStyle = getComputedStyle(slider);
const width = parseInt(computedStyle.width, 10)*0.88;
const enlarge_ratio = width/962
// var width = 962,
rotated = 0,
height = 502*enlarge_ratio;

console.log("WIDTH")
console.log(width)
var colourList = ['lightgreen', 'green', 'blue', 'palevioletred', 'red', 'yellow']

//Store parsed data
// var parsedData;
// d3.json("https://jeremydavidfriesen.github.io/stackoverflow-2019-survey-world-map-d3/data.json", function(data) {
//   parsedData = data;
// });

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
// + document.getElementsByClassName();
var offsetT = document.getElementById('map').offsetTop +10;

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
var suicideData = {};
d3.json("suicide_data.json", function(error, data){
  for(var country in data){
    if (data[country]["2019"] != undefined){
    suicideData[country] = data[country]["2019"]["num"];}
  }
  suicideData = renameKeysUsingMap(suicideData, rename)
  updateMapColours("top languages");
})
d3.json("data.json", function(error, data){
  for(var country in data){
    countryData[country] = data[country];

    // parse top languages
    var topLanguage = Object.keys(data[country].languages)[0];
    if (topLanguage == "NA") topLanguage = Object.keys(data[country].languages)[1];
    if (topLanguage == undefined) topLanguage = "NA";
    if(topLanguages.indexOf(topLanguage) == -1) {
      topLanguages.push(topLanguage);
      topLanguagesColours.push(languageColours[topLanguage]);
    }

    // parse top platforms
    var topPlatform = Object.keys(data[country].platforms)[0];
    if (topPlatform == "NA") topPlatform = Object.keys(data[country].platforms)[1];
    if (topPlatform == undefined) topPlatform = "NA";
    if (topPlatforms.indexOf(topPlatform) == -1) {
      topPlatforms.push(topPlatform);
    }

    // parse top developer types
    var topDeveloperType = Object.keys(data[country].developerTypes)[0];
    if (topDeveloperType == "NA") topDeveloperType = Object.keys(data[country].developerTypes)[1];
    if (topDeveloperType == undefined) topDeveloperType = "NA";
    if (topDeveloperTypes.indexOf(topDeveloperType) == -1) {
      topDeveloperTypes.push(topDeveloperType);
    }
  }

  countryTops = {"top languages": topLanguages, "top platforms": topPlatforms, "top developer types": topDeveloperTypes};
  console.log(countryTops); //remove

  // var dropdowndiv = d3.select("body").insert("div", ":first-child");
  // dropdowndiv.insert("a").html("Colour attribute:");
  // slider range bar
  // var bardiv = d3.select("body").insert("div", ":first-child");
  // bardiv.insert("a").html("year");
  // var bar = bardiv.insert("div").attr("class", "bar").attr("id", "bar")

  var output = document.getElementById("demo");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    var year_str = String(this.value)
    d3.json("suicide_data.json", function(error, data){
      for(var country in data){
        if (data[country][year_str] != undefined){
        suicideData[country] = data[country][year_str]["num"];}
      }
      suicideData = renameKeysUsingMap(suicideData, rename)
      updateMapColours("top languages");
    })
  }
  function dragstarted(event) {
    d3.select(this).raise().attr("stroke", "black");
  }

  function dragged(event) {
    const x = event.x;
    const index = Math.round(xScale.invert(x));
    if (index >= 0 && index < years.length) {
      bar.style("left", x + "px");
      updateSelectedYear(index);
    }
  }
  function dragended(event) {
    d3.select(this).attr("stroke", null);
  }
  bar.call(d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended));

  var dropdown = dropdowndiv.insert("select")
    .attr("class", "select")

  // Page Title
  d3.select("body").insert("a", ":first-child").attr("href", "https://github.com/jeremydavidfriesen/stackoverflow-2019-survey-world-map-d3").html("Source");
  d3.select("body").insert("h2", ":first-child").html("Stack Overflow Developer Survey (2019): World Map ")

  dropdown.selectAll("option")
    .data(Object.keys(countryTops))
    .enter()
    .append("option")
    .attr("value", function (d) { return d; })
    .text(function (d) {
      return d;
      //return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
    });
    
  var legendRectSize = 18;
  var legendSpacing = 4;
  var legend = svg.append("g")
    .attr("class", "legend");

  // Handler for dropdown value change
  // var dropdownChange = function () {
  //   var selectedAttribute = d3.select(this).property('value');
  //   console.log(selectedAttribute);
  //   console.log(countryTops[selectedAttribute]);
  //   if (selectedAttribute == undefined)
  //     selectedAttribute = "top languages";

  //   var rects = legend
  //     .selectAll('rect')
  //     .data(countryTops[selectedAttribute], function(d){return d;})

  //   rects.exit().remove();

  //   rects.enter()
  //     .append('rect')
  //     .attr('width', legendRectSize)
  //     .attr('height', legendRectSize)
  //     .attr('x', width + 20)
  //     .attr('y', function (d, i) { return 100 + i * 25 })
  //     .attr('fill', function (d, i) {
  //       var value = countryTops[selectedAttribute][i]
  //       if (selectedAttribute == "top languages") {
  //         var ret = topLanguagesColours[topLanguages.indexOf(value)];
  //       } else {
  //         var ret = d3.scale.category20().domain(countryTops[selectedAttribute])(value);
  //         if(value == "NA")
  //           return "white"
  //       }
  //       if (ret == undefined)
  //         return "white";
  //       return ret;
  //     })
  //     .attr('stroke', function () { return "black" });

  //   rects.transition()
  //     .attr('y', function (d, i) { return 100 + i * 25 })
  //     .attr('fill', function (d, i) {
  //       var value = countryTops[selectedAttribute][i]
  //       if (selectedAttribute == "top languages") {
  //         var ret = topLanguagesColours[topLanguages.indexOf(value)];
  //       } else {
  //         var ret = d3.scale.category20().domain(countryTops[selectedAttribute])(value);
  //         if(value == "NA")
  //           return "white"
  //       }
  //       if (ret == undefined)
  //         return "white";
  //       return ret;
  //     })

  //   var texts = legend.selectAll('text')
  //     .data(countryTops[selectedAttribute], function (d) { return d; });

  //   texts.exit().remove()

  //   texts.enter()
  //     .append('text')
  //     .attr('x', width + 50)
  //     .attr('y', function (d, i) { return 110 + i * 25 })
  //     .text(function (d, i) { return countryTops[selectedAttribute][i]; });
  
  //   texts.transition()
  //     .attr('y', function (d, i) { return 110 + i * 25 })

  //   updateMapColours(selectedAttribute);
  // };
  
  var dropdownChange = function(){
    
    var selectedAttribute = d3.select(this).property('value');
    console.log(selectedAttribute);
    console.log(countryTops[selectedAttribute]);
    if (selectedAttribute == undefined)
      selectedAttribute = "top platforms";

    var gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%");
    
    // Add color stops to the gradient
    gradient.selectAll("stop")
      .data(colorScale.range())
      .enter().append("stop")
      .attr("offset", function(d, i) { return i / (colorScale.range().length - 1); })
      .attr("stop-color", function(d) { return d; });
    
    // Display the gradient as a rect
    // legendHeight =20
    // svg.append("rect")
    //   .attr("width", 200)
    //   .attr("height", legendHeight)
    //   .attr('x', width + 50)
    //   .attr('y', function (d, i) { return 110 + i * 25 })
    //   .style("fill", "url(#gradient)");
    
    // // Position and style the legend
    // svg.attr("transform", "translate(10, 10)");
    
    // // Add marks to the color bar legend
    // var markPercentages = [0, 25, 50, 75];
    // var markValues = markPercentages.map(function(percentage) {
    //   return colorScale.invert(percentage / 100*colorScale.max); // Calculate the data value from the percentage
    //   // return colorScale.invert(20); // Calculate the data value from the percentage
    // });
    // var markGroup = svg.append("g")
    // .attr("class", "color-bar-marks");

    // console.log(markValues)
    // markGroup.selectAll("line")
    // .data(markValues)
    // .enter().append("line")
    // .attr("x1", function(d) { return colorScale(d); })
    // .attr("x2", function(d) { return colorScale(d); })
    // // .attr("x1", function(d) { return (d); })
    // // .attr("x2", function(d) { return (d); })
    // .attr("y1", 0)
    // .attr("y2", legendHeight)
    // .style("stroke", "black")
    // .style("stroke-width", 2);

    // // Add labels to the marks
    // markGroup.selectAll("text")
    // .data(markValues)
    // .enter().append("text")
    // .attr("x", function(d) { return colorScale(d)+ width+50; })
    // .attr("y", legendHeight + 14)
    // .attr("text-anchor", "middle")
    // .text(function(d) { return Math.round(d * 100) + "%"; });

    updateMapColours(selectedAttribute);
  };
  dropdown.on("change", dropdownChange);
  dropdownChange();
});


//console.log(countryData);
console.log("topLanguages: ");
console.log(topLanguages);
console.log("topLanguagesColours: ");
console.log(topLanguagesColours);


var colorScale = d3.scale.linear()
  .domain([0, 10000]) // Set the domain of your continuous data
  .range(["blue", "red"]);
  // .interpolator(d3.interpolateViridis); // Choose an interpolator for color mapping (e.g., interpolateViridis)

// update the colour of each country, by attribute parameter
function updateMapColours(attribute){
  if(countries != undefined){
    console.log(countries);
    console.log(countryData);

    var altName = attribute;
    if(attribute == 'top languages'){
      altName = 'languages';
    } else if(attribute == 'top platforms'){
      altName = 'platforms';
    } else if(attribute == 'top developer types'){
      altName = 'developerTypes';
    }

    countries.attr("style", function (d) {
      // var colour = "white";
      var colour = "f0f0f0";
      if (d.properties.name != undefined && countryData[d.properties.name] != undefined){
        //countryData[d.properties.name][altName][0]
        var value = Object.keys(countryData[d.properties.name][altName])[0];
        if(value == "NA" && Object.keys(countryData[d.properties.name][altName])[1] != undefined)
          value = Object.keys(countryData[d.properties.name][altName])[1];

        var colour = "white"
        // if (altName == "languages") {
          // colour = topLanguagesColours[topLanguages.indexOf(value)];
        // } else {
          // colour = d3.scale.category20().domain(countryTops[attribute])(value);
          // colour = d3.scale.category20().domain(suicideData)(value);
        value = suicideData[d.properties.name]
        colour = colorScale(value)
        if (value == "NA")
          colour = "white"
        // }
      }
      console.log(colour);
      return "fill:" + colour + ";";
    })
    console.log(countryData);
    console.log(countryTops);
    // console.log(parsedData);
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
    .attr("style", function (d) {
      var colour = "#f0f0f0";
      
      if(suicideData[d.properties.name] != undefined){
        value = suicideData[d.properties.name]
        colour = colorScale(value)
        if (value == "NA")
          colour = "white"

        if(colour == undefined){
          //console.log('language issue: ' + languages[0] + ', country: ' + d.properties.name);
          colour = "#f0f0f0";
        } else{

        }
      }else{
        //console.log("Country issue: " + d.properties.name);
      }
      return "fill:" + colour + ";";
    })
    // .on('click', selected)
    .on("mousemove", selected)
    .on("mouseout", function (d, i) {
      unselected()
      tooltip.classed("hidden", true);
    })
    .attr("d", path);
});

// tooltip
function showTooltip(d) {
  label = d.properties.name;
  
  var mouse = d3.mouse(svg.node())
    .map(function (d) { return parseInt(d); });
  tooltip.classed("hidden", false)
    .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
    .html(label);
}

// selection
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

//This functon will unhighlight the country and grab the country name 
function unselected() {
  d3.select('.selected').classed('selected', false);
}
//This functon will highlight the country pressed and grab the country name 
function selected(d) {
  showTooltip(d)
 
  if (countryClicked != ''){ //clears the countryClicked variable when user presses new country 
      countryClicked = '';
      countryClicked += d.properties.name; //stores country name in variable 
  }

  countryClicked = d.properties.name;  //stores country name in variable
  console.log(countryClicked); 

  //Aabids function for his graphs can go here and he can pass it country name
  // let attribute = "languages";
  // displayBarCharts(countryClicked, attribute, "Languages", true, 1);
  // attribute = "platforms";
  // displayBarCharts(countryClicked, attribute, "Platforms", true, 2);
  // attribute = "yearsCoding";
  // displayBarCharts(countryClicked, attribute, "Coding Experience", false, 3);
  // attribute = "developerTypes";
  // displayBarCharts(countryClicked, attribute, "Developer Types", true, 4);
  
  // attribute = "student";
  // displayPieCharts(countryClicked, attribute, "Student", 5);
  // attribute = "genders";
  // displayPieCharts(countryClicked, attribute, "Gender", 6);

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
// function displayBarCharts(countryClicked, attribute, xLabel, bool, index){
//   //use the parsed data
//   // console.log("ds");
//   // console.log(parsedData[countryClicked]);
//   let data = countryData[countryClicked][attribute];
//   // console.log(data);
//   // console.log(Object.keys(data));
//   // console.log(Object.values(data));

//   let maxY = Math.max(...Object.values(data));
//   let newData = [];

//   let maxLength = 10;
//   if (Object.keys(data).length < maxLength){
//     maxLength = Object.keys(data).length;
//   }
//   for (let i = 0; i < maxLength; i++){
//     newData.push({'x': `${Object.keys(data)[i]}`, "y": `${Object.values(data)[i]}`});
//   }

//   //console.log("newData = ", newData);

//   let div = document.getElementById(`vis${index}`);
//   if(div.hasChildNodes()){
//     let removeTable = document.getElementById(`svgChart${index}`);
//     removeTable.parentNode.removeChild(removeTable);
//   }

//   const margin = 50;
//   const width = 500;
//   const height = 500;
//   const chartWidth = width - 2 * margin;
//   const chartHeight = height - 2 * margin - 80;

//   const colourScale = d3.scale.ordinal()
//                         //.domain([0, d3.max(data, d => d.y)])
//                         .domain([0, 5])
//                         .range(colourList);

//   const xScale = d3.scale.ordinal()
//                    .rangeRoundBands([0, chartWidth], .1)
//                    .domain(newData.map((d) => d.x))
//   //console.log("domain = ", xScale.domain())

//   const yScale = d3.scale.linear()
//                    .range([chartHeight, 0])
//                    .domain([0, maxY]);
//   //console.log("domain = ", yScale.domain())

//   const xAxis = d3.svg.axis()
//                   .scale(xScale)
//                   .orient("bottom")

//   const yAxis = d3.svg.axis()
//                   .scale(yScale)
//                   .orient("left")
  
//   const svg = d3.select(`#vis${index}`)
//                 .append('svg')
//                   .attr('id', `svgChart${index}`)
//                   .attr('class', 'graph')
//                   .attr('width', width)
//                   .attr('height', height);
  
//   const canvas = svg.append('g')
//                       .attr('transform', `translate(${margin}, ${margin})`);
  
//   let title;
//   if (bool == true){
//     title = `Top ${maxLength} ${xLabel} in ${countryClicked}`
//   }
//   else{
//     title = `${xLabel} in ${countryClicked}`
//   }
//   // chart title
//   svg.append('text')
//         .attr('x', margin + chartWidth / 1.75)
//         .attr('y', margin - 30)
//         .attr('text-anchor', 'middle')
//         .text(title)
//         .attr('font-size', 22)
//         .attr('font-weight', 'bold')
//         .style("text-decoration", "underline");

//   // x-axis and label
//   canvas.append('g')
//     .attr('transform', `translate(${margin}, ${chartHeight})`)
//     .call(xAxis)
//     .selectAll("text")  
//       .style("text-anchor", "end")
//       .attr("dx", "-.8em")
//       .attr("dy", ".15em")
//       .attr("transform", "rotate(-65)")
//       .attr('font-size', 10);

//   svg.append('text')
//         .attr('x', margin + chartWidth / 2 + margin)
//         .attr('y', chartHeight + 2 * margin + 60)
//         .attr('text-anchor', 'middle')
//         .text(`${xLabel}`)
//         .attr('font-weight', 'bold')
//         .style('fill', 'red');
    

//   // y-axis and label
//   canvas.append('g')
//            .attr('transform', `translate(50, 0)`)
//            .call(yAxis)
//            .attr('font-size', 15);

//   svg.append('text')
//         .attr('x', margin + -(chartWidth / 1.7))
//         .attr('y', margin - 10)
//         .attr('transform', 'rotate(-90)')
//         .attr('text-anchor', 'middle')
//         .text('Count')
//         .attr('font-weight', 'bold')
//         .style('fill', 'red');


//   //const legend = canvas.
//   var xs = [];
//   for (var i = 0; i < newData.length; i++) {
//     xs.push(newData[i].x);
//   }
  
//   // the bar chart
//   const bars = canvas.selectAll('rect')
//     .data(newData)
//     .enter()
//       .append('rect')
//           .attr('x', (d) => margin + xScale(d.x))
//           .attr('y', chartHeight)
//           .attr('height', 0)
//           .attr('width', xScale.rangeBand())
//           .on('mouseenter', function(source, index) {
//               d3.select(this)
//                 .transition()
//                 .duration(200)
//                 .attr('opacity', 0.5);
//           })
//           .on('mouseleave', function(source, index) {
//             d3.select(this)
//                 .transition()
//                 .duration(200)
//                 .attr('opacity', 1.0);
//           });
  
//   bars.transition()
//     .ease("elastic")
//     .duration(800)
//     .delay((d, index) => index * 50)
//     .attr('y', (d) => yScale(d.y))
//     .attr('height', (d)  => chartHeight - yScale(d.y))
//     .attr('fill', function (d) {
//       return d3.scale.category20().domain(xs)(d.x);
//     })
// }


// function displayPieCharts(countryClicked, attribute, xLabel, index){
//   var w = 500;
//   var h = 500;
//   var r = h/3;
//   var color = d3.scale.category10();

//   let div = document.getElementById(`vis${index}`);
//   if(div.hasChildNodes()){
//     let removeTable = document.getElementById(`svgChart${index}`);
//     removeTable.parentNode.removeChild(removeTable);
//   }

//   console.log(countryData[countryClicked]);
//   let data = countryData[countryClicked][attribute];
//   //console.log(data);
//   //console.log(Object.keys(data));
//   //console.log(Object.values(data));

//   let maxY = Math.max(...Object.values(data));
//   let newData = [];

//   let maxLength = 10;
//   if (Object.keys(data).length < maxLength){
//     maxLength = Object.keys(data).length;
//   }

//   let totalCount = d3.sum(Object.values(data))
//   //console.log("totalCount", totalCount);
//   for (let i = 0; i < maxLength; i++){
//     let percent = Math.round(Object.values(data)[i]/totalCount * 100)
//     //console.log("divide = ", percent)
//     newData.push({'category': `${Object.keys(data)[i]}`, "value": `${percent}`});
//   }

//   //console.log("newData = ", newData);

//   var vis = d3.select(`#vis${index}`)
//                 .append("svg:svg")
//                   .attr('id', `svgChart${index}`)
//                   .attr('class', 'graph')
//                   .data([newData])
//                   .attr("width", w)
//                   .attr("height", h)
//                   .append("svg:g")
//                     .attr("transform", "translate(" + r * 1.62 + "," + r * 1.62 + ")");

//   var pie = d3.layout.pie().value(function(d){return d.value;});

//  // chart title
//   vis.append('text')
//         .attr('x', 0)
//         .attr('y', -240)
//         .attr('text-anchor', 'middle')
//         .text(`${xLabel} Distribution in ${countryClicked}`)
//         .attr('font-size', 22)
//         .attr('font-weight', 'bold')
//         .style("text-decoration", "underline");

//   // Declare an arc generator function
//   var arc = d3.svg.arc().outerRadius(r);

//   // Select paths, use arc generator to draw
//   var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
//   arcs.append("svg:path")
//       .attr("fill", function(d, i){return color(i);})
//       .attr("d", function (d) {return arc(d);})
//   ;

//   // Add the text
//   arcs.append("svg:text")
//       .attr("transform", function(d){
//           d.innerRadius = 100; /* Distance of label to the center*/
//           d.outerRadius = r;
//           return "translate(" + arc.centroid(d) + ")";}
//       )
//       .attr("text-anchor", "middle")
//       .text( function(d, i) {return newData[i].value + '%';})
//       .attr('font-size', 12);

//   //remove this later
//   arcs.append("svg:text")
//       .attr("transform", function(d){
//           d.innerRadius = 200; /* Distance of label to the center*/
//           d.outerRadius = r;
//           return "translate(" + arc.centroid(d) + ")";}
//       )
//       .attr("text-anchor", "middle")
//       .text( function(d, i) {return newData[i].category;})
      
//       .attr('font-size', 12);
// }

const rename = new Map([
  ["China, Hong Kong SAR", "China"],
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