class Booking < ApplicationRecord
  after_create :mark_rooms_as_unavailable
  after_destroy :mark_rooms_as_available
  after_update :mark_rooms_as_available_if_cancelled

  belongs_to :user
  belongs_to :hotel
  has_many :booking_rooms
  has_many :rooms, through: :booking_rooms

  accepts_nested_attributes_for :booking_rooms

  validates :check_in, :check_out, :guests, :total_price, presence: true

  private

  def mark_rooms_as_unavailable
    rooms.each { |room| room.update(available: false) }
  end

  def mark_rooms_as_available
    rooms.each { |room| room.update(available: true) }
  end

  def mark_rooms_as_available_if_cancelled
    if saved_change_to_is_cancelled? && is_cancelled
      mark_rooms_as_available
    end
  end
  def self.guests_by_date
    group_by_day(:check_in).sum(:guests)
  end
end