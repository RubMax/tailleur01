 window.deferredPrompt = window.deferredPrompt || null;

    // Variable globale pour stocker les détails du produit actuel
    let currentProduct = {};
    let pubItems = [];
    let currentPubIndex = 0;
    let pubTimeout;
    
    // Variables pour la galerie d'images
    let currentImageIndex = 0;
    let imageUrls = [];
    
    document.addEventListener("DOMContentLoaded", () => {
  // Initialiser le système d'enregistrement
  initRegistration();
        const socialLinks = document.querySelector('.social-links');
    const pedDePage = document.getElementById('ped de page');
 if (socialLinks) socialLinks.remove();
    if (pedDePage) pedDePage.remove();
      // Chargement des données
     fetch("https://script.google.com/macros/s/AKfycbyRHCuLb0IC_fLpQs36UW_zzgnwmDHAJtDZHByZjz3rxHieXr-Xw54yt5NvCEZgzk64xQ/exec?page=api")
  .then(response => response.json())
  .then(data => {
    displayProduits(data);
  })
  .catch(error => {
    document.getElementById("produits").innerHTML =
      "<div class='alert alert-danger'>Erreur de chargement des données</div>";
    console.error(error);
  });

      
      // Initialiser le défilement horizontal
      setupHorizontalDragScroll();
    });

    function triggerScrollPulse() {
    const el = document.querySelector('.old-price');

    // Stopper l’animation subtile
    el.classList.add('pause-subtle');

    // Déclencher scrollPulse
    el.classList.add('animate-badge');

    // Après 2s, retirer l’animation scrollPulse et relancer subtlePulse
    setTimeout(() => {
        el.classList.remove('animate-badge');
        el.classList.remove('pause-subtle');
    }, 2000);
}


    function setupHorizontalDragScroll() {
      const container = document.getElementById('nav-container');
      const content = document.getElementById('section-nav');
      
      let pos = { left: 0, x: 0 };
      let isDragging = false;
      
      // Souris
      content.addEventListener('mousedown', function(e) {
        isDragging = true;
        pos = {
          left: container.scrollLeft,
          x: e.clientX
        };
        content.classList.add('grabbing');
        e.preventDefault();
      });
      
      document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const dx = e.clientX - pos.x;
        container.scrollLeft = pos.left - dx;
      });
      
      document.addEventListener('mouseup', function() {
        isDragging = false;
        content.classList.remove('grabbing');
      });
      
      // Tactile
      content.addEventListener('touchstart', function(e) {
        isDragging = true;
        pos = {
          left: container.scrollLeft,
          x: e.touches[0].clientX
        };
        content.classList.add('grabbing');
      }, { passive: false });
      
      document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - pos.x;
        container.scrollLeft = pos.left - dx;
        e.preventDefault();
      }, { passive: false });
      
      document.addEventListener('touchend', function() {
        isDragging = false;
        content.classList.remove('grabbing');
      });
    }
    
function createSectionButtons(sections) {
  const navContainer = document.getElementById('section-nav');
  navContainer.innerHTML = '';

  sections.forEach((section, index) => {
    const sectionId = generateSectionId(section);
    const button = document.createElement('a');
    button.href = `#${sectionId}`;
    button.textContent = section.toUpperCase();
    button.className = 'section-btn';

    button.addEventListener('click', function(e) {
      e.preventDefault();

      // Retirer "active" des autres boutons
      document.querySelectorAll('.section-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Faire défiler jusqu’à la section voulue
      document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
    });

    navContainer.appendChild(button);

    // Activer automatiquement la première section
    if (index === 0) {
      button.classList.add('active');
      setTimeout(() => {
        document.getElementById(sectionId).scrollIntoView({ behavior: "instant" });
      }, 100);
    }
  });
}



    
    /**
 * Génère un ID de section à partir d'un nom
 * @param {string} sectionName - Le nom de la section à transformer
 * @param {object} options - Options de configuration
 * @param {string} [options.separator='-'] - Séparateur à utiliser
 * @param {boolean} [options.preserveCase=false] - Conserver la casse originale
 * @param {boolean} [options.allowUnderscores=false] - Autoriser les underscores
 * @param {number} [options.maxLength=0] - Longueur maximale (0 = illimitée)
 * @returns {string} L'ID généré
 */
function generateSectionId(sectionName) {
  return sectionName
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/(^-|-$)/g, ''); // Supprimer les tirets en début et fin
} 
    
    document.addEventListener('DOMContentLoaded', () => {
  // Afficher la première section au démarrage
  const firstTitle = document.querySelector('h2');
  const firstContainer = firstTitle?.nextElementSibling;

  if (firstTitle && firstContainer) {
    firstTitle.style.display = 'block';
    firstContainer.style.display = 'block';
  }
});

