import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hotel", "rooms"]

  connect() {
    console.log("aha")
  }

  updateRooms() {
    const hotelId = this.hotelTarget.value;
    if (!hotelId) {
      this.roomsTarget.innerHTML = '<option value="">Select a hotel first</option>';
      return;
    }
    this.roomsTarget.innerHTML = '<option value="">Loading...</option>';
    fetch(`/dashboard/room_types/rooms_for_hotel?hotel_id=${hotelId}`, {
      headers: { Accept: "application/json" }
    })
        .then(response => response.json())
        .then(data => {
          this.roomsTarget.innerHTML = '<option value="">Select Room</option>';
          data.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.actual_room_id;
            this.roomsTarget.appendChild(option);
          });
        })
        .catch(() => {
          this.roomsTarget.innerHTML = '<option value="">Error loading rooms</option>';
        });
  }
}
