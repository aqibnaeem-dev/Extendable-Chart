// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';

// const LineChart1 = () => {
//   const svgRef = useRef(null);
//   const [maxHeight, setMaxHeight] = useState(0)

//   useEffect(() => {
//     const createGraph = async () => {
//       // Generate fake data
//       const data = generateFakeData(50); // Change the number of data points as needed

//       // Set the dimensions and margins of the graph
//       const margin = { top: 20, right: 20, bottom: 50, left: 70 };
//       const width = 960 - margin.left - margin.right;
//       const height = 500 - margin.top - margin.bottom;

//       // Append the SVG object to the body of the page
//       const svg = d3.select(svgRef.current)
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom);

//       const g = svg.append("g")
//         .attr("transform", `translate(${margin.left}, ${margin.top})`);

//       // Define initial y-axis domain and range
//       const initialYMax = d3.max(data, (d) => d.value);
//       let y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);

//       // Create the line generator
//       const line = d3.line()
//         .x((d) => x(d.date))
//         .y((d) => y(d.value));

//       // Add X and Y axes
//       const x = d3.scaleTime()
//         .domain(d3.extent(data, (d) => d.date))
//         .range([0, width]);

//       g.append("g")
//         .attr("transform", `translate(0, ${height})`)
//         .call(d3.axisBottom(x));

//       const yAxis = g.append("g").call(d3.axisLeft(y));

//       // Add the line
//       g.append("path")
//         .data([data])
//         .attr("class", "line")
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-width", 1.5)
//         .attr("d", line);

//       // Create a horizontal green draggable line
//       let dragLineGreen = g
//         .append("line")
//         .attr("class", "drag-line")
//         .attr("stroke", "green")
//         .attr("stroke-width", 4)
//         .attr("x1", 0)
//         .attr("x2", width)
//         .attr("y1", height) // Initialize the line at the bottom of the chart
//         .attr("y2", height);

//       // Define the drag behavior for the green line
//       let initialY = height;

//       // Store the maximum Y value
//       let maxY = initialYMax;

//       // Define the drag behavior for the green line
//       const dragGreen = d3.drag().on("drag", (event) => {
//         // Calculate the new Y position
//         // let newY = initialY + event.dy;
//         const newY = Math.max(0, Math.min(height, event.y));

//         // Ensure the line stays within the graph's boundaries
//         // newY = Math.max(0, newY);

//         // Update the drag line's position
//         dragLineGreen.attr("y1", newY).attr("y2", newY);

//         // Calculate the expansion factor based on the drag direction
//         const expansionFactor = newY / initialY;

//         // Update the maximum Y value to expand to infinity
//         maxY = maxY + Math.exp(expansionFactor);

//         // Update the y-axis domain to expand vertically
//         y.domain([0, maxY]);

//         // Update the y-axis
//         yAxis.call(d3.axisLeft(y));

//         // Redraw the line with the updated y-scale
//         g.select(".line").attr("d", line);
//       });

//       // Apply the drag behavior to the green line
//       dragLineGreen.call(dragGreen);
//     };

//     createGraph();
//   }, []);

//   // Function to generate fake data
//   const generateFakeData = (count) => {
//     const data = [];
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - count);

//     for (let i = 0; i < count; i++) {
//       const date = new Date(startDate);
//       date.setDate(startDate.getDate() + i);
//       const value = Math.random() * 100; // Random value for demonstration
//       data.push({ date, value });
//     }

//     return data;
//   };

//   return <svg ref={svgRef}></svg>;
// };

// export default LineChart1;



