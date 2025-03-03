class Dashboard::RoomsController < ApplicationController
  before_action :set_hotel_and_room_types, only: %i[ new edit ]
    before_action :require_admin
    before_action :set_room, only: %i[ show edit update destroy ]

    # GET /rooms or /rooms.json
    def index
      @rooms = Room.all
      render layout: "dashboard"
    end

    # GET /rooms/1 or /rooms/1.json
    def show
    end

    # GET /rooms/new
    def new
      @room = Room.new
    end

    # GET /rooms/1/edit
    def edit
    end

    # POST /rooms or /rooms.json
    def create
      @room = Room.new(room_params)

      respond_to do |format|
        if @room.save
          format.html { redirect_to @room, notice: I18n.t("flash.room_created") }
          format.json { render :show, status: :created, location: @room }
        else
          format.html { render :new, status: :unprocessable_entity }
          format.json { render json: @room.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /rooms/1 or /rooms/1.json
    def update
      respond_to do |format|
        if @room.update(room_params)
          format.html { redirect_to dashboard_rooms_path, notice: I18n.t("flash.room_updated") }
          format.json { render :index, status: :ok, location: dashboard_rooms_path }
        else
          format.html { render :edit, status: :unprocessable_entity }
          format.json { render json: @room.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /rooms/1 or /rooms/1.json
    def destroy
      @room.destroy!

      respond_to do |format|
        format.html { redirect_to dashboard_rooms_path, status: :see_other, notice: I18n.t("flash.room_deleted") }
        format.json { head :no_content }
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_room
        @room = Room.find(params.expect(:id))
      end
    def set_hotel_and_room_types
      @room_types = RoomType.all
      @hotels = Hotel.all
    end

      # Only allow a list of trusted parameters through.
      def room_params
        params.expect(room: [ :actual_room_id, :available, :hotel_id, :room_type_id, :thumbnail])
      end
end
