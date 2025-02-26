class RegistrationsController < ApplicationController
  allow_unauthenticated_access

  def new
    @user = User.new
    render layout: "auth"
  end

  def create
    @user = User.new(user_params)
    user.role = params[:role] if params[:role].present?
    if @user.save
      start_new_session_for @user
      redirect_to root_path, notice: I18n.t("flash.auth.account_created")
    else
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email_address, :password, :password_confirmation, :role)
  end
end
