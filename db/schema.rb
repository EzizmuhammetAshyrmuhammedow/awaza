# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_03_01_115653) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.integer "resource_id"
    t.string "author_type"
    t.integer "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "booking_rooms", force: :cascade do |t|
    t.integer "booking_id"
    t.integer "room_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "bookings", force: :cascade do |t|
    t.date "check_in"
    t.date "check_out"
    t.integer "user_id", null: false
    t.integer "hotel_id", null: false
    t.integer "total_price"
    t.integer "guests"
    t.boolean "is_cancelled"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hotel_id"], name: "index_bookings_on_hotel_id"
    t.index ["user_id"], name: "index_bookings_on_user_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "content"
    t.integer "user_id", null: false
    t.integer "hotel_id", null: false
    t.integer "like_count"
    t.integer "dislike_count"
    t.integer "parent_id"
    t.boolean "is_read"
    t.integer "total_rating"
    t.integer "food_rating"
    t.integer "room_rating"
    t.integer "service_rating"
    t.integer "entertainment_rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_review"
    t.datetime "deleted_at"
    t.index ["hotel_id"], name: "index_comments_on_hotel_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "employees", force: :cascade do |t|
    t.string "employee_id"
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_employees_on_user_id"
  end

  create_table "employees_tables", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "hotels", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.decimal "rating"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.integer "room_id"
    t.integer "room_type_id"
    t.index ["room_id"], name: "index_hotels_on_room_id"
    t.index ["room_type_id"], name: "index_hotels_on_room_type_id"
    t.index ["user_id"], name: "index_hotels_on_user_id"
  end

  create_table "like_dislike_relations", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "comment_id", null: false
    t.boolean "liked", default: false
    t.boolean "disliked", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["comment_id"], name: "index_like_dislike_relations_on_comment_id"
    t.index ["user_id", "comment_id"], name: "index_like_dislike_relations_on_user_id_and_comment_id", unique: true
    t.index ["user_id"], name: "index_like_dislike_relations_on_user_id"
  end

  create_table "room_types", force: :cascade do |t|
    t.string "name"
    t.integer "price"
    t.text "features"
    t.text "extra_info"
    t.integer "room_id"
    t.integer "capacity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "hotel_id"
    t.index ["hotel_id"], name: "index_room_types_on_hotel_id"
    t.index ["room_id"], name: "index_room_types_on_room_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.boolean "available"
    t.integer "hotel_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "room_type_id"
    t.string "actual_room_id"
    t.index ["hotel_id"], name: "index_rooms_on_hotel_id"
    t.index ["room_type_id"], name: "index_rooms_on_room_type_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 0, null: false
    t.string "username"
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookings", "hotels"
  add_foreign_key "bookings", "users"
  add_foreign_key "comments", "hotels"
  add_foreign_key "comments", "users"
  add_foreign_key "employees", "users"
  add_foreign_key "hotels", "room_types"
  add_foreign_key "hotels", "rooms"
  add_foreign_key "hotels", "users"
  add_foreign_key "like_dislike_relations", "comments"
  add_foreign_key "like_dislike_relations", "users"
  add_foreign_key "room_types", "hotels"
  add_foreign_key "room_types", "rooms"
  add_foreign_key "rooms", "hotels"
  add_foreign_key "rooms", "room_types"
  add_foreign_key "sessions", "users"
end
