class ChangeRoomsIdToRoomIdsInBookings < ActiveRecord::Migration[8.0]
  def change
    remove_column :bookings, :rooms_id, :integer
    add_column :bookings, :room_ids, :jsonb, default: []
  end
end
