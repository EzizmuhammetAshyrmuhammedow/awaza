# frozen_string_literal: true

class HotelsComponent < ViewComponent::Base
  def initialize
    @hotels = Hotel.all
  end
end
