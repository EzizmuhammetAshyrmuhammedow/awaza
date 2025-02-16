class Hotel < ApplicationRecord
  has_one :thumbnail
  has_many :photos
  has_one :user
end
