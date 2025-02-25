// app/javascript/controllers/hotel_controller.js
import {Controller} from "@hotwired/stimulus";

export default class extends Controller {
    static targets = ["checkOut", "guestCount", "roomCount", "adults", "children", "rooms", "popover", "guests"];

    connect() {
        // Initialize state values from inputs
        this.adultsValue = parseInt(this.adultsTarget.value) || 1;
        this.childrenValue = parseInt(this.childrenTarget.value) || 0;
        this.roomsValue = parseInt(this.roomsTarget.value) || 1;
        this.updateGuestDisplay();
        this.updateRoomDisplay();
    }

    updateCheckOut(event) {
        const checkIn = new Date(event.target.value);
        const tomorrow = new Date(checkIn);
        tomorrow.setDate(checkIn.getDate() + 1);
        const formatted = tomorrow.toISOString().split("T")[0];
        this.checkOutTarget.value = formatted;
    }

    incrementAdults() {
        this.adultsValue++;
        this.adultsTarget.value = this.adultsValue;
        this.updateGuestDisplay();
    }

    decrementAdults() {
        if (this.adultsValue > 1) {
            this.adultsValue--;
            this.adultsTarget.value = this.adultsValue;
            this.updateGuestDisplay();
        }
    }

    incrementChildren() {
        this.childrenValue++;
        this.childrenTarget.value = this.childrenValue;
        this.updateGuestDisplay();
    }

    decrementChildren() {
        if (this.childrenValue > 0) {
            this.childrenValue--;
            this.childrenTarget.value = this.childrenValue;
            this.updateGuestDisplay();
        }
    }

    incrementRooms() {
        // Only allow increasing rooms if the number is less than the total guest count
        if (this.roomsValue < (this.adultsValue + this.childrenValue)) {
            this.roomsValue++;
            this.roomsTarget.value = this.roomsValue;
            this.updateRoomDisplay();
        }
    }

    decrementRooms() {
        if (this.roomsValue > 1) {
            this.roomsValue--;
            this.roomsTarget.value = this.roomsValue;
            this.updateRoomDisplay();
        }
    }

    updateGuestDisplay() {
        const total = this.adultsValue + this.childrenValue;
        const guestText = this.getLocalizedText("guests", total);
        this.guestCountTarget.textContent = guestText;
        this.guestsTarget.value = total;
    }

    updateRoomDisplay() {
        const roomText = this.getLocalizedText("rooms", this.roomsValue);
        this.roomCountTarget.textContent = roomText;
    }

    getLocalizedText(key, count) {
        const locale = new URLSearchParams(window.location.search).get("locale") || "tk"; // Get locale from URL
        const translations = {
            tk: {
                guests: {
                    zero: "Myhman yok", one: "1 Myhman", other: `${count} Myhman`
                }, rooms: {
                    zero: "Otag yok", plural: "Otaglar", one: "1 Otag", other: `${count} Otag`
                }, adults: {
                    zero: "0 Uly Yasly", plural: "Uly Yaslylar", one: "1 Uly Yasly", other: "%{count} Uly Yasly"
                }, children: {
                    zero: "Caga Yok", plural: "Cagalar", one: "1 Caga", other: "%{count} Caga"
                },
            }, en: {
                guests: {
                    zero: "No Guests", one: "1 Guest", other: `${count} Guests`
                }, rooms: {
                    zero: "No Rooms", one: "1 Room", other: `${count} Rooms`
                }, children: {
                    zero: "No Children", plural: "Children", one: "1 Child", other: "%{count} Children"
                }, adults: {
                    zero: "0 Adult", plural: "Adults", one: "1 Adult", other: "%{count} Adults"
                }
            }, ru: {
                guests: {
                    zero: "Нет гостей", one: "1 гость", few: `${count} гостя`, // For numbers 2, 3, 4 (except 12-14)
                    many: `${count} гостей` // For numbers 5+ and 11-14
                }, rooms: {
                    zero: "Нет номеров", one: "1 номер", few: `${count} номера`, many: `${count} номеров`
                }, children: {
                    zero: "Нет детей", one: "1 ребёнок", few: `${count} ребёнка`, many: `${count} детей`
                }, adults: {
                    zero: "0 взрослых", one: "1 взрослый", few: `${count} взрослых`, many: `${count} взрослых`
                }
            }

        };

        if (!translations[locale]) return translations["en"]; // Fallback to English
        const localizedText = translations[locale][key];
        if (!localizedText) {
            console.error(`No translation found for key: ${key} in locale: ${locale}`);
            return `Missing translation for ${key}`;
        }

        if (count === 0) return localizedText.zero;
        if (count === 1) return localizedText.one;
        if (locale === "ru") {
            const lastDigit = count % 10;
            const lastTwoDigits = count % 100;
            if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
                return localizedText.few.replace("%{count}", count);
            }
            return localizedText.many.replace("%{count}", count);
        }
        return localizedText.other.replace("%{count}", count);
    }
}