function scrollToSection(sectionId) {
  const allSections = document.querySelectorAll('.section-container');
  const allTitles = document.querySelectorAll('h2');

  const firstSectionId = allTitles[0]?.id;

  // Durées plus lentes
  const fadeDuration = 2400;   // fade-in plus lent
  const scrollDelay = 100;      // petit délai avant le scroll

  // Fonction fade-in lente
  function fadeIn(element, duration) {
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = `opacity ${duration}ms`;
    requestAnimationFrame(() => {
      element.style.opacity = 1;
    });
  }

  if (sectionId === firstSectionId) {
    // Affiche toutes les sections
    allTitles.forEach(title => title.style.display = 'block');
    allSections.forEach(section => fadeIn(section, fadeDuration));

    // Défile tout en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Masque toutes les sections sauf celle sélectionnée
    allTitles.forEach(title => {
      title.style.display = (title.id === sectionId) ? 'block' : 'none';
    });

    allSections.forEach((section, i) => {
      const title = allTitles[i];
      if (title.id === sectionId) {
        fadeIn(section, fadeDuration);
      } else {
        section.style.display = 'none';
      }
    });

    // Défile vers la section visible
    const selectedTitle = document.getElementById(sectionId);
    if (selectedTitle) {
      setTimeout(() => {
        selectedTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, scrollDelay);
    }
  }
}


function handleScroll() {
  const header = document.querySelector('.fixed-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const scrollPosition = window.scrollY + headerHeight + 20;

  // Ne considérer que les titres visibles et qui ont un id
  const sections = [...document.querySelectorAll('h2')]
    .filter(s => s.offsetParent !== null && s.id);

  if (sections.length === 0) return;

  let activeFound = false;

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.id;

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      // retirer "active" de tous les boutons
      document.querySelectorAll('.section-btn').forEach(btn => btn.classList.remove('active'));

      // sécuriser l'id dans le sélecteur
      const selector = `.section-btn[href="#${CSS.escape(sectionId)}"]`;
      const activeBtn = document.querySelector(selector);
      if (activeBtn) activeBtn.classList.add('active');

      activeFound = true;
    }
  });

  // Si aucune section trouvée et qu'on est en bas de page, activer la dernière section visible
  if (!activeFound) {
    const scrollBottom = window.scrollY + window.innerHeight;
    if (document.documentElement.scrollHeight - scrollBottom < 5) {
      const last = sections[sections.length - 1];
      if (last) {
        document.querySelectorAll('.section-btn').forEach(btn => btn.classList.remove('active'));
        const selector = `.section-btn[href="#${CSS.escape(last.id)}"]`;
        const activeBtn = document.querySelector(selector);
        if (activeBtn) activeBtn.classList.add('active');
      }
    }
  }
}

    
    
