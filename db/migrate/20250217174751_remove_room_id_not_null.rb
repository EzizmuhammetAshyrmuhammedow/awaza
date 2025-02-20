class RemoveRoomIdNotNull < ActiveRecord::Migration[8.0]
  def change
    change_column :room_types, :room_id, :integer, null: true
    #Ex:- change_column("admin_users", "email", :string, :limit =>25)
  end
end
