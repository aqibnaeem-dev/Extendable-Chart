import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart1 = () => {
    const svgRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0)
    const [redLine, setRedLine] = useState()

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



    const createGraph = async () => {
        // Generate fake data
        const data = generateFakeData(50); // Change the number of data points as needed

        // Set the dimensions and margins of the graph
        const margin = { top: 20, right: 20, bottom: 50, left: 30 };
        const width = 960 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        d3.select(svgRef.current).selectAll('*').remove()

        // Append the SVG object to the body of the page
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Define initial y-axis domain and range
        const initialYMax = d3.max(data, (d) => d.value);
        const initialYMin = d3.min(data, (d) => d.value);
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

        // Create a horizontal green draggable line
        let dragLineRed = g
            .append("line")
            .attr("class", "drag-line")
            .attr("stroke", "red")
            .attr("stroke-width", 4)
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", height) // Initialize the line at the bottom of the chart
            .attr("y2", height);

        // Create separate text elements to display the values above the lines
        const valueTextGreen = svg.append("text")
            .attr("class", "value-text")
            .attr("text-anchor", "left")
            .style("fill", "green");

        // Create separate text elements to display the values above the lines
        const valueTextRed = svg.append("text")
            .attr("class", "value-text")
            .attr("text-anchor", "left")
            .style("fill", "red");

        // Define the drag behavior for the green line
        let initialY = height;

        // Store the maximum Y value
        let maxY = initialYMax;
        let minY = initialYMin
        console.log("Min Y: ", minY)

        let lastVal = -Infinity;

        // Define the drag behavior for the green line
        const dragGreen = d3.drag()
            .on("start", () => dragLineGreen.style("cursor", "grabbing"))
            .on("drag", (event) => {
                // Calculate the new Y position
                // let newY = initialY + event.dy;
                const newY = Math.max(0, Math.min(height, event.y));
                const invertedYRed = y.invert(newY);

                valueTextGreen
                    .attr("x", 50) // Centered horizontally
                    .attr("y", newY - 1) // Slightly above the red line
                    .text(`Green Line Value: ${invertedYRed.toFixed(2)}`);

                // Ensure the line stays within the graph's boundaries
                // newY = Math.max(0, newY);

                // Update the drag line's position
                dragLineGreen.attr("y1", newY).attr("y2", newY);

                // Calculate the expansion factor based on the drag direction
                const expansionFactor = newY / initialY;

                if (newY === 0) {
                    maxY = maxY + Math.exp(expansionFactor);
                    // minY = minY + Math.exp(expansionFactor)
                    lastVal = newY
                    y.domain([minY, maxY]);
                } else if (newY < lastVal) {
                    maxY = maxY + Math.exp(expansionFactor);
                    // minY = minY + Math.exp(expansionFactor)
                    console.log("If statement, newY, lastVal", newY, lastVal)
                    lastVal = newY
                    console.log("maxY , expansionFactor, minY : ", maxY, expansionFactor, minY)
                    y.domain([minY, maxY]);
                } else if (newY >= lastVal) {
                    minY = minY - Math.exp(expansionFactor)
                    lastVal = newY
                    y.domain([minY, maxY])
                    console.log("Else statement, newY, lastVal", newY, lastVal)
                    console.log("maxY , expansionFactor, minY : ", maxY, expansionFactor, minY)
                }



                // // Update the y-axis domain to expand vertically
                // y.domain([0, maxY]);

                // Update the y-axis
                yAxis.call(d3.axisLeft(y));

                // Redraw the line with the updated y-scale
                g.select(".line").attr("d", line);
            })
            .on("end", () => dragLineGreen.style("cursor", "grab"));;

        // Define the drag behavior for the green line
        const dragRed = d3.drag()
            .on("start", () => dragLineRed.style("cursor", "grabbing"))
            .on("drag", (event) => {
                // Calculate the new Y position
                // let newY = initialY + event.dy;
                const newY = Math.max(0, Math.min(height, event.y));
                const invertedYRed = y.invert(newY);

                valueTextRed
                    .attr("x", 50) // Centered horizontally
                    .attr("y", newY - 1) // Slightly above the red line
                    .text(`Red Line Value: ${invertedYRed.toFixed(5)}`);

                // Ensure the line stays within the graph's boundaries
                // newY = Math.max(0, newY);

                // Update the drag line's position
                dragLineRed.attr("y1", newY).attr("y2", newY);

                // Calculate the expansion factor based on the drag direction
                const expansionFactor = newY / initialY;

                if (newY === 0) {
                    maxY = maxY + Math.exp(expansionFactor);
                    // minY = minY + Math.exp(expansionFactor)
                    lastVal = newY
                    y.domain([minY, maxY]);
                } else if (newY < lastVal) {
                    maxY = maxY + Math.exp(expansionFactor);
                    // minY = minY + Math.exp(expansionFactor)
                    console.log("If statement, newY, lastVal", newY, lastVal)
                    lastVal = newY
                    console.log("maxY , expansionFactor, minY : ", maxY, expansionFactor, minY)
                    y.domain([minY, maxY]);
                } else if (newY >= lastVal) {
                    minY = minY - Math.exp(expansionFactor)
                    lastVal = newY
                    y.domain([minY, maxY])
                    console.log("Else statement, newY, lastVal", newY, lastVal)
                    console.log("maxY , expansionFactor, minY : ", maxY, expansionFactor, minY)
                }



                // // Update the y-axis domain to expand vertically
                // y.domain([0, maxY]);

                // Update the y-axis
                yAxis.call(d3.axisLeft(y));

                // Redraw the line with the updated y-scale
                g.select(".line").attr("d", line);
            })
            .on("end", () => dragLineRed.style("cursor", "grab"));



        // Apply the drag behavior to the green line
        dragLineGreen.call(dragGreen);
        dragLineRed.call(dragRed);
    };

    useEffect(() => {
        createGraph();
    });

  
    return <svg ref={svgRef}></svg>;
};

export default LineChart1;