function displayProduits(data) {
  const container = document.getElementById('produits');
  container.innerHTML = "";
  const sections = [...new Set(data.map(item => item.section))];

  // Filtrer les pubs valides
  pubItems = data.filter(item => item.pub && item.pub.trim() !== '');

  createSectionButtons(sections);

  sections.forEach(section => {
    const sectionId = generateSectionId(section);
    const h2 = document.createElement('h2');
    h2.textContent = section.toUpperCase(); // <-- Ajouté pour mettre le titre en majuscule
    h2.id = sectionId;
    container.appendChild(h2);

    const sectionContainer = document.createElement('div');
    sectionContainer.className = "section-container";
    container.appendChild(sectionContainer);

    data
      .filter(p => p.section === section)
      .forEach(produit => {
       const div = document.createElement('div');
const hasImage = produit.image && produit.image.trim() !== '';
div.className = "article produit-ligne" + (hasImage ? "" : " no-image");

        const descriptionHtml = produit.description.replace(/\n/g, '<br>');
        const descriptionParam = encodeURIComponent(produit.description);

        div.innerHTML = `
          ${hasImage ? `
  <div class="article-image">
    <img src="${escapeHtml(produit.image)}" 
         alt="${escapeHtml(produit.nom)}" 
         onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}', '${escapeHtml(produit.section)}')">
  </div>
` : ''}


          <div class="article-details">
            <h3 style="text-transform: uppercase"
    onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}', '${escapeHtml(produit.section)}')">
  ${escapeHtml(produit.nom)}
</h3>



            

            <div class="details">
  ${produit.prix ? (() => {
  try {
    if (produit.prix.includes('-')) {
      const [oldPrice, newPrice] = produit.prix.split('-').map(p => escapeHtml(p.trim()));
      return `
        <div class="price-container">
          <span class="old-price">R$ ${oldPrice}</span>
          <span class="new-price">R$ ${newPrice}</span>
        </div>
      `;
    }
    return `<p>R$ <strong>${escapeHtml(produit.prix)}</strong></p>`;
  } catch (e) {
    return `<p>R$ <strong>${escapeHtml(produit.prix)}</strong></p>`;
  }
})() : ''}

${(() => {
  let note = '';
  let taillesNettoyees = produit.tailles;

  // Extraire le texte entre parenthèses (s'il existe)
  const match = produit.tailles.match(/\(([^)]+)\)/);
  if (match) {
    note = match[1];
    taillesNettoyees = produit.tailles.replace(/\([^)]*\)/g, '').trim();
  }

  // Séparer et formater les tailles avec encadrement
  const taillesArray = taillesNettoyees.split(',')
    .map(t => t.trim())
    .filter(t => t !== '');

  const taillesEncadrees = taillesArray.map(taille => 
  `<span class="taille-encadree">🔹 ${escapeHtml(taille)}</span>`
).join(' ');

  return `
    ${note ? `<p class="note-text"><strong>${escapeHtml(note)}</strong></p>` : ''}
    ${taillesArray.length > 0 ? `
      <div class="tailles-container">
        ${taillesEncadrees}
      </div>
    ` : ''}
  `;
})()}
<br>
            <button class="open-button" onclick="showPopup('${escapeHtml(produit.image)}', '${escapeHtml(produit.nom)}', '${descriptionParam}', '${escapeHtml(produit.prix)}', '${escapeHtml(produit.tailles)}', '${escapeHtml(produit.code)}', '${escapeHtml(produit.section)}')">Solicite/Realise</button>
            
          

          </div>
        `;
        sectionContainer.appendChild(div);
      });
  });

  // Démarrer le carrousel de pubs si il y a des pubs
  if (pubItems.length > 0) {
    startPubCarousel();
  }

  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 300);
  }
}


    
    
     function startPubCarousel() {
      if (pubItems.length === 0) return;
      
      currentPubIndex = 0;
      scheduleNextPub();
    }
    
    function scheduleNextPub() {
      clearTimeout(pubTimeout);
      
      const currentPub = pubItems[currentPubIndex];
      const delay = currentPub.pubInterval || 25000; // Valeur par défaut 25s
      
      pubTimeout = setTimeout(() => {
        showCurrentPub();
        currentPubIndex = (currentPubIndex + 1) % pubItems.length;
        scheduleNextPub();
      }, delay);
    }

   function showCurrentPub() {
  const currentPub = pubItems[currentPubIndex];
  const parts = currentPub.pub.split('|');
  
  // Nouveau format: texte_gras|image|texte
  const boldText = parts[0] ? parts[0].trim() : null;
  const imageUrl = parts[1] ? parts[1].trim() : null;
  const text = parts[2] ? parts[2].trim() : null;
  
  let htmlContent = '<div class="pub-header" style="color: #ff0000; font-weight: bold; font-size: 2rem; margin-bottom: 0.5rem; text-align: center;">ANÚNCIO</div>';
  
  // Ajouter le texte en gras s'il existe
  if (boldText) {
    htmlContent += `<div class="pub-bold-text" style="font-weight: bold; font-size: 2rem; margin-bottom: 1rem;">
                    ${escapeHtml(boldText).replace(/\n/g, '<br>')}
                   </div>`;
  }
  
  // Ajouter l'image si elle existe
  if (imageUrl) {
    htmlContent += `<img src="${escapeHtml(imageUrl)}" class="pub-image" alt="Publicité">`;
  }
  
  // Ajouter le texte normal s'il existe
  if (text) {
    htmlContent += `<div class="pub-text">${escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
  }
  
  document.getElementById('pub-container').innerHTML = htmlContent;
  updatePubDots();
  document.getElementById('pub-popup').style.display = 'flex';
}
    
    function updatePubDots() {
      const dotsContainer = document.getElementById('pub-dots');
      dotsContainer.innerHTML = '';
      
      pubItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = `pub-dot ${index === currentPubIndex ? 'active' : ''}`;
        dot.onclick = () => {
          currentPubIndex = index;
          showCurrentPub();
          scheduleNextPub();
        };
        dotsContainer.appendChild(dot);
      });
    }
    
    function closePubPopup() {
      document.getElementById('pub-popup').style.display = 'none';
    }
    
    
    
    
    function escapeHtml(text) {
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    function showDescriptionPopup(encodedDescription) {
  const description = decodeURIComponent(encodedDescription).replace(/\n/g, '<br>');
  const descriptionContent = document.getElementById("description-content");
  descriptionContent.innerHTML = description;
  descriptionContent.style.fontSize = "50px";  // 👈 Taille du texte à 40px
  document.getElementById("description-popup").style.display = "flex";
  document.querySelector('.description-popup-close').style.fontSize = '40px';

}

    
    function closeDescriptionPopup() {
      document.getElementById("description-popup").style.display = "none";
    }
    
    
    /* Fonctions pour la galerie d'images */
  function showPopup(imageUrl, nom, description, prix, tailles, code, section, hideWhatsappButton = false) {
  // Supprimer la première image de la galerie
  imageUrls = imageUrl.split(',').map(url => url.trim()).slice(1); // 👈 ici
  
  currentImageIndex = 0;
  document.getElementById("popup").style.display = "flex";

  // Supprimer les textes entre parenthèses dans "tailles"
  const cleanedTailles = tailles.replace(/\([^)]*\)/g, '').trim();
  const sizesArray = cleanedTailles.split(',').map(size => size.trim()).filter(size => size !== '');
  const hasMultipleSizes = sizesArray.length > 1;

  // Stocker les détails du produit dans la variable globale
  currentProduct = {
    imageUrl,
    nom,
    description,
    prix,
    tailles,
    code,
    section,
    selectedSize: hasMultipleSizes ? null : sizesArray[0]
  };

  updateGallery();

  let sizesHTML = '';
  if (hasMultipleSizes) {
    sizesHTML = `
  <p></p>
  <div class="sizes-list" id="sizes-container">
    ${sizesArray.map(size => `
      <span class="size-item" onclick="selectSize(this, '${escapeHtml(size)}')">${escapeHtml(size)}</span>
    `).join('')}
  </div>
`;
  } else if (sizesArray.length === 1) {
    sizesHTML = `
      <p><strong>${escapeHtml(sizesArray[0])}</strong></p>
    `;
  } else {
    sizesHTML = ``;
  }

  // Mettre à jour le contenu du popup
  document.getElementById("popup-details").innerHTML = `
    <h4>${escapeHtml(nom)}</h4>
    
    ${prix?.trim() ? (() => {
      // Vérifie si le prix contient un séparateur "-"
      if (prix.includes('-')) {
        const [oldPrice, newPrice] = prix.split('-').map(p => p.trim());
        return `
          <div class="price-highlight">
            <div class="dual-price-container">
              <div class="old-price">
                <span class="currency-symbol">R$</span>
                <span class="price-amount">${escapeHtml(oldPrice)}</span>
              </div>
              <div class="new-price">
                <span class="currency-symbol">R$</span>
                <span class="price-amount">${escapeHtml(newPrice)}</span>
              </div>
            </div>
          </div>
        `;
      }
      // Cas normal (un seul prix)
      return `
        <div class="price-highlight">
          <span class="currency-symbol">R$</span>
          <span class="price-amount">${escapeHtml(prix)}</span>
        </div>
      `;
    })() : ''}
    
    <div>
      ${sizesHTML}
    </div>
    
    

    <div">
      <strong>Solicite ou realize este serviço no Whatsapp:</strong>
    </div>
     <br>
    <a href="#" id="whatsappButton" class="whatsapp-btn" onclick="event.preventDefault(); sendWhatsAppMessage();">
      <i class="fab fa-whatsapp"></i> WhatsApp
    </a>
<br>
    <div">
      <strong>Descrição:</strong>
      <div class="description-text" color: #0081fe;">
        ${decodeURIComponent(description).replace(/\n/g, '<br>')}
      </div>
    </div>
  `;

  // Afficher ou masquer le bouton WhatsApp selon le paramètre
  const whatsappButton = document.getElementById("whatsappButton");
  if (hideWhatsappButton) {
    whatsappButton.style.display = "none";
  } else {
    whatsappButton.style.display = "inline-block";
  }

  // Sélection automatique de la taille si une seule
  if (!hasMultipleSizes && sizesArray.length === 1) {
    const sizeElements = document.querySelectorAll('.size-item');
    if (sizeElements.length > 0) {
      sizeElements[0].classList.add('selected');
    }
  }
}

    
       function updateGallery() {
      const galleryImages = document.getElementById('gallery-images');
      const galleryDots = document.getElementById('gallery-dots');
      
      galleryImages.innerHTML = '';
      galleryDots.innerHTML = '';
      
      imageUrls.forEach((url, index) => {
        // Ajouter l'image
        const img = document.createElement('img');
        img.src = url;
        img.alt = currentProduct.nom;
        img.className = 'gallery-image';
        galleryImages.appendChild(img);
        
        // Ajouter le point de navigation
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (index === currentImageIndex ? ' active' : '');
        dot.onclick = () => goToImage(index);
        galleryDots.appendChild(dot);
      });
      
      // Positionner la galerie sur l'image actuelle
      galleryImages.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }
    
    function prevImage() {
      if (currentImageIndex > 0) {
        currentImageIndex--;
      } else {
        currentImageIndex = imageUrls.length - 1;
      }
      updateGallery();
    }
    
    function nextImage() {
      if (currentImageIndex < imageUrls.length - 1) {
        currentImageIndex++;
      } else {
        currentImageIndex = 0;
      }
      updateGallery();
    }
    
    function goToImage(index) {
      currentImageIndex = index;
      updateGallery();
    }
    
    // Gestion des glissements tactiles
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.getElementById('gallery-images').addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    document.getElementById('gallery-images').addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        nextImage(); // Glissement vers la gauche
      } else if (touchEndX - touchStartX > threshold) {
        prevImage(); // Glissement vers la droite
      }
    }
    
    function selectSize(element, size) {
  const sizeItems = document.querySelectorAll('.size-item');
  sizeItems.forEach(item => item.classList.remove('selected'));
  
  element.classList.add('selected');
  currentProduct.selectedSize = size;
  
  // Supprimer l'animation de secousse si elle était active
  const sizesContainer = document.getElementById('sizes-container');
  if (sizesContainer) {
    sizesContainer.classList.remove('shake');
  }
}
    
   // Ton numéro WhatsApp (à personnaliser)
const WHATSAPP_NUMBER = "11916204805";

function sendWhatsAppMessage() { 
  const sizesArray = currentProduct.tailles.split(',').map(size => size.trim()).filter(size => size !== '');
  const hasMultipleSizes = sizesArray.length > 1;
  const sizesContainer = document.getElementById('sizes-container');

  if (hasMultipleSizes && !currentProduct.selectedSize) {
    sizesContainer.classList.add('shake');
    setTimeout(() => sizesContainer.classList.remove('shake'), 500);
    return;
  }

  let message = `Slt, Mwen vle pran sevis sa:\n` +
                 `${currentProduct.nom}\n` +
                `Peyi : ${currentProduct.section}\n`;

  if (currentProduct.selectedSize) {
    message += `\nDesc : ${currentProduct.selectedSize}`;
  } else if (sizesArray.length === 1) {
    message += `\nDesc : ${sizesArray[0]}`;
  }

  // Ouvre WhatsApp
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}


function closePopup() {
  const popup = document.getElementById("popup");
  if (popup) {
    popup.style.display = "none";
  }
}

    function showCustomAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.style.position = 'fixed';
  alertBox.style.top = '50%';
  alertBox.style.left = '50%';
  alertBox.style.transform = 'translate(-50%, -50%)';
  alertBox.style.backgroundColor = '#fff'; // blanc complet
  alertBox.style.color = '#000'; // texte noir
  alertBox.style.padding = '20px';
  alertBox.style.border = '2px solid #333';
  alertBox.style.zIndex = '9999';
  alertBox.style.fontSize = '40px';
  alertBox.style.textAlign = 'center';
  alertBox.style.borderRadius = '8px';
  alertBox.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
  alertBox.innerHTML = `
    <p style="margin: 0; font-size: 40px;">${message}</p>
    <button id="close-alert" style="
      margin-top: 15px;
      padding: 10px 20px;
      font-size: 40px;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    ">OK</button>
  `;

  document.body.appendChild(alertBox);

  document.getElementById('close-alert').addEventListener('click', () => {
    document.body.removeChild(alertBox);
  });
}

    
    




document.addEventListener('DOMContentLoaded', () => {
  const logo = document.getElementById('logo');

  if (!logo) {
    console.warn("⚠️ Élément #logo introuvable !");
    return;
  }

  let tapCount = 0;
  let lastTapTime = 0;
  const maxDelay = 600; // délai max entre 2 taps

  logo.addEventListener('touchstart', () => {
    const now = Date.now();

    if (now - lastTapTime < maxDelay) {
      tapCount++;
    } else {
      tapCount = 1; // recommencer si trop lent
    }

    lastTapTime = now;

    if (tapCount === 3) {
      tapCount = 0;

      fetch('https://script.google.com/macros/s/AKfycbwoTyj8mpGYPfWCOxszGA-SPYTSBsJbJoHyFKgIr-b5xSAu-CO9pgE3bCebLGAWCVDnPg/exec?page=popupWelcome')
        .then(response => response.text())
        .then(content => {
          document.querySelector('#popup-welcome .popup-content p').innerText = content;
          document.getElementById('popup-welcome').style.display = 'flex';
        })
        .catch(err => {
          console.error('Erreur chargement contenu :', err);
        });
    }
  });
});


function waitForLogoAndInit() {
  const logo = document.getElementById('logo');
  if (!logo) {
    setTimeout(waitForLogoAndInit, 100); // réessaye après 100ms
    return;
  }

  initLogoTouchHandler(logo);
}

function initLogoTouchHandler(logo) {
  let tapCount = 0;
  let lastTap = 0;

  logo.addEventListener('touchstart', () => {
    const now = Date.now();
    if (now - lastTap < 600) {
      tapCount++;
    } else {
      tapCount = 1;
    }
    lastTap = now;

    if (tapCount === 3) {
      tapCount = 0;
      console.log("🎉 3 taps détectés !");

      fetch('https://script.google.com/macros/s/AKfycbwoTyj8mpGYPfWCOxszGA-SPYTSBsJbJoHyFKgIr-b5xSAu-CO9pgE3bCebLGAWCVDnPg/exec?page=popupWelcome')
        .then(r => r.text())
        .then(content => {
          document.querySelector('#popup-welcome .popup-content p').innerText = content;
          document.getElementById('popup-welcome').style.display = 'flex';
        });
    }
  });
}

document.addEventListener('DOMContentLoaded', waitForLogoAndInit);

// Variables pour l'enregistrement
let agentsList = [];

// Fonction pour charger la liste des agents
function loadAgents() {
  const AGENTS_URL = "https://script.google.com/macros/s/AKfycbzDeSDfYzb_953duQ-HuubILeZfzoRrtNe7d2Z7MEQbvVH9tzFZ1Dm0xTSHyZEgl7BIzg/exec?action=getAgents";
  
  fetch(AGENTS_URL)
    .then(response => response.json())
    .then(agents => {
      agentsList = agents;
      const agentSelect = document.getElementById('agent');
      
      agents.forEach(agent => {
        const option = document.createElement('option');
        option.value = agent;
        option.textContent = agent;
        agentSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Erreur chargement agents:', error);
    });
}

// Fonction pour enregistrer le client
// ✅ Fonction pour enregistrer le client
function registerClient(clientData) {
  const SAVE_URL = `https://script.google.com/macros/s/AKfycbzDeSDfYzb_953duQ-HuubILeZfzoRrtNe7d2Z7MEQbvVH9tzFZ1Dm0xTSHyZEgl7BIzg/exec` +
    `?action=saveClient&nom=${encodeURIComponent(clientData.nom)}` +
    `&tel=${encodeURIComponent(clientData.tel)}` +
    `&email=${encodeURIComponent(clientData.email)}` +
    `&whatsappAgent=${encodeURIComponent(clientData.whatsappAgent)}`; // 👈 Ajouté

  return fetch(SAVE_URL)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        localStorage.setItem('clientRegistered', 'true');
        localStorage.setItem('clientData', JSON.stringify(clientData));
        console.log(result.message);
        return { success: true };
      } else {
        throw new Error(result.message || 'Erreur lors de l\'enregistrement');
      }
    })
    .catch(error => {
      console.error('Erreur de requête:', error);
      return { success: false, message: error.message };
    });
}


