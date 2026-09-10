// Temporary: the button stands where the download link will go, and says so when pressed. When
// there is a file to hand out, the button becomes a plain <a href> and this file goes away.
document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("apk");
  if (!button) return;
  button.addEventListener("click", function () {
    var ru = document.documentElement.getAttribute("data-lang") !== "en";
    alert(ru ? "Скачивание APK появится позже." : "The APK download will come later.");
  });
});
