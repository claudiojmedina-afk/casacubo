document.addEventListener("DOMContentLoaded", () => {

  const cards = Array.from(
    document.querySelectorAll(".cnm-card")
  );

  const audienceContainer =
    document.getElementById("audience-filters");

  const categoryContainer =
    document.getElementById("category-filters");

  const emptyMessage =
    document.getElementById("cnm-empty");


  let activeAudience = "all";
  let activeCategory = "all";


  /* ==========================================================
     OBTENER PÚBLICOS
     ========================================================== */

  const audiences = new Set();

  cards.forEach(card => {

    const audience =
      (card.dataset.audience || "")
        .trim()
        .toLowerCase();

    if (audience) {
      audiences.add(audience);
    }

  });


  /* ==========================================================
     OBTENER CATEGORÍAS
     ========================================================== */

  const categories = new Set();

  cards.forEach(card => {

    const rawCategories =
      card.dataset.category || "";

    const cardCategories =
      rawCategories
        .split("||")
        .map(category => category.trim().toLowerCase())
        .filter(Boolean);

    cardCategories.forEach(category => {
      categories.add(category);
    });

  });


  /* ==========================================================
     FORMATEAR TEXTO
     ========================================================== */

  function formatLabel(value) {

    if (!value) return "";

    return value
      .split(" ")
      .map(word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
      )
      .join(" ");

  }


  /* ==========================================================
     CREAR BOTONES DE PÚBLICO
     ========================================================== */

  if (audienceContainer) {

    audiences.forEach(audience => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className = "cnm-filter";

      button.dataset.filterType =
        "audience";

      button.dataset.filterValue =
        audience;

      button.textContent =
        formatLabel(audience);

      audienceContainer.appendChild(button);

    });

  }


  /* ==========================================================
     CREAR BOTONES DE CATEGORÍAS
     ========================================================== */

  if (categoryContainer) {

    categories.forEach(category => {

      const button =
        document.createElement("button");

      button.type = "button";

      button.className = "cnm-filter";

      button.dataset.filterType =
        "category";

      button.dataset.filterValue =
        category;

      button.textContent =
        formatLabel(category);

      categoryContainer.appendChild(button);

    });

  }


  /* ==========================================================
     FILTRAR TARJETAS
     ========================================================== */

  function filterCards() {

    let visibleCards = 0;

    cards.forEach(card => {

      const audience =
        (card.dataset.audience || "")
          .trim()
          .toLowerCase();


      const categories =
        (card.dataset.category || "")
          .split("||")
          .map(category =>
            category.trim().toLowerCase()
          )
          .filter(Boolean);


      const audienceMatches =
        activeAudience === "all" ||
        audience === activeAudience;


      const categoryMatches =
        activeCategory === "all" ||
        categories.includes(activeCategory);


      const visible =
        audienceMatches &&
        categoryMatches;


      card.hidden = !visible;


      if (visible) {
        visibleCards++;
      }

    });


    if (emptyMessage) {

      emptyMessage.hidden =
        visibleCards !== 0;

    }

  }


  /* ==========================================================
     BOTONES DE FILTRO
     ========================================================== */

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(".cnm-filter");

      if (!button) return;


      const type =
        button.dataset.filterType;

      const value =
        button.dataset.filterValue;


      if (type === "audience") {

        activeAudience = value;

        document
          .querySelectorAll(
            '[data-filter-type="audience"]'
          )
          .forEach(item =>
            item.classList.remove("active")
          );

      }


      if (type === "category") {

        activeCategory = value;

        document
          .querySelectorAll(
            '[data-filter-type="category"]'
          )
          .forEach(item =>
            item.classList.remove("active")
          );

      }


      button.classList.add("active");

      filterCards();

    }
  );


  /* ==========================================================
     FILTRO INICIAL
     ========================================================== */

  filterCards();

});
