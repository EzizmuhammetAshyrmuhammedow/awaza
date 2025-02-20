class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :hotel
  has_many :rooms
end
