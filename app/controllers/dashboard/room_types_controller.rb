class Dashboard::RoomTypesController < ApplicationController
  before_action :require_admin
  before_action :set_room_type, only: %i[ show edit update destroy ]

  # GET /room_types or /room_types.json
  def index
    @room_types = RoomType.all
    render layout: "dashboard"
  end

  # GET /room_types/1 or /room_types/1.json
  def show
  end

  def rooms_for_hotel
    @rooms = Room.where(hotel_id: params[:hotel_id])
    respond_to do |format|
      format.json { render json: @rooms.select(:id, :actual_room_id) }
    end
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
        format.html { redirect_to hotel_room_type_url(params[:room_type][:hotel_id], @room_type.id), notice: I18n.t("flash.room_created") }
        format.json { render :show, status: :created, location: @room_type }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @room_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /room_types/1 or /room_types/1.json
  def update
    Rails.logger.debug "=== Update Action Called ==="
    Rails.logger.debug "Params: #{params.inspect}"
    Rails.logger.debug "Permitted Params: #{room_type_params.inspect}"

    if @room_type.update(room_type_params)
      Rails.logger.debug "RoomType updated successfully: #{@room_type.inspect}"
      redirect_to hotel_room_types_path(@room_type.hotel_id), notice: I18n.t("flash.room_updated")
    else
      Rails.logger.debug "RoomType update failed: #{@room_type.errors.full_messages.join(', ')}"
      render :edit, status: :unprocessable_entity
    end
  end

  # DELETE /room_types/1 or /room_types/1.json
  def destroy
    @room_type.destroy!

    respond_to do |format|
      format.html { redirect_to dashboard_room_types_path, status: :see_other, notice: I18n.t("flash.room_deleted") }
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
    params.expect(room_type: [:name, :price, :features, :extra_info, :room_id, :hotel_id, :capacity, :thumbnail])
  end

  def require_admin
    if current_user.nil? || !(current_user.admin? || current_user.hotel_owner?)
      redirect_to root_path, alert: "Access Denied"
    end
  end
end
