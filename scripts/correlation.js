// ============================================================
//   CORRELATION.JS → heat‑map for slide 4
//   Exposes global  drawCorrelationHeatmap(file )
// ============================================================
/* global d3 */
(function () {
  const labelMap = {
    danceability            : 'Danceability',
    energy                  : 'Energy',
    valence                 : 'Valence',
    tempo                   : 'Tempo',
    spotify_track_popularity: 'Popularity'
  };

  window.drawCorrelationHeatmap = function drawCorrelationHeatmap (file) {
    d3.select('#correlation-heatmap').html('');

    d3.csv('assets/data/correlation/${file}').then(data => {
      const rowKey    = Object.keys(data[0])[0];
      const variables = data.columns.slice(1);

      const cellH   = 100;
      const cellW   = cellH * 1.5;
      const margin  = { top: 100, right: 400, bottom: 150, left: 150 };
      const width   = cellW * variables.length;
      const height  = cellH * variables.length;

      const svg = d3.select('#correlation-heatmap').append('svg')
        .attr('width',  width  + margin.left + margin.right)
        .attr('height', height + margin.top  + margin.bottom);

      /* -------- legend gradient -------- */
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient')
        .attr('id', 'legendGrad')
        .attr('x1', '0%').attr('y1', '100%')
        .attr('x2', '0%').attr('y2', '0%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#d73027');
      grad.append('stop').attr('offset', '50%').attr('stop-color', '#ffffbf');
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#1a9850');

      const legendG = svg.append('g')
        .attr('transform', `translate(${margin.left + width + 20},${margin.top})`);
      legendG.append('rect').attr('width', 10).attr('height', 200)
        .style('fill', 'url(#legendGrad)');
      const legendScale = d3.scaleLinear().domain([1, -1]).range([0, 200]);
      legendG.append('g')
        .attr('transform', 'translate(10,0)')
        .call(d3.axisRight(legendScale).tickValues([-1, 0, 1]).tickFormat(d3.format('d')))
        .select('.domain').remove();

      /* -------- main heat‑map -------- */
      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
      const x = d3.scaleBand().domain(variables).range([0, width]).padding(0.01);
      const y = d3.scaleBand().domain(variables).range([0, height]).padding(0.01);
      const color = d3.scaleLinear().domain([-1, 0, 1]).range(['#d73027', '#ffffbf', '#1a9850']);

      const matrix = [];
      data.forEach(row => variables.forEach(col => matrix.push({
        x: col,
        y: row[rowKey],
        value: +row[col]
      })));

      g.selectAll('rect').data(matrix).enter().append('rect')
        .attr('x', d => x(d.x) + x.bandwidth()/2)
        .attr('y', d => y(d.y) + y.bandwidth()/2)
        .attr('width', 0).attr('height', 0)
        .style('fill', d => color(d.value))
        .transition().delay((d,i) => i*8).duration(800).ease(d3.easeBounce)
        .attr('x', d => x(d.x)).attr('y', d => y(d.y))
        .attr('width', x.bandwidth()).attr('height', y.bandwidth());

      g.selectAll('text').data(matrix).enter().append('text')
        .attr('x', d => x(d.x)+x.bandwidth()/2)
        .attr('y', d => y(d.y)+y.bandwidth()/2 + 10)
        .attr('text-anchor', 'middle').attr('dy', '.35em')
        .style('font-size', '14px')
        .style('opacity', 0)
        .text(d => d.value.toFixed(2))
        .transition().delay((d,i)=>i*8+400).duration(600).style('opacity',1)
        .attr('y', d => y(d.y)+y.bandwidth()/2);

      /* -------- axes -------- */
      const xAxisG = g.append('g').attr('transform','translate(0,-30)').attr('opacity',0)
        .call(d3.axisTop(x).tickFormat(d=>labelMap[d]||d).tickSize(0));
      xAxisG.selectAll('text').attr('dy','-0.4em').style('font-weight','700');
      xAxisG.transition().delay(matrix.length*5+300).duration(1200).ease(d3.easeElasticOut)
        .attr('transform','translate(0,0)').attr('opacity',1);

      const yAxisG = g.append('g').attr('transform','translate(-30,0)').attr('opacity',0)
        .call(d3.axisLeft(y).tickFormat(d=>labelMap[d]||d).tickSize(0));
      yAxisG.selectAll('text').attr('transform','rotate(-90)').attr('dy','-1.4em').style('font-weight','700');
      yAxisG.transition().delay(matrix.length*5+300).duration(1200).ease(d3.easeElasticOut)
        .attr('transform','translate(0,0)').attr('opacity',1);
    });
  };
})();
