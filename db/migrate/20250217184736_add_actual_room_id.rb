class AddActualRoomId < ActiveRecord::Migration[8.0]
  def change
    add_column :rooms, :actual_room_id, :string
    #Ex:- add_column("admin_users", "username", :string, :limit =>25, :after => "email")
  end
end
