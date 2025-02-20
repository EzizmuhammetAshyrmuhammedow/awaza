class RoomType < ApplicationRecord
  has_many :room
  has_one_attached :thumbnail
  has_many_attached :photos
  has_rich_text :features
  has_rich_text :extra_info
  belongs_to :hotel
end
