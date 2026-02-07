// Sistema de tradução simplificado
document.addEventListener("DOMContentLoaded", function () {
  console.log("🌐 Translator carregado");

  const translations = {
    pt: {
      "nav.home": "Início",
      "nav.about": "Sobre",
      "nav.portfolio": "Portfólio",
      "nav.services": "Serviços",
      "nav.contact": "Contato",
      "hero.cta2": "Contato Rápido",
    },
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.portfolio": "Portfolio",
      "nav.services": "Services",
      "nav.contact": "Contact",
      "hero.cta2": "Quick Contact",
    },
  };

  // Detectar idioma
  const savedLang = localStorage.getItem("preferredLanguage");
  const browserLang = navigator.language.startsWith("pt") ? "pt" : "en";
  const currentLang = savedLang || browserLang;

  // Aplicar traduções
  function applyTranslations(lang) {
    const langData = translations[lang] || translations["pt"];

    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (langData[key]) {
        element.textContent = langData[key];
      }
    });

    localStorage.setItem("preferredLanguage", lang);
    document.documentElement.lang = lang;
  }

  // Language switcher
  function createLanguageSwitcher() {
    const container = document.getElementById("languageSwitcher");
    if (!container) return;

    container.innerHTML = `
            <button class="lang-btn ${currentLang === "pt" ? "active" : ""}" data-lang="pt">PT</button>
            <button class="lang-btn ${currentLang === "en" ? "active" : ""}" data-lang="en">EN</button>
        `;

    container.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const lang = this.getAttribute("data-lang");
        applyTranslations(lang);
        container
          .querySelectorAll(".lang-btn")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
      });
    });
  }

  // Inicializar
  applyTranslations(currentLang);
  createLanguageSwitcher();
});
