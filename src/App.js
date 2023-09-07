/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./App.css"
import Chart2 from './try1';
import LineChart1 from './LineChart1';
import LineChart from './LineChart';
import LineChartStates from './LineChart_states';
import Graph1 from './FourLegs_static';
import ChartExpands from './chart_expand';

const Chart = ({ data, width, height }) => {
  const svgRef = useRef(null);
  const [lineY, setLineY] = useState(height / 2);
  const [draggedValue, setDraggedValue] = useState(null);

  const handleDrag = (e) => {
    const newY = e.y;

    if (!isNaN(newY)) {
      setLineY(newY);

      const yScale = d3.scaleLinear().domain([0, height]).range([d3.max(data), 0]);
      const newValue = yScale(newY);

      setDraggedValue(newValue.toFixed(2));
    }
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
  
    const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);
  
    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);
  
    svg.selectAll('*').remove();
  
    // Add the y-axis labels
    const yAxisLabels = yScale.ticks(5); // Adjust the number of ticks as needed
    yAxisLabels.forEach((label) => {
      svg
        .append('text')
        .attr('x', -10) // Adjust the position of the labels to fit your needs
        .attr('y', yScale(label))
        .attr('dy', 4) // Adjust the vertical position of the labels
        .attr('text-anchor', 'end')
        .text(label.toFixed(2)); // Format the label to display with desired precision
    });
  
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);
  
    svg
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', lineY)
      .attr('y2', lineY)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('cursor', 'ns-resize')
      .call(d3.drag().on('drag', handleDrag));
  
    if (draggedValue !== null) {
      svg
        .append('text')
        .attr('x', width - 10)
        .attr('y', lineY)
        .attr('dy', -5)
        .attr('text-anchor', 'end')
        .text(`Value: ${draggedValue}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, width, height, lineY, draggedValue]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};




const Chart1 = ({ data, width, height, margin }) => {
  const svgRef = useRef(null);
  const [lineY, setLineY] = useState(height / 2); // Initial position of the draggable line
  const [lineValue, setLineValue] = useState(null);

  const handleDrag = (e) => {
    const newY = Math.max(margin.top, Math.min(height - margin.bottom, e.y));
    setLineY(newY);
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Create scales for x and y axes
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add x-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    // Add y-axis
    svg
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Create a line chart
    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    // Add the line to the chart
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Create a draggable horizontal line
    svg
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', lineY)
    .attr('y2', lineY)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('cursor', 'ns-resize')
    .call(
      d3.drag().on('drag', handleDrag)
    );
  }, [data, width, height, margin, lineY]);

  return (
    <div>
      <svg ref={svgRef} width={width} height={height}></svg>
      {lineValue !== null && (
        <div style={{ textAlign: 'center' }}>
          Current Value: {lineValue.toFixed(2)}
        </div>
      )}
    </div>
  );
};



function App() {
  const chartData = [10, 25, 5, 60, 80, 90, 120, 140, 160, 180];
  const chartWidth = 600;
  const chartHeight = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  

  return (
    <div className="App">
      <h1>Hello D3</h1>
      {/* <Chart data={chartData} width={chartWidth} height={chartHeight} />
      <br />
      <Chart1 data={chartData} width={chartWidth} height={chartHeight} margin={margin} />
      <br />
      <Chart2 />
      <br />
      <LineChart /> */}
      <br />
      {/* <LineChart1 />  */}

      {/* <LineChart1 />

      <br />
      <br />
      <hr />
      <br />
      <Graph1 /> */}
      {/* <ChartExpands /> */}
      <LineChart1 />
    </div>
  );
}

export default App;
