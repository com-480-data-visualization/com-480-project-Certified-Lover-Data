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

  window.drawCorrelationHeatmap = function drawCorrelationHeatmap(file) {
  // 1) clear any old chart
  d3.select("#correlation-heatmap").html("");

  // 2) load CSV
  d3.csv("{{ site.baseurl }}/assets/data/" + file).then(data => {
    const rowKey    = Object.keys(data[0])[0];
    const variables = data.columns.slice(1);

    // friendly axis labels
    const labelMap = {
      danceability:             "Danceability",
      energy:                   "Energy",
      valence:                  "Valence",
      tempo:                    "Tempo",
      spotify_track_popularity: "Popularity"
    };

    // 3) flatten into matrix
    const matrix = [];
    data.forEach(row =>
      variables.forEach(col =>
        matrix.push({
          x:     col,
          y:     row[rowKey],
          value: +row[col]
        })
      )
    );

    // 4) sizing
    const cellH  = 100,
          cellW  = cellH * 1.5,
          margin = { top: 100, right: 400, bottom: 150, left: 150 },
          width  = cellW * variables.length,
          height = cellH * variables.length;

    // 5) root SVG
    const svg = d3.select("#correlation-heatmap")
      .append("svg")
        .attr("width",  width  + margin.left + margin.right)
        .attr("height", height + margin.top  + margin.bottom);

    // --- 6) vertical legend gradient ---
    // a) defs
    const defs = svg.append("defs");
    const grad = defs.append("linearGradient")
      .attr("id","legendGrad")
      // bottom→top
      .attr("x1","0%").attr("y1","100%")
      .attr("x2","0%").attr("y2","0%");
    grad.append("stop").attr("offset","0%").attr("stop-color","#d73027");
    grad.append("stop").attr("offset","50%").attr("stop-color","#ffffbf");
    grad.append("stop").attr("offset","100%").attr("stop-color","#1a9850");

    // b) draw vertical bar + right-side axis
    const legendHeight = 200,
          legendWidth  = 10;
    const legendG = svg.append("g")
      // place to the right of the heatmap
      .attr("transform", `translate(${margin.left + width + 20},${margin.top})`);
    legendG.append("rect")
      .attr("width",  legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legendGrad)");

    // scale from +1 at top to –1 at bottom
    const legendScale = d3.scaleLinear()
      .domain([1, -1])
      .range([0, legendHeight]);

    legendG.append("g")
      // move it just right of the color bar
      .attr("transform", `translate(${legendWidth},0)`)
      .call(d3.axisRight(legendScale)
        .tickValues([-1, 0, 1])
        .tickFormat(d3.format("d"))
      )
      .select(".domain").remove();

    // 7) main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // 8) scales & color
    const x = d3.scaleBand().domain(variables).range([0,width]).padding(0.01);
    const y = d3.scaleBand().domain(variables).range([0,height]).padding(0.01);
    const colorScale = d3.scaleLinear()
      .domain([-1,0,1])
      .range(["#d73027","#ffffbf","#1a9850"]);

    // 9) draw cells with pop-in bounce
    const cells = g.selectAll("rect.cell")
      .data(matrix)
      .enter().append("rect")
        .attr("class","cell")
        .attr("x",     d => x(d.x) + x.bandwidth()/2)
        .attr("y",     d => y(d.y) + y.bandwidth()/2)
        .attr("width", 0)
        .attr("height", 0)
        .style("fill", d => colorScale(d.value));

    cells.transition()
      .delay((d,i) => i * 8)
      .duration(800)
      .ease(d3.easeBounce)
      .attr("x", d => x(d.x))
      .attr("y", d => y(d.y))
      .attr("width",  x.bandwidth())
      .attr("height", y.bandwidth());

    // 10) annotate with fade + float
    const labels = g.selectAll("text.label")
      .data(matrix)
      .enter().append("text")
        .attr("class","label")
        .attr("x",           d => x(d.x)+x.bandwidth()/2)
        .attr("y",           d => y(d.y)+y.bandwidth()/2 + 10)
        .attr("text-anchor","middle")
        .attr("dy",".35em")
        .style("font-size","14px")
        .style("fill","#000")
        .attr("opacity", 0)
        .text(d => d.value.toFixed(2));

    labels.transition()
      .delay((d,i) => i * 8 + 400)
      .duration(600)
      .attr("opacity", 1)
      .attr("y", d => y(d.y)+y.bandwidth()/2)
      .ease(d3.easeSinOut);

    // 11) top axis (elastic slide-in)
    const xAxisG = g.append("g")
      .attr("transform", "translate(0,-30)")
      .attr("opacity", 0)
      .call(d3.axisTop(x)
        .tickFormat(d => labelMap[d]||d)
        .tickSize(0)
      );

    xAxisG.selectAll("text")
      .attr("dy","-0.4em")
      .style("text-anchor","middle")
      .style("fill","#000")
      .style("font-family","Poppins, sans-serif")
      .style("font-weight","700");

    xAxisG.transition()
      .delay(variables.length * variables.length * 5 + 300)
      .duration(1200)
      .ease(d3.easeElasticOut.amplitude(1).period(0.4))
      .attr("transform", "translate(0,0)")
      .attr("opacity", 1);

    // 12) left axis (elastic slide-in)
    const yAxisG = g.append("g")
      .attr("transform", "translate(-30,0)")
      .attr("opacity", 0)
      .call(d3.axisLeft(y)
        .tickFormat(d => labelMap[d]||d)
        .tickSize(0)
      );

    yAxisG.selectAll("text")
      .attr("transform","rotate(-90)")
      .attr("dy","-1.4em")
      .style("text-anchor","middle")
      .style("fill","#000")
      .style("font-family","Poppins, sans-serif")
      .style("font-weight","700");

    yAxisG.transition()
      .delay(variables.length * variables.length * 5 + 300)
      .duration(1200)
      .ease(d3.easeElasticOut.amplitude(1).period(0.4))
      .attr("transform", "translate(0,0)")
      .attr("opacity", 1);

  })
  .catch(err => console.error("couldn't load", file, err));
};
})();
