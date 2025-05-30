const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];
const genreEmojis = {
  "Pop":"🎤","Rock":"🎸","R&B":"🎷","Hip Hop":"🎧","Country":"🤠","Electronic":"🎹",
  "Jazz":"🎺","Blues":"🎼","Soul":"🫀","Folk":"🪕","Easy Listening":"🛋️","Other":"🌀"
};
const BASE_URL = window.BASE_URL || "";

function getRandomInt(min,max) { return Math.floor(Math.random()*(max-min+1))+min; }

// --- Utility: "track id" (prefer spotify, else song+performer) ---
function getTrackId(track) {
  return track.spotify_track_id?.trim() || (track.song?.trim().toLowerCase() + "::" + track.performer?.trim().toLowerCase());
}

// --- Pick a random month+year ---
function pickRandomMonthYear() {
  const year = getRandomInt(1959, 2020);
  const monthIndex = getRandomInt(0,11);
  return {year, month: months[monthIndex], monthIndex};
}

// --- Load 10 random *unique* tracks from a month (optionally, a year) ---
async function loadRandomTracksFromMonth() {
  const {year, month, monthIndex} = pickRandomMonthYear();
  const file = `${BASE_URL}/data/billboard_${month.toLowerCase()}_${year}.csv`;
  try {
    const data = await d3.csv(file);
    // Only consider top 40 (so they're real hits) and deduplicate by "track id"
    const pool = data.filter(d => {
      const pos = +d.weekly_position || +d.WeeklyPosition || 999;
      return pos >= 1 && pos <= 40;
    });
    // Build unique tracks: { trackId: {track, genres:[...] } }
    const uniqueMap = {};
    pool.forEach(d => {
      const id = d.spotify_track_id?.trim() || (d.Song?.trim().toLowerCase() + "::" + d.Performer?.trim().toLowerCase());
      if (!id) return;
      if (!uniqueMap[id]) {
        uniqueMap[id] = {
          cover: d.cover_url || d.album_cover || "",
          genres: [d.Genre || d.genre || "Other"],
          genre: d.Genre || d.genre || "Other",
          performer: d.Performer || d.performer || "",
          song: d.Song || d.title || "",
          spotify_id: d.spotify_track_id,
          id: id
        };
      } else {
        // Add genre if not present
        const g = d.Genre || d.genre || "Other";
        if (!uniqueMap[id].genres.includes(g)) uniqueMap[id].genres.push(g);
      }
    });
    // Assign most frequent genre to each song (or first one if tie)
    Object.values(uniqueMap).forEach(trk => {
      if (trk.genres.length > 1) {
        // Optionally: assign the one that appears most in the pool for that song
        const genreCounts = {};
        trk.genres.forEach(g => { genreCounts[g] = 0; });
        pool.filter(x =>
          (x.spotify_track_id?.trim() || (x.Song?.trim().toLowerCase() + "::" + x.Performer?.trim().toLowerCase())) === trk.id
        ).forEach(x => {
          const g = x.Genre || x.genre || "Other";
          genreCounts[g] = (genreCounts[g]||0)+1;
        });
        // Pick the genre with the most occurrences (break ties by order)
        let maxCount = 0, genreMax = trk.genres[0];
        trk.genres.forEach(g => {
          if (genreCounts[g] > maxCount) { maxCount = genreCounts[g]; genreMax = g; }
        });
        trk.genre = genreMax;
      }
    });
    // Shuffle and pick 10
    const uniqueTracks = Object.values(uniqueMap);
    for (let i = uniqueTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueTracks[i], uniqueTracks[j]] = [uniqueTracks[j], uniqueTracks[i]];
    }
    const tracks = uniqueTracks.slice(0,10);
    if (tracks.length < 10) return await loadRandomTracksFromMonth(); // Try again if not enough
    return {year, month, tracks};
  } catch {
    return await loadRandomTracksFromMonth(); // Retry on fail/missing file
  }
}

