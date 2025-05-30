document.addEventListener("DOMContentLoaded", function () {
  // --- Insert SVG dynamically ---
  const svg = d3.select("#genre-race-vis")
    .append("svg")
    .attr("width", 960)
    .attr("height", 900);

  // --- Margin and chart size ---
  const margin = {top: 100, right: 160, bottom: 200, left: 70},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

  // --- Play/Pause Button SVG ---
  function setPlayPauseIcon(isPlaying) {
    const iconSpan = document.getElementById('togglePlayIcon');
    if (isPlaying) {
      iconSpan.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#222" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="4" width="4" height="16" rx="1"/>
          <rect x="15" y="4" width="4" height="16" rx="1"/>
        </svg>
      `;
    } else {
      iconSpan.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#222" xmlns="http://www.w3.org/2000/svg">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      `;
    }
  }
  let isPlaying = true;
  setPlayPauseIcon(isPlaying);
  document.getElementById("togglePlay").onclick = () => {
    isPlaying = !isPlaying;
    setPlayPauseIcon(isPlaying);
    const audio = document.getElementById('preview-audio');
    if (audio) {
      if (isPlaying) {
        audio.play().catch(()=>{});
      } else {
        audio.pause();
      }
    }
  };

  // --- D3 Chart Logic ---
  const mainG = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  const xStatic = d3.scaleLinear().domain([1950, 2020]).range([0, width]);
  const xAxisStaticG = mainG.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xStatic).tickValues(d3.range(1950, 2021, 10)).tickFormat(d => d.toString()));

  let selectedYear = null, selectedMonth = null;
  const decadeTicks = xAxisStaticG.selectAll(".tick")
    .classed("decade-tick", true)
    .style("cursor", "pointer")
    .on("click", (event, d) => {
      selectedYear = d;
      selectedMonth = "Jan";
      updateOffsetFromSelection();
      updateDecadeTickHighlight(d);
      showYearsMonths(selectedYear, selectedMonth);
    });

  function updateDecadeTickHighlight(currentDecade) {
    decadeTicks.classed("selected-tick", d => d === currentDecade);
  }

  const yScale = d3.scaleLinear().domain([10.9, 0.5]).range([height, 0]);
  const xScale = d3.scaleLinear().range([0, width]);

  mainG.append("g").attr("class", "y axis")
    .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => `#${d}`))
    .style("font-size", "13px");

  svg.append("defs").append("clipPath").attr("id", "clip-left")
    .append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height);

  const linesGroup = mainG.append("g").attr("class", "lines-group").attr("clip-path", "url(#clip-left)");
  const weekLabelsGroup = mainG.append("g").attr("class", "week-labels");
  weekLabelsGroup.append("line").attr("x1", 0).attr("x2", width).attr("y1", -2).attr("y2", -2).attr("stroke", "#999").attr("stroke-width", 1).attr("opacity", 0.6);

  const topLabelTexts = Array.from({length: 6}, () =>
    weekLabelsGroup.append("text")
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .style("font-size", "17px")
      .style("fill", "#3a86ff")
      .style("font-family", "Poppins, Arial, sans-serif")
      .style("opacity", 0)
  );

  const containerGroup = svg.append("g").attr("class", "container-group");
  const yearCellW = 40, yearCellH = 22, yearCols = 3;
  const monthCellW = 40, monthCellH = 22, monthCols = 4;
  const gapBetween = 40;
  const yearsGridW = yearCols * yearCellW;
  const monthsGridW = monthCols * monthCellW;
  const totalGridW = yearsGridW + gapBetween + monthsGridW;
  const containerX = (width + margin.left + margin.right - totalGridW) / 2;
  const containerY = height + margin.top + 80;

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function showYearsMonths(year, monthStr) {
    const decade = Math.floor(year / 10) * 10;
    const years = d3.range(decade, decade + 10);

    containerGroup.selectAll("*").remove();
    containerGroup.attr("transform", `translate(${containerX}, ${containerY})`);
    const yearsGroup = containerGroup.append("g").attr("class", "years-group");
    const monthsGroup = containerGroup.append("g").attr("class", "months-group");

    yearsGroup.selectAll("text")
      .data(years).join("text")
      .attr("class", "clickable-text")
      .attr("x", (d,i) => (i % yearCols) * yearCellW)
      .attr("y", (d,i) => Math.floor(i / yearCols) * yearCellH)
      .attr("dy", "1em")
      .attr("pointer-events", "all")
      .text(d => d)
      .classed("selected", d => d === year)
      .on("click", (e, d) => {
        selectedYear = d;
        updateOffsetFromSelection();
        updateDecadeTickHighlight(Math.floor(d / 10) * 10);
        showYearsMonths(d, selectedMonth);
      });

    monthsGroup.attr("transform", `translate(${yearsGridW + gapBetween}, 0)`);
    monthsGroup.selectAll("text")
      .data(monthShort).join("text")
      .attr("class", "clickable-text")
      .attr("x", (d,i) => (i % monthCols) * monthCellW)
      .attr("y", (d,i) => Math.floor(i / monthCols) * monthCellH)
      .attr("dy", "1em")
      .attr("pointer-events", "all")
      .text(d => d)
      .classed("selected", d => d === monthStr)
      .on("click", (e, d) => {
        selectedMonth = d;
        updateOffsetFromSelection();
        showYearsMonths(selectedYear, d);
      });
  }

  function updateOffsetFromSelection() {
    if (selectedYear && selectedMonth) {
      const mo = (selectedYear - minYear) * 12 + monthShort.indexOf(selectedMonth) - minMonthIndex;
      offset = mo;
    }
  }

  const files = [];
  for (let year = 1959; year <= 2020; year++) {
    for (const month of months) {
      files.push(`data/billboard_${month}_${year}.csv`);
    }
  }

  let offset = 0;
  let minYear, minMonthIndex, maxMonthOffset;
  let toggledOffGenres = new Set();

  const topSongBox = d3.select("#top-song-box");
  const songFields = [
    {key: "Genre", label: "Genre", emoji: "🏷️"},
    {key: "Performer", label: "Performer", emoji: "🎤"},
    {key: "Song", label: "Song", emoji: "🎵"}
  ];

  // --- Album cover cache and token for race condition handling --- 
  const albumCoverCache = {};
  let currentTopSongToken = 0;
  let lastTopSongId = null;

  async function renderTopSongBox(info, week, month, year) {
    if (!info) {
      topSongBox.style("display", "none");
      lastTopSongId = null;
      return;
    }
    const thisSongId = info.spotify_track_id || (info.Genre + info.Performer + info.Song);

    // Only refresh for a new song
    if (thisSongId === lastTopSongId) {
      const weekText = week || '';
      const monthText = month || '';
      const yearText = year?.toString() || '';
      const weekSpan = topSongBox.select(".value-week");
      const monthSpan = topSongBox.select(".value-month");
      const yearSpan = topSongBox.select(".value-year");
      if (!weekSpan.empty() && weekSpan.text() !== weekText) weekSpan.text(weekText);
      if (!monthSpan.empty() && monthSpan.text() !== monthText) monthSpan.text(monthText);
      if (!yearSpan.empty() && yearSpan.text() !== yearText) yearSpan.text(yearText);
      return;
    }
    lastTopSongId = thisSongId;
    topSongBox.style("display", "block");
    topSongBox.html(`<h4>🎉 Top Song of the Week</h4>
      <div style="text-align:center;margin:30px 0;">Loading...</div>
    `);
    let html = `<h4>🎉 Top Song of the Week</h4>`;
    html += `<div class="song-row"><span class="emoji">📅</span><span class="label">Week:</span> <span class="value value-week">${week || ''}</span></div>`;
    html += `<div class="song-row"><span class="emoji">🗓️</span><span class="label">Month:</span> <span class="value value-month">${month || ''}</span></div>`;
    html += `<div class="song-row"><span class="emoji">📆</span><span class="label">Year:</span> <span class="value value-year">${year || ''}</span></div>`;
    for (const field of songFields) {
      if (info[field.key] !== undefined && info[field.key] !== "") {
        html += `<div class="song-row"><span class="emoji">${field.emoji}</span><span class="label">${field.label}:</span> <span class="value">${info[field.key]}</span></div>`;
      }
    }
    const thisToken = ++currentTopSongToken;
    let albumCoverUrl = "";
    if (info.spotify_track_id && albumCoverCache[info.spotify_track_id]) {
      albumCoverUrl = albumCoverCache[info.spotify_track_id];
    } else if (info.spotify_track_id && info.spotify_track_id !== "") {
      try {
        const oembedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${info.spotify_track_id}`;
        const response = await fetch(oembedUrl);
        if (response.ok) {
          const oembed = await response.json();
          albumCoverUrl = oembed.thumbnail_url;
          albumCoverCache[info.spotify_track_id] = albumCoverUrl;
        }
      } catch (e) {
        albumCoverUrl = "";
      }
    }
    if (thisToken === currentTopSongToken) {
      if (albumCoverUrl) {
        html += `<img class="album-cover" src="${albumCoverUrl}" alt="Album cover" onerror="this.style.display='none'">`;
      } else {
        html += `<img class="album-cover" src="https://via.placeholder.com/200?text=No+Cover" alt="No album cover">`;
      }
      topSongBox.html(html);
    }
  }

  function updateTopSongAudio(topSong) {
    const audio = document.getElementById('preview-audio');
    if (audio && topSong && topSong.spotify_track_preview_url && topSong.spotify_track_preview_url.startsWith("http")) {
      if (audio.src !== topSong.spotify_track_preview_url) {
        audio.src = topSong.spotify_track_preview_url;
      }
      if (isPlaying) {
        audio.play().catch(()=>{});
      } else {
        audio.pause();
      }
    } else if (audio) {
      audio.pause();
      audio.src = "";
    }
  }

  // --- Main Data Loading and Drawing ---
  Promise.all(files.map(f => d3.csv(f, d => ({
    Year: +d.Year,
    Month: d.Month,
    WeekIndex: +d.WeekIndex,
    Genre: d.Genre,
    genre_weekly_score: +d.genre_weekly_score,
    weekly_position: +d.weekly_position,
    Performer: d.Performer || d.performer,
    Song: d.Song || d.title,
    spotify_track_id: d.spotify_track_id,
    spotify_track_preview_url: d.spotify_track_preview_url
  })))).then(allDataArrays => {
    const rawData = allDataArrays.flat().filter(d => d.weekly_position >= 1 && d.weekly_position <= 10);
    minYear = d3.min(rawData, d => d.Year);
    minMonthIndex = d3.min(rawData.filter(d => d.Year === minYear), d => months.indexOf(d.Month));
    rawData.forEach(d => {
      d.monthOffset = (d.Year - minYear) * 12 + (months.indexOf(d.Month) - minMonthIndex);
      d.timeIndex = d.monthOffset + (d.WeekIndex - 1) / 4;
    });
    const genres = d3.group(rawData, d => d.Genre);
    window.rawData = rawData;
    window.genres = genres;
    const genreList = [...genres.keys()];
    // Use the same fixed color scale as your CSS for consistency
    const genreColor = d3.scaleOrdinal()
      .domain([
        'Blues','Classical','Comedy','Country','Dance','Easy Listening',
        'Electronic','Folk','Funk','Hip Hop','Holiday','Indie',
        'Jazz','Latin','Metal','Other','Pop','R&B',
        'Reggae','Regional Mexican','Rock','Ska','Soul','Soundtrack'
      ])
      .range([
        '#1f77b4','#aec7e8','#ff7f0e','#ffbb78','#2ca02c','#98df8a',
        '#d62728','#ff9896','#9467bd','#c5b0d5','#8c564b','#c49c94',
        '#e377c2','#f7b6d2','#7f7f7f','#c7c7c7','#bcbd22','#dbdb8d',
        '#17becf','#9edae5','#393b79','#6b6ecf','#637939','#8ca252'
      ]);

    const lineGenerator = d3.line()
      .x(d => xScale(d.timeIndex))
      .y(d => yScale(d.weekly_position))
      .curve(d3.curveLinear)
      .defined(d => d.defined !== false);

    const paths = linesGroup.selectAll(".line")
      .data([...genres.entries()])
      .join("path")
      .attr("class", "line")
      .attr("stroke", d => genreColor(d[0]))
      .attr("fill", "none")
      .attr("stroke-width", 2);

    // --- Genre labels colored like their lines ---
    const genreLabels = mainG.selectAll(".genre-label")
      .data(genreList)
      .join("text")
      .attr("class", "genre-label")
      .style("font-size", "13px")
      .style("font-family", "Poppins, Arial, sans-serif")
      .style("fill", d => genreColor(d));

    maxMonthOffset = d3.max(rawData, d => d.monthOffset);
    const weeksPerWindow = 3.5;

    selectedYear = minYear;
    selectedMonth = "Jan";
    showYearsMonths(selectedYear, selectedMonth);

    function updateLegend(currentGenres) {
      const legend = d3.select("#legend")
        .selectAll("span")
        .data(currentGenres, d => d);

      legend.enter().append("span")
        .attr("class", "legend-item")
        .style("color", d => genreColor(d))
        .style("opacity", d => toggledOffGenres.has(d) ? 0.3 : 1)
        .text(d => d)
        .on("click", function(event, d) {
          if (toggledOffGenres.has(d)) {
            toggledOffGenres.delete(d);
            d3.select(this).style("opacity", 1);
          } else {
            toggledOffGenres.add(d);
            d3.select(this).style("opacity", 0.3);
          }
        });

      legend
        .style("opacity", d => toggledOffGenres.has(d) ? 0.3 : 1);

      legend.exit().remove();
    }

    function interpolateAtRightEdge(data, rightEdge) {
      let before = null, after = null;
      for (let i = 0; i < data.length; ++i) {
        if (data[i].timeIndex === rightEdge) {
          return { timeIndex: rightEdge, weekly_position: data[i].weekly_position, defined: true };
        }
        if (data[i].timeIndex < rightEdge) {
          before = data[i];
        }
        if (data[i].timeIndex > rightEdge) {
          after = data[i];
          break;
        }
      }
      if (before && after) {
        if (after.timeIndex - before.timeIndex <= 1.01) {
          const t = (rightEdge - before.timeIndex) / (after.timeIndex - before.timeIndex);
          const yInterp = before.weekly_position + t * (after.weekly_position - before.weekly_position);
          return { timeIndex: rightEdge, weekly_position: yInterp, defined: true };
        } else {
          return null;
        }
      }
      return null;
    }

    function updateTopSongBoxAndAudio(offset) {
      // --- Find the top song at the left edge of the window --- 
      const weekIdx = Math.floor((offset - Math.floor(offset)) * 4) + 1;
      const mo = Math.floor(offset);
      const year = minYear + Math.floor((mo + minMonthIndex) / 12);
      const monthIdx = (mo + minMonthIndex) % 12;
      const month = months[monthIdx];
      const week = weekIdx;
      const weekData = rawData.filter(d =>
        d.Year === year && d.Month === month && d.WeekIndex === week && d.weekly_position === 1
      );
      const topSong = weekData[0];
      renderTopSongBox(topSong, week, month, year);
      updateTopSongAudio(topSong);
    }

    function animate() {
      if (isPlaying) offset += 0.002;
      if (offset > maxMonthOffset + 1) offset = 0;
      xScale.domain([offset, offset + weeksPerWindow]);
      const rightEdge = offset + weeksPerWindow;

      // --- Find genres currently in the frame ---
      const genresInFrameSet = new Set();
      paths.each(function([genre, data]) {
        const visible = data.filter(d => d.timeIndex >= offset && d.timeIndex <= rightEdge);
        if (visible.length > 0) genresInFrameSet.add(genre);
      });
      const genresInFrame = Array.from(genresInFrameSet).sort();
      updateLegend(genresInFrame);

      paths.each(function([genre, data]) {
        if (toggledOffGenres.has(genre)) {
          d3.select(this).style("opacity", 0);
          return;
        }
        const visible = data.filter(d => d.timeIndex >= offset && d.timeIndex <= rightEdge);
        if (visible.length === 0) {
          d3.select(this).style("opacity", 0);
          return;
        }
        let extended = visible;
        const tip = interpolateAtRightEdge(data, rightEdge);
        if (tip) {
          extended = visible.concat([tip]);
        }
        d3.select(this)
          .style("opacity", () => {
            const avgRank = d3.mean(visible, d => d.weekly_position);
            const opacity = 1.1 - (avgRank * 0.1); 
            return Math.max(0.1, Math.min(1.0, opacity));
          })
          .attr("stroke-width", () => {
            const avgRank = d3.mean(visible, d => d.weekly_position);
            return 4 - (avgRank - 1) * 0.3;
          })
          .attr("d", lineGenerator(extended));
      });

      genreLabels.each(function(genre) {
        if (toggledOffGenres.has(genre)) {
          d3.select(this).style("opacity", 0);
          return;
        }
        const data = genres.get(genre);
        const visible = data.filter(d => d.timeIndex >= offset && d.timeIndex <= rightEdge);
        if (visible.length === 0) {
          d3.select(this).style("opacity", 0);
          return;
        }
        let labelPoint = null;
        const tip = interpolateAtRightEdge(data, rightEdge);
        if (tip) {
          labelPoint = tip;
        } else {
          labelPoint = visible[visible.length - 1];
        }
        d3.select(this)
          .style("opacity", 1)
          .attr("x", xScale(labelPoint.timeIndex) + 10)
          .attr("y", yScale(labelPoint.weekly_position) + 4)
          .text(genre);
      });

      // --- Extract current date info from offset ---
      const mo = Math.floor(offset);
      const currentYear = minYear + Math.floor((mo + minMonthIndex) / 12);
      const currentMonthIdx = (mo + minMonthIndex) % 12;
      const currentMonthStr = monthShort[currentMonthIdx];

      // --- Update selectedYear and selectedMonth if they changed --- 
      if (selectedYear !== currentYear || selectedMonth !== currentMonthStr) {
        selectedYear = currentYear;
        selectedMonth = currentMonthStr;
        updateDecadeTickHighlight(Math.floor(currentYear / 10) * 10);
        showYearsMonths(selectedYear, selectedMonth);
      }

      // --- Top Song Info Box and Audio update ---
      updateTopSongBoxAndAudio(offset);

      // --- Top axis labels: W3 Feb '72 style ---
      for (let i = 0; i < 6; i++) {
        const tp = offset + i * (weeksPerWindow / 6);
        const mo = Math.floor(tp);
        const weekNum = Math.floor((tp - mo) * 4) + 1;
        const absYear = minYear + Math.floor((mo + minMonthIndex) / 12);
        const absMonth = (mo + minMonthIndex) % 12;
        topLabelTexts[i]
          .attr("x", xScale(tp))
          .text(`W${weekNum} ${monthShort[absMonth]} '${String(absYear).slice(2)}`)
          .style("opacity", 1);
      }

      requestAnimationFrame(animate);
    }
    animate();
  });
});
