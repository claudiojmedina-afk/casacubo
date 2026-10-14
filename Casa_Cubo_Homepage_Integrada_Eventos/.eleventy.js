module.exports = function (eleventyConfig) {

  function getDateKey(value) {
    if (!value) return "";

    const text = String(value);
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return [
      date.getUTCFullYear(),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0")
    ].join("-");
  }

  function formatDate(value, options) {
    const key = getDateKey(value);

    if (!key) return "";

    const [year, month, day] = key.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("es-AR", {
      timeZone: "UTC",
      ...options
    }).format(date);
  }

  function todayInArgentina() {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());
  }

  eleventyConfig.addFilter("date_short", function (date) {
    return formatDate(date, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  });

  eleventyConfig.addFilter("date_es", function (date) {
    return formatDate(date, {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  });

  eleventyConfig.addFilter("money_ar", function (value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "";
    }

    const number = Number(value);

    if (Number.isNaN(number)) return "";

    return number.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  });

  eleventyConfig.addFilter("sortByDate", function (collection = []) {
    return [...collection].sort((a, b) => {
      return getDateKey(a?.data?.sort_date).localeCompare(
        getDateKey(b?.data?.sort_date)
      );
    });
  });

  eleventyConfig.addFilter(
    "splitEventsByDate",
    function (collection = []) {

      const today = todayInArgentina();

      const visible = collection.filter((item) => {

        const status = item?.data?.status;
        const dateKey = getDateKey(item?.data?.sort_date);

        return dateKey && status !== "borrador";

      });


      const upcoming = [];
      const past = [];


      visible.forEach((item) => {

        const dateKey = getDateKey(
          item.data.sort_date
        );

        const manuallyFinished =
          item.data.status === "finalizado";


        if (
          manuallyFinished ||
          dateKey < today
        ) {

          past.push(item);

        } else {

          upcoming.push(item);

        }

      });


      upcoming.sort((a, b) =>
        getDateKey(a.data.sort_date)
          .localeCompare(
            getDateKey(b.data.sort_date)
          )
      );


      past.sort((a, b) =>
        getDateKey(b.data.sort_date)
          .localeCompare(
            getDateKey(a.data.sort_date)
          )
      );


      return {
        upcoming,
        past
      };

    }
  );


  eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addPassthroughCopy({
    "src/css/evento.css":
      "css/evento.css"
  });

  eleventyConfig.addPassthroughCopy({
    "src/css/crear-nuevos-mundos.css":
      "css/crear-nuevos-mundos.css"
  });

  eleventyConfig.addPassthroughCopy("assets");

  eleventyConfig.addPassthroughCopy("js");

  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addPassthroughCopy("_redirects");


  return {

    dir: {

      input: "content",

      includes: "../_includes",

      output: "_site"

    }

  };

};
