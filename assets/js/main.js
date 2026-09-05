/*
 * Filaverse homepage — progressive enhancement.
 *
 * Deliberately dependency-free and small: no animation library, no framework.
 * Everything here enhances markup that already works without JavaScript.
 */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * Real catalogue imagery
   *
   * The first homepage version intentionally shipped with schematic SVGs.
   * Replace those presentation assets with verified current products:
   * Smart Print product photography from the manufacturer and current
   * Filaverse shop imagery for bundles / Bambu Lab A1.
   *
   * Price and stock are deliberately NOT added here; those must come from
   * the live commerce backend.
   * ------------------------------------------------------------------ */
  (function realCatalogueImagery() {
    var sources = {
      "assets/img/category-pla-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s79-e1fg-s79-e1.jpg",
        alt: "Smart Print PLA Cyan filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/category-pla-plus-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s46-e1fg-s46-e1.jpg",
        alt: "Smart Print PLA+ Black filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/category-petg-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s202-e1fg-s202-e1.jpg",
        alt: "Smart Print PETG Ocean Blue filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/category-tpu-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s123-e1fg-s123-e1.jpg",
        alt: "Smart Print TPU Orange filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/category-asa-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s132-e1fg-s132-e1.jpg",
        alt: "Smart Print ASA Black filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/category-silk-filament-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s97-e1fg-s97-e1.jpg",
        alt: "Smart Print Silk PLA Dual Color Red Blue filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/product-placeholder-1.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s79-e1fg-s79-e1.jpg",
        alt: "Smart Print PLA Cyan filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/product-placeholder-2.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s46-e1fg-s46-e1.jpg",
        alt: "Smart Print PLA+ Black filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/product-placeholder-3.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s202-e1fg-s202-e1.jpg",
        alt: "Smart Print PETG Ocean Blue filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/product-placeholder-4.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s123-e1fg-s123-e1.jpg",
        alt: "Smart Print TPU Orange filament 1,75 mm 1 kg",
        contain: true
      },
      "assets/img/brand-filaverse-placeholder.svg": {
        src: "https://i0.wp.com/uptodatewebdesign.s3.eu-west-3.amazonaws.com/sites/995/images/5226e4a6b740eed5/w1024.jpg?resize=1024%2C1024&ssl=1",
        alt: "Filaverse kleurenmixpakket met vijf Smart Print PLA rollen",
        contain: true
      },
      "assets/img/brand-smart-print-placeholder.svg": {
        src: "https://b2b.smartprint24.com/_data/products/fg-s97-e1fg-s97-e1.jpg",
        alt: "Smart Print Silk PLA Dual Color Red Blue filament",
        contain: true
      },
      "assets/img/b2b-volume-spoelen-placeholder.svg": {
        src: "https://i0.wp.com/uptodatewebdesign.s3.eu-west-3.amazonaws.com/sites/995/images/5f30a5fc9380ce9e/w1024.jpg?resize=1024%2C1024&ssl=1",
        alt: "Filaverse 4+1 Smart Print startpakket met vijf PLA rollen",
        contain: true
      },
      "assets/img/onderwijs-3d-printen-placeholder.svg": {
        src: "https://i0.wp.com/d2j6dbq0eux0bg.cloudfront.net/images/120416751/products/805521577/5494921973.jpg?resize=405%2C508&ssl=1",
        alt: "Bambu Lab A1 3D-printer uit het Filaverse assortiment",
        contain: true
      }
    };

    Array.prototype.forEach.call(document.images, function (img) {
      var raw = img.getAttribute("src");
      var replacement = sources[raw];
      if (!replacement) return;
      img.src = replacement.src;
      img.alt = replacement.alt;
      if (replacement.contain) {
        img.style.objectFit = "contain";
        img.style.objectPosition = "center";
        img.style.background = "#fff";
        img.style.padding = "8px";
      }
    });

    // Bring the already-rendered static cards in sync with data/products.json.
    var products = [
      { brand: "Smart Print", title: "PLA Cyan", meta: "PLA · 1,75 mm · 1 kg", colour: "Kleur: Cyan" },
      { brand: "Smart Print", title: "PLA+ Black", meta: "PLA+ · 1,75 mm · 1 kg", colour: "Kleur: Black" },
      { brand: "Smart Print", title: "PETG Ocean Blue", meta: "PETG · 1,75 mm · 1 kg", colour: "Kleur: Ocean Blue" },
      { brand: "Smart Print", title: "TPU Orange", meta: "TPU · 1,75 mm · 1 kg", colour: "Kleur: Orange" }
    ];

    var cards = document.querySelectorAll(".fv-grid-products .fv-product");
    Array.prototype.forEach.call(cards, function (card, index) {
      var product = products[index];
      if (!product) return;
      var badge = card.querySelector(".fv-badge");
      if (badge) badge.remove();
      var brand = card.querySelector(".fv-product__brand");
      var title = card.querySelector(".fv-product__title a");
      var meta = card.querySelector(".fv-product__meta");
      if (brand) brand.textContent = product.brand;
      if (title) title.textContent = product.title;
      if (meta) meta.textContent = product.meta;

      var oldColour = card.querySelector(".fv-product__body > .fv-product__colour-runtime");
      if (!oldColour) {
        var p = document.createElement("p");
        p.className = "fv-product__meta fv-product__colour-runtime";
        p.textContent = product.colour;
        if (meta && meta.parentNode) meta.parentNode.insertBefore(p, meta.nextSibling);
      }
    });

    // The current assortment is Smart Print-led while Filaverse rebuilds its
    // own filament stock. Keep the brand explanation honest and aligned with
    // the real product imagery instead of presenting Smart Print as Filaverse.
    var brandSection = document.querySelector('[aria-labelledby="fv-merken-title"]');
    if (brandSection) {
      var intro = brandSection.querySelector(".fv-section-head p");
      if (intro) intro.textContent = "Filaverse is de webshop en selectie. Smart Print vormt momenteel een belangrijk deel van het filamentassortiment.";

      var brandCards = brandSection.querySelectorAll(".fv-brand");
      if (brandCards[0]) {
        var ownTag = brandCards[0].querySelector(".fv-brand__tag");
        var ownCopy = brandCards[0].querySelector(".fv-brand__body > p:not(.fv-brand__tag)");
        if (ownTag) ownTag.textContent = "Webshop & selectie";
        if (ownCopy) ownCopy.textContent = "Filaverse brengt geselecteerde filamenten, voordeelbundels en 3D-printoplossingen samen voor makers, scholen en bedrijven.";
      }
      if (brandCards[1]) {
        var partnerCopy = brandCards[1].querySelector(".fv-brand__body > p:not(.fv-brand__tag)");
        if (partnerCopy) partnerCopy.textContent = "Smart Print biedt binnen het huidige assortiment onder meer PLA, PLA+, PETG, TPU, ASA en Silk PLA in verschillende kleuren en uitvoeringen.";
      }

      var note = brandSection.querySelector(".fv-brandnote p");
      if (note) note.innerHTML = "<strong>Kort samengevat:</strong> Filaverse is de winkel en curator van het aanbod; Smart Print is een belangrijk filamentmerk dat je er momenteel koopt.";
    }
  })();

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
   * Mobile navigation drawer
   * ------------------------------------------------------------------ */
  (function drawer() {
    var panel = document.getElementById("fv-drawer");
    var toggle = document.querySelector("[data-fv-menu-toggle]");
    if (!panel || !toggle) return;

    var lastFocused = null;

    function focusables() {
      return Array.prototype.filter.call(
        panel.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'),
        function (el) { return el.offsetParent !== null; }
      );
    }

    function open() {
      lastFocused = document.activeElement;
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close() {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    toggle.addEventListener("click", function () {
      panel.hidden ? open() : close();
    });

    Array.prototype.forEach.call(
      panel.querySelectorAll("[data-fv-menu-close]"),
      function (el) { el.addEventListener("click", close); }
    );

    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (panel.hidden) return;

      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key === "Tab") {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  })();

  /* ------------------------------------------------------------------
   * Compact search panel
   * ------------------------------------------------------------------ */
  (function search() {
    var toggle = document.querySelector("[data-fv-search-toggle]");
    var panel = document.getElementById("fv-searchpanel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        var input = panel.querySelector("input");
        if (input) input.focus();
      }
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        panel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  })();

  /* ------------------------------------------------------------------
   * FAQ accordion
   * ------------------------------------------------------------------ */
  (function accordion() {
    var roots = document.querySelectorAll("[data-fv-accordion]");

    Array.prototype.forEach.call(roots, function (root) {
      var triggers = root.querySelectorAll(".fv-faq__trigger");

      Array.prototype.forEach.call(triggers, function (trigger, index) {
        trigger.addEventListener("click", function () {
          var panel = document.getElementById(trigger.getAttribute("aria-controls"));
          if (!panel) return;
          var expanded = trigger.getAttribute("aria-expanded") === "true";
          trigger.setAttribute("aria-expanded", String(!expanded));
          panel.hidden = expanded;
        });

        trigger.addEventListener("keydown", function (event) {
          var next = null;
          if (event.key === "ArrowDown") next = triggers[(index + 1) % triggers.length];
          else if (event.key === "ArrowUp") next = triggers[(index - 1 + triggers.length) % triggers.length];
          else if (event.key === "Home") next = triggers[0];
          else if (event.key === "End") next = triggers[triggers.length - 1];
          if (next) {
            event.preventDefault();
            next.focus();
          }
        });
      });
    });
  })();

  /* ------------------------------------------------------------------
   * Reveal on scroll
   * ------------------------------------------------------------------ */
  (function reveal() {
    var items = document.querySelectorAll(".fv-reveal");
    if (!items.length) return;

    function showAll() {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-visible"); });
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });
  })();

  /* ------------------------------------------------------------------
   * Hero background video
   *
   * The markup ships with preload="none" and no bytes are fetched until this
   * decides the video is welcome. It is suppressed entirely — poster only —
   * when the visitor prefers reduced motion, has Save-Data on, is on a slow
   * or metered connection, or is on a small screen where a background video
   * is a waste of their data.
   *
   * Autoplay can still be refused by the browser (low battery, iOS Low Power
   * Mode, a user setting). That is handled, not fought: the promise rejection
   * simply leaves the poster in place.
   * ------------------------------------------------------------------ */
  (function heroVideo() {
    var video = document.querySelector("[data-fv-hero-video]");
    if (!video) return;

    var conn = navigator.connection || {};
    var slow = /2g/.test(conn.effectiveType || "");
    var smallScreen = window.matchMedia("(max-width: 700px)").matches;

    if (reduceMotion || conn.saveData || slow || smallScreen) {
      // Poster only. Drop the sources so no request is ever made for them.
      video.removeAttribute("autoplay");
      while (video.firstChild) video.removeChild(video.firstChild);
      video.load();
      return;
    }

    video.preload = "auto";
    video.load();

    function play() {
      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          /* Autoplay refused — the poster stays, which is a fine hero. */
        });
      }
    }

    // Don't spend decode time on a hero the visitor has scrolled past.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) play();
          else video.pause();
        });
      }, { threshold: 0.1 });
      io.observe(video);
    } else {
      play();
    }

    // Background tabs shouldn't keep decoding frames.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0) play();
    });
  })();

  /* ------------------------------------------------------------------
   * Footer year
   * ------------------------------------------------------------------ */
  (function year() {
    var el = document.querySelector("[data-fv-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  })();

  /* ------------------------------------------------------------------
   * Cart badge
   * ------------------------------------------------------------------ */
  window.filaverse = window.filaverse || {};
  window.filaverse.setCartCount = function (count) {
    var badge = document.querySelector("[data-fv-cart-count]");
    if (!badge) return;
    var n = Number(count) || 0;
    badge.textContent = String(n);
    badge.hidden = n === 0;
  };
})();
