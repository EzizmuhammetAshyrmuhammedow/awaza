class Booking < ApplicationRecord
  belongs_to :user
  belongs_to :hotel
  has_and_belongs_to_many :rooms
end
