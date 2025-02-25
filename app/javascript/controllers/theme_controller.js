import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.flatpickrDarkTheme = document.getElementById("flatpickr-dark");
    this.applyTheme();
  }

  toggle() {
    document.documentElement.classList.toggle("dark");
    const isDarkMode = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    this.applyTheme();
  }

  applyTheme() {
    const isDarkMode =
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDarkMode);
    this.flatpickrDarkTheme.disabled = !isDarkMode;
  }
}
