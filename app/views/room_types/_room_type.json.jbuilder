json.extract! room_type, :id, :name, :price, :features, :extra_info, :room_id, :capacity, :created_at, :updated_at
json.url room_type_url(room_type, format: :json)
