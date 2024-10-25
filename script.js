// Load the dataset
d3.csv("yahoo_data_converted.csv").then(data => {
    
    // Convert numerical values to numbers
    data.forEach(d => {
        d.Open = +d.Open;
        d.Close = +d.Close;
        d.High = +d.High;
        d.Low = +d.Low;
        d.Volume = +d.Volume;
    });

    // Define margins, width, and height for all charts
    const margin = { top: 20, right: 30, bottom: 50, left: 60 },
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // 1. Line Chart (Timeline: Date vs Close Price)
    const svgLine = d3.select("#lineChart").append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScaleLine = d3.scaleTime()
                         .domain(d3.extent(data, d => new Date(d.Date)))
                         .range([0, width]);
    
    const yScaleLine = d3.scaleLinear()
                         .domain([0, d3.max(data, d => d.Close)])
                         .range([height, 0]);

    const line = d3.line()
                   .x(d => xScaleLine(new Date(d.Date)))
                   .y(d => yScaleLine(d.Close));

    svgLine.append("path")
           .datum(data)
           .attr("fill", "none")
           .attr("stroke", "steelblue")
           .attr("stroke-width", 1.5)
           .attr("d", line);

    // Axes
    svgLine.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(xScaleLine).ticks(6));
    svgLine.append("g")
           .call(d3.axisLeft(yScaleLine));
           
    // 2. Bar Chart (Volume by Date)
    const svgBar = d3.select("#barChart").append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                     .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    const xScaleBar = d3.scaleBand()
                        .domain(data.map(d => d.Date))
                        .range([0, width])
                        .padding(0.2);

    const yScaleBar = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.Volume)])
                        .range([height, 0]);

    svgBar.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => xScaleBar(d.Date))
          .attr("y", d => yScaleBar(d.Volume))
          .attr("width", xScaleBar.bandwidth())
          .attr("height", d => height - yScaleBar(d.Volume))
          .attr("fill", "steelblue");

    // Axes
    svgBar.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScaleBar).ticks(6));
    svgBar.append("g")
          .call(d3.axisLeft(yScaleBar));

    // 3. Scatter Plot (Open vs Close Prices)
    const svgScatter = d3.select("#scatterPlot").append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                         .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScaleScatter = d3.scaleLinear()
                            .domain([d3.min(data, d => d.Open), d3.max(data, d => d.Open)])
                            .range([0, width]);

    const yScaleScatter = d3.scaleLinear()
                            .domain([d3.min(data, d => d.Close), d3.max(data, d => d.Close)])
                            .range([height, 0]);

    svgScatter.selectAll("circle")
              .data(data)
              .enter()
              .append("circle")
              .attr("cx", d => xScaleScatter(d.Open))
              .attr("cy", d => yScaleScatter(d.Close))
              .attr("r", 5)
              .attr("fill", "steelblue");

    // Axes
    svgScatter.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(xScaleScatter));
    svgScatter.append("g")
              .call(d3.axisLeft(yScaleScatter));

    // 4. Histogram (Distribution of Closing Prices)
    const svgHist = d3.select("#histogram").append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const hist = d3.histogram()
                   .value(d => d.Close)
                   .domain([d3.min(data, d => d.Close), d3.max(data, d => d.Close)])
                   .thresholds(10);

    const bins = hist(data);

    const xScaleHist = d3.scaleLinear()
                         .domain([d3.min(bins, d => d.x0), d3.max(bins, d => d.x1)])
                         .range([0, width]);

    const yScaleHist = d3.scaleLinear()
                         .domain([0, d3.max(bins, d => d.length)])
                         .range([height, 0]);

    svgHist.selectAll("rect")
           .data(bins)
           .enter()
           .append("rect")
           .attr("x", d => xScaleHist(d.x0))
           .attr("y", d => yScaleHist(d.length))
           .attr("width", d => xScaleHist(d.x1) - xScaleHist(d.x0) - 1)
           .attr("height", d => height - yScaleHist(d.length))
           .attr("fill", "steelblue");

    // Axes
    svgHist.append("g")
           .attr("transform", `translate(0,${height})`)
           .call(d3.axisBottom(xScaleHist));
    svgHist.append("g")
           .call(d3.axisLeft(yScaleHist));

   
    const correlation = pearsonCorrelation(data.map(d => d.Open), data.map(d => d.Close));
    console.log(`Pearson Correlation (Open vs Close): ${correlation}`);

});

// Pearson Correlation Function
function pearsonCorrelation(x, y) {
    let n = x.length;
    let sumX = d3.sum(x);
    let sumY = d3.sum(y);
    let sumXY = d3.sum(x.map((d, i) => d * y[i]));
    let sumXSquare = d3.sum(x.map(d => d * d));
    let sumYSquare = d3.sum(y.map(d => d * d));

    return (n * sumXY - sumX * sumY) / (Math.sqrt((n * sumXSquare - sumX * sumX) * (n * sumYSquare - sumY * sumY)));
}
