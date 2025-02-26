class RemoveRoomIdFromBooking < ActiveRecord::Migration[8.0]
  def change
    remove_column :bookings, :room_ids
  end
end
