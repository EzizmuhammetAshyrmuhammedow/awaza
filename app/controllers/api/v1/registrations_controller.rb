class Api::V1::RegistrationsController < Api::V1::BaseController
  before_action :require_authentication, only: :destroy
  allow_unauthenticated_access
  def create
    @user = User.new(user_params)
    if @user.save
      start_new_session_for @user
      render json: { message: "Register successfull", token: session.id, user: user }, status: :ok
    else
      render json: { message: "Register successfull" }, status: 400
    end
  end

  private

  def user_params
    params.expect(user: [:username, :email_address, :password, :password_confirmation, :role])
  end
end
