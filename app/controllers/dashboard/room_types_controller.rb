class Dashboard::RoomTypesController < ApplicationController
  before_action :require_admin
  before_action :set_room_type, only: %i[ show edit update destroy ]

  # GET /room_types or /room_types.json
  def index
    @room_types = RoomType.all
  end

  # GET /room_types/1 or /room_types/1.json
  def show
  end

  # GET /room_types/new
  def new
    @room_type = RoomType.new
    @rooms = Room.all
    @hotels = Hotel.all
  end

  # GET /room_types/1/edit
  def edit
    @rooms = Room.all
    @hotels = Hotel.all
  end

  # POST /room_types or /room_types.json
  def create
    @room_type = RoomType.new(room_type_params)

    respond_to do |format|
      if @room_type.save
        format.html { redirect_to dashboard_room_type_path, notice: "Room type was successfully created." }
        format.json { render :show, status: :created, location: @room_type }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @room_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /room_types/1 or /room_types/1.json
  def update
    respond_to do |format|
      if @room_type.update(room_type_params)
        format.html { redirect_to dashboard_room_types_path, notice: "Room type was successfully updated." }
        format.json { render :show, status: :ok, location: @room_type }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @room_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /room_types/1 or /room_types/1.json
  def destroy
    @room_type.destroy!

    respond_to do |format|
      format.html { redirect_to dashboard_room_types_path, status: :see_other, notice: "Room type was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_room_type
    @room_type = RoomType.find(params[:id])
    @hotel = Hotel.find(params[:hotel_id]) if params[:hotel_id].present?
  end

  # Only allow a list of trusted parameters through.
  def room_type_params
    params.expect(room_type: [ :name, :price, :features, :extra_info, :room_id, :hotel_id, :capacity, :thumbnail ])
  end

  def require_admin
    if current_user.nil? || !(current_user.admin? || current_user.hotel_owner?)
      redirect_to root_path, alert: "Access Denied"
    end
  end
end
