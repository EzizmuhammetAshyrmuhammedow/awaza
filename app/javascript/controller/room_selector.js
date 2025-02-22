export function roomSelector() {
    return {
        selectedRoomId: '',
        selectedRooms: [],
        addRoom() {
            if (!this.selectedRoomId) return;
            const option = document.querySelector(`option[value="${this.selectedRoomId}"]`);
            if (!option) return;
            if (this.selectedRooms.some(room => room.id === this.selectedRoomId)) {
                this.selectedRoomId = '';
                return;
            }
            const roomData = {
                id: this.selectedRoomId,
                thumbnail: option.dataset.thumbnailUrl || '',
                name: option.dataset.name || 'Room',
                capacity: option.dataset.capacity || '',
                price: option.dataset.price || ''
            };
            this.selectedRooms.push(roomData);
            this.selectedRoomId = '';
        },
        removeRoom(index) {
            this.selectedRooms.splice(index, 1);
        }
    }
}
