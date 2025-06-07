const menuToggle = document.getElementById('mobile-menu');
const nav = document.getElementById('mobile-nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});
