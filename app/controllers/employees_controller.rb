class EmployeesController < ApplicationController
  before_action :require_admin

  def index
  end
  def create
    employee = Employee.create!
    flash[:notice] = "Employee ID: #{employee.employee_id} created successfully!"
    redirect_to admin_dashboard_path
  end

  private

  def require_admin
    redirect_to root_path, alert: "Unauthorized" unless current_user&.role == "admin"
  end
end
