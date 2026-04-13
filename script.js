/* Interactivity & Micro-Animations */

document.addEventListener("DOMContentLoaded", () => {
  const GOOGLE_SHEET_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbzI_Ex2imPDLoq5Nm4fdbACFj4lFDN0L4KS34HTLvb2_MeF9lHSD0CgUsg3WXbnMN_s/exec";

  // Reveal Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.add("reveal"); // Ensure base class is present
    revealObserver.observe(el);
  });

  // Latency Simulation
  const latencyEl = document.getElementById("latency");
  const latencyBars = document.getElementById("latency-bars");

  if (latencyEl && latencyBars) {
    setInterval(() => {
      const val = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
      latencyEl.textContent = `${val}ms`;

      // Randomize bar heights a bit
      const bars = latencyBars.children;
      for (let bar of bars) {
        bar.style.height = `${Math.random() * 100}%`;
      }
    }, 3000);
  }

  // Revenue/Stats Counter Animation Simulation
  const revenueVal = document.getElementById("revenue-val");
  if (revenueVal) {
    let currentRev = 14204.0;
    setInterval(() => {
      currentRev += Math.random() * 20;
      revenueVal.textContent = `$${currentRev.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }, 5000);
  }

  // Sticky Bar Scroll Effect
  const stickyBar = document.getElementById("sticky-bar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      stickyBar.classList.remove("translate-y-full");
      stickyBar.style.transform = "translate(-50%, 0)";
      stickyBar.style.opacity = "1";
    } else {
      stickyBar.style.transform = "translate(-50%, 150%)";
      stickyBar.style.opacity = "0";
    }

    lastScroll = currentScroll;
  });

  // Smooth Scroll for Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: "smooth",
        });
      }
    });
  });

  // Hover effect for feature cards
  document.querySelectorAll(".bg-surface-container-high").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.borderColor = "rgba(126, 75, 134, 0.3)";
      card.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.borderColor = "transparent";
    });
  });

  // Lead modal + Google Sheet submission
  const leadModal = document.getElementById("lead-modal");
  const thankYouModal = document.getElementById("thank-you-modal");
  const leadForm = document.getElementById("lead-form");
  const leadStatus = document.getElementById("lead-form-status");
  const leadSubmitButton = document.getElementById("lead-form-submit");
  const leadCloseButtons = document.querySelectorAll("[data-close-lead-form]");
  const thankYouCloseButtons = document.querySelectorAll(
    "[data-close-thank-you]",
  );

  if (leadModal && leadForm && leadStatus && leadSubmitButton) {
    const leadInputs = Array.from(leadForm.querySelectorAll("input"));

    const setStatus = (message, type = "") => {
      leadStatus.textContent = message;
      leadStatus.classList.remove("is-error", "is-success");
      if (type) {
        leadStatus.classList.add(type);
      }
    };

    const getFieldContainer = (input) => input.closest(".lead-form__field");

    const getErrorNode = (input) => {
      const field = getFieldContainer(input);
      if (!field) {
        return null;
      }

      let errorNode = field.querySelector(".lead-form__error");
      if (!errorNode) {
        errorNode = document.createElement("small");
        errorNode.className = "lead-form__error";
        field.appendChild(errorNode);
      }

      return errorNode;
    };

    const setFieldError = (input, message) => {
      const errorNode = getErrorNode(input);
      if (errorNode) {
        errorNode.textContent = message || "";
      }

      if (message) {
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
      } else {
        input.classList.remove("is-invalid");
        input.removeAttribute("aria-invalid");
      }
    };

    const validateField = (input) => {
      const name = input.name;
      const value = input.value.trim();

      if (name === "firstName" || name === "lastName") {
        if (!value) {
          setFieldError(input, "This field is required.");
          return false;
        }
        if (!/^[A-Za-z][A-Za-z\s'.-]{1,49}$/.test(value)) {
          setFieldError(input, "Use 2-50 letters only.");
          return false;
        }
      }

      if (name === "companyName") {
        if (!value) {
          setFieldError(input, "Company name is required.");
          return false;
        }
        if (value.length < 2) {
          setFieldError(input, "Company name must be at least 2 characters.");
          return false;
        }
      }

      if (name === "phone") {
        const phoneDigits = value.replace(/\D/g, "");
        if (!value) {
          setFieldError(input, "Phone number is required.");
          return false;
        }
        if (
          !/^[0-9+()\-\s]{7,20}$/.test(value) ||
          phoneDigits.length < 7 ||
          phoneDigits.length > 15
        ) {
          setFieldError(input, "Enter a valid phone number.");
          return false;
        }
      }

      if (name === "email") {
        if (!value) {
          setFieldError(input, "Email is required.");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
          setFieldError(input, "Enter a valid email address.");
          return false;
        }
      }

      if (name === "shopUrl" && value) {
        try {
          const parsed = new URL(value);
          if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            setFieldError(input, "URL must start with http:// or https://");
            return false;
          }
        } catch (urlError) {
          setFieldError(input, "Enter a valid website URL.");
          return false;
        }
      }

      setFieldError(input, "");
      return true;
    };

    const validateForm = () => {
      let isValid = true;
      let firstInvalidInput = null;

      leadInputs.forEach((input) => {
        const fieldValid = validateField(input);
        if (!fieldValid && !firstInvalidInput) {
          firstInvalidInput = input;
        }
        isValid = isValid && fieldValid;
      });

      return { isValid, firstInvalidInput };
    };

    const clearFormValidation = () => {
      leadInputs.forEach((input) => {
        setFieldError(input, "");
      });
    };

    const openLeadModal = () => {
      leadModal.classList.add("is-open");
      leadModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLeadModal = () => {
      leadModal.classList.remove("is-open");
      leadModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const openThankYouModal = () => {
      if (!thankYouModal) {
        return;
      }
      thankYouModal.classList.add("is-open");
      thankYouModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeThankYouModal = () => {
      if (!thankYouModal) {
        return;
      }
      thankYouModal.classList.remove("is-open");
      thankYouModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    leadInputs.forEach((input) => {
      input.addEventListener("blur", () => {
        validateField(input);
      });

      input.addEventListener("input", () => {
        if (input.classList.contains("is-invalid")) {
          validateField(input);
        }
      });
    });

    const leadTriggerButtons = Array.from(
      document.querySelectorAll("button"),
    ).filter(
      (button) =>
        !button.closest("#lead-modal") && !button.closest("#thank-you-modal"),
    );

    leadTriggerButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openLeadModal();
      });
    });

    leadCloseButtons.forEach((button) => {
      button.addEventListener("click", closeLeadModal);
    });

    thankYouCloseButtons.forEach((button) => {
      button.addEventListener("click", closeThankYouModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && leadModal.classList.contains("is-open")) {
        closeLeadModal();
        return;
      }

      if (
        event.key === "Escape" &&
        thankYouModal &&
        thankYouModal.classList.contains("is-open")
      ) {
        closeThankYouModal();
      }
    });

    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const { isValid, firstInvalidInput } = validateForm();
      if (!isValid) {
        setStatus("Please fix the highlighted fields.", "is-error");
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      if (
        !GOOGLE_SHEET_WEB_APP_URL ||
        GOOGLE_SHEET_WEB_APP_URL.includes("PASTE_YOUR")
      ) {
        setStatus(
          "Google Sheet URL is missing. Add your Apps Script web app URL in script.js.",
          "is-error",
        );
        return;
      }

      const formData = new FormData(leadForm);
      const payload = {
        firstName: (formData.get("firstName") || "").toString().trim(),
        lastName: (formData.get("lastName") || "").toString().trim(),
        phone: (formData.get("phone") || "").toString().trim(),
        companyName: (formData.get("companyName") || "").toString().trim(),
        shopUrl: (formData.get("shopUrl") || "").toString().trim(),
        email: (formData.get("email") || "").toString().trim(),
        source: "ComboForge Website",
        submittedAt: new Date().toISOString(),
      };

      const encodedData = new URLSearchParams(payload).toString();

      setStatus("Submitting...");
      leadSubmitButton.disabled = true;
      leadSubmitButton.textContent = "Submitting...";

      try {
        await fetch(GOOGLE_SHEET_WEB_APP_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: encodedData,
        });

        setStatus(
          "Thank you. Your details were submitted successfully.",
          "is-success",
        );
        leadForm.reset();
        clearFormValidation();
        setTimeout(() => {
          closeLeadModal();
          setStatus("");
          openThankYouModal();
        }, 500);
      } catch (error) {
        setStatus(
          "Submission failed. Please try again in a moment.",
          "is-error",
        );
      } finally {
        leadSubmitButton.disabled = false;
        leadSubmitButton.textContent = "Submit";
      }
    });
  }
});