import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart1 = () => {
  const svgRef = useRef(null);
  const [legs, setLegs] = useState({ leg2: false, leg3: false, leg4: false });
  const [yValues, setYMax] = useState({ initialMaximum: "", initialMinimum: "" })
  const [yAxis, setYAxis] = useState()
  const [graph, setG] = useState();



  const generateFakeData = (count) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);
    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const value = Math.random() * 100;
      data.push({ date, value });
    }
    return data;
  };

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;


  // eslint-disable-next-line no-unused-vars
  let initialY = height;
  // Store the maximum Y value
  let maxY = yValues.initialMaximum;
  let minY = yValues.initialMinimum;
  // eslint-disable-next-line no-unused-vars
  let lastVal = -Infinity;


  // Run on first render onky and draws the graph 
  useEffect(() => {
    const data = generateFakeData(50);
    const initialYMax = d3.max(data, (d) => d.value);
    const initialYMin = d3.min(data, (d) => d.value);

    setYMax({ initialMaximum: Number(initialYMax), initialMinimum: Number(initialYMin) })
    const y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);

    // Append the SVG object to the body of the page
    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const graph = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);
    setG(graph);

    // Create the line generator
    const line = d3.line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    

    // Add X and Y axes
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    graph.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    const yAxis = graph.append("g").call(d3.axisLeft(y));
    setYAxis(yAxis)

    // Add the line
    graph.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 0.7)
      .attr("d", line);

    createDraggableLine(graph, "green", height, initialYMax, yAxis);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // Dragging function
  function createDraggableLine(g, color, height, initialYMax, yAxis) {
    const y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);

    const dragLine = g
      .append("line")
      .attr("class", "drag-line")
      .attr("stroke", color)
      .attr("stroke-width", 4)
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(40))
      .attr("y2", y(40));

    const valueText = g
      .append("text")
      .attr("class", "value-text")
      .attr("text-anchor", "left")
      .style("fill", color);

    valueText
      .attr("x", 50)
      .attr("y", y(40) - 5)
      .text(`${color.charAt(0).toUpperCase() + color.slice(1)} Line Value: ${40}`);


    const drag = d3.drag()
      .on("start", () => {
        dragLine.style("cursor", "grabbing")
      })
      .on("drag", (event) => {

        const newY = Math.max(0, Math.min(height, event.y));
        const invertedY = y.invert(newY);

        valueText
          .attr("x", 50)
          .attr("y", newY - 5)
          .text(`${color.charAt(0).toUpperCase() + color.slice(1)} Line Value: ${invertedY.toFixed(2)}`);

        dragLine.attr("y1", newY).attr("y2", newY);

        const lines = document.querySelectorAll(".drag-line");
        const linesText = document.querySelectorAll(".value-text")
        lines.forEach((line, index) => {
          if (line.getAttribute("stroke") === color) {
            const propColor = line.getAttribute("data-color");
            line.style.stroke = propColor;
            linesText[index].style.fill = color;
          } else {
            line.style.stroke = "grey";
            linesText[index].style.fill = "grey";
          }
        })


        // Dragging Logic
        if (newY === 0) {
          maxY = +maxY + 1;
        } else if (newY === 430) {
          minY = +minY - 1
        } else {
          if (maxY > initialYMax) {
            maxY = +maxY
          } else {
            maxY = initialYMax
          }
        }


        // if (newY === 0) {
        //   maxY = +maxY + Math.exp(+expansionFactor);
        //   lastVal = newY
        //   // setYMax(prevState => ({ ...prevState, initialMaximum: +maxY }))
        //   y.domain([Number(yValues.initialMinimum), Number(yValues.initialMaximum)]);
        // } else if (newY < lastVal) {
        //   maxY = +maxY + Math.exp(+expansionFactor);
        //   lastVal = newY
        //   // setYMax((prevState) => ({ ...prevState, initialMaximum: +maxY }))
        // } else if (newY >= lastVal) {
        //   minY = +minY - Math.exp(+expansionFactor)
        //   lastVal = newY
        //   // setYMax(prevState => ({ ...prevState, initialMinimum: +minY }))
        // }

        // console.log("From Inside the drah", minY, maxY)

        // Updating the state
        setYMax((prevState) => ({
          ...prevState,
          initialMaximum: +maxY,
          initialMinimum: +minY,
        }));

        // Update the yScale of graph
        y.domain([+minY, +maxY])
        yAxis.call(d3.axisLeft(y));

        console.log("State value inside drag function", Number(minY), Number(maxY))
      })
      .on("end", () => dragLine.style("cursor", "grab"));

    dragLine.call(drag);

    return dragLine;
  }


  console.log("State value outside the useEffect ", Number(yValues.initialMinimum), Number(yValues.initialMaximum))

  useEffect(() => {
    if (legs.leg2 && !legs.leg3) { createDraggableLine(graph, "red", height, yValues?.initialMaximum, yAxis) }
    if (legs.leg3 && !legs.leg4 && legs.leg2) { createDraggableLine(graph, "indigo", height, yValues?.initialMaximum, yAxis) }
    if (legs.leg4 && legs.leg3 && legs.leg2) { createDraggableLine(graph, "orange", height, yValues?.initialMaximum, yAxis) }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legs])

  const handleAddingLegs = (legNumber) => {
    setLegs((prevState) => ({ ...prevState, [legNumber]: true }));
  };

  return (
    <>
      <svg ref={svgRef}></svg>
      <div>
        {!legs.leg2 && <button onClick={() => handleAddingLegs("leg2")}>Leg2</button>}
        {!legs.leg3 && <button onClick={() => handleAddingLegs("leg3")}>Leg3</button>}
        {!legs.leg4 && <button onClick={() => handleAddingLegs("leg4")}>Leg4</button>}
      </div>
    </>
  )
};

export default LineChart1;