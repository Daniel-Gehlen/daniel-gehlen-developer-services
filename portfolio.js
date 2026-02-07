// Portfolio-specific JavaScript - VERSÃO CORRIGIDA
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 portfolio.js carregado");

  // Só executa na página de portfólio
  if (!window.location.pathname.includes("portfolio.html")) {
    return;
  }

  class PortfolioManager {
    constructor() {
      this.projects = [];
      this.filteredProjects = [];
      this.currentFilter = "all";
      this.currentSort = "updated";
      this.currentPage = 1;
      this.projectsPerPage = 9;

      this.init();
    }

    async init() {
      await this.loadProjects();
      this.setupEventListeners();
      this.renderProjects();
      this.updateStats();
    }

    async loadProjects() {
      try {
        this.showLoading(true);

        const response = await fetch(
          "https://api.github.com/users/Daniel-Gehlen/repos?sort=updated&per_page=100",
        );
        const repos = await response.json();

        this.projects = repos.map((repo) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "Projeto de desenvolvimento",
          language: repo.language || "Vários",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updated: repo.updated_at,
          created: repo.created_at,
          url: repo.html_url,
          homepage: repo.homepage,
          topics: repo.topics || [],
          category: this.determineCategory(repo),
          featured: repo.stargazers_count > 0 || repo.forks_count > 0,
        }));

        this.filteredProjects = [...this.projects];
      } catch (error) {
        console.error("Error loading projects:", error);
        this.projects = this.getFallbackProjects();
        this.filteredProjects = [...this.projects];
      } finally {
        this.showLoading(false);
      }
    }

    determineCategory(repo) {
      const name = (repo.name || "").toLowerCase();
      const description = (repo.description || "").toLowerCase();
      const topics = repo.topics || [];

      if (
        topics.includes("web") ||
        topics.includes("frontend") ||
        name.includes("web") ||
        name.includes("site") ||
        description.includes("website")
      ) {
        return "web";
      }

      if (
        topics.includes("api") ||
        topics.includes("backend") ||
        name.includes("api") ||
        name.includes("backend")
      ) {
        return "api";
      }

      if (
        topics.includes("mobile") ||
        name.includes("mobile") ||
        name.includes("app")
      ) {
        return "mobile";
      }

      if (topics.includes("fullstack") || description.includes("full stack")) {
        return "fullstack";
      }

      return "tool";
    }

    getFallbackProjects() {
      return [
        {
          id: 1,
          name: "Portfolio Website",
          description: "Site de portfólio responsivo com design moderno",
          language: "HTML/CSS/JS",
          stars: 12,
          forks: 3,
          updated: "2024-01-15",
          category: "web",
          url: "https://github.com/Daniel-Gehlen/portfolio",
          demoUrl: "#",
          featured: true,
        },
      ];
    }

    setupEventListeners() {
      // Filter buttons
      document.querySelectorAll(".filter-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.currentFilter = button.getAttribute("data-filter");
          document.querySelectorAll(".filter-btn").forEach((btn) => {
            btn.classList.remove("active");
          });
          button.classList.add("active");
          this.filterProjects(this.currentFilter);
        });
      });

      // Sort select
      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
          this.currentSort = e.target.value;
          this.sortProjects(this.currentSort);
        });
      }

      // Load more button
      const loadMoreBtn = document.getElementById("loadMoreBtn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.loadMoreProjects();
        });
      }
    }

    filterProjects(filter) {
      this.currentFilter = filter;
      this.currentPage = 1;

      if (filter === "all") {
        this.filteredProjects = [...this.projects];
      } else {
        this.filteredProjects = this.projects.filter(
          (project) => project.category === filter,
        );
      }

      this.sortProjects(this.currentSort);
      this.renderProjects();
    }

    sortProjects(sortBy) {
      this.filteredProjects.sort((a, b) => {
        switch (sortBy) {
          case "updated":
            return new Date(b.updated) - new Date(a.updated);
          case "stars":
            return b.stars - a.stars;
          case "name":
            return a.name.localeCompare(b.name);
          case "language":
            return (a.language || "").localeCompare(b.language || "");
          default:
            return 0;
        }
      });

      this.renderProjects();
    }

    renderProjects() {
      const container = document.getElementById("projectsGrid");
      if (!container) return;

      const startIndex = (this.currentPage - 1) * this.projectsPerPage;
      const endIndex = startIndex + this.projectsPerPage;
      const projectsToShow = this.filteredProjects.slice(startIndex, endIndex);

      if (projectsToShow.length === 0) {
        container.innerHTML = `
                    <div class="no-projects">
                        <i class="fas fa-search"></i>
                        <h3>Nenhum projeto encontrado</h3>
                        <p>Tente outro filtro</p>
                    </div>
                `;
        return;
      }

      container.innerHTML = projectsToShow
        .map((project) => this.createProjectCard(project))
        .join("");

      this.updateLoadMoreButton();
    }

    createProjectCard(project) {
      const languageIcon = this.getLanguageIcon(project.language);
      const categoryClass = this.getCategoryClass(project.category);
      const updatedDate = new Date(project.updated).toLocaleDateString("pt-BR");

      return `
                <div class="project-card ${categoryClass}">
                    <div class="project-header">
                        <div class="project-icon">
                            <i class="${languageIcon}"></i>
                        </div>
                        <div class="project-meta">
                            <span class="project-language">${project.language}</span>
                            <span class="project-stars">
                                <i class="fas fa-star"></i> ${project.stars}
                            </span>
                        </div>
                    </div>
                    <div class="project-content">
                        <h3>${project.name}</h3>
                        <p>${project.description}</p>
                        <div class="project-tags">
                            <span class="project-tag">${this.getCategoryLabel(project.category)}</span>
                        </div>
                    </div>
                    <div class="project-actions">
                        <a href="${project.url}" target="_blank" class="btn btn-small">
                            <i class="fas fa-code"></i> Código
                        </a>
                    </div>
                </div>
            `;
    }

    getLanguageIcon(language) {
      const icons = {
        JavaScript: "fab fa-js",
        Python: "fab fa-python",
        HTML: "fab fa-html5",
        CSS: "fab fa-css3-alt",
        React: "fab fa-react",
        "Node.js": "fab fa-node-js",
      };
      return icons[language] || "fas fa-code";
    }

    getCategoryClass(category) {
      return `category-${category}`;
    }

    getCategoryLabel(category) {
      const labels = {
        web: "Web Development",
        api: "API/Backend",
        mobile: "Mobile",
        fullstack: "Full Stack",
        tool: "Ferramenta",
      };
      return labels[category] || category;
    }

    loadMoreProjects() {
      const totalProjects = this.filteredProjects.length;
      const currentShowing = this.currentPage * this.projectsPerPage;

      if (currentShowing >= totalProjects) {
        document.getElementById("loadMoreBtn").style.display = "none";
        return;
      }

      this.currentPage++;
      this.renderProjects();
    }

    updateLoadMoreButton() {
      const loadMoreBtn = document.getElementById("loadMoreBtn");
      if (!loadMoreBtn) return;

      const totalProjects = this.filteredProjects.length;
      const currentShowing = this.currentPage * this.projectsPerPage;

      loadMoreBtn.style.display =
        currentShowing >= totalProjects ? "none" : "inline-flex";
    }

    updateStats() {
      const totalRepos = document.getElementById("totalRepos");
      const totalLanguages = document.getElementById("totalLanguages");

      if (totalRepos) {
        totalRepos.textContent = `${this.projects.length}+`;
      }

      if (totalLanguages) {
        const languages = [
          ...new Set(this.projects.map((p) => p.language).filter(Boolean)),
        ];
        totalLanguages.textContent = `${languages.length}+`;
      }
    }

    showLoading(show) {
      const container = document.getElementById("projectsGrid");
      if (!container) return;

      if (show) {
        container.innerHTML = `
                    <div class="loading-projects">
                        <i class="fas fa-spinner fa-spin"></i>
                        <p>Carregando projetos...</p>
                    </div>
                `;
      }
    }
  }

  // Inicializa
  const portfolioManager = new PortfolioManager();
  window.portfolioManager = portfolioManager;

  console.log("✅ Portfolio configurado");
});
