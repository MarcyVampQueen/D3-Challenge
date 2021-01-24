/* Step 1
 * Define the "workspace area"
 */
// =================================
var svgArea = d3.select("body").select("svg");

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// append svg and group
var svg = d3.select("#plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


/* Step 2
 * Access the data from somewhere and pull it into 
 * your program
 */
// =================================
d3.csv("D3_data_journalism/data.csv").then(function (healthData) {
    console.log(healthData);

    /* Step 3:
     * Prep the data - 
     * clean and/or filter
     */
    // =================================
    healthData.forEach(state => state.healthcare = +state.healthcare);
    healthData.forEach(state => state.poverty = +state.poverty);
    console.log(healthData);

    /* Step 4:
     * Scales and axes
     */
    // =================================
    // scales
    var xScale = d3.scaleLinear()
        .domain([0, pizzasEatenByMonth.length])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(pizzasEatenByMonth)])
        .range([height, 0]);

    // skip axes on this activity


    /* Step 5:
     * Draw the actual chart!
     */
    // =================================
    // create path
    // line generator
    var lineGenerator = d3.line()
        .x((d, i) => xScale(i))
        .y(d => yScale(d));

    chartGroup.append("path")
        .attr("d", lineGenerator(pizzasEatenByMonth))
        .attr("fill", "none")
        .attr("stroke", "blue");

    // append circles to data points
    // Note that I've saved these into a new variable - now I
    // can reference these elements and their bound data when needed!
    var circlesGroup = chartGroup.selectAll("circle")
        .data(pizzasEatenByMonth)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xScale(i))
        .attr("cy", d => yScale(d))
        .attr("r", "5")
        .attr("fill", "red");


    /* Step 6:
     * Add text/titles/etc.
     */
    // =================================
    // Skip for this activity


    /* Step 7:
     * Add the interactivity!
     */
    // =======================================================

    // part a: append a div to the body. This is empty at time
    // of creation.
    var toolTip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    // part b: create handlers
    function onMouseover(d, i) {
        toolTip.style("display", "block");
        toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    }

    function onMouseout(d, i) {
        toolTip.style("display", "none");
    }

    // part c: add event listener
    circlesGroup.on("mouseover", onMouseover).on("mouseout", onMouseout);


    //You can put multiple functionality on a single element!
    function onClick(d, i) {
        alert(`Hey! I already told you, ${pizzasEatenByMonth[i]} pizzas!`)
    }
    circlesGroup.on("mouseover", onMouseover)
        .on("mouseout", onMouseout)
        .on("click", onClick);
}
    , function (error) {
        console.log(error);
    });