/* ============================================================
   DOCUMENTS & CERTIFICATES — JavaScript
   ============================================================
   Link this file before </body>, after the HTML section exists:
     <script src="documents.js"></script>
   or paste its contents into your existing script.js.

   The only thing you need to edit is the DOCS array below —
   add one object per certificate. Everything else (gallery
   rendering, lightbox open/close) is automatic.
   ============================================================ */

(function () {
  // ============================================================
  // EDIT THIS ARRAY to add / remove certificates.
  // ============================================================
  const DOCS = [
    // {
    //   title: "TryHackMe Pre Security",
    //   issuer: "TryHackMe",
    //   date: "2026",
    //   type: "image",              // "image" or "pdf"
    //   file: "assets/certs/thm-presecurity.jpg",
    //   thumb: "assets/certs/thumbs/thm-presecurity.jpg" // optional, falls back to file
    // },
  ];

  const gallery = document.getElementById('certGallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxCaption = document.getElementById('lightboxCaption');

  if (!gallery || !lightbox) {
    console.warn('documents.js: expected elements not found — make sure documents-section.html has been added to the page.');
    return;
  }

  const docIconSVG = `
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
      <path d="M14 3v5h5"/>
      <path d="M9 13h6M9 16.5h6M9 9.5h2.5"/>
    </svg>`;

  function renderGallery() {
    if (!DOCS.length) {
      gallery.innerHTML = `<div class="cert-tile-empty">Certificates coming soon — add entries to the DOCS array in documents.js.</div>`;
      return;
    }

    gallery.innerHTML = DOCS.map((doc, i) => {
      const thumbSrc = doc.type === 'image' ? (doc.thumb || doc.file) : null;
      const thumbInner = doc.type === 'image'
        ? `<img src="${thumbSrc}" alt="${doc.title}" loading="lazy">`
        : docIconSVG;
      const thumbClass = doc.type === 'pdf' ? 'cert-thumb-wrap is-pdf' : 'cert-thumb-wrap';

      return `
        <button class="cert-tile" data-index="${i}" aria-label="Open ${doc.title}">
          <div class="${thumbClass}">${thumbInner}</div>
          <div class="cert-meta">
            <h4>${doc.title}</h4>
            <p>${doc.issuer}${doc.date ? ' · ' + doc.date : ''}</p>
          </div>
        </button>`;
    }).join('');

    gallery.querySelectorAll('.cert-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const doc = DOCS[Number(tile.dataset.index)];
        openLightbox(doc.file, doc.type, `${doc.title} — ${doc.issuer}`);
      });
    });
  }

  function openLightbox(file, type, caption) {
    lightboxMedia.innerHTML = type === 'pdf'
      ? `<iframe src="${file}" title="${caption}"></iframe>`
      : `<img src="${file}" alt="${caption}">`;
    lightboxCaption.textContent = caption;
    lightbox.setAttribute('data-open', 'true');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.setAttribute('data-open', 'false');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxMedia.innerHTML = '';
    document.body.style.overflow = '';
  }

  lightbox.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeLightbox));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Resume "View" button
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      openLightbox(btn.dataset.view, btn.dataset.type, btn.dataset.title);
    });
  });

  renderGallery();
})();
