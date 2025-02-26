class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :like_dislike_relations
  has_many :liked_comments, -> { where(like_dislike_relations: { liked: true }) }, through: :like_dislike_relations, source: :comment
  has_many :disliked_comments, -> { where(like_dislike_relations: { disliked: true }) }, through: :like_dislike_relations, source: :comment

  enum :role, [ :user, :employee, :hotel_owner, :admin ] # Corrected line
  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
