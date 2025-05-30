import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// Slider label updates
const features = [
  "danceability", "energy", "key", "loudness", "mode",
  "speechiness", "acousticness", "instrumentalness", "liveness",
  "valence", "tempo", "time_signature"
];
features.forEach(f => {
  const slider = document.getElementById(f);
  const valueSpan = document.getElementById('val-' + f);
  slider.addEventListener('input', () => { valueSpan.textContent = slider.value; });
});

// Year slider logic
const yearMin = document.getElementById('year-min');
const yearMax = document.getElementById('year-max');
const valYearMin = document.getElementById('val-year-min');
const valYearMax = document.getElementById('val-year-max');
function updateYearDisplay() {
  if (parseInt(yearMin.value) > parseInt(yearMax.value)) yearMin.value = yearMax.value;
  if (parseInt(yearMax.value) < parseInt(yearMin.value)) yearMax.value = yearMin.value;
  valYearMin.textContent = yearMin.value;
  valYearMax.textContent = yearMax.value;
}
yearMin.addEventListener('input', updateYearDisplay);
yearMax.addEventListener('input', updateYearDisplay);
updateYearDisplay();

// Cosine similarity function
function cosineSimilarity(a, b) {
  let dot = 0, a2 = 0, b2 = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    a2 += a[i] * a[i];
    b2 += b[i] * b[i];
  }
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}

// Months array
const months = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december"
];

// MAIN BUTTON HANDLER
document.getElementById('similar-btn').addEventListener('click', async function(e) {
  e.preventDefault();

  d3.select("#genre-result").style("display", "none");
  d3.select("#similar-result").style("display", "block");
  d3.select("#similar-track").html('<span>Loading Billboard data...</span>');
  d3.select("#spotify-iframe").attr("src", "");

  // ----------- 1. PREDICT GENRE USING GRADIO CLIENT -----------
  const userInput = {};
  features.forEach(f => userInput[f] = parseFloat(document.getElementById(f).value));

  d3.select("#genre-result").style("display", "inline-block").html('<span>Predicting genre...</span>');

  let genre = "Unknown";
  try {
    const client = await Client.connect("schifferlearning/genre-classifier-api");
    const result = await client.predict("/predict", userInput);
    if(result && result.data && result.data[0]) {
      genre = result.data[0];
    }
    d3.select("#genre-result")
      .style("display", "inline-block")
      .html('<span>🎼 Predicted genre: <b>' + genre + '</b></span>');
  } catch (err) {
    d3.select("#genre-result")
      .style("display", "inline-block")
      .html('<span>🎼 Predicted genre: <b>Unknown</b> (prediction error)</span>');
  }

  // ----- 2. FIND CLOSEST TRACK -----
  const yrMin = parseInt(yearMin.value), yrMax = parseInt(yearMax.value);
  const userVec = features.map(f => parseFloat(document.getElementById(f).value));
  let allTracks = [];
  let fetches = [];
  for (let year = yrMin; year <= yrMax; year++) {
    for (let m of months) {
      let url = `data/billboard_${m}_${year}.csv`;
      fetches.push(
        d3.csv(url).then(data => {
          allTracks.push(...data.filter(row =>
            features.every(f => row[f] !== undefined && row[f] !== "")
          ));
        }).catch(()=>{})
      );
    }
  }
  await Promise.all(fetches);

  let bestSim = -Infinity, bestTrack = null;
  for (const track of allTracks) {
    const trackVec = features.map(f => parseFloat(track[f]));
    const sim = cosineSimilarity(userVec, trackVec);
    if (sim > bestSim) {
      bestSim = sim;
      bestTrack = track;
    }
  }

  const container = d3.select("#similar-track");
  container.html("");
  if (bestTrack) {
    container.append("div")
      .html(`<b>${bestTrack.Song}</b> by <b>${bestTrack.Performer}</b><br>
        <span style="font-size:0.97rem; color:#236d59;">(${bestTrack.Year}), Peak Billboard position: #${bestTrack.weekly_position}</span>`);
    if (bestTrack.spotify_track_id) {
      // embedTrack function assumed to be in scripts/spotify.js
      embedTrack(bestTrack.spotify_track_id, "#spotify-iframe");
    } else {
      d3.select("#spotify-iframe").attr("src", "");
      container.append("div").text("No Spotify track available.");
    }
  } else {
    d3.select("#spotify-iframe").attr("src", "");
    container.text("No similar track found.");
  }
});
