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
      const fileElement = document.createElement("div");
      fileElement.className = "file-item";
      fileElement.innerHTML = `
                <i class="fas fa-file"></i>
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
                <button class="file-remove" data-index="${i}">
                    <i class="fas fa-times"></i>
                </button>
            `;
      filePreview.appendChild(fileElement);
    }

    // Add remove functionality
    filePreview.querySelectorAll(".file-remove").forEach((button) => {
      button.addEventListener("click", function () {
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
      referrer: document.referrer || "Nenhuma",
    };

    // Show context detection
    contextDetection.classList.add("active");
    contextDetails.innerHTML = `
            <p><strong>Página:</strong> ${context.page}</p>
            <p><strong>Data:</strong> ${context.date} ${context.time}</p>
            <p><strong>Origem:</strong> ${context.referrer}</p>
        `;

    // Set hidden fields
    document.getElementById("referringPage").value = context.referrer;
    document.getElementById("userBrowser").value = navigator.userAgent;
    document.getElementById("userTimezone").value =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Geolocation (with permission)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const location = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
        document.getElementById("userLocation").value = location;
      },
      function () {
        document.getElementById("userLocation").value = "Não permitido";
      },
    );
  }

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

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
            modalDetails.innerHTML = `
                            <h4>Resumo do Envio</h4>
                            <p><strong>Nome:</strong> ${data.name || "Não informado"}</p>
                            <p><strong>Projeto:</strong> ${data.project_type || "Não especificado"}</p>
                            <p><strong>Contato preferido:</strong> ${data.contact_preference || "E-mail"}</p>
                        `;
          }
          successModal.classList.add("active");
        }

        // Reset form
        contactForm.reset();
        if (filePreview) filePreview.innerHTML = "";
        if (charCount) charCount.textContent = "0";
      } catch (error) {
        console.error("Form submission error:", error);
        alert("Erro ao enviar mensagem. Tente novamente.");
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }

  // Modal close
  if (closeModal && successModal) {
    closeModal.addEventListener("click", function () {
      successModal.classList.remove("active");
    });

    // Close on click outside
    successModal.addEventListener("click", function (e) {
      if (e.target === successModal) {
        successModal.classList.remove("active");
      }
    });
  }

  // Schedule call button
  const scheduleCall = document.getElementById("scheduleCall");
  if (scheduleCall) {
    scheduleCall.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Funcionalidade de agendamento será implementada em breve!");
    });
  }

  // Initialize
  setTimeout(detectContext, 500);

  console.log("✅ Contact form configurado");
});
