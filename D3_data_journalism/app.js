/* Step 1
 * Define the "workspace area"
 */
// =================================
var svgArea = d3.select("body").select("svg");

var svgWidth = window.innerWidth - 100;
var svgHeight = window.innerHeight - 100;

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
 * Access the data and pull it in
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
    console.log(healthData);

    /* Step 4:
     * Scales and axes
     */
    // =================================
    healthcare = healthData.map(s => s.healthcare);
    poverty = healthData.map(s => s.poverty)
    var xScale = d3.scaleLinear()
        .domain([d3.min(poverty) - 1, d3.max(poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(healthcare) - 1, d3.max(healthcare)])
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
    var chartData = chartGroup.selectAll("circles")
        .data(healthData);
    var chartDataEnter = chartData.enter().append("g")
    var circlesGroup = chartDataEnter.append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "#B2F1DF");

    /* Step 6:
     * Add text/titles/etc.
     */
    // =================================
    // label the circles
    chartDataEnter.append("text")
        .attr("dx", d => xScale(d.poverty))
        .attr("dy", d => yScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "10px")
        .text(d => d.abbr);
    // X axis title
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top})`)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "after-edge")
        .attr("font-size", "16px")
        .text("In Poverty (%)");

    // Y axis title
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - height / 2)
        .attr("y", 0 - margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)");


    /* Step 7:
     * Add the interactivity!
     */
    // =======================================================
    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`<strong>% In Poverty: ${d.poverty}<strong><hr>% Without Healthcare: ${d.healthcare}`);
        });

    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function (d) {
        toolTip.show(d, this);
    })
        // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function (d) {
            toolTip.hide(d);
        });
}
    , function (error) {
        console.log(error);
    });