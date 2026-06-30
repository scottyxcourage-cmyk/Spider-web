function openModal() {
  document.getElementById('modal-overlay').classList.add('visible');
  document.body.style.overflow = 'hidden';
  STATE.viewCount++;
  document.getElementById('stat-views').textContent = STATE.viewCount;
}
function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modal-overlay').classList.remove('visible');
  document.body.style.overflow = '';
}

function setModalHeroImg(src, alt, fallback) {
  const mh = document.getElementById('modal-hero');
  mh.querySelector('img')?.remove();
  const im = document.createElement('img');
  im.src = src; im.alt = alt;
  im.onerror = () => im.src = fallback;
  im.style.cssText = 'width:100%;height:100%;object-fit:cover;';
  mh.insertBefore(im, mh.firstChild);
}

function openMovieModal(idx) {
  const item = STATE.allMovies[idx];
  if (!item) return;
  const title   = item.name || item.title || 'Unknown';
  const img     = item.poster || item.image || fallbackImg(title + idx);
  const year    = item.year || item.Year || '';
  const size    = item.size || item.Size || '';
  const seeds   = item.seeds || item.seeders || '';
  const leeches = item.leeches || item.leechers || '';
  const uploader= item.uploader || '';
  const desc    = item.description || item.info || `A top-trending title in this month's most popular torrents.`;

  setModalHeroImg(img, title, fallbackImg(title + idx));
  document.getElementById('modal-badge').textContent = '🎬 Movie / TV';
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-meta').innerHTML =
    (year    ? `<span class="badge">${year}</span>` : '') +
    (size    ? `<span class="badge">💾 ${size}</span>` : '') +
    (seeds   ? `<span class="badge cyan">⬆ ${seeds} seeds</span>` : '') +
    (leeches ? `<span class="badge">⬇ ${leeches}</span>` : '') +
    (uploader? `<span class="badge">👤 ${uploader}</span>` : '');
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('modal-actions').innerHTML =
    `<button class="btn-modal primary" onclick="handleDownload('${encodeURIComponent(title)}')">⬇ Download Torrent</button>
     <button class="btn-modal secondary" onclick="handleSave('${encodeURIComponent(title)}')">🔖 Save</button>
     <button class="btn-modal secondary" onclick="closeModalDirect()">Close</button>`;
  openModal();
}

function openMusicModal(idx) {
  const item = STATE.allMusic[idx];
  if (!item) return;
  const title  = item.name || item.title || 'Unknown';
  const artist = item.artist || item.Artist || item.uploader || '';
  const img    = item.poster || item.image || fallbackImgSq(title + idx);
  const size   = item.size || item.Size || '';
  const seeds  = item.seeds || item.seeders || '';
  const desc   = item.description || item.info || `Trending in this month's top 100 music torrents.`;

  setModalHeroImg(img, title, fallbackImgSq(title + idx));
  document.getElementById('modal-badge').textContent = '🎵 Music';
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-meta').innerHTML =
    (artist ? `<span class="badge">🎤 ${artist}</span>` : '') +
    (size   ? `<span class="badge">💾 ${size}</span>` : '') +
    (seeds  ? `<span class="badge cyan">⬆ ${seeds} seeds</span>` : '');
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('modal-actions').innerHTML =
    `<button class="btn-modal primary" onclick="handleDownload('${encodeURIComponent(title)}')">⬇ Download</button>
     <button class="btn-modal secondary" onclick="handleSave('${encodeURIComponent(title)}')">🔖 Save</button>
     <button class="btn-modal secondary" onclick="closeModalDirect()">Close</button>`;
  openModal();
}

function handleDownload(encodedTitle) {
  const title = decodeURIComponent(encodedTitle);
  STATE.dlCount++;
  document.getElementById('stat-dl').textContent = STATE.dlCount;
  toast(`Starting download: ${title}`, 'success');
  closeModalDirect();
}
function handleSave(encodedTitle) {
  const title = decodeURIComponent(encodedTitle);
  STATE.saveCount++;
  document.getElementById('stat-saves').textContent = STATE.saveCount;
  toast(`Saved: ${title}`, 'info');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModalDirect(); });
