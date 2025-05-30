// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————

function embedTrack(trackId) {
  d3.select("#player-iframe")
    .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
}

function drawPlayer() {
  const countries = [
    "Netherlands","Philippines","New Zealand","Singapore","Peru","India",
    "Denmark","Belarus","Italy","Korea Republic of","Türkiye",
    "Venezuela Bolivarian Republic of","Romania","Chile","Lithuania",
    "Slovakia","Indonesia","Norway","Mexico","Morocco","Japan",
    "Uruguay","Ireland","Finland","Egypt","United States",
    "Dominican Republic","Viet Nam","United Kingdom","Germany",
    "Pakistan","Bulgaria","Canada","United Arab Emirates","France",
    "South Africa","Thailand","Portugal","Spain","Luxembourg","Paraguay",
    "Nicaragua","Costa Rica","Austria","Latvia","Israel","Brazil",
    "Greece","Sweden","Belgium","Czechia","Hong Kong","Australia",
    "Bolivia Plurinational State of","Nigeria","Malaysia","Switzerland",
    "Panama","Taiwan Province of China","Ecuador","El Salvador",
    "Saudi Arabia","Iceland","Hungary","Argentina","Kazakhstan",
    "Poland","Colombia","Guatemala","Honduras","Estonia","Ukraine"
  ];

  const sel = d3.select("#country-select");

  sel.html("")
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  sel.on("change", function() {
    const country  = this.value;
    const safeName = encodeURIComponent(country);  // handles spaces, accents

    d3.csv(`data/countries/${safeName}.csv`)
      .then(rows => {
        // find the #1 daily rank
        const top = rows.find(r => +r.daily_rank === 1);
        if (top && top.spotify_id) {
          embedTrack(top.spotify_id);
        } else {
          // no track → clear iframe
          d3.select("#player-iframe").attr("src", "");
        }
      })
      .catch(err => {
        console.error("Couldn't load", safeName, err);
        d3.select("#player-iframe").attr("src", "");
      });
  });

  // 4) set a default country and fire its handler
  sel.property("value", "United States")
     .dispatch("change");
}

// expose to your slide controller
window.drawPlayer = drawPlayer;