// ✅ Fonction de validation visuelle
function validateFormInputs(formData) {
  let valid = true;

  // Réinitialiser les styles avant chaque validation
  const fields = ['nom', 'tel', 'email'];
  fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) field.style.border = '1px solid #ccc';
  });

  // Vérifier chaque champ et colorer en rouge si incorrect
  if (!formData.nom || formData.nom.trim().length < 2) {
    document.getElementById('nom').style.border = '2px solid red';
    valid = false;
  }

  const telRegex = /^[0-9]{8,15}$/;
  if (!telRegex.test(formData.tel)) {
    document.getElementById('tel').style.border = '2px solid red';
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    document.getElementById('email').style.border = '2px solid red';
    valid = false;
  }

  return valid;
}

// ✅ Vérifie si déjà enregistré
function checkRegistration() {
  return localStorage.getItem('clientRegistered') === 'true';
}

// ✅ Message de confirmation/erreur
function showRegisterMessage(message, isError = false) {
  const messageEl = document.getElementById('register-message');
  messageEl.textContent = message;
  messageEl.style.display = 'block';
  messageEl.style.background = isError ? '#ffebee' : '#e8f5e8';
  messageEl.style.color = isError ? '#c62828' : '#2e7d32';
  messageEl.style.border = isError ? '1px solid #ffcdd2' : '1px solid #c8e6c9';
}

