// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "controllers"
import "@hotwired/turbo-rails"

import "trix"
import "@rails/actiontext"

// Turkmen localization (custom)
const turkmenLocale = {
    firstDayOfWeek: 1,
    weekdays: {
        shorthand: ["Ýek", "Duş", "Siş", "Çar", "Pen", "Anna", "Şen"],
        longhand: [
            "Ýekşenbe", "Duşenbe", "Sişenbe", "Çarşenbe", "Penşenbe", "Anna", "Şenbe"
        ]
    },
    months: {
        shorthand: ["Ýan", "Few", "Mar", "Apr", "Maý", "Iýun", "Iýul", "Awg", "Sen", "Okt", "Noý", "Dek"],
        longhand: [
            "Ýanwar", "Fewral", "Mart", "Aprel", "Maý", "Iýun", "Iýul", "Awgust",
            "Sentýabr", "Oktýabr", "Noýabr", "Dekabr"
        ]
    }
};

// Function to format the date manually for Turkmen locale
function formatTurkmenDate(date) {
    const months = [
        "Fewral", "Fewral", "Mart", "Aprel", "Maý", "Iýun", "Iýul",
        "Awgust", "Sentýabr", "Oktýabr", "Noýabr", "Dekabr"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function initFlatpickr() {
    const locale = new URLSearchParams(window.location.search).get("locale") || "en";
    const flatpickrLocale = locale === "tk" ? turkmenLocale : "en";
    console.log("Aha")
    flatpickr("#date-input", {
        locale: flatpickrLocale,
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        onChange: function (selectedDates, dateStr, instance) {
            if (locale === "tk" && selectedDates.length > 0) {
                instance.altInput.value = formatTurkmenDate(selectedDates[0]);
            }
        }
    });

    const checkIn = flatpickr("#checkin", {
        minDate: "today",
        locale: flatpickrLocale,
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        theme: "dark",
        onChange: function (selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOut.set("minDate", nextDay);

                if (locale === "tk") {
                    instance.altInput.value = formatTurkmenDate(selectedDates[0]);
                }
            }
        }
    });

    const checkOut = flatpickr("#checkout", {
        minDate: new Date().fp_incr(1),
        locale: flatpickrLocale,
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        theme: "dark",
        onChange: function (selectedDates, dateStr, instance) {
            if (locale === "tk" && selectedDates.length > 0) {
                instance.altInput.value = formatTurkmenDate(selectedDates[0]);
            }
        }
    });
}
import Pikaday from "pikaday";

document.addEventListener("turbo:load", () => {
    new Pikaday({
        field: document.getElementById("date-input"),
        format: "YYYY-MM-DD"
    });
});
document.addEventListener("turbo:load", initFlatpickr);
document.addEventListener("DOMContentLoaded", initFlatpickr);import "@hotwired/turbo-rails"
