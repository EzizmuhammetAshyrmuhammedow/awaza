class AddRoomIdAndRoomTypeIdToHotels < ActiveRecord::Migration[8.0]
  def change
    add_reference :hotels, :room, foreign_key: true
    add_reference :hotels, :room_type, foreign_key: true
  end
end
