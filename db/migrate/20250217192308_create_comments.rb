class CreateComments < ActiveRecord::Migration[8.0]
  def change
    create_table :comments do |t|
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.references :hotel, null: false, foreign_key: true
      t.integer :like_count
      t.integer :dislike_count
      t.integer :parent_id
      t.boolean :is_read
      t.integer :total_rating
      t.integer :food_rating
      t.integer :room_rating
      t.integer :service_rating
      t.integer :entertainment_rating

      t.timestamps
    end
  end
end
