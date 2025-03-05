import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.flatpickrDarkTheme = document.getElementById("flatpickr-business");
    this.applyTheme();
  }

  toggle() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "emerald" ? "business" : "emerald";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    this.applyTheme();
  }

  applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: business)").matches;

    const theme = savedTheme || (prefersDark ? "business" : "emerald");
    document.documentElement.setAttribute("data-theme", theme);
    this.flatpickrDarkTheme.disabled = theme !== "business";
  }
}