// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————

function embedTrack(trackId) {
  d3.select("#spotify-player").html(`
    <iframe
      style="border-radius:12px"
      src="https://open.spotify.com/embed/track/${trackId}"
      width="300" height="380"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture">
    </iframe>
  `);
}

function drawPlayer() {
  // 1) your 72 country names (must match the CSV names exactly)
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

  // 2) build the <select>
  const select = d3.select("#country-select")
    .html("")                  // clear
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  // 3) on change → load CSV → embed top-1 track
  select.on("change", function() {
    const country = this.value;
    const safeName = encodeURIComponent(country);    // handles spaces, accents, etc.
    d3.csv(`/data/countries/${safeName}.csv`)
      .then(rows => {
        const top = rows.find(r => +r.daily_rank === 1);
        if (top && top.spotify_id) {
          embedTrack(top.spotify_id);
        } else {
          d3.select("#spotify-player")
            .html("<p>No #1 track found for that country.</p>");
        }
      })
      .catch(err => {
        console.error("couldn't load", safeName, err);
        d3.select("#spotify-player")
          .html("<p>Error loading that country’s data.</p>");
      });
  });

  // 4) default on first draw
  select.property("value", "United States").dispatch("change");
}