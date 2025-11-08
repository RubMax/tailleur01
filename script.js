<script>
window.deferredPrompt = window.deferredPrompt || null;

// Variables globales
let currentProduct = {};
let pubItems = [];
let currentPubIndex = 0;
let pubTimeout;
let currentImageIndex = 0;
let imageUrls = [];

// ✅ Exécuter une seule fois au chargement
document.addEventListener("DOMContentLoaded", function () {
  // Supprimer éléments inutiles
  const socialLinks = document.querySelector(".social-links");
  const pedDePage = document.getElementById("ped de page");
  if (socialLinks) socialLinks.remove();
  if (pedDePage) pedDePage.remove();

  // ✅ Afficher popup de registre à l’ouverture
  const regPopup = document.getElementById("reg-popup");
  if (regPopup) {
    regPopup.style.display = "flex";
  }

  // Charger les données de la feuille Google
  fetch("https://script.google.com/macros/s/AKfycbyRHCuLb0IC_fLpQs36UW_zzgnwmDHAJtDZHByZjz3rxHieXr-Xw54yt5NvCEZgzk64xQ/exec?page=api")
    .then((response) => response.json())
    .then((data) => {
      displayProduits(data);
    })
    .catch((error) => {
      document.getElementById("produits").innerHTML =
        "<div class='alert alert-danger'>Erreur de chargement des données</div>";
      console.error(error);
    });

  // Activer défilement horizontal
  setupHorizontalDragScroll();
});

function setupHorizontalDragScroll() {
  const container = document.getElementById("nav-container");
  const content = document.getElementById("section-nav");
  if (!container || !content) return;

  let pos = { left: 0, x: 0 };
  let isDragging = false;

  // Souris
  content.addEventListener("mousedown", (e) => {
    isDragging = true;
    pos = { left: container.scrollLeft, x: e.clientX };
    content.classList.add("grabbing");
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - pos.x;
    container.scrollLeft = pos.left - dx;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    content.classList.remove("grabbing");
  });

  // Tactile
  content.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      pos = { left: container.scrollLeft, x: e.touches[0].clientX };
      content.classList.add("grabbing");
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - pos.x;
      container.scrollLeft = pos.left - dx;
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("touchend", () => {
    isDragging = false;
    content.classList.remove("grabbing");
  });
}

function generateSectionId(sectionName) {
  return sectionName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// === POPUP REG ===
function closeRegPopup() {
  const regPopup = document.getElementById("reg-popup");
  if (regPopup) regPopup.style.display = "none";
}

// === AFFICHAGE DES PRODUITS ===
function displayProduits(data) {
  const container = document.getElementById("produits");
  if (!container) return;

  container.innerHTML = "";
  const sections = [...new Set(data.map((item) => item.section))];
  pubItems = data.filter((item) => item.pub && item.pub.trim() !== "");

  createSectionButtons(sections);

  sections.forEach((section) => {
    const sectionId = generateSectionId(section);
    const h2 = document.createElement("h2");
    h2.textContent = section.toUpperCase();
    h2.id = sectionId;
    container.appendChild(h2);

    const sectionContainer = document.createElement("div");
    sectionContainer.className = "section-container";
    container.appendChild(sectionContainer);

    data
      .filter((p) => p.section === section)
      .forEach((produit) => {
        const div = document.createElement("div");
        const hasImage = produit.image && produit.image.trim() !== "";
        div.className =
          "article produit-ligne" + (hasImage ? "" : " no-image");

        const descriptionHtml = produit.description.replace(/\n/g, "<br>");
        const descriptionParam = encodeURIComponent(produit.description);

        div.innerHTML = `
          ${hasImage ? `
            <div class="article-image">
              <img src="${escapeHtml(produit.image)}"
                   alt="${escapeHtml(produit.nom)}"
                   onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">
            </div>` : ""}
          <div class="article-details">
            <h3 style="text-transform: uppercase"
                onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">
              ${escapeHtml(produit.nom)}
            </h3>
            <div class="details">
              ${produit.prix ? `<p><strong>R$ ${escapeHtml(produit.prix)}</strong></p>` : ""}
              <button class="open-button"
                      onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}')">
                Solicite/Realise
              </button>
            </div>
          </div>
        `;
        sectionContainer.appendChild(div);
      });
  });

  if (pubItems.length > 0) startPubCarousel();
}

// === PUBS ===
function startPubCarousel() {
  if (pubItems.length === 0) return;
  currentPubIndex = 0;
  scheduleNextPub();
}

function scheduleNextPub() {
  clearTimeout(pubTimeout);
  const currentPub = pubItems[currentPubIndex];
  const delay = currentPub.pubInterval || 25000;
  pubTimeout = setTimeout(() => {
    showCurrentPub();
    currentPubIndex = (currentPubIndex + 1) % pubItems.length;
    scheduleNextPub();
  }, delay);
}

function showCurrentPub() {
  const currentPub = pubItems[currentPubIndex];
  const parts = currentPub.pub.split("|");
  const boldText = parts[0] ? parts[0].trim() : null;
  const imageUrl = parts[1] ? parts[1].trim() : null;
  const text = parts[2] ? parts[2].trim() : null;

  let html = "<div class='pub-header'>ANÚNCIO</div>";
  if (boldText) html += `<div class='pub-bold'>${escapeHtml(boldText)}</div>`;
  if (imageUrl) html += `<img src='${escapeHtml(imageUrl)}' class='pub-image'>`;
  if (text) html += `<div class='pub-text'>${escapeHtml(text)}</div>`;

  const popup = document.getElementById("pub-popup");
  const dots = document.getElementById("pub-dots");
  if (!popup) return;

  popup.innerHTML = html;
  if (dots) updatePubDots();
  popup.style.display = "flex";
}

// === UTILITAIRES ===
function escapeHtml(text) {
  return text
    ? text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    : "";
}
</script>
