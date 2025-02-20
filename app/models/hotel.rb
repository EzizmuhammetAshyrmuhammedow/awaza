class Hotel < ApplicationRecord
  has_one_attached :thumbnail
  has_many_attached :photos
  has_many :comments, dependent: :destroy
  has_one :user
  belongs_to :user

  has_many :rooms
  has_many :bookings

  scope :with_available_rooms, ->(check_in, check_out) {
    joins(:rooms)
      .where('rooms.available = ?', true)
      .where('rooms.id NOT IN (
                SELECT rooms_id FROM bookings WHERE
                (check_in BETWEEN ? AND ?) OR
                (check_out BETWEEN ? AND ?)
              )', check_in, check_out, check_in, check_out)
      .distinct
  }
end
