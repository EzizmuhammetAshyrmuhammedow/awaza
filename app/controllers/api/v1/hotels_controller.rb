class Api::V1::HotelsController < Api::V1::BaseController
    def index
      hotels = Hotel.all
      render json: hotels
    end
  
    def show
      hotel = Hotel.find(params[:id])
      render json: hotel, include: [:rooms, :room_types]
    end
  end
  