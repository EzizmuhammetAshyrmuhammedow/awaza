json.extract! booking, :id, :check_in, :check_out, :user_id, :hotel_id, :rooms_id, :total_price, :guests, :is_cancelled, :created_at, :updated_at
json.url booking_url(booking, format: :json)
