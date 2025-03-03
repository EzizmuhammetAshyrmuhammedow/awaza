class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :like_dislike_relations
  has_many :liked_comments, -> { where(like_dislike_relations: { liked: true }) }, through: :like_dislike_relations, source: :comment
  has_many :disliked_comments, -> { where(like_dislike_relations: { disliked: true }) }, through: :like_dislike_relations, source: :comment

  enum :role, [ :user, :employee, :hotel_owner, :admin ]
  normalizes :email_address, with: ->(e) { e.strip.downcase }

  has_one :employee, dependent: :destroy

  after_create :create_employee_record, if: -> { role == "employee" }
  private
  def create_employee_record
    Employee.create(user: self)
  end
end
