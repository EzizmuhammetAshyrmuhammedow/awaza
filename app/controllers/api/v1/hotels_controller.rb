class Api::V1::HotelsController < Api::V1::BaseController
  before_action :set_hotel, only: [:show, :update, :destroy]

  def index
    hotels = Hotel.all
    render json: hotels
  end

  def show
    render json: @hotel, include: [:rooms, :room_types]
  end

  def create
    hotel = Hotel.new(hotel_params)
    if hotel.save
      render json: hotel, status: :created
    else
      render json: { errors: hotel.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @hotel.update(hotel_params)
      render json: @hotel
    else
      render json: { errors: @hotel.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @hotel.destroy
    head :no_content
  end

  private

  def set_hotel
    @hotel = Hotel.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Hotel not found" }, status: :not_found
  end

  def hotel_params
    params.require(:hotel).permit(:name, :location, :rating, :description, :user_id)
  end

end
