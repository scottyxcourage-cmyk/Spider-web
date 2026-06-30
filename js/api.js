async function apiFetch(endpoint) {
  const res = await fetch(`${CONFIG.BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: CONFIG.HEADERS
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function parseItems(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.torrents)) return data.torrents;
  for (const k of Object.keys(data || {})) {
    if (Array.isArray(data[k])) return data[k];
  }
  return [];
}

async function loadMovies() {
  const data = await apiFetch('monthly_top100_movies');
  STATE.allMovies = parseItems(data);
  return STATE.allMovies;
}

async function loadMusic() {
  const data = await apiFetch('monthly_top100_music');
  STATE.allMusic = parseItems(data);
  return STATE.allMusic;
}
