// ———————————————————————
//   SLIDE “3-2”: per-country player
// ———————————————————————

function embedTrack(trackId) {
  d3.select("#player-iframe")
    .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
}

function drawPlayer() {
  const countries = [
    "Netherlands","Philippines","New Zealand","Singapore","Peru","India",
    "Denmark","Belarus","Italy","Korea Republic of","Türkiye","Venezuela Bolivarian Republic of",
    "Romania","Chile","Lithuania","Slovakia","Indonesia","Norway","Mexico","Morocco",
    "Japan","Uruguay","Ireland","Finland","Egypt","United States","Dominican Republic",
    "Viet Nam","United Kingdom","Germany","Pakistan","Bulgaria","Canada",
    "United Arab Emirates","France","South Africa","Thailand","Portugal","Spain",
    "Luxembourg","Paraguay","Nicaragua","Costa Rica","Austria","Latvia",
    "Israel","Brazil","Greece","Sweden","Belgium","Czechia","Hong Kong",
    "Australia","Bolivia Plurinational State of","Nigeria","Malaysia",
    "Switzerland","Panama","Taiwan Province of China","Ecuador","El Salvador",
    "Saudi Arabia","Iceland","Hungary","Argentina","Kazakhstan","Poland",
    "Colombia","Guatemala","Honduras","Estonia","Ukraine"
  ];

  // populate <select>
  const select = d3.select("#country-select")
    .html("")
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  // avoid re-loading same track
  let lastTrack = null;

  select.on("change", function() {
    const country  = this.value;
    const safeName = encodeURIComponent(country);

    d3.csv(`data/countries/${safeName}.csv`)
      .then(rows => {
        const top = rows.find(r => +r.daily_rank === 1);
        if (top && top.spotify_id && top.spotify_id !== lastTrack) {
          lastTrack = top.spotify_id;
          embedTrack(top.spotify_id);
        }
      })
      .catch(err => {
        console.error("Couldn't load", safeName, err);
        d3.select("#player-iframe").attr("src", "");
      });
  });

  // default to United States on first draw
  select.property("value", "United States").dispatch("change");
}

window.drawPlayer = drawPlayer;