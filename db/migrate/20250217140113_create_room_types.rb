class CreateRoomTypes < ActiveRecord::Migration[8.0]
  def change
    create_table :room_types do |t|
      t.string :name
      t.integer :price
      t.text :features
      t.text :extra_info
      t.references :room, null: false, foreign_key: true
      t.integer :capacity

      t.timestamps
    end
  end
end
