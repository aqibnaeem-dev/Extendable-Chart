import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Graph1 = () => {
  const svgRef = useRef(null);
  const [legs, setLegs] = useState({ leg2: false, leg3: false, leg4: false })
  const [graph, setG] = useState();
  const [yMax, setYMax] = useState()

  const generateFakeData = (count) => {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const value = Math.random() * 10; // Random value for demonstration
      data.push({ date, value });
    }

    return data;
  };

  const margin = { top: 20, right: 20, bottom: 50, left: 30 };
  const width = 960 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;



  useEffect(() => {

    const data = generateFakeData(50);
    const initialYMax = d3.max(data, (d) => d.value);
    setYMax(initialYMax)
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

    graph.append("g").call(d3.axisLeft(y));

    // Add X and Y axes
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    graph.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))

    // Add the line
    graph.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 0.7)
      .attr("d", line);

    createDraggableLine(graph, "green", height, initialYMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function createDraggableLine(g, color, height, initialYMax) {
    const y = d3.scaleLinear().domain([0, initialYMax]).range([height, 0]);
    const isGreen = color
    const lineColor = isGreen
    const dragLine = g
      .append("line")
      .attr("class", "drag-line")
      .attr("stroke", lineColor)
      .attr("stroke-width", 4)
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height)
      .attr("y2", height);

    const valueText = g
      .append("text")
      .attr("class", "value-text")
      .attr("text-anchor", "left")
      .style("fill", lineColor);

    const drag = d3.drag()
      .on("start", () => dragLine.style("cursor", "grabbing"))
      .on("drag", (event) => {
        const newY = Math.max(0, Math.min(height, event.y));
        const invertedY = y.invert(newY);


        valueText
          .attr("x", 50)
          .attr("y", newY - 1)
          .text(`${lineColor.charAt(0).toUpperCase() + lineColor.slice(1)} Line Value: ${invertedY.toFixed(2)}`);

        dragLine.attr("y1", newY).attr("y2", newY);
      })
      .on("end", () => dragLine.style("cursor", "grab"));

    dragLine.call(drag);

    return dragLine;
  }

  useEffect(() => {
    if (legs.leg2 && !legs.leg3) { createDraggableLine(graph, "red", height, yMax) }
    if (legs.leg3 && !legs.leg4 && legs.leg2) { createDraggableLine(graph, "indigo", height, yMax) }
    if (legs.leg4 && legs.leg3 && legs.leg2) { createDraggableLine(graph, "orange", height, yMax) }

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

export default Graph1;
