class Api::V1::SessionsController < Api::V1::BaseController
    before_action :require_authentication, only: :destroy
    rate_limit to: 10, within: 3.minutes, only: :create
  
    def create
      user = User.authenticate_by(params.permit(:email_address, :password, :role))
  
      if user
        user.role = params[:role] if params[:role].present?
        session = start_new_session_for(user)
  
        render json: { message: "Login successful", token: session.id, user: user }, status: :ok
      else
        render json: { error: "Invalid email or password" }, status: :unauthorized
      end
    end
  
    def destroy
      terminate_session
      render json: { message: "Logged out successfully" }, status: :ok
    end
  end
  