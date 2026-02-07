// Main JavaScript for Developer Portfolio - VERSÃO CORRIGIDA
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 main.js carregado - versão corrigida");

  // Initialize Translator
  if (typeof Translator !== "undefined") {
    const translator = new Translator();
  }

  // ========== MOBILE MENU ==========
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      menuToggle.innerHTML = navMenu.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !navMenu.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navMenu.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    // Close menu when clicking links
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ========== NAVEGAÇÃO CORRIGIDA ==========
  function setupNavigation() {
    console.log("🔧 Configurando navegação...");

    // Remove todos os event listeners antigos de links
    document.querySelectorAll("a").forEach((link) => {
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
    });

    // Novo sistema de navegação
    document.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      console.log("🔗 Link clicado:", {
        href: href,
        text: link.textContent.trim(),
        isAnchor: href.startsWith("#"),
        isHtmlFile: href.includes(".html"),
        isExternal:
          link.target === "_blank" ||
          link.hostname !== window.location.hostname,
      });

      // 1. LINKS EXTERNOS - deixa o browser lidar
      if (
        link.target === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        console.log("🌐 Link externo - navegação normal");
        return true;
      }

      // 2. LINKS PARA OUTRAS PÁGINAS .html
      if (href.includes(".html")) {
        console.log("📄 Link para outra página - navegação normal");
        // Permite navegação normal do browser
        return true;
      }

      // 3. ÂNCORAS (#) NA MESMA PÁGINA
      if (href.startsWith("#") && href !== "#") {
        e.preventDefault();
        console.log("🎯 Âncora na mesma página:", href);

        const target = document.querySelector(href);
        if (target) {
          // Close mobile menu
          if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
          }

          // Scroll suave
          const headerHeight =
            document.querySelector(".dev-header")?.offsetHeight || 80;
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = targetPosition - headerHeight - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Atualiza URL sem recarregar (SPA)
          history.pushState(null, null, href);

          // Atualiza link ativo (apenas para âncoras)
          document.querySelectorAll(".nav-link").forEach((navLink) => {
            if (navLink.getAttribute("href") === href) {
              navLink.classList.add("active");
            } else {
              navLink.classList.remove("active");
            }
          });
        }
        return false;
      }

      // 4. OUTROS LINKS - comportamento padrão
      console.log("⚡ Outro tipo de link - navegação normal");
      return true;
    });
  }

  // Configura navegação após um pequeno delay
  setTimeout(setupNavigation, 100);

  // ========== ACTIVE NAV ON SCROLL ==========
  function setupScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveLink() {
      const scrollPosition = window.scrollY + 100;
      let currentSection = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = sectionId;
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");
        if (linkHref === `#${currentSection}`) {
          link.classList.add("active");
        }
      });
    }

    // Só ativa scroll spy se estiver no index.html (SPA)
    if (
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/")
    ) {
      window.addEventListener("scroll", updateActiveLink);
      updateActiveLink(); // Chama uma vez ao carregar
    }
  }

  setTimeout(setupScrollSpy, 150);

  // ========== THEME TOGGLE ==========
  function setupThemeToggle() {
    const themeToggle = document.createElement("button");
    themeToggle.className = "theme-toggle";
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.title = "Alternar tema claro/escuro";

    // Insere após o language switcher
    const languageSwitcher = document.getElementById("languageSwitcher");
    if (languageSwitcher) {
      languageSwitcher.parentNode.insertBefore(themeToggle, languageSwitcher);
    } else {
      document.body.appendChild(themeToggle);
    }

    // Verifica tema salvo
    const savedTheme = localStorage.getItem("devTheme") || "dark";
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");

      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("devTheme", "light");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
        localStorage.setItem("devTheme", "dark");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
    });

    // Estilos do theme toggle
    const themeToggleStyles = `
            .theme-toggle {
                position: fixed;
                top: 1rem;
                right: 5rem;
                z-index: 1001;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--dev-card-bg);
                border: 1px solid var(--dev-border);
                color: var(--dev-text);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                transition: all 0.3s;
            }

            body.light-mode .theme-toggle {
                background-color: white;
                border-color: var(--dev-light-border);
                color: var(--dev-light-text);
            }

            .theme-toggle:hover {
                transform: rotate(30deg);
                background-color: var(--dev-accent);
                color: var(--dev-primary);
            }

            @media (max-width: 768px) {
                .theme-toggle {
                    top: 0.5rem;
                    right: 4rem;
                    width: 35px;
                    height: 35px;
                }
            }
        `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = themeToggleStyles;
    document.head.appendChild(styleSheet);
  }

  setupThemeToggle();

  // ========== ANIMAÇÕES ==========
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    // Adiciona classes de animação dinamicamente
    document.querySelectorAll("section").forEach((section, index) => {
      if (index > 0) {
        // Pula hero section
        section.classList.add("animate-on-scroll");
        observer.observe(section);
      }
    });

    // Cards e outros elementos
    document
      .querySelectorAll(".service-card, .project-card, .story-card")
      .forEach((card) => {
        card.classList.add("animate-on-scroll");
        observer.observe(card);
      });

    // Estilos de animação
    const animationStyles = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .service-card:hover,
            .project-card:hover,
            .story-card:hover {
                transform: translateY(-10px);
                transition: transform 0.3s ease;
            }
        `;

    const animationStyleSheet = document.createElement("style");
    animationStyleSheet.textContent = animationStyles;
    document.head.appendChild(animationStyleSheet);
  }

  setTimeout(initAnimations, 200);

  // ========== CONTACT FORM ==========
  const contactForm = document.getElementById("quickContactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      try {
        submitButton.disabled = true;
        submitButton.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Coleta dados
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        console.log("📨 Formulário enviado:", data);

        // Simula envio
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Sucesso
        alert("Mensagem enviada com sucesso! Entrarei em contato em breve.");
        contactForm.reset();
      } catch (error) {
        console.error("Erro no formulário:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      const icon = this.querySelector("i");

      // Fecha outros
      document.querySelectorAll(".faq-answer").forEach((otherAnswer) => {
        if (otherAnswer !== answer) {
          otherAnswer.style.display = "none";
          otherAnswer.previousElementSibling.querySelector(
            "i",
          ).style.transform = "rotate(0deg)";
        }
      });

      // Alterna atual
      answer.style.display =
        answer.style.display === "block" ? "none" : "block";
      icon.style.transform =
        answer.style.display === "block" ? "rotate(180deg)" : "rotate(0deg)";
    });
  });

  // ========== SERVICE NAVIGATION (services.html) ==========
  // Initialize services page
  if (window.location.pathname.includes("services.html")) {
    const serviceLinks = document.querySelectorAll(".service-link");
    serviceLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          serviceLinks.forEach((l) => l.classList.remove("active"));
          this.classList.add("active");

          const headerHeight =
            document.querySelector(".dev-header")?.offsetHeight || 80;
          const targetPosition = targetSection.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }

  // ========== DEBUG INFO ==========
  console.log("✅ main.js configurado com sucesso");
  console.log("Página atual:", window.location.pathname);
  console.log("Total de links:", document.links.length);

  // Remove qualquer erro de extensão
  window.addEventListener("error", function (e) {
    if (e.message.includes("chrome-extension")) {
      e.preventDefault();
      e.stopPropagation();
      console.log("⚠️  Erro de extensão ignorado");
      return false;
    }
  });
});
