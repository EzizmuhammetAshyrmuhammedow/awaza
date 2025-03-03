class CreateBookings < ActiveRecord::Migration[8.0]
  def change
    create_table :bookings do |t|
      t.date :check_in
      t.date :check_out
      t.references :user, null: false, foreign_key: true
      t.references :hotel, null: false, foreign_key: true
      t.references :rooms, null: false, foreign_key: true
      t.integer :total_price
      t.integer :guests
      t.boolean :is_cancelled

      t.timestamps
    end
  end
end
