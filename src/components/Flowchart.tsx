import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styled from 'styled-components';

const SVGContainer = styled.div`
  width: 100%;
  padding: 10px;
  background: #2a2a2a;
  border-top: 1px solid #444;
`;

interface FlowchartProps {
  currentStep: string; // e.g., 'initialize', 'assign', 'update', 'converge'
}

const Flowchart: React.FC<FlowchartProps> = ({ currentStep }) => {
  const ref = useRef<SVGSVGElement>(null);

  const steps = [
    { id: 'initialize', text: '1. 初始化质心' },
    { id: 'assign', text: '2. 分配像素到簇' },
    { id: 'update', text: '3. 更新质心位置' },
    { id: 'converge', text: '4. 判断是否收敛' },
  ];

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear previous render

    const g = svg.append('g').attr('transform', 'translate(10, 20)');

    const nodes = g.selectAll('g')
      .data(steps)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${i * 150}, 0)`);

    nodes.append('rect')
      .attr('width', 140)
      .attr('height', 40)
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', d => d.id === currentStep ? '#4a90e2' : '#555')
      .style('stroke', '#777')
      .style('stroke-width', 2);

    nodes.append('text')
      .attr('x', 70)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .text(d => d.text);

  }, [currentStep, steps]);

  return (
    <SVGContainer>
      <h4>算法流程</h4>
      <svg ref={ref} width="610" height="80"></svg>
    </SVGContainer>
  );
};

export default Flowchart; 