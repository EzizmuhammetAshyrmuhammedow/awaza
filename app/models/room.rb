class Room < ApplicationRecord
  belongs_to :hotel
  belongs_to :room_type
  has_many :booking_rooms
  has_many :bookings, through: :booking_rooms
  has_one_attached :thumbnail
end
