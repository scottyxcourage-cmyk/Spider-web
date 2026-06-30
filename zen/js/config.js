'use strict';

const CONFIG = {
  // Leave blank if the backend (server/server.js) serves this frontend itself (recommended).
  // Otherwise set to the backend's full URL, e.g. 'https://your-backend.pxxl.run'
  API_BASE: '',
  API_KEY:  'c335d0b400msh62c69a4f85637f9p106ed2jsn24bab3b24b29',
  API_HOST: 'movie-tv-music-search-and-download.p.rapidapi.com',
  get BASE_URL() { return `https://${this.API_HOST}`; },
  get HEADERS() {
    return {
      'Content-Type': 'application/json',
      'x-rapidapi-host': this.API_HOST,
      'x-rapidapi-key': this.API_KEY
    };
  }
};

const SPLASH_MESSAGES = [
  'Initializing Spider Hub...',
  'Loading Movies...',
  'Loading Music...',
  'Preparing Your Experience...',
  'Almost Ready...'
];

// App state
const STATE = {
  currentUser:  null,
  currentPage:  'home',
  navLocked:    false,
  userMenuOpen: false,
  allMovies:    [],
  allMusic:     [],
  viewCount:    0,
  dlCount:      0,
  saveCount:    0,
  searchTimer:  null
};
