/*
 * Filaverse homepage — progressive enhancement.
 *
 * Deliberately dependency-free and small: no animation library, no framework.
 * Everything here enhances markup that already works without JavaScript —
 * the FAQ answers, the navigation links and the search form are all usable
 * with scripting disabled.
 */
(function () {
  "use strict";

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

    // Close after following an in-page link.
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) close();
    });

    document.addEventListener("keydown", function (event) {
      if (panel.hidden) return;

      if (event.key === "Escape") {
        close();
        return;
      }

      // Keep focus inside the dialog while it is open.
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
   * Compact search panel (below the 1080px breakpoint)
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
   *
   * Multiple panels may be open at once — visitors often compare two
   * answers. Panels use the `hidden` attribute, so the content is in the
   * DOM (and indexable) but correctly hidden from assistive technology.
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

        // Arrow-key navigation between questions, per the WAI-ARIA
        // accordion pattern.
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
   * Reveal on scroll — a single fade-up, once per element.
   * Skipped entirely when the visitor prefers reduced motion, or when
   * IntersectionObserver is unavailable.
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
   * Footer year
   * ------------------------------------------------------------------ */
  (function year() {
    var el = document.querySelector("[data-fv-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  })();

  /* ------------------------------------------------------------------
   * Cart badge
   *
   * TODO(integration): the homepage does NOT own cart state. Hook this up to
   * the project's existing cart store / API and call window.filaverse
   * .setCartCount(n) from there. Until that is wired up the badge stays
   * hidden rather than showing a fabricated "0 items".
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
