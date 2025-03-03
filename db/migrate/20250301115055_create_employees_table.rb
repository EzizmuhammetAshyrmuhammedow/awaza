class CreateEmployeesTable < ActiveRecord::Migration[8.0]
  def change
    create_table :employees do |t|
      t.string :employee_id, null: false, unique: true
      t.references :user, foreign_key: true, null: false

      t.timestamps
    end

    add_index :employees, :employee_id, unique: true
  end
end
