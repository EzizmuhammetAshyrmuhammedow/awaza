class CreateEmployees < ActiveRecord::Migration[8.0]
  def change
    create_table :employees do |t|
      t.string :employee_id
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
