class BookingsController < ApplicationController
  before_action :set_booking, only: %i[ show edit update destroy ]

  # GET /bookings or /bookings.json
  def index
    @bookings = Booking.all
  end

  # GET /bookings/1 or /bookings/1.json
  def show
  end

  # GET /bookings/new
  def new
    @booking = Booking.new
    @rooms = Room.all
  end

  # GET /bookings/1/edit
  def edit
  end

  # POST /bookings or /bookings.json
  def create
    ActiveRecord::Base.transaction do
      @booking = Booking.new(booking_params)
      @booking.user = current_user

      # Assign rooms to the booking
      room_id = params[:room_id]

      if @booking.save
        redirect_to bookings_path, notice: "Booking successfully created!"
      else
        redirect_to root_path, alert: "Booking failed: #{@booking.errors.full_messages.join(", ")}"
      end
    end
  end

  # PATCH/PUT /bookings/1 or /bookings/1.json
  def update
    respond_to do |format|
      if @booking.update(booking_params)
        format.html { redirect_to @booking, notice: "Booking was successfully updated." }
        format.json { render :show, status: :ok, location: @booking }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @booking.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bookings/1 or /bookings/1.json
  def destroy
    @booking.destroy!

    respond_to do |format|
      format.html { redirect_to bookings_path, status: :see_other, notice: "Booking was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_booking
    @booking = Booking.find(params.expect(:id))
  end

  # Only allow a list of trusted parameters through.
  def booking_params
    params.require(:booking).permit(
      :check_in,
      :check_out,
      :guests,
      :hotel_id,
      :total_price,
      :is_cancelled,
      booking_rooms_attributes: [:room_id]
    )
  end


end