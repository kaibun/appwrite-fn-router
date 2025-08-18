/**
 * Scroll utility that accounts for the Docusaurus navbar and a custom offset.
 *
 * Smoothly scrolls the page so that the given element is positioned just below
 * the fixed navbar, with an additional offset (default: 50px).
 *
 * @param element HTMLElement to scroll to
 * @param offset Additional offset in pixels (default: 50)
 */
export function scrollToWithHeaderOffset(element: HTMLElement, offset = 50) {
  const navbar = document.querySelector('.nav.navbar');
  const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const y =
    element.getBoundingClientRect().top +
    window.scrollY -
    navbarHeight -
    offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
