const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}


/* ==========================================================
   CARRUSEL PRINCIPAL
   ========================================================== */

const carousel = document.querySelector("[data-hero-carousel]");

if (carousel) {
  const slides = [...carousel.querySelectorAll(".hero-slide")];
  const dots = [...carousel.querySelectorAll(".hero-carousel-dot")];
  const previousButton = carousel.querySelector(".hero-carousel-prev");
  const nextButton = carousel.querySelector(".hero-carousel-next");

  let currentIndex = 0;
  let autoplayTimer = null;
  let touchStartX = 0;

  const autoplayDelay = 5500;

  function showSlide(index) {
    if (!slides.length) return;

    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;

      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.tabIndex = active ? 0 : -1;
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentIndex;

      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", String(active));
    });
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function previousSlide() {
    showSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();

    if (slides.length > 1) {
      autoplayTimer = window.setInterval(nextSlide, autoplayDelay);
    }
  }

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      previousSlide();
      startAutoplay();
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      nextSlide();
      startAutoplay();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slideIndex));
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
      stopAutoplay();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;

      if (Math.abs(distance) > 45) {
        if (distance < 0) {
          nextSlide();
        } else {
          previousSlide();
        }
      }

      startAutoplay();
    },
    { passive: true }
  );

  showSlide(0);
  startAutoplay();
}


/* ==========================================================
   POPUP ADMINISTRABLE
   ========================================================== */

const sitePopup = document.querySelector("[data-site-popup]");

if (sitePopup) {
  const popupId = sitePopup.dataset.popupId || "general";

  const delaySeconds = Math.max(
    0,
    Number(sitePopup.dataset.delay || 12)
  );

  const repeatDays = Math.max(
    0,
    Number(sitePopup.dataset.repeatDays || 7)
  );

  const storageKey = `casa-cubo-popup-${popupId}`;

  const closeButtons = sitePopup.querySelectorAll(
    "[data-popup-close]"
  );

  function canShowPopup() {
    if (repeatDays === 0) {
      return true;
    }

    try {
      const lastClosed = Number(
        localStorage.getItem(storageKey)
      );

      if (!lastClosed) {
        return true;
      }

      const elapsed =
        Date.now() - lastClosed;

      const repeatAfter =
        repeatDays *
        24 *
        60 *
        60 *
        1000;

      return elapsed >= repeatAfter;

    } catch {
      return true;
    }
  }

  function rememberClose() {
    if (repeatDays === 0) {
      return;
    }

    try {
      localStorage.setItem(
        storageKey,
        String(Date.now())
      );
    } catch {
      // El popup sigue funcionando aunque
      // el navegador bloquee localStorage.
    }
  }

  function openPopup() {
    sitePopup.hidden = false;

    requestAnimationFrame(() => {
      sitePopup.classList.add("is-open");
      document.body.classList.add("popup-open");

      const closeButton =
        sitePopup.querySelector(
          ".site-popup-close"
        );

      if (closeButton) {
        closeButton.focus();
      }
    });
  }

  function closePopup() {
    sitePopup.classList.remove("is-open");
    document.body.classList.remove("popup-open");

    rememberClose();

    window.setTimeout(() => {
      sitePopup.hidden = true;
    }, 220);
  }

  if (canShowPopup()) {
    window.setTimeout(
      openPopup,
      delaySeconds * 1000
    );
  }

  closeButtons.forEach((button) => {
    button.addEventListener(
      "click",
      closePopup
    );
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.key === "Escape" &&
        sitePopup.classList.contains("is-open")
      ) {
        closePopup();
      }
    }
  );
}


/* ==========================================================
   NEWSLETTER
   ========================================================== */

const form =
  document.getElementById("newsletter-form");

if (form) {
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const input =
        form.querySelector(
          "input[type='email']"
        );

      const email =
        input ? input.value : "";

      alert(
        `Gracias. El formulario está preparado para conectar con tu sistema de newsletter.\n\nEmail: ${email}`
      );

      form.reset();
    }
  );
}
