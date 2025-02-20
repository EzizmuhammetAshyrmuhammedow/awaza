class Room < ApplicationRecord
  belongs_to :hotel
  belongs_to :room_type
  has_one_attached :thumbnail
end
