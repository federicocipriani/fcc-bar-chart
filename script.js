const w = 800;
const h = 400;
const padding = 50;

const svg = d3.select('svg').attr('width', w).attr('height', h);
// .style('border', '1px solid black');

fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
    .then((response) => response.json())
    .then((dataset) => {
        var binLenght = w / dataset.data.length;

        // Arrays containing the x and y axis data
        var dates = dataset.data.map((item) => new Date(item[0]));
        var gdp = dataset.data.map((item) => item[1]);

        // Get min and max values
        var date_min = d3.min(dates);
        var date_max = d3.max(dates);
        var gdp_min = d3.min(gdp);
        var gdp_max = d3.max(gdp);

        // Scaling the domain to the dimensions of the canvas
        const xScale = d3
            .scaleTime()
            .domain([date_min, date_max])
            .range([padding, w - padding]);
        const yScale = d3
            .scaleLinear()
            .domain([0, gdp_max])
            .range([h - padding, padding]);

        // Add axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + (h - padding) + ')')
            .call(xAxis);
        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + padding + ',0)')
            .call(yAxis);

        d3.select('svg')
            .selectAll('rect')
            .data(dataset.data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(i * binLenght))
            .attr('y', (d, i) => h - padding - yScale(d[1]))
            .attr('width', binLenght)
            .attr('height', (d) => yScale(d[1]))
            .attr('fill', 'teal');
    });

// d3.json(
//     'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',
//     (dataf) => {
//         console.log(dataf.data);
//     }
// );