// ✅ Initialisation de l’enregistrement
function initRegistration() {
  const popup = document.getElementById('register-popup');
  const form = document.getElementById('register-form');
  const messageEl = document.getElementById('register-message');

  if (!popup || !form) {
    console.error("❌ Erreur : le popup d'enregistrement est introuvable.");
    return;
  }

  if (checkRegistration()) {
    popup.style.display = 'none';
    document.body.classList.remove('registration-pending');
    return;
  }

  popup.style.display = 'flex';
  document.body.classList.add('registration-pending');
  loadAgents();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    messageEl.style.display = 'none';

    const formData = {
      nom: document.getElementById('nom').value.trim(),
      tel: document.getElementById('tel').value.trim(),
      email: document.getElementById('email').value,
      whatsappAgent: WHATSAPP_NUMBER
    };

    // Validation visuelle
    if (!validateFormInputs(formData)) {
      showRegisterMessage('⚠️ Veuillez corriger les champs en rouge avant de continuer.', true);
      return;
    }

    const submitBtn = document.querySelector('.register-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Vérification...';

    // Envoi vers le serveur
    registerClient(formData)
      .then(result => {
        if (result.success) {
          // ✅ Succès - que ce soit un nouveau client ou un client existant
          const message = result.dejaEnregistre 
            ? '✅ Bienvenue de retour ! Accès à l\'application...'
            : '✅ Enregistrement réussi ! Accès à l\'application...';
          
          showRegisterMessage(message, false);
          
          setTimeout(() => {
            popup.style.display = 'none';
            document.body.classList.remove('registration-pending');
            loadMainApp();
          }, 1500);
        } else {
          showRegisterMessage('❌ Erreur : ' + (result.message || 'Veuillez réessayer.'), true);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Accéder à l\'application';
        }
      })
      .catch(error => {
        showRegisterMessage('🚫 Erreur : ' + error.message, true);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Accéder à l\'application';
      });
  });
}

