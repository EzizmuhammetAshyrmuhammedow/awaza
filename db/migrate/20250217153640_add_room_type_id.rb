class AddRoomTypeId < ActiveRecord::Migration[8.0]
  def change
    add_reference :rooms, :room_type, foreign_key: true
  end
end
