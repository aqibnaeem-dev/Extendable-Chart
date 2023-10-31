import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Chart2 = () => {
    useEffect(() => {
        const createGraph = async () => {
            // Read from CSV and format variables
            let data = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv');
            let parseTime = d3.timeParse("%Y-%m-%d");
            data.forEach((d) => {
                d.date = parseTime(d.date);
                d.value = +d.value;
            });

            // Set the dimensions and margins of the graph
            var margin = { top: 20, right: 20, bottom: 50, left: 70 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            // Append the SVG object to the body of the page
            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // Create X and Y scales
            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);
            x.domain(d3.extent(data, (d) => { return d.date; }));
            y.domain([0, d3.max(data, (d) => { return d.value; })]);

            // Add X and Y axes
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add the line
            var valueLine = d3.line()
                .x((d) => { return x(d.date); })
                .y((d) => { return y(d.value); });
            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", valueLine);

            // Create a horizontal red draggable line
            const dragLineRed = svg.append("line")
                .attr("class", "drag-line")
                .attr("stroke", "red")
                .attr("stroke-width", 4)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", height - 100) // Initialize the line at the bottom of the chart
                .attr("y2", height - 100);

            // Create a horizontal green draggable line
            const dragLineGreen = svg.append("line")
                .attr("class", "drag-line")
                .attr("stroke", "green")
                .attr("stroke-width", 4)
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", height) // Initialize the line at the bottom of the chart
                .attr("y2", height);

            // Create separate text elements to display the values above the lines
            const valueTextRed = svg.append("text")
                .attr("class", "value-text")
                .attr("text-anchor", "left")
                .style("fill", "red");

            const valueTextGreen = svg.append("text")
                .attr("class", "value-text")
                .attr("text-anchor", "left")
                .style("fill", "green");

            // Define the drag behavior for the red line
            const dragRed = d3.drag()
            .on("start", () => dragLineRed.style("cursor", "grabbing"))
            .on("drag", (event) => {
              // Calculate the new Y position based on the mouse event
              const newY = Math.max(0, Math.min(height, event.y));
          
              // Update the red line's y-coordinates during dragging
              dragLineRed.attr("y1", newY).attr("y2", newY);
          
              // Calculate the corresponding value based on the position of the red line
              const invertedYRed = y.invert(newY);
          
              // Update the displayed value text position for the red line
              valueTextRed
                .attr("x", 10) // Centered horizontally
                .attr("y", newY - 10) // Slightly above the red line
                .text(`Red Line Value: ${invertedYRed.toFixed(2)}`);
            })
            .on("end", () => dragLineRed.style("cursor", "grab"));
          

            // Define the drag behavior for the green line
            const dragGreen = d3.drag()
                .on("start", () => dragLineGreen.style("cursor", "grabbing"))
                .on("drag", (event) => {
                    // Update the green line's y-coordinates during dragging
                    const newY = Math.max(0, Math.min(height, event.y));
                    dragLineGreen.attr("y1", newY).attr("y2", newY);

                    // Calculate the corresponding value based on the position of the green line
                    const invertedYGreen = y.invert(newY);


                    // Update the displayed value text position for the green line
                    valueTextGreen
                        .attr("x", 10) // Centered horizontally
                        .attr("y", newY - 10) // Slightly above the green line
                        .text(`Green Line Value: ${invertedYGreen.toFixed(2)}`);
                })
                .on("end", () => dragLineGreen.style("cursor", "grab"));

            // Apply the drag behavior to the red and green lines
            dragRed(dragLineRed);
            dragGreen(dragLineGreen);
        };

        createGraph();
    }, []);

    return (
        <></>
    );
};

export default Chart2;