// --- Render Billboard Source Table ---
function renderBillboardOriginal(tracks, container, draggable=true, usedIds=[]) {
  let html = `<table class="billboard-table" style="width:100%;">`;
  html += tracks.map((track,idx) => {
    const id = getTrackId(track);
    const used = usedIds.includes(id);
    return `
      <tr class="billboard-row${used?" disabled":""}" draggable="${draggable && !used}" data-index="${idx}" data-id="${id}" style="${used?'opacity:0.43;pointer-events:none;':""}">
        <td class="billboard-rank">${idx+1}</td>
        <td><img class="billboard-cover" src="${track.cover||'https://via.placeholder.com/54'}" alt=""></td>
        <td>
          <div class="billboard-title">${track.song}</div>
          <div class="billboard-artist">${track.performer}</div>
          <div class="billboard-genre">${genreEmojis[track.genre]||""} ${track.genre}</div>
        </td>
      </tr>
    `;
  }).join("");
  html += `</table>`;
  container.innerHTML = html;
}

// --- User Billboard (as before) ---
function renderUserBillboard(userTracks) {
  let html = `<table class="billboard-user-table" style="width:100%;">`;
  for (let i=0;i<10;i++) {
    const track = userTracks[i];
    html += `<tr class="user-row user-slot${track?" filled":""}" data-slot="${i}" ${track?'draggable="true"':""}>
      <td class="user-rank">${i+1}</td>
      <td>${
        track? `<img class="user-cover" src="${track.cover||'https://via.placeholder.com/54'}" alt="">` : ""
      }</td>
      <td style="min-width:160px;">${
        track? `<div class="user-title">${track.song}</div>
          <div class="user-artist">${track.performer}</div>
          <div class="billboard-genre">${genreEmojis[track.genre]||""} ${track.genre}</div>` 
        : `<span style="color:#bbb;font-style:italic;">Drag a song here</span>`
      }</td>
    </tr>`;
  }
  html += `</table>`;
  document.getElementById("billboard-user").innerHTML = html;
}

function updateGenreRankings(userTracks) {
  // genre_ranking = sum(1/track_ranking) for tracks in the top 10
  const scores = {};
  userTracks.forEach((track, idx) => {
    if (!track) return;
    if (!scores[track.genre]) scores[track.genre]=0;
    scores[track.genre] += 1/(idx+1);
  });
  const genresSorted = Object.keys(scores).sort((a,b) => scores[b]-scores[a]);
  return genresSorted.map((g,i) => ({
    genre: g,
    emoji: genreEmojis[g]||"",
    score: scores[g]
  }));
}

function animateGenreBillboard(results, userTracks) {
  const container = document.getElementById("genre-billboard-results");
  container.innerHTML = "";

  // Compute fractions per genre
  const genreTracks = {};
  userTracks.forEach((track, idx) => {
    if (!track) return;
    if (!genreTracks[track.genre]) genreTracks[track.genre] = [];
    genreTracks[track.genre].push(idx+1);
  });

  // Sort results by score descending (in case they're not sorted already)
  results = results.slice().sort((a, b) => b.score - a.score);

  results.forEach((row, idx) => {
    const box = document.createElement("div");
    box.className = "genre-board-row-inline";
    box.style.animationDelay = (0.17 + idx*0.09) + "s";

    // Inline fractions
    const ranks = genreTracks[row.genre] || [];
    const frac = ranks.map(r => `<span class="frac">1/<sub>${r}</sub></span>`).join(' + ');
    box.innerHTML = `
      <span class="genre-rank-circle">${idx+1}</span>
      <span class="genre-emoji">${row.emoji}</span>
      <span class="genre-label">${row.genre}</span>
      <span class="genre-inline-formula">${frac} = <b>${row.score.toFixed(2)}</b></span>
    `;
    container.appendChild(box);
  });

  container.style.display = "";
  document.getElementById("genre-score-explanation").style.display = "";
}


