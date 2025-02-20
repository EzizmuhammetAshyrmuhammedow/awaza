# app/models/like_dislike_relation.rb
class LikeDislikeRelation < ApplicationRecord
    belongs_to :user
    belongs_to :comment
  
    # Ensure a user can only like/dislike a comment once
    validates :user_id, uniqueness: { scope: :comment_id }
  end