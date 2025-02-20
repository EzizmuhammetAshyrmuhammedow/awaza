# db/migrate/YYYYMMDDHHMMSS_create_like_dislike_relations.rb
class CreateLikeDislikeRelations < ActiveRecord::Migration[8.0]
  def change
    create_table :like_dislike_relations do |t|
      t.references :user, null: false, foreign_key: true
      t.references :comment, null: false, foreign_key: true
      t.boolean :liked, default: false
      t.boolean :disliked, default: false

      t.timestamps
    end

    # Add unique index to ensure a user can only like/dislike a comment once
    add_index :like_dislike_relations, [:user_id, :comment_id], unique: true
  end
end