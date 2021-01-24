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
    /* Step 3:
     * Prep the data - 
     * clean and/or filter
     */
    // =================================
    healthData.forEach(state => state.healthcare = +state.healthcare);
    healthData.forEach(state => state.poverty = +state.poverty);
    console.log(healthData.map(s => s.poverty));

    /* Step 4:
     * Scales and axes
     */
    // =================================
    // scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(healthData.map(s => s.poverty))])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(healthData.map(s => s.healthcare))])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);


    /* Step 5:
     * Draw the actual chart!
     */
    // =================================
    // append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "5")
        .attr("fill", "red");


    /* Step 6:
     * Add text/titles/etc.
     */
    // =================================
    // label the circles
    // chartGroup.append("text")
    //     .
    // X axis title
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text("Poverty");

    // Y axis title
    chartGroup.append("text")
        // this rotation makes things weird!
        // x and y placements will seem transposed.
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        // "em" used to offset the text. 1em is equivalent to 
        // the font size. For example, if default text is 16px, then 1 em is 16, 
        // 2 is 32px, etc. Used to dynamically place text regardless of size.
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Healthcare");


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