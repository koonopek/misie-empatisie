window.addEventListener("DOMContentLoaded", main);
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function main() {
  /*==================== SHOW MENU ====================*/
  const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId);

    // Validate that variables exist
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        // We add the show-menu class to the div tag with the nav__menu class
        nav.classList.toggle("show-menu");
      });
    }
  };
  showMenu("nav-toggle", "nav-menu");

  /*==================== REMOVE MENU MOBILE ====================*/
  const navLink = document.querySelectorAll("a.nav__link");
  const dropdownToggles = document.querySelectorAll(".nav__dropdown-toggle");

  function closeDropdowns(exceptItem = null) {
    dropdownToggles.forEach((button) => {
      const item = button.closest(".nav__item--dropdown");
      if (!item || item === exceptItem) return;

      item.classList.remove("show-dropdown");
      button.setAttribute("aria-expanded", "false");
    });
  }

  dropdownToggles.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const item = button.closest(".nav__item--dropdown");
      if (!item) return;

      const isOpen = item.classList.toggle("show-dropdown");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
      closeDropdowns(item);
    });
  });

  document.addEventListener("click", () => closeDropdowns());

  function getHeaderOffset() {
    const header = document.getElementById("header");
    return (header?.offsetHeight || 0) + 24;
  }

  function scrollToSection(target) {
    const targetTop =
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function linkAction(event) {
    const navMenu = document.getElementById("nav-menu");
    const hash = this.getAttribute("href");

    // When we click on each nav__link, we remove the show-menu class
    navMenu?.classList.remove("show-menu");

    if (!hash || !hash.startsWith("#") || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    scrollToSection(target);
    history.pushState(null, "", hash);
  }
  navLink.forEach((n) => n.addEventListener("click", linkAction));

  document.querySelectorAll(".nav__dropdown-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("nav-menu")?.classList.remove("show-menu");
      closeDropdowns();
    });
  });

  /*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
  const sections = document.querySelectorAll("section[id]");

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 200;
      const sectionId = current.getAttribute("id");
      const activeLink = document.querySelector(
        `.nav__menu a[href="#${sectionId}"]`,
      );

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        activeLink?.classList.add("active-link");
      } else {
        activeLink?.classList.remove("active-link");
      }
    });
  }
  window.addEventListener("scroll", scrollActive);

  /*==================== CHANGE BACKGROUND HEADER ====================*/
  function scrollHeader() {
    const nav = document.getElementById("header");
    // When the scroll is greater than 200 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 200) nav?.classList.add("scroll-header");
    else nav.classList.remove("scroll-header");
  }
  window.addEventListener("scroll", scrollHeader);

  /*==================== SHOW SCROLL TOP ====================*/
  function scrollTop() {
    const scrollTop = document.getElementById("scroll-top");
    // When the scroll is higher than 560 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 560) {
      scrollTop?.classList.add("show-scroll");
    } else {
      scrollTop?.classList.remove("show-scroll");
    }
  }
  window.addEventListener("scroll", scrollTop);

  /*==================== SCROLL REVEAL ANIMATION ====================*/
  const sr = ScrollReveal({
    duration: 1800,
    delay: isMobile ? 400 : 100,
  });

  sr.reveal(
    `.decoration__data,
           .locations__card,
           .facility__card,
           .offer__content,
           .gallery__content,
           .footer__content,
           .contact__data,
           .terapia__content,
           .work__data,
           .mapa__container`,
    {
      origin: "top",
    },
  );

  sr.reveal(`.about_us__img,  .offering__prices`, {
    origin: "left",
  });

  sr.reveal(`.about_us__data, .send__img, .offering__description`, {
    origin: "right",
  });

  if (document.querySelector("#gallery__container")) {
    import("https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js").then(
      ({ default: PhotoSwipeLightbox }) => {
        const lightbox = new PhotoSwipeLightbox({
          gallery: "#gallery__container",
          children: "div",
          pswpModule: () => import("https://unpkg.com/photoswipe"),
        });

        lightbox.addFilter("domItemData", (itemData) => {
          itemData.src = itemData.element.dataset.src;
          itemData.width = itemData.element.dataset.pswpWidth;
          itemData.height = itemData.element.dataset.pswpHeight;
          return itemData;
        });

        lightbox.init();
      },
    );
  }
}
