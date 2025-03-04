class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_url, alert: "Try again later." }

  def new
  end

  def create
    user = User.authenticate_by(params.permit(:email_address, :password))

    if user
      if params[:is_employee] == "1"
        if user.role != "employee"
          redirect_to new_session_path, alert: "You are not registered as an employee."
        elsif user.employee_id != params[:employee_id]
          redirect_to new_session_path, alert: "Invalid Employee ID."
        else
          start_new_session_for user
          redirect_to after_authentication_url
        end
      else
        start_new_session_for user
        redirect_to after_authentication_url
      end
    else
      redirect_to new_session_path, alert: "Try another email address or password."
    end
  end

  def destroy
    terminate_session
    redirect_to new_session_path
  end
end
