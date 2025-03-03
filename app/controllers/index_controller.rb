class IndexController < ApplicationController
  allow_unauthenticated_access
  def index
    @hotels = Hotel.all
    @room_types = RoomType.all
  end
end
