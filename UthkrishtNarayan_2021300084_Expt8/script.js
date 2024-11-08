// Load and parse the dataset
const filePath = 'covtype.csv';

d3.csv(filePath).then(data => {
    console.log(data); // Check data

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Helper function for creating SVG elements
    function createSVG(selector) {
        return d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
    }

    // 1. Bar Chart
    createBarChart(data);
    function createBarChart(data) {
        const svg = createSVG("#bar-chart");

        const x = d3.scaleBand().domain(data.slice(0, 10).map(d => d['Elevation'])).range([0, width]).padding(0.1);
        const y = d3.scaleLinear().domain([0, d3.max(data.slice(0, 10), d => +d['Aspect'])]).range([height, 0]);

        svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll(".bar").data(data.slice(0, 10)).enter().append("rect")
            .attr("x", d => x(d['Elevation']))
            .attr("y", d => y(d['Aspect']))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d['Aspect']))
            .attr("fill", "steelblue");
    }

    // 2. Pie Chart
    createPieChart(data);
    function createPieChart(data) {
        const pieData = d3.pie().value(d => +d['Aspect'])(data.slice(0, 5));
        const arc = d3.arc().innerRadius(0).outerRadius(Math.min(width, height) / 2);

        const svg = d3.select("#pie-chart").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        svg.selectAll("path").data(pieData).enter().append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => d3.schemeCategory10[i % 10]);
    }

    // 3. Histogram
    createHistogram(data);
    function createHistogram(data) {
        const values = data.map(d => +d['Slope']);
        const bins = d3.histogram().domain(d3.extent(values)).thresholds(10)(values);

        const x = d3.scaleLinear().domain(d3.extent(values)).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(bins, d => d.length)]).range([height, 0]);

        const svg = createSVG("#histogram");

        svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll("rect").data(bins).enter().append("rect")
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - y(d.length))
            .attr("fill", "orange");
    }

    // 4. Scatter Plot
    createScatterPlot(data);
    function createScatterPlot(data) {
        const svg = createSVG("#scatter-plot");

        const x = d3.scaleLinear().domain(d3.extent(data, d => +d['Elevation'])).range([0, width]);
        const y = d3.scaleLinear().domain(d3.extent(data, d => +d['Horizontal_Distance_To_Hydrology'])).range([height, 0]);

        svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll("circle").data(data.slice(0, 50)).enter().append("circle")
            .attr("cx", d => x(d['Elevation']))
            .attr("cy", d => y(d['Horizontal_Distance_To_Hydrology']))
            .attr("r", 5)
            .attr("fill", "green");
    }

    // 5. Bubble Plot
    createBubblePlot(data);
    function createBubblePlot(data) {
        const svg = createSVG("#bubble-plot");

        const x = d3.scaleLinear().domain(d3.extent(data, d => +d['Elevation'])).range([0, width]);
        const y = d3.scaleLinear().domain(d3.extent(data, d => +d['Horizontal_Distance_To_Hydrology'])).range([height, 0]);
        const r = d3.scaleSqrt().domain(d3.extent(data, d => +d['Vertical_Distance_To_Hydrology'])).range([2, 20]);

        svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x));
        svg.append("g").call(d3.axisLeft(y));

        svg.selectAll("circle").data(data.slice(0, 50)).enter().append("circle")
            .attr("cx", d => x(d['Elevation']))
            .attr("cy", d => y(d['Horizontal_Distance_To_Hydrology']))
            .attr("r", d => r(d['Vertical_Distance_To_Hydrology']))
            .attr("fill", "purple")
            .attr("opacity", 0.7);
    }

    // Add implementations for Word chart, Box plot, Violin plot, Regression plot, 3D chart, and Jitter plot as needed.

}).catch(error => {
    console.error("Error loading the data: ", error);
});