let billboardWeekData = null, userTop10 = Array(10).fill(null);
let dragSourceIdx = null;

// --- Billboard logic with deduplication and single-use constraints ---
async function refreshRandomWeek() {
  document.getElementById("genre-billboard-results").style.display = "none";
  document.getElementById("see-genre-rankings").style.display = "none";
  document.getElementById("see-genre-rankings").classList.remove("active");
  userTop10 = Array(10).fill(null);
  document.getElementById("billboard-user").innerHTML = "";
  document.getElementById("billboard-original").innerHTML = "<div style='padding:40px;text-align:center;font-size:1.2em;'>Loading 10 random tracks...</div>";
  const data = await loadRandomTracksFromMonth();
  billboardWeekData = data;
  document.getElementById("random-week-label").textContent = `— ${data.month} ${data.year}`;
  renderBillboardOriginal(data.tracks, document.getElementById("billboard-original"), true, []);
  renderUserBillboard(userTop10);
  enableDragAndDrop();
}

function enableDragAndDrop() {
  // Used IDs
  const usedIds = userTop10.filter(Boolean).map(getTrackId);

  // Billboard table: disable used
  renderBillboardOriginal(billboardWeekData.tracks, document.getElementById("billboard-original"), true, usedIds);

  // Drag from original list (only if not used)
  document.querySelectorAll("#billboard-original .billboard-row:not(.disabled)").forEach(row => {
    row.addEventListener("dragstart", e => {
      dragSourceIdx = +row.dataset.index;
      e.dataTransfer.effectAllowed = "copy";
      row.style.opacity = "0.5";
    });
    row.addEventListener("dragend", e => {
      row.style.opacity = "";
    });
  });
  // Drag to user slots
  document.querySelectorAll("#billboard-user .user-slot").forEach(slot => {
    slot.addEventListener("dragover", e => {
      e.preventDefault(); slot.classList.add("drag-over");
    });
    slot.addEventListener("dragleave", e => { slot.classList.remove("drag-over"); });
    slot.addEventListener("drop", e => {
      slot.classList.remove("drag-over");
      if (dragSourceIdx==null) return;
      const track = billboardWeekData.tracks[dragSourceIdx];
      // Don't allow same track more than once
      const tid = getTrackId(track);
      if (userTop10.some(t => t && getTrackId(t) === tid)) return;
      userTop10[+slot.dataset.slot] = track;
      renderUserBillboard(userTop10);
      enableDragAndDrop();
      checkUserComplete();
    });
  });
  // Re-drag from user slots
  document.querySelectorAll("#billboard-user .user-slot.filled").forEach(slot => {
    slot.addEventListener("dragstart", e => {
      dragSourceIdx = null;
      e.dataTransfer.effectAllowed = "move";
      slot.style.opacity = "0.5";
      // Remove from current slot on drag
      const i = +slot.dataset.slot;
      setTimeout(()=>{ userTop10[i]=null; renderUserBillboard(userTop10); enableDragAndDrop(); },0);
    });
    slot.addEventListener("dragend", e => {
      slot.style.opacity = "";
      checkUserComplete();
    });
  });
}

function checkUserComplete() {
  if (userTop10.filter(t=>t).length===10) {
    const btn = document.getElementById("see-genre-rankings");
    btn.style.display = "";
    setTimeout(()=>btn.classList.add("active"),50);
  } else {
    document.getElementById("see-genre-rankings").classList.remove("active");
    document.getElementById("see-genre-rankings").style.display="none";
  }
}

document.getElementById("refresh-billboard-week").onclick = refreshRandomWeek;
document.getElementById("see-genre-rankings").onclick = () => {
  const results = updateGenreRankings(userTop10);
  animateGenreBillboard(results, userTop10);
  const resultsSection = document.getElementById("genre-billboard-results");
  if (resultsSection) {
    resultsSection.scrollIntoView({ behavior: "smooth" });
  }
};

refreshRandomWeek();