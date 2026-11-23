
/*
 * CASA CUBO — Gestión automática de eventos
 * Zona horaria: America/Argentina/Buenos_Aires
 */

(function () {
  "use strict";

  const ARGENTINA_OFFSET = "-03:00";
  const UPDATE_INTERVAL = 60000;

  function parseEventDate(value) {
    if (!value) return NaN;

    const text = String(value).trim();

    // Fecha y hora sin zona: interpretar como Buenos Aires.
    const localDateTime = text.match(
      /^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})(?::(\d{2}))?$/
    );

    if (localDateTime) {
      return Date.parse(
        localDateTime[1] +
        "T" +
        localDateTime[2] +
        ":" +
        (localDateTime[3] || "00") +
        ARGENTINA_OFFSET
      );
    }

    // Fecha sin hora: inicio del día en Buenos Aires.
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return Date.parse(text + "T00:00:00-03:00");
    }

    // Fecha con zona horaria explícita.
    return Date.parse(text);
  }

  function getArgentinaDateKey(timestamp) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date(timestamp));

    const get = (type) =>
      parts.find((part) => part.type === type).value;

    return (
      get("year") + "-" +
      get("month") + "-" +
      get("day")
    );
  }

  function getEventStart(node) {
    return parseEventDate(node.dataset.eventStart);
  }

  function getEventEnd(node) {
    if (node.dataset.eventEnd) {
      return parseEventDate(node.dataset.eventEnd);
    }

    const start = getEventStart(node);

    if (!Number.isFinite(start)) {
      return NaN;
    }

    // Compatibilidad con eventos sin fecha de cierre.
    const dateKey = getArgentinaDateKey(start);

    return Date.parse(
      dateKey + "T23:59:59.999-03:00"
    );
  }

  function isArchived(node, now) {
    if (node.dataset.eventStatus === "finalizado") {
      return true;
    }

    const end = getEventEnd(node);

    return Number.isFinite(end) && now >= end;
  }

  function sortByStart(a, b) {
    return getEventStart(a) - getEventStart(b);
  }

  function updateHomepage(now) {
    const container = document.querySelector(
      "[data-home-events]"
    );

    if (!container) return;

    const cards = Array.from(
      container.querySelectorAll("[data-event-start]")
    );

    const upcoming = [];
    const past = [];

    cards.forEach((card) => {
      if (isArchived(card, now)) {
        past.push(card);
      } else {
        upcoming.push(card);
      }
    });

    upcoming.sort(sortByStart);
    past.sort((a, b) => sortByStart(b, a));

    const selected = upcoming.concat(past).slice(0, 3);

    // Reordenar las tarjetas seleccionadas.
    selected.forEach((card) => {
      container.appendChild(card);
    });

    // Mantener todas las tarjetas en el HTML para que
    // puedan volver a clasificarse en cada actualización.
    cards.forEach((card) => {
      card.hidden = !selected.includes(card);
    });

    const emptyMessage = document.querySelector(
      "[data-home-events-empty]"
    );

    if (emptyMessage) {
      emptyMessage.hidden = selected.length > 0;
    }
  }

  function updateAgenda(now) {
    const upcomingList = document.querySelector(
      "[data-upcoming-list]"
    );

    const pastList = document.querySelector(
      "[data-past-list]"
    );

    if (!upcomingList || !pastList) return;

    // La homepage se administra por separado.
    if (document.querySelector("[data-home-events]")) {
      return;
    }

    const cards = Array.from(
      document.querySelectorAll(
        "[data-upcoming-list] [data-event-start]," +
        "[data-past-list] [data-event-start]"
      )
    );

    const upcoming = [];
    const past = [];

    cards.forEach((card) => {
      if (isArchived(card, now)) {
        past.push(card);
      } else {
        upcoming.push(card);
      }
    });

    upcoming.sort(sortByStart);
    past.sort((a, b) => sortByStart(b, a));

    upcoming.forEach((card) => upcomingList.appendChild(card));
    past.forEach((card) => pastList.appendChild(card));

    const emptyMessage = document.querySelector(
      '[data-event-empty="[data-upcoming-list]"]'
    );

    if (emptyMessage) {
      emptyMessage.hidden = upcoming.length > 0;
    }

    const pastSection = document.querySelector(
      "[data-past-section]"
    );

    if (pastSection) {
      pastSection.hidden = past.length === 0;
    }
  }

  function updateEventPage(now) {
    const page = document.querySelector(
      "[data-event-page]"
    );

    if (!page) return;

    const archived = isArchived(page, now);

    const open = document.querySelector(
      "[data-registration-open]"
    );

    const closed = document.querySelector(
      "[data-registration-closed]"
    );

    const cta = document.querySelector(
      "[data-registration-cta]"
    );

    if (open) open.hidden = archived;
    if (closed) closed.hidden = !archived;
    if (cta) cta.hidden = archived;

    const iframe = document.querySelector(
      "[data-registration-frame]"
    );

    if (iframe) {
      const formUrl = iframe.dataset.formSrc;

      if (!archived && formUrl) {
        if (!iframe.getAttribute("src")) {
          iframe.setAttribute("src", formUrl);
        }
      } else {
        iframe.removeAttribute("src");
      }
    }
  }

  function updateEvents() {
    const now = Date.now();

    updateHomepage(now);
    updateAgenda(now);
    updateEventPage(now);
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      updateEvents
    );
  } else {
    updateEvents();
  }

  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) updateEvents();
    }
  );

  window.addEventListener("pageshow", updateEvents);

  window.setInterval(updateEvents, UPDATE_INTERVAL);
})();