// ✅ Chargement principal de l’app (inchangé)
function loadMainApp() {
  const BASE = "https://script.google.com/macros/s/AKfycbzDeSDfYzb_953duQ-HuubILeZfzoRrtNe7d2Z7MEQbvVH9tzFZ1Dm0xTSHyZEgl7BIzg/exec";
  const logoUrlAPI = BASE + "?page=logo";
  const dataUrlAPI = BASE + "?page=api";

  const fetchText = (url) => fetch(url, { cache: "no-store" }).then(r => r.text());
  const fetchJSON = (url) => fetch(url, { cache: "no-store" }).then(r => r.json());

  const loader = document.getElementById("page-loader");
  const app = document.getElementById("app");
  const logoEl = document.getElementById("logo");

  loader.style.display = "flex";
  app.classList.remove("app-ready");

  Promise.all([
    fetchText(logoUrlAPI).then(url => {
      const test = new Image();
      return new Promise(resolve => {
        test.onload = () => { logoEl.src = url; resolve("ok"); };
        test.onerror = () => resolve("error");
        test.src = url;
      });
    }),
    fetchJSON(dataUrlAPI)
  ])
    .then(([_, data]) => {
      if (typeof displayProducts === "function") displayProducts(data);
    })
    .catch(err => {
      console.error("Erreur lors du chargement :", err);
      document.getElementById("produits").innerHTML =
        "<div class='alert alert-danger'>Erreur de chargement des données</div>";
    })
    .finally(() => {
      loader.style.display = "none";
      app.classList.add("app-ready");
    });
}
