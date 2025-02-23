class Comment < ApplicationRecord
    belongs_to :user
    belongs_to :hotel
    belongs_to :parent, class_name: "Comment", optional: true
    has_many :replies, -> { active }, class_name: "Comment", foreign_key: "parent_id", dependent: :destroy
    has_many :like_dislike_relations
    has_many :liked_users, -> { where(like_dislike_relations: { liked: true }) }, through: :like_dislike_relations, source: :user
    has_many :disliked_users, -> { where(like_dislike_relations: { disliked: true }) }, through: :like_dislike_relations, source: :user
  
    validates :content, presence: true
    validates :user_id, presence: true
    validates :hotel_id, presence: true
  
    # Ensure ratings are within a valid range (e.g., 1 to 5)
    validates :food_rating, :room_rating, :service_rating, :entertainment_rating,
              numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 5 }, allow_nil: true


    after_initialize :set_default_likes_dislikes, if: :new_record?
    
    scope :active, -> { where(deleted_at: nil) }

    def soft_delete
        update(deleted_at: Time.current)
    end

    def restore
        update(deleted_at: nil)
    end
  # Like a comment
  def like!(user)
    relation = like_dislike_relations.find_or_initialize_by(user: user)
    relation.update!(liked: true, disliked: false)
  end

  # Dislike a comment
  def dislike!(user)
    relation = like_dislike_relations.find_or_initialize_by(user: user)
    relation.update!(liked: false, disliked: true)
  end

  # Unlike a comment
  def unlike!(user)
    relation = like_dislike_relations.find_by(user: user)
    relation&.update!(liked: false)
  end

  # Undislike a comment
  def undislike!(user)
    relation = like_dislike_relations.find_by(user: user)
    relation&.update!(disliked: false)
  end

  # Check if a user liked the comment
  def liked_by?(user)
    liked_users.include?(user)
  end

  # Check if a user disliked the comment
  def disliked_by?(user)
    disliked_users.include?(user)
  end
    
    before_save :calculate_total_rating

    private

    def calculate_total_rating
        if self.isReview
            ratings = [food_rating, room_rating, service_rating, entertainment_rating].compact
            self.total_rating = ratings.sum.to_f / ratings.size if ratings.any? 
        else
            self.total_rating = 0
        end
    end          
    def set_default_likes_dislikes
        self.like_count ||= 0
        self.dislike_count ||= 0
  end
end