class Dashboard::HotelsController < ApplicationController
  before_action :set_hotel, only: %i[ show edit update destroy ]
  before_action :require_admin
  allow_unauthenticated_access only: [:show, :index]
  # GET /hotels or /hotels.json
  def index
    @hotels = Hotel.all
    @user = current_user
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

    respond_to do |format|
      if @hotel.save
        format.html { redirect_to @hotel, notice: "Hotel was successfully created." }
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
        format.html { redirect_to @hotel, notice: "Hotel was successfully updated." }
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
      format.html { redirect_to hotels_path, status: :see_other, notice: "Hotel was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hotel
      @hotel = Hotel.find(params.expect(:id))
    end

  def set_room_and_room_type
    @rooms = Room.all.where(hotel_id:  @hotel.id)
    @room_types = RoomType.all.where(hotel_id: @hotel.id)
  end
    # Only allow a list of trusted parameters through.
    def hotel_params
      params.expect(hotel: [ :name, :description, :rating, :thumbnail ])
    end
def require_admin
  if current_user.nil? || !(current_user.admin? || current_user.hotel_owner?)
    redirect_to root_path, alert: "Access Denied"
  end
end
end
