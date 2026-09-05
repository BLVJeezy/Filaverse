/*
 * Filaverse homepage — progressive enhancement.
 *
 * Deliberately dependency-free and small: no animation library, no framework.
 * Everything here enhances markup that already works without JavaScript.
 */
(function () {
  "use strict";

  // Read once: consulted by the scroll reveal and the hero video controller.
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
   * Catalogue image fallback
   *
   * Real product photography is hotlinked from hosts this site does not
   * control, so a renamed file or hotlink protection would otherwise leave a
   * broken-image icon in the middle of a product card. Each such image carries
   * data-fallback pointing at the local schematic placeholder; if the remote
   * one fails to load, swap it in.
   *
   * The image URLs themselves live in data/categories.json and
   * data/products.json and are written into the markup by scripts/build.mjs.
   * They are deliberately NOT swapped in at runtime: doing that cost a wasted
   * request per card, because the browser fetched the placeholder first and
   * then replaced it.
   * ------------------------------------------------------------------ */
  (function imageFallback() {
    function swap(img) {
      var fallback = img.getAttribute("data-fallback");
      if (!fallback || img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = "1";   // never loop if the fallback 404s too
      img.classList.remove("fv-photo");    // schematic art is meant to be cropped
      img.src = fallback;
    }

    Array.prototype.forEach.call(
      document.querySelectorAll("img[data-fallback]"),
      function (img) {
        img.addEventListener("error", function () { swap(img); });
        // A lazy image may already have failed before this script ran.
        if (img.complete && img.naturalWidth === 0) swap(img);
      }
    );
  })();

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
