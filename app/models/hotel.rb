class Hotel < ApplicationRecord
  has_one_attached :thumbnail
  has_many_attached :photos
  has_many :comments, dependent: :destroy
  belongs_to :user

  has_many :rooms
  has_many :bookings

  scope :with_available_rooms, ->(check_in, check_out) {
    joins(:rooms)
      .where("rooms.available = ?", true)
      .where('rooms.id NOT IN (
                SELECT room_id FROM bookings
              )', check_in, check_out, check_in, check_out)
      .distinct
  }
  def thumbnail_url
    return nil unless thumbnail.attached?
    Rails.application.routes.url_helpers.rails_blob_url(thumbnail, only_path: true)
  end

  def photos_urls
    photos.map { |photo| Rails.application.routes.url_helpers.rails_blob_url(photo, only_path: true) if photo.attached? }
  end
end
