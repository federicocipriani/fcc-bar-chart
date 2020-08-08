const w = 740;
const h = 400;
var margins = { right: 40, left: 80, top: 50, bottom: 50 };
const padding = 80;

const svg = d3
    .select('svg')
    .attr('width', w + (margins.right + margins.left))
    .attr('height', h + (margins.top + margins.bottom));

fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
    .then((response) => response.json())
    .then((dataset) => {
        var binLenght = w / dataset.data.length;

        // Arrays containing the x and y axis data
        const dates = dataset.data.map((item) => item[0]);
        const datesFormat = dates.map((item) => new Date(item));
        var gdp = dataset.data.map((item) => item[1]);

        // Get min and max values
        var date_min = d3.min(datesFormat);
        var date_max = d3.max(datesFormat);
        var gdp_min = d3.min(gdp);
        var gdp_max = d3.max(gdp);

        // Adjust max GDP value to get a better graph
        if (gdp_max % 2000 !== 0) {
            gdp_max = gdp_max - (gdp_max % 2000) + 2000;
        }

        // Adjust latest date to get a better graph
        var date_max_limit = new Date(date_max);
        date_max_limit.setMonth(date_max_limit.getMonth() + 3);

        // var newdate = date_max.setMonth(date_max.getMonth() + 3);
        // console.log(newdate);

        // Scaling the domain to the dimensions of the canvas
        var xScale = d3
            .scaleTime()
            .domain([date_min, date_max_limit])
            .range([margins.left, w + margins.left]);

        var yScale = d3
            .scaleLinear()
            .domain([0, gdp_max])
            .range([h + margins.top, margins.top]);

        // Render the columns
        d3.select('svg')
            .selectAll('rect')
            .data(gdp)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(datesFormat[i]))
            .attr('y', (d) => yScale(d))
            .attr('width', binLenght)
            .attr('height', (d) => h + margins.top - yScale(d))
            .attr('fill', 'teal')
            .attr('data-date', (d, i) => dates[i])
            .attr('data-gdp', (d, i) => gdp[i])
            .attr('class', 'bar')
            .on('mouseover', (d) => console.log(d));

        // Add axes
        var xAxis = d3.axisBottom(xScale).tickPadding(8);
        var yAxis = d3.axisLeft(yScale);

        var xAxisGrid = d3.axisTop(xScale).tickFormat('').ticks(0).tickSize(-h);
        var yAxisGrid = d3.axisLeft(yScale).tickFormat('').tickSize(-w);

        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0,' + (h + margins.top) + ')')
            .call(xAxis);
        svg.append('g')
            .attr('id', 'x-axis-top')
            .attr('transform', 'translate(0,' + margins.top + ')')
            .call(xAxisGrid);
        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + margins.left + ',0)')
            .call(yAxis);
        svg.append('g')
            .attr('id', 'y-axis-grid')
            .attr('transform', 'translate(' + margins.left + ',0)')
            .call(yAxisGrid);
        svg.append('text')
            .text('Gross Domestic Product (GDP)')
            .attr('transform', 'rotate(-90)')
            .attr('x', -(h / 1.5 + margins.top))
            .attr('y', margins.left / 3);
        svg.append('text')
            .text('Years')
            .attr('x', margins.left + w / 2.1)
            .attr('y', h + 1.9 * margins.top);
    });
