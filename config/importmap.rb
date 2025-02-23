# Pin npm packages by running ./bin/importmap

pin "application"
pin "alpinejs" # @3.14.8
pin "flatpickr" # @4.6.13
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"
pin_all_from "app/javascript/controllers", under: "controllers"
pin "trix"
pin "@rails/actiontext", to: "actiontext.esm.js"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "pikaday" # @1.8.2
pin "moment" # @2.30.1
pin "chartkick", to: "chartkick.js"
pin "Chart.bundle", to: "Chart.bundle.js"
pin "room_selector", to: "components/room_selector.js"
