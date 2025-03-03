class AddUserIdToHotels < ActiveRecord::Migration[8.0]
  def change
    add_reference :hotels, :user, foreign_key: true
  end
end
