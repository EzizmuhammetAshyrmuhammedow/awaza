class NavBarComponent < ViewComponent::Base
  # Pass user_id optionally during initialization
  def initialize(user_id: nil)
    @provided_user_id = user_id
  end

  def before_render
    @user ||= User.find_by(id: @provided_user_id) if @provided_user_id
  end
end
