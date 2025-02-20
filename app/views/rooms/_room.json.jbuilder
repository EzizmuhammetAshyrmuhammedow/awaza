json.extract! room, :id, :available, :hotel_id, :room_type_id, :created_at, :updated_at
json.url room_url(room, format: :json)
