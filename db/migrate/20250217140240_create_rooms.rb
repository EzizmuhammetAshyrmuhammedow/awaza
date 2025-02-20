class CreateRooms < ActiveRecord::Migration[8.0]
  def change
    create_table :rooms do |t|
      t.boolean :available
      t.references :hotel, null: false, foreign_key: true

      t.timestamps
    end
  end
end
