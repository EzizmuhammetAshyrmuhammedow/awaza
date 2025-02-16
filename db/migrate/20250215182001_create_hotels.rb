class CreateHotels < ActiveRecord::Migration[8.0]
  def change
    create_table :hotels do |t|
      t.string :name
      t.text :description
      t.numeric :rating
      t.timestamps
    end
  end
end
