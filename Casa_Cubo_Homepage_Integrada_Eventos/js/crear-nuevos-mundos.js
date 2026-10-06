document.addEventListener("DOMContentLoaded", () => {

  const cards = [
    ...document.querySelectorAll(".cnm-card")
  ];

  if (!cards.length) return;


  const audienceContainer =
    document.getElementById("audience-filters");

  const categoryContainer =
    document.getElementById("category-filters");

  const emptyMessage =
    document.getElementById("cnm-empty");


  const audiences = [
    ...new Set(
      cards
        .map(card => card.dataset.audience)
        .filter(Boolean)
    )
  ].sort();


  const categories = [
    ...new Set(
      cards
        .map(card => card.dataset.category)
        .filter(Boolean)
    )
  ].sort();


  function pretty(value){

    return value
      .split(" ")
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

  }


  function createButton(
    value,
    type,
    container
  ){

    const button =
      document.createElement("button");

    button.type = "button";

    button.className = "cnm-filter";

    button.dataset.filterType = type;

    button.dataset.filterValue = value;

    button.textContent = pretty(value);

    container.appendChild(button);

  }


  audiences.forEach(value =>
    createButton(
      value,
      "audience",
      audienceContainer
    )
  );


  categories.forEach(value =>
    createButton(
      value,
      "category",
      categoryContainer
    )
  );


  let activeAudience = "all";

  let activeCategory = "all";


  function filterCards(){

    let visible = 0;

    cards.forEach(card => {

      const audience =
        card.dataset.audience;

      const category =
        card.dataset.category;


      const audienceMatch =
        activeAudience === "all" ||
        audience === activeAudience;


      const categoryMatch =
        activeCategory === "all" ||
        category === activeCategory;


      const show =
        audienceMatch && categoryMatch;


      card.hidden = !show;

      if(show) visible++;

    });


    emptyMessage.hidden = visible !== 0;

  }


  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(".cnm-filter");

      if(!button) return;


      const type =
        button.dataset.filterType;

      const value =
        button.dataset.filterValue;


      document
        .querySelectorAll(
          `.cnm-filter[data-filter-type="${type}"]`
        )
        .forEach(item =>
          item.classList.remove("active")
        );


      button.classList.add("active");


      if(type === "audience"){

        activeAudience = value;

      }


      if(type === "category"){

        activeCategory = value;

      }


      filterCards();

    }
  );

});
