class NavBarComponent < ViewComponent::Base
  # Pass user_id optionally during initialization
  def initialize(user_id: nil)
    @provided_user_id = user_id
  end

  # before_render is called once the view context (including cookies) is available
  def before_render
    if cookies[:user_id]
      effective_user_id = @provided_user_id || cookies[:user_id]
      @user = User.find_by(id: effective_user_id)
    end
  end
end
