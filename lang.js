// Loaded from <head> without defer, like theme.js: the language has to be on the root element
// before the first paint, or the wrong half of the page flashes past.
(function () {
  var root = document.documentElement;

  var LABELS = {
    ru: { theme: "Светлая или тёмная тема", lang: "Switch to English" },
    en: { theme: "Light or dark theme", lang: "Переключить на русский" },
  };

  function apply(lang) {
    root.setAttribute("data-lang", lang);
    root.lang = lang;
    var theme = document.getElementById("theme");
    var button = document.getElementById("lang");
    if (theme) theme.setAttribute("aria-label", LABELS[lang].theme);
    if (button) button.setAttribute("aria-label", LABELS[lang].lang);
  }

  var saved = null;
  try {
    saved = localStorage.getItem("vekha-lang");
  } catch (e) {
    // Private windows and blocked site data throw on access; the browser's own language decides.
  }
  // Russian for a Russian browser, English for everyone else. A visitor Google sends to read the
  // policy is unlikely to read Russian, and should not have to find the switch first.
  var initial = saved === "ru" || saved === "en"
    ? saved
    : (navigator.language || "").toLowerCase().indexOf("ru") === 0 ? "ru" : "en";
  apply(initial);

  function attach() {
    var button = document.getElementById("lang");
    if (!button) return;
    apply(root.getAttribute("data-lang"));
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-lang") === "ru" ? "en" : "ru";
      apply(next);
      try {
        localStorage.setItem("vekha-lang", next);
      } catch (e) {
        // The page still switches; the choice just will not outlive it.
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();
