class Api::V1::HotelsController < Api::V1::BaseController
  before_action :set_hotel, only: [ :show, :update, :destroy ]
  allow_unauthenticated_access

  def index
    hotels = Hotel.all
    render json: hotels, methods: [ :thumbnail_url, :photos_urls ]
  end

  def show
    render json: @hotel, methods: [ :thumbnail_url, :photos_urls ]
  end

  def create
    hotel = Hotel.new(hotel_params)
    if hotel.save
      render json: hotel, methods: [ :thumbnail_url, :photos_urls ], status: :created
    else
      render json: { errors: hotel.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @hotel.update(hotel_params)
      render json: @hotel, methods: [ :thumbnail_url, :photos_urls ]
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
