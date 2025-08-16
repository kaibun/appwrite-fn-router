// Scroll utilitaire prenant en compte la navbar Docusaurus et un offset
export function scrollToWithHeaderOffset(element: HTMLElement, offset = 50) {
  // Sélecteur centralisé pour la navbar Docusaurus
  const navbar = document.querySelector('.nav.navbar');
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const y =
    element.getBoundingClientRect().top +
    window.scrollY -
    navbarHeight -
    offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
