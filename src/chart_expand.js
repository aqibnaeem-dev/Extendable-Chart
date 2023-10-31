/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';



const ChartExpands = () => {

    const svgRef = useRef(null);
    const [showSecond, setShowSecond] = useState(false)
    const [yAxis, setYAxis] = useState()
    const [ gg, setGG] = useState();

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

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 50, left: 70 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // const getY = (initialYMax, height) => {
    //     let y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);
    //     return y
    // }

    // const giveLine = (initialYMax, height) => {

    //     // Add X and Y axes
    //     const x = d3.scaleTime()
    //         .domain(d3.extent(myData, (d) => d.date))
    //         .range([0, width]);
    //     let y = getY(initialYMax, height)

    //     return d3.line()
    //         .x((d) => x(d.date))
    //         .y((d) => y(d.value));
    // }


    const data = generateFakeData(50); // Change the number of data points as needed

    

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



    useEffect(() => {

        const svg = d3.select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

        const graph = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

        setGG(graph)
       
        graph.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        const yAx = graph.append("g").call(d3.axisLeft(y));
        setYAxis(yAx)

        console.log(data, line, graph)
        // Add the line
        graph.append("path")
            .data([data])
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);


        dragLine(graph, "green", height, initialYMax, yAx)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // eslint-disable-next-line no-unused-vars
    const dragLine = (graph, color, height, initialYMax, yAxis) => {

   


        let dragLineGreen = graph
            .append("line")
            .attr("class", "drag-line")
            .attr("stroke", color)
            .attr("stroke-width", 4)
            .attr("x1", 0)
            .attr("x2", width)
            .attr("y1", height) // Initialize the line at the bottom of the chart
            .attr("y2", height);

        const dragGreen = d3.drag().on("drag", (event) => {

            const newY = Math.max(0, Math.min(height, event.y));
            dragLineGreen.attr("y1", newY).attr("y2", newY);


            // Update the y-axis domain to expand vertically when moved up
            y.domain([0, initialYMax += 10]);

            // Update the y-axis
            yAxis.call(d3.axisLeft(y));

            // Redraw the line with the updated y-scale
            graph.select(".line").attr("d", line);
        });

        dragLineGreen.call(dragGreen);

        return dragLine;
    }


    
    useEffect(() => {
        if (showSecond) {
            dragLine(gg, "blue", height, initialYMax, yAxis)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSecond])


    return (
        <>
            <svg ref={svgRef}></svg>
            <button onClick={() => setShowSecond(true)}>Show more leg</button>
        </>
    )
};

export default ChartExpands;
