/* Casa Cubo: archivo automático de experiencias (zona horaria Buenos Aires). */
(function () {
  function endTimestamp(node) {
    const value = node.dataset.eventEnd || node.dataset.eventStart;
    if (!value) return NaN;
    const start = Date.parse(value);
    if (!Number.isFinite(start)) return NaN;
    if (node.dataset.eventEnd) return start;
    // Si no hay fecha/hora de cierre, archivar al terminar el día en Buenos Aires.
    const parts = new Intl.DateTimeFormat('en-US', {timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(start));
    const get = type => parts.find(part => part.type === type).value;
    const date = get('year') + '-' + get('month') + '-' + get('day');
    return Date.parse(date + 'T23:59:59.999-03:00');
  }
  function update() {
    const now = Date.now();
    const upcoming = document.querySelector('[data-upcoming-list]');
    const past = document.querySelector('[data-past-list]');
    document.querySelectorAll('[data-event-start]').forEach(function (node) {
      const archived = node.dataset.eventStatus === 'finalizado' || now >= endTimestamp(node);
      if (upcoming && past) {
        const target = archived ? past : upcoming;
        if (node.parentElement !== target) target.appendChild(node);
      }
      if (node.hasAttribute('data-event-page')) {
        const open = document.querySelector('[data-registration-open]');
        const closed = document.querySelector('[data-registration-closed]');
        if (open) open.hidden = archived;
        if (closed) closed.hidden = !archived;
        const cta = document.querySelector('[data-registration-cta]');
        if (cta) cta.hidden = archived;
      }
    });
    document.querySelectorAll('[data-event-empty]').forEach(function (el) {
      const list = document.querySelector(el.dataset.eventEmpty);
      if (list) el.hidden = list.children.length > 0;
    });
    document.querySelectorAll('[data-past-section]').forEach(function (el) {
      const list = el.querySelector('[data-past-list]');
      if (list) el.hidden = list.children.length === 0;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', update);
  else update();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) update(); });
  window.addEventListener('pageshow', update);
  // Mantener actualizado si el usuario deja la pestaña abierta al cambiar el día.
  setInterval(update, 60000);
})();
