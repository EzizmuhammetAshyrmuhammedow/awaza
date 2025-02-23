class HotelsController < ApplicationController
  before_action :set_hotel, only: %i[ show edit update destroy ]
  before_action :require_admin, only: [ :destroy, :edit, :create,  :new ]
  allow_unauthenticated_access only: [:show, :index]
  # GET /hotels or /hotels.json
  def index
    @hotels = Hotel.all
    @user = current_user

  end

  def book
    @hotel = Hotel.find(params[:id])
    @guests = params[:guests].to_i
    @rooms = params[:rooms].to_i
    @check_in = Date.parse(params[:check_in]) # Ensure this is parsed to Date
    @check_out = Date.parse(params[:check_out]) # Ensure this is parsed to Date

    # Calculate the total number of days
    @total_days = (@check_out - @check_in).to_i

    available_rooms = @hotel.rooms.includes(:room_type).select(&:available?)

    @room_combinations = find_optimal_rooms(@guests, @rooms, available_rooms)

    # Calculate total price for all selected rooms
    @total_price = @room_combinations.sum do |allocation|
      allocation[:room].room_type.price * @total_days
    end
  end



  # GET /hotels/1 or /hotels/1.json
  def show
    @user = current_user
  end

  # GET /hotels/new
  def new
    @hotel = Hotel.new
  end

  # GET /hotels/1/edit
  def edit
  end

  # POST /hotels or /hotels.json
  def create
    @hotel = Hotel.new(hotel_params)
    @hotel.user = current_user

    respond_to do |format|
      if @hotel.save
        format.html { redirect_to @hotel, notice: I18n.t("flash.hotel_created") }
        format.json { render :show, status: :created, location: @hotel }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @hotel.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /hotels/1 or /hotels/1.json
  def update
    respond_to do |format|
      if @hotel.update(hotel_params)
        format.html { redirect_to @hotel, notice: I18n.t("flash.hotel_updated") }
        format.json { render :show, status: :ok, location: @hotel }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @hotel.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /hotels/1 or /hotels/1.json
  def destroy
    @hotel.destroy!

    respond_to do |format|
      format.html { redirect_to hotels_path, status: :see_other, notice: I18n.t("flash.hotel_deleted") }
      format.json { head :no_content }
    end
  end

  def search
    @check_in = params[:check_in]
    @check_out = params[:check_out]
    @guests = params[:guests].to_i
    @rooms_count = params[:rooms].to_i

    @hotels = Hotel.with_available_rooms(@check_in, @check_out)
    logger.debug "HOTELS: #{@hotels}"

    # Optionally, filter hotels by number of guests, room types, etc.
    @rooms = @hotels.flat_map do |hotel|
      hotel.rooms.select { |room| room.room_type.capacity >= @guests && room.available? }
    end
  end

  def find_optimal_rooms(guests, room_count, available_rooms)
    return "Invalid input" if guests <= 0 || room_count <= 0

    # Sort by room capacity in descending order
    available_rooms = available_rooms.sort_by { |room| -room.room_type.capacity }

    selected_rooms = []
    remaining_guests = guests

    # Try to distribute guests across `room_count` rooms
    if available_rooms.size < room_count
      return "Not enough available rooms to match the requested room count."
    end

    available_rooms.first(room_count).each do |room|
      break if remaining_guests <= 0

      assigned_guests = [room.room_type.capacity, (remaining_guests / room_count.to_f).ceil].min
      selected_rooms << { room: room, guests: assigned_guests }
      remaining_guests -= assigned_guests
      room_count -= 1
    end

    return selected_rooms if remaining_guests.zero?

    "Not enough rooms available to accommodate all guests within the specified room count."
  end



  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hotel
      @hotel = Hotel.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def hotel_params
      params.expect(hotel: [ :user, :name, :description, :rating, :thumbnail ])
    end
def require_admin
  if current_user.nil? || !(current_user.admin? || current_user.hotel_owner?)
    redirect_to root_path, alert: "Access Denied"
  end
end
end
