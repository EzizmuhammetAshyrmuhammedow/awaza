class ApplicationController < ActionController::Base
  include Authentication
  helper_method :current_user  # Expose current_user to the views
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  def current_user
    @current_user ||= User.find_by(id: cookies[:user_id]) if cookies[:user_id]
  end

    def require_admin
      unless current_user.admin?
        redirect_to root_path, alert: "You are not authorized to access this page."
      end
    end
end
