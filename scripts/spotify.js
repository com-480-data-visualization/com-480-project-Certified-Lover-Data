// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————
  function embedTrack(trackId) {
    // simply update the existing iframe’s src
    d3.select("#player-iframe")
      .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
  }

  function drawPlayer() {
    // 1) all 72 country names (must exactly match your
    //    filenames in data/countries/, minus “.csv”)
    const countries = [
      "Netherlands","Philippines","New Zealand","Singapore","Peru","India",
      "Denmark","Belarus","Italy","Korea Republic of","Türkiye",
      "Venezuela Bolivarian Republic of","Romania","Chile","Lithuania",
      "Slovakia","Indonesia","Norway","Mexico","Morocco","Japan","Uruguay",
      "Ireland","Finland","Egypt","United States","Dominican Republic",
      "Viet Nam","United Kingdom","Germany","Pakistan","Bulgaria","Canada",
      "United Arab Emirates","France","South Africa","Thailand","Portugal",
      "Spain","Luxembourg","Paraguay","Nicaragua","Costa Rica","Austria",
      "Latvia","Israel","Brazil","Greece","Sweden","Belgium","Czechia",
      "Hong Kong","Australia","Bolivia Plurinational State of","Nigeria",
      "Malaysia","Switzerland","Panama","Taiwan Province of China",
      "Ecuador","El Salvador","Saudi Arabia","Iceland","Hungary",
      "Argentina","Kazakhstan","Poland","Colombia","Guatemala","Honduras",
      "Estonia","Ukraine"
    ];

    // 2) populate the <select>
    const select = d3.select("#country-select")
      .html("")                // clear any static <option>s
      .selectAll("option")
      .data(countries)
      .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    // 3) when the user picks a country…
    select.on("change", function() {
      const country  = this.value,
            safeName = encodeURIComponent(country),
            // **relative path** from your published site root:
            url      = `${window.location.pathname.replace(/\/[^/]*$/, "")}/data/countries/${safeName}.csv`;

      d3.csv(url)
        .then(rows => {
          const top = rows.find(r => +r.daily_rank === 1);
          if (top && top.spotify_id) {
            embedTrack(top.spotify_id);
          } else {
            alert("No #1 track found for " + country);
          }
        })
        .catch(err => {
          console.error("couldn't load", url, err);
          alert("Error loading data for " + country);
        });
    });

    // 4) set a default
    select.property("value", "United States").dispatch("change");
  }

  document.addEventListener("DOMContentLoaded", () => {
    drawPlayer();
  });
