// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————

function embedTrack(trackId) {
  // update the existing iframe’s src
  d3.select("#player-iframe")
    .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
}

function drawPlayer() {
  // 1) list of your country names (matching filenames minus “.csv”)
  const countries = [
    "Global",
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

  // 2) populate the <select>
  const select = d3.select("#country-select")
    .html("")    // clear existing options
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  // 3) when the user changes country:
  select.on("change", function() {
    const country = this.value;
    // encodeURIComponent handles spaces & special chars
    const safeName = encodeURIComponent(country);
    const url = `data/countries/${safeName}.csv`;

    d3.csv(url).then(rows => {
      // find the row where daily_rank==1
      const top = rows.find(r => +r.daily_rank === 1);
      if (top && top.spotify_id) {
        embedTrack(top.spotify_id);
      } else {
        // no #1 found → show a message instead
        d3.select("#player-iframe")
          .attr("src","") // unload iframe
        d3.select("#player-iframe").node().insertAdjacentHTML("afterend",
          `<p style="text-align:center;color:#a00;">No #1 track for ${country}</p>`
        );
      }
    })
    .catch(err => {
      console.error("Error loading", url, err);
      d3.select("#player-iframe")
        .attr("src",""); // unload
      d3.select("#player-iframe").node().insertAdjacentHTML("afterend",
        `<p style="text-align:center;color:#a00;">Couldn’t load data for ${country}</p>`
      );
    });
  });

  // 4) pick a sane default on first load:
  select.property("value", "Global").dispatch("change");
}

// 5) kick things off once the DOM is ready
document.addEventListener("DOMContentLoaded", drawPlayer);