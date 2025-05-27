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
    /* … your full 72-country list … */
    "United States","Ukraine"
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

    d3.csv(`{{ site.baseurl }}/data/countries/${safeName}.csv`)
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