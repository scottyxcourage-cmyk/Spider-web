function handleSearchInput(val) {
  clearTimeout(STATE.searchTimer);
  document.getElementById('search-input').value = val;
  document.getElementById('search-big').value   = val;
  if (val.trim().length > 1) {
    STATE.searchTimer = setTimeout(() => doSearch(val), 400);
  }
}

function doSearch(q) {
  const query = (q || document.getElementById('search-big').value || document.getElementById('search-input').value).trim();
  if (!query) return;
  navigateTo('search');
  const res = document.getElementById('search-results');
  const ql  = query.toLowerCase();
  const movieHits = STATE.allMovies.filter(i => (i.name || i.title || '').toLowerCase().includes(ql));
  const musicHits = STATE.allMusic.filter(i  => (i.name || i.title || i.artist || '').toLowerCase().includes(ql));

  if (!movieHits.length && !musicHits.length) {
    res.innerHTML = `<div class="search-empty">
      <div class="em-icon">🔍</div>
      <p>No results for "<strong>${query}</strong>"</p>
      <p style="margin-top:8px;font-size:12px;color:var(--grey);">Try a different keyword.</p>
    </div>`;
    return;
  }

  let html = '';
  if (movieHits.length) {
    html += `<div class="sec-head" style="margin-top:0;">
      <div class="sec-title">Movies &amp; TV (${movieHits.length})</div>
    </div>
    <div class="card-grid" style="margin-bottom:28px;">
      ${movieHits.slice(0,12).map((item) => renderMovieCard(item, STATE.allMovies.indexOf(item))).join('')}
    </div>`;
  }
  if (musicHits.length) {
    html += `<div class="sec-head">
      <div class="sec-title">Music (${musicHits.length})</div>
    </div>
    <div class="music-row">
      ${musicHits.slice(0,10).map((item) => renderTrack(item, STATE.allMusic.indexOf(item))).join('')}
    </div>`;
  }
  res.innerHTML = html;
}
