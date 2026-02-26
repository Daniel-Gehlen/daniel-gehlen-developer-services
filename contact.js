// Contact Form JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("📞 contact.js carregado");

  // Only run on contact page
  if (!window.location.pathname.includes("contact.html")) {
    return;
  }

  // Form elements
  const contactForm = document.getElementById("mainContactForm");
  const messageTextarea = document.getElementById("contactMessage");
  const charCount = document.getElementById("charCount");
  const fileUploadArea = document.getElementById("fileUploadArea");
  const fileInput = document.getElementById("contactFiles");
  const filePreview = document.getElementById("filePreview");
  const submitButton = document.getElementById("submitButton");
  const successModal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");
  const contextDetection = document.getElementById("contextDetection");
  const contextDetails = document.getElementById("contextDetails");

  // Character counter for message
  if (messageTextarea && charCount) {
    messageTextarea.addEventListener("input", function () {
      const length = this.value.length;
      charCount.textContent = length;

      if (length > 1900) {
        charCount.style.color = "var(--dev-error)";
      } else if (length > 1500) {
        charCount.style.color = "var(--dev-warning)";
      } else {
        charCount.style.color = "var(--dev-text-light)";
      }
    });
  }

  // File upload handling
  if (fileUploadArea && fileInput) {
    // Click on area triggers file input
    fileUploadArea.addEventListener("click", function () {
      fileInput.click();
    });

    // Drag and drop
    fileUploadArea.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.style.borderColor = "var(--dev-accent)";
      this.style.backgroundColor = "rgba(100, 255, 218, 0.05)";
    });

    fileUploadArea.addEventListener("dragleave", function () {
      this.style.borderColor = "var(--dev-border)";
      this.style.backgroundColor = "";
    });

    fileUploadArea.addEventListener("drop", function (e) {
      e.preventDefault();
      this.style.borderColor = "var(--dev-border)";
      this.style.backgroundColor = "";

      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        updateFilePreview();
      }
    });

    // File input change
    fileInput.addEventListener("change", updateFilePreview);
  }

  function updateFilePreview() {
    if (!filePreview) return;

    filePreview.innerHTML = "";
    const files = fileInput.files;

    if (files.length === 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Arquivo ${file.name} excede o limite de 10MB`);
        continue;
      }

      const fileElement = document.createElement("div");
      fileElement.className = "file-item";

      // Get appropriate icon based on file type
      let fileIcon = "fa-file";
      if (file.type.includes("pdf")) fileIcon = "fa-file-pdf";
      else if (file.type.includes("image")) fileIcon = "fa-file-image";
      else if (file.type.includes("word")) fileIcon = "fa-file-word";
      else if (file.type.includes("zip") || file.type.includes("rar"))
        fileIcon = "fa-file-archive";

      fileElement.innerHTML = `
        <i class="fas ${fileIcon}"></i>
        <div class="file-info">
          <span class="file-name">${file.name}</span>
          <span class="file-size">${formatFileSize(file.size)}</span>
        </div>
        <button type="button" class="file-remove" data-index="${i}">
          <i class="fas fa-times"></i>
        </button>
      `;
      filePreview.appendChild(fileElement);
    }

    // Add remove functionality
    filePreview.querySelectorAll(".file-remove").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const index = parseInt(this.getAttribute("data-index"));
        removeFile(index);
      });
    });
  }

  function removeFile(index) {
    const dt = new DataTransfer();
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
      if (i !== index) {
        dt.items.add(files[i]);
      }
    }

    fileInput.files = dt.files;
    updateFilePreview();
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Context detection
  function detectContext() {
    if (!contextDetection || !contextDetails) return;

    const context = {
      page: document.title,
      url: window.location.href,
      time: new Date().toLocaleTimeString("pt-BR"),
      date: new Date().toLocaleDateString("pt-BR"),
      referrer: document.referrer || "Acesso direto",
    };

    // Show context detection
    contextDetection.classList.add("active");
    contextDetails.innerHTML = `
      <div class="context-item">
        <i class="fas fa-file-alt"></i>
        <span><strong>Página:</strong> ${context.page}</span>
      </div>
      <div class="context-item">
        <i class="fas fa-calendar-alt"></i>
        <span><strong>Data:</strong> ${context.date} ${context.time}</span>
      </div>
      <div class="context-item">
        <i class="fas fa-link"></i>
        <span><strong>Origem:</strong> ${context.referrer}</span>
      </div>
    `;

    // Set hidden fields
    const referringPage = document.getElementById("referringPage");
    const userBrowser = document.getElementById("userBrowser");
    const userTimezone = document.getElementById("userTimezone");

    if (referringPage) referringPage.value = context.referrer;
    if (userBrowser) userBrowser.value = navigator.userAgent;
    if (userTimezone)
      userTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Geolocation (with permission)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const location = `Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`;
        const userLocation = document.getElementById("userLocation");
        if (userLocation) userLocation.value = location;
      },
      function () {
        const userLocation = document.getElementById("userLocation");
        if (userLocation) userLocation.value = "Não permitido";
      },
    );
  }

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validate terms
      const acceptTerms = document.getElementById("acceptTerms");
      if (!acceptTerms || !acceptTerms.checked) {
        alert(
          "Você precisa aceitar a Política de Privacidade para enviar a mensagem.",
        );
        return;
      }

      if (!submitButton) return;

      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Enviando...';

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Show success modal
        if (successModal) {
          const modalDetails = document.getElementById("modalDetails");
          if (modalDetails) {
            const now = new Date();
            const protocol = Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase();

            modalDetails.innerHTML = `
              <div class="detail-item">
                <i class="fas fa-check-circle"></i>
                <span><strong>Nome:</strong> ${data.name || "Não informado"}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-project-diagram"></i>
                <span><strong>Projeto:</strong> ${getProjectTypeText(data.project_type)}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span><strong>Enviado:</strong> ${now.toLocaleTimeString("pt-BR")}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-hashtag"></i>
                <span><strong>Protocolo:</strong> #${protocol}</span>
              </div>
            `;
          }

          // Show modal with display flex
          successModal.style.display = "flex";
          document.body.style.overflow = "hidden"; // Prevent scrolling
        }

        // Reset form
        contactForm.reset();
        if (filePreview) filePreview.innerHTML = "";
        if (charCount) charCount.textContent = "0";

        // Reset file input
        if (fileInput) fileInput.value = "";
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  // Helper function to get project type text
  function getProjectTypeText(value) {
    const types = {
      new_website: "Novo Website",
      web_application: "Aplicação Web",
      mobile_app: "Aplicativo Mobile",
      api_development: "Desenvolvimento de API",
      system_integration: "Integração de Sistemas",
      consulting: "Consultoria Técnica",
      maintenance: "Manutenção/Atualização",
      other: "Outro",
    };
    return types[value] || value || "Não especificado";
  }

  // Modal close
  if (closeModal && successModal) {
    closeModal.addEventListener("click", function () {
      successModal.style.display = "none";
      document.body.style.overflow = ""; // Restore scrolling
    });

    // Close on click outside
    successModal.addEventListener("click", function (e) {
      if (e.target === successModal) {
        successModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });

    // Close on ESC key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && successModal.style.display === "flex") {
        successModal.style.display = "none";
        document.body.style.overflow = "";
      }
    });
  }

  // Schedule call button
  const scheduleCall = document.getElementById("scheduleCall");
  if (scheduleCall) {
    scheduleCall.addEventListener("click", function (e) {
      e.preventDefault();
      alert(
        "Funcionalidade de agendamento será implementada em breve! Por enquanto, entre em contato por WhatsApp ou e-mail.",
      );
    });
  }

  // Initialize
  setTimeout(detectContext, 500);

  console.log("✅ Contact form configurado");
});
