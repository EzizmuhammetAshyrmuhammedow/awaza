class RoomCardComponent < ViewComponent::Base
  def initialize(room:, form:, booking:)
    @room = room
    @form = form
    @booking = booking
  end

  private

  attr_reader :room, :form, :booking
end