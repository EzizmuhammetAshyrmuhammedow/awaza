class Employee < ApplicationRecord
  belongs_to :user
  before_create :assign_role

  private

  def assign_role
    user.role = "employee" if user
  end
end
