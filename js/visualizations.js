// Simple, self-contained demo chart using D3
function renderRevenueChart() {
  const el = document.getElementById('rev-chart');
  if (!el) return;

  // Sample (non-sensitive) quarterly revenue data
  const data = [
    { quarter: 'Q2-24', revenue: 4.2 },
    { quarter: 'Q3-24', revenue: 4.6 },
    { quarter: 'Q4-24', revenue: 5.1 },
    { quarter: 'Q1-25', revenue: 5.4 },
    { quarter: 'Q2-25', revenue: 5.9 }
  ];

  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const width = Math.min(960, el.clientWidth) - margin.left - margin.right;
  const height = el.clientHeight - margin.top - margin.bottom;

  const svg = d3.select(el)
    .append('svg')
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.quarter))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue) * 1.15])
    .nice()
    .range([height, 0]);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append('g')
    .call(d3.axisLeft(y).ticks(6).tickFormat(d => `$${d.toFixed(1)}B`));

  const bars = g.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.quarter))
    .attr('y', height)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', '#2a7ade');

  // Animate bars
  bars.transition()
    .duration(900)
    .attr('y', d => y(d.revenue))
    .attr('height', d => height - y(d.revenue))
    .delay((_, i) => i * 120);

  // Value labels
  g.selectAll('.label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'label')
    .attr('x', d => x(d.quarter) + x.bandwidth()/2)
    .attr('y', d => y(d.revenue) - 8)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', '#333')
    .text(d => `$${d.revenue.toFixed(1)}B`);
}
