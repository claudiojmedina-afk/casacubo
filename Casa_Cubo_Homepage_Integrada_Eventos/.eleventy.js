module.exports = function (eleventyConfig) {

  eleventyConfig.addFilter("date_short", function (date) {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  });

  eleventyConfig.addFilter("date_es", function (date) {
    if (!date) return "";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "";

    return d.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  });
  eleventyConfig.addFilter("money_ar", function (value) {
    if (value === null || value === undefined || value === "") return "";

    const number = Number(value);

    if (isNaN(number)) return "";

    return number.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  });
    eleventyConfig.addPassthroughCopy("css");

  eleventyConfig.addPassthroughCopy("assets");

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
