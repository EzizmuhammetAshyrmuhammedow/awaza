import * as Turbo from "@hotwired/turbo-rails"
import "trix"
import Alpine from "alpinejs";
import {roomSelector} from '../controller/room_selector.js'

window.roomSelector = roomSelector

document.addEventListener("turbo:load", () => {
    window.Alpine = Alpine;
    Alpine.start();
});
