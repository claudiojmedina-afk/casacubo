const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const form = document.getElementById('newsletter-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = form.querySelector('input').value;
    alert(`Gracias. El formulario está preparado para conectar con tu sistema de newsletter.\n\nEmail: ${email}`);
    form.reset();
  });
}
