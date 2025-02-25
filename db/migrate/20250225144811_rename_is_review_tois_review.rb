class RenameIsReviewToisReview < ActiveRecord::Migration[8.0]
  def change
    rename_column :comments, :isReview, :is_review
  end
end
