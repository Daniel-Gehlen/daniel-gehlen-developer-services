// Services Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  console.log("⚙️ services.js carregado");

  // Only run on services page
  if (!window.location.pathname.includes("services.html")) {
    return;
  }

  // Service navigation
  const serviceLinks = document.querySelectorAll(".service-link");
  const serviceSections = document.querySelectorAll(".service-detail");

  // Update active link on scroll
  function updateActiveService() {
    const scrollPosition = window.scrollY + 100;
    let currentSection = "";

    serviceSections.forEach((section) => {
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

    serviceLinks.forEach((link) => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (linkHref === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Smooth scroll to sections
  serviceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Update active link
        serviceLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");

        // Scroll to section
        const headerHeight =
          document.querySelector(".dev-header")?.offsetHeight || 80;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // FAQ accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const answer = this.nextElementSibling;
      const icon = this.querySelector("i");

      // Close other answers
      document.querySelectorAll(".faq-answer").forEach((otherAnswer) => {
        if (otherAnswer !== answer) {
          otherAnswer.classList.remove("active");
          otherAnswer.previousElementSibling.querySelector(
            "i",
          ).style.transform = "rotate(0deg)";
        }
      });

      // Toggle current answer
      answer.classList.toggle("active");
      icon.style.transform = answer.classList.contains("active")
        ? "rotate(180deg)"
        : "rotate(0deg)";
    });
  });

  // Add scroll event listener
  window.addEventListener("scroll", updateActiveService);

  // Initialize
  updateActiveService();

  console.log("✅ Services page configurada");
});
