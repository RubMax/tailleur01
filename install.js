window.deferredPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('installBtn');
  if (!installBtn) return;

  // Toujours afficher le bouton
  installBtn.style.display = 'block';

  let isInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  // Détecte l’installation après coup
  window.addEventListener('appinstalled', () => {
    isInstalled = true;
    console.log("📲 Aplicativo instalado com sucesso");
  });

  // Événement déclenché quand le navigateur autorise le prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPrompt = e;
    console.log("🛎️ Prompt prêt");

    installBtn.onclick = async () => {
      if (isInstalled) {
        alert("✅ O aplicativo já está instalado.");
        return;
      }

      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        const choice = await window.deferredPrompt.userChoice;
        console.log("Résultat:", choice.outcome);
        window.deferredPrompt = null;
      }
    };
  });

  // Si beforeinstallprompt n’est jamais déclenché
  installBtn.onclick = () => {
    if (isInstalled) {
      alert("✅ O aplicativo já está instalado.");
    } else if (!window.deferredPrompt) {
      alert("ℹ️ A instalação automática não está disponível.\nAdicione manualmente pelo menu do navegador.");
    }
  };
});

