class ConvertThumbnailJob < ApplicationJob
  queue_as :default

  def perform(hotel_id)
    hotel = Hotel.find(hotel_id)
    return unless hotel.thumbnail.attached?
    return if hotel.thumbnail.content_type == "image/avif"

    require "image_processing/vips"

    original_data = hotel.thumbnail.download
    Tempfile.create(["original", ".jpg"]) do |temp_original|
      temp_original.binmode
      temp_original.write(original_data)
      temp_original.rewind

      converted = ImageProcessing::Vips
                    .source(temp_original)
                    .convert("avif")
                    .call

      hotel.thumbnail.purge
      hotel.thumbnail.attach(
        io: File.open(converted.path),
        filename: "#{File.basename(hotel.thumbnail.filename.to_s, '.*')}.avif",
        content_type: "image/avif"
      )
    end
  end
end
