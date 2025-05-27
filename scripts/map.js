// ============================================================
//   MAP.JS  →  world‑map choropleth for slide 3
//   Exposes global function  drawMap()  consumed by slider.js
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

  const nameFix = {
    'United States'                    : 'USA',
    'Russia'                           : 'Russian Federation',
    "Korea, Republic of"              : 'South Korea',
    "Korea, Democratic People's Republic of" : 'North Korea',
    'South Korea'                      : 'Korea, Republic of',
    'Viet Nam'                         : 'Vietnam',
    'Venezuela, Bolivarian Republic of': 'Venezuela',
    'Czechia'                          : 'Czech Republic',
    'Taiwan, Province of China'        : 'Taiwan',
    'Bolivia, Plurinational State of'  : 'Bolivia',
    'United Kingdom'                   : 'England'
  };

  window.drawMap = function drawMap () {
    const svg = d3.select('#my_dataviz');
    const width  = +svg.attr('width');
    const height = +svg.attr('height');

    const projection = d3.geoNaturalEarth1()
      .scale(260)
      .translate([width/2, height/2]);
    const path = d3.geoPath(projection);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'white')
      .style('border', '1px solid #ccc')
      .style('border-radius', '5px')
      .style('pointer-events', 'none')
      .style('display', 'none');

    Promise.all([
      d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
      d3.csv("assets/data/correlation/country_genre_data_viz.csv") 
    ]).then(([geoData, csvData]) => {
      const info = {};
      csvData.forEach(d => {
        const key = (nameFix[d.country_name] || d.country_name).trim();
        info[key] = {
          genre     : d.top_genre,
          dance     : +d.avg_danceability,
          energy    : +d.avg_energy,
          valence   : +d.avg_valence,
          tempo     : +d.avg_tempo,
          popularity: +d.avg_popularity
        };
      });

      svg.append('g')
        .selectAll('path')
        .data(geoData.features)
        .join('path')
          .attr('d', path)
          .attr('fill', d => {
            const v = info[d.properties.name];
            return v ? genreColor(v.genre.toLowerCase()) : '#eee';
          })
          .attr('stroke', '#fff').attr('stroke-width', 0.5)
          .on('mouseover', function (event, d) {
            const v = info[d.properties.name];
            if (!v) return tooltip.style('display', 'none');

            d3.select(this)
              .raise()
              .transition().duration(200)
              .attr('stroke', '#111').attr('stroke-width', 1.5);

            tooltip.html(
              `<strong>${d.properties.name}</strong><br>`+
              `🎧 <span style="color:${genreColor(v.genre.toLowerCase())};font-weight:bold">${v.genre}</span><br>`+
              `💃 ${v.dance.toFixed(2)} /0.99<br>`+
              `⚡️ ${v.energy.toFixed(2)} /1<br>`+
              `😊 ${v.valence.toFixed(2)} /0.99<br>`+
              `🎵 ${v.tempo.toFixed(0)} BPM<br>`+
              `🔥 ${v.popularity.toFixed(0)} /100`
            ).style('display', 'block');
          })
          .on('mousemove', e => tooltip.style('left', `${e.pageX+10}px`).style('top', `${e.pageY-28}px`))
          .on('mouseout', function (event, d) {
            d3.select(this)
              .transition().duration(200)
              .attr('stroke', '#fff').attr('stroke-width', 0.5)
              .attr('fill', () => {
                const v = info[d.properties.name];
                return v ? genreColor(v.genre.toLowerCase()) : '#eee';
              });
            tooltip.style('display', 'none');
          });
    });
  };
})();
