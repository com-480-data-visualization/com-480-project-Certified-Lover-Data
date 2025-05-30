// ============================================================
//   SCATTER.JS  →  two‑feature scatter‑plot for slide 5/8
//   Exposes global drawScatter() and wires dropdowns
// ============================================================
/* global d3 */
(function () {
  const genreColor = d3.scaleOrdinal()
    .domain([
      'blues','classical','comedy','country','dance','easy listening',
      'electronic','folk','funk','hip hop','holiday','indie',
      'jazz','latin','metal','other','pop','r&b',
      'reggae','regional mexican','rock','ska','soul','soundtrack'
    ])
    .range([
      '#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a',
      '#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94',
      '#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d',
      '#17becf','#9edae5','#393b79','#6b6ecf','#637939','#8ca252'
    ]);

  const colMap = {
    danceability: 'avg_danceability_y',
    energy      : 'avg_energy_y',
    valence     : 'avg_valence_y',
    tempo       : 'avg_tempo_y',
    popularity  : 'avg_spotify_track_popularity'
  };
  const emojiMap = { danceability:'💃', energy:'⚡️', valence:'😊', tempo:'🎵', popularity:'🔥' };
  const labelMap = { danceability:'Danceability', energy:'Energy', valence:'Valence', tempo:'Tempo', popularity:'Popularity' };

  function forbidDuplicates (xSel, ySel) {
    [...ySel.options].forEach(opt => opt.disabled = (opt.value === xSel.value));
    [...xSel.options].forEach(opt => opt.disabled = (opt.value === ySel.value));
  }

 window.drawScatter = function drawScatter () {
  // 1) clear any previous plot & tooltips
  d3.select('#scatter-container').html('');
  d3.selectAll('.scatter-tooltip').remove();

  // 2) disable same‐feature combos
  const xSel = document.getElementById('feature-x');
  const ySel = document.getElementById('feature-y');
  forbidDuplicates(xSel, ySel);

  // 3) load data
  d3.csv('data/correlation/broad_genre_correlation_summary.csv').then(data => {
    // 3a) figure out keys & parse numbers
    const xKey = xSel.value, yKey = ySel.value;
    const colX = colMap[xKey], colY = colMap[yKey];
    const c1   = `${xKey}_${yKey}_corr`,
          c2   = `${yKey}_${xKey}_corr`;

    data.forEach(d => {
      d.x    = +d[colX];
      d.y    = +d[colY];
      d.corr = +d[c1] || +d[c2] || null;
    });

    // 4) sizing
    const margin = { top: 40, right: 20, bottom: 60, left: 80 };
    const wrap   = d3.select('#scatter-container');
    const fullW  = wrap.node().clientWidth;
    const fullH  = 600;
    const width  = fullW  - margin.left - margin.right;
    const height = fullH  - margin.top  - margin.bottom;

    // 5) root SVG
    const svg = wrap.append('svg')
        .attr('width',  fullW)
        .attr('height', fullH)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // 6) scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x)).nice()
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y)).nice()
        .range([height, 0]);

    // 7) axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
    svg.append('g')
      .call(d3.axisLeft(y).tickSizeOuter(0));

    // 8) axis labels
    svg.append('text')
      .attr('x', width/2).attr('y', height + 40)
      .attr('text-anchor','middle')
      .style('font-family','Poppins, sans-serif')
      .style('font-weight','600')
      .text(labelMap[xKey]);
    svg.append('text')
      .attr('transform','rotate(-90)')
      .attr('x', -height/2).attr('y', -50)
      .attr('text-anchor','middle')
      .style('font-family','Poppins, sans-serif')
      .style('font-weight','600')
      .text(labelMap[yKey]);

    // 9) tooltip container
    const tooltip = d3.select('body').append('div')
      .attr('class','scatter-tooltip')
      .style('position','absolute')
      .style('padding','8px')
      .style('background','white')
      .style('border','1px solid #ccc')
      .style('border-radius','5px')
      .style('pointer-events','none')
      .style('display','none');

    // 10) draw circles + hover handlers
    const circles = svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
        .attr('cx',    d => x(d.x))
        .attr('cy',    d => y(d.y))
        .attr('r',     0)  // start at zero radius
        .attr('fill',  d => genreColor(d.broad_genre.toLowerCase()))
        .on('mouseover', (e,d) => {
          tooltip.html(
            `<strong><span style="color:${genreColor(d.broad_genre.toLowerCase())};
               font-weight:bold">🎧 ${d.broad_genre}</span></strong><br>` +
            `${emojiMap[xKey]} ${labelMap[xKey]}: ${d.x.toFixed(2)}<br>` +
            `${emojiMap[yKey]} ${labelMap[yKey]}: ${d.y.toFixed(2)}<br>` +
            `🔗 Correlation: ${d.corr != null ? d.corr.toFixed(2) : 'N/A'}`
          )
          .style('display','block');
        })
        .on('mousemove', e => {
          tooltip
            .style('left',  `${e.pageX + 10}px`)
            .style('top',   `${e.pageY - 28}px`);
        })
        .on('mouseout', () => {
          tooltip.style('display','none');
        });

    // 11) pop-in animation
    circles.transition()
      .delay((d,i) => i * 50)      // stagger
      .duration(600)
      .ease(d3.easeBackOut)
      .attr('r', 6);               // grow to final radius
  })
  .catch(err => console.error('couldn’t load broad‐genre data:', err));
};
