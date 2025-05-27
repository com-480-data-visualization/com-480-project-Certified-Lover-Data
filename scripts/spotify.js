// ————————————————————————————————
//   SLIDE “3-2”: per-country Spotify player
// ————————————————————————————————

function embedTrack(trackId) {
  // update the existing iframe’s src
  d3.select("#player-iframe")
    .attr("src", `https://open.spotify.com/embed/track/${trackId}`);
}

function drawPlayer() {
  const countries = [ /* your 72 names… */ ];
  const select = d3.select("#country-select")
    .html("")
    .selectAll("option")
    .data(countries)
    .join("option")
      .attr("value", d => d)
      .text(d => d);

  select.on("change", function() {
    const country  = this.value,
          safeName = encodeURIComponent(country),
          url      = `{{ site.baseurl }}/data/countries/${safeName}.csv`;

    d3.csv(url)
      .then(rows => {
        const top = rows.find(r => +r.daily_rank === 1);
        if (top && top.spotify_id) {
          embedTrack(top.spotify_id);
        } else {
          d3.select("#player-iframe")
            .attr("src", "")
            .node().insertAdjacentHTML(
              "afterend",
              `<p style="text-align:center;color:#a00;">
                No #1 track found for ${country}.
              </p>`
            );
        }
      })
      .catch(err => {
        console.error("couldn't load", url, err);
        d3.select("#player-iframe")
          .attr("src", "")
          .node().insertAdjacentHTML(
            "afterend",
            `<p style="text-align:center;color:#a00;">
              Error loading data for ${country}.
            </p>`
          );
      });
  });

  select.property("value", "United States").dispatch("change");
}
// 5) kick things off once the DOM is ready
document.addEventListener("DOMContentLoaded", drawPlayer);