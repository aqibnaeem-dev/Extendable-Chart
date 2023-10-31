import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineChart = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    const createGraph = async () => {
      // Generate fake data
      const data = generateFakeData(50); // Change the number of data points as needed

      // Set the dimensions and margins of the graph
      const margin = { top: 20, right: 20, bottom: 50, left: 70 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      // Append the SVG object to the body of the page
      const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Define initial y-axis domain and range
      const initialYMax = d3.max(data, (d) => d.value);
      let y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);

      // Create the line generator
      const line = d3.line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      // Add X and Y axes
      const x = d3.scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width]);
      
      g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
      
      const yAxis = g.append("g").call(d3.axisLeft(y));

      // Add the line
      g.append("path")
        .data([data])
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      // Create a horizontal green draggable line
      let dragLineGreen = g
        .append("line")
        .attr("class", "drag-line")
        .attr("stroke", "green")
        .attr("stroke-width", 4)
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", height) // Initialize the line at the bottom of the chart
        .attr("y2", height);

      // Define the drag behavior for the green line
      const dragGreen = d3.drag().on("drag", function (event) {
        const newY = Math.max(0, Math.min(height, event.y));
        dragLineGreen.attr("y1", newY).attr("y2", newY);

        // Update the y-axis domain to expand vertically when moved up
        y.domain([0, initialYMax + (height - newY) * (initialYMax / height)]);

        // Update the y-axis
        yAxis.call(d3.axisLeft(y));

        // Redraw the line with the updated y-scale
        g.select(".line").attr("d", line);
      });

      // Apply the drag behavior to the green line
      dragLineGreen.call(dragGreen);
    };

    createGraph();
  }, []);

  // Function to generate fake data
  const generateFakeData = (count) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const value = Math.random() * 100; // Random value for demonstration
      data.push({ date, value });
    }

    return data;
  };

  return <svg ref={svgRef}></svg>;
};

export default LineChart;
