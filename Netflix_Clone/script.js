"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const backToTopButton = document.querySelector(".back-to-top");
    const loadingScreen = document.querySelector(".loading-screen");
    const faqItems = document.querySelectorAll(".faq-item");
    const searchInput = document.querySelector("#movie-search");
    const movieCards = [...document.querySelectorAll(".movie-card")];
    const emptySearchMessage = document.querySelector(".search-empty");
    const navigationLinks = document.querySelectorAll(".nav-links a");

    const updateScrollUI = () => {
        const hasScrolled = window.scrollY > 24;
        navbar?.classList.toggle("scrolled", hasScrolled);
        backToTopButton?.classList.toggle("visible", window.scrollY > 560);
    };

    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, { passive: true });

    window.addEventListener("load", () => {
        window.setTimeout(() => loadingScreen?.classList.add("is-hidden"), 250);
    }, { once: true });

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq_box");

        button?.addEventListener("click", () => {
            const isOpen = item.classList.contains("active");

            faqItems.forEach((faqItem) => {
                faqItem.classList.remove("active");
                faqItem.querySelector(".faq_box")?.setAttribute("aria-expanded", "false");
            });

            if (!isOpen) {
                item.classList.add("active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    searchInput?.addEventListener("input", (event) => {
        const query = event.target.value.trim().toLowerCase();
        let visibleCount = 0;

        movieCards.forEach((card) => {
            const title = (card.dataset.title || card.textContent).toLowerCase();
            const matches = title.includes(query);

            card.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        if (emptySearchMessage) emptySearchMessage.hidden = visibleCount !== 0;
    });

    backToTopButton?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const sections = [...document.querySelectorAll("#home, #trending, #faq")];
    const navigationObserver = new IntersectionObserver((entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (!visibleSection) return;

        navigationLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${visibleSection.target.id}`);
        });
    }, { rootMargin: "-35% 0px -55%" });

    sections.forEach((section) => navigationObserver.observe(section));
});
