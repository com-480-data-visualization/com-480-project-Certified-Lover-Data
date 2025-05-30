// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————

function embedTrack(trackId) {
  // just change the iframe’s src
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



  // 1) grab the <select>
  const sel = d3.select("#country-select");

  // 2) populate its <option>s
  sel.html("")           // clear any old ones
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  // 3) bind the change handler *to the select*, not to each option
  sel.on("change", function() {
    const country  = this.value;
    const safeName = encodeURIComponent(country);

    d3.csv(`data/countries/${safeName}.csv`)
      .then(rows => {
        const top = rows.find(r => +r.daily_rank === 1);
        if (top && top.spotify_id) {
          embedTrack(top.spotify_id);
        } else {
          // no #1 track
          d3.select("#player-iframe").attr("src","");
        }
      })
      .catch(err => {
        console.error("Couldn't load", safeName, err);
        d3.select("#player-iframe").attr("src","");
      });
  });

  // 4) pick a default and fire the handler once
  sel.property("value", "United States")
     .dispatch("change");
}

// expose it so your slider code can call it:
window.drawPlayer = drawPlayer;

// spotify.js
function embedTrack(trackId, iframeSelector = "#spotify-iframe") {
  d3.select(iframeSelector)
    .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
}
