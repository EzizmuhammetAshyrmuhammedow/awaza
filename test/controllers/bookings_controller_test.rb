require "test_helper"

class BookingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @booking = bookings(:one)
  end

  test "should get index" do
    get bookings_url
    assert_response :success
  end

  test "should get new" do
    get new_booking_url
    assert_response :success
  end

  test "should create booking" do
    assert_difference("Booking.count") do
      post bookings_url, params: { booking: { check_in: @booking.check_in, check_out: @booking.check_out, guests: @booking.guests, hotel_id: @booking.hotel_id, is_cancelled: @booking.is_cancelled, rooms_id: @booking.rooms_id, total_price: @booking.total_price, user_id: @booking.user_id } }
    end

    assert_redirected_to booking_url(Booking.last)
  end

  test "should show booking" do
    get booking_url(@booking)
    assert_response :success
  end

  test "should get edit" do
    get edit_booking_url(@booking)
    assert_response :success
  end

  test "should update booking" do
    patch booking_url(@booking), params: { booking: { check_in: @booking.check_in, check_out: @booking.check_out, guests: @booking.guests, hotel_id: @booking.hotel_id, is_cancelled: @booking.is_cancelled, rooms_id: @booking.rooms_id, total_price: @booking.total_price, user_id: @booking.user_id } }
    assert_redirected_to booking_url(@booking)
  end

  test "should destroy booking" do
    assert_difference("Booking.count", -1) do
      delete booking_url(@booking)
    end

    assert_redirected_to bookings_url
  end
end
