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
    /* … etc … */
    "Honduras","Estonia","Ukraine"
  ];

  // 1) grab the <select id="country-select">
  const sel = d3.select("#country-select");

  // 2) populate its <option>s
  sel.html("")
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  // 3) on change → load CSV → embed top-1 track
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
