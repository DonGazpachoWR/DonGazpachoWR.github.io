/*
 * main.js
 *
 * Page behaviour shared by every page: top bar state, mobile menu,
 * active section in the navigation and scroll-reveal of content.
 *
 * Version: 1.0
 * Author: Adrian Berenguer-Agustí (I2SysBio-CSIC)
 * Date: 2026-10-18
 */
(() => {
  "use strict";

  const topbar = document.querySelector(".topbar");
  const nav = document.getElementById("nav");
  const menu_toggle = document.querySelector(".menu-toggle");

  /**
   * Give the top bar a background once the page has scrolled.
   * @returns {void}
   */
  function update_topbar() {
    topbar.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  update_topbar();
  window.addEventListener("scroll", update_topbar, { passive: true });

  // Mobile menu.
  menu_toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menu_toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      menu_toggle.setAttribute("aria-expanded", "false");
    }
  });

  if ("IntersectionObserver" in window) {
    // Reveal elements once, when they first enter the viewport.
    const reveal_observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal_observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal")
      .forEach((el) => reveal_observer.observe(el));

    // Highlight the navigation link of the section in view.
    const links = new Map();
    nav.querySelectorAll('a[href^="#"]').forEach((a) => {
      links.set(a.getAttribute("href").slice(1), a);
    });
    const section_observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (link) {
          link.classList.toggle("is-active", entry.isIntersecting);
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]")
      .forEach((section) => section_observer.observe(section));
  } else {
    document.querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("is-visible"));
  }
})();
