// Loaded from <head> without defer, on purpose: the stored choice has to reach the root element
// before the first paint, or a dark-theme reader gets a white flash on every page load.
(function () {
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem("vekha-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) {
    // Private windows and blocked site data throw on access. The system preference still applies.
  }

  function attach() {
    var button = document.getElementById("theme");
    if (!button) return;
    button.addEventListener("click", function () {
      var chosen = root.getAttribute("data-theme");
      var dark = chosen ? chosen === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("vekha-theme", next);
      } catch (e) {
        // Nothing to do: the page still switches, the choice just will not outlive it.
      }
    });
  }

  // The button does not exist yet — this file runs before the body is parsed.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attach);
  } else {
    attach();
  }
})();
