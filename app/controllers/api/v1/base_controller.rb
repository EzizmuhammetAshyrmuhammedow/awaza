class Api::V1::BaseController < ActionController::API
  
    rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
    rescue_from StandardError, with: :handle_generic_error
  
    private
  
    def record_not_found(exception)
      render json: { error: "Record not found", details: exception.message }, status: :not_found
    end
  
    def record_invalid(exception)
      render json: { error: "Invalid record", details: exception.record.errors.full_messages }, status: :unprocessable_entity
    end
  
    def handle_generic_error(exception)
      render json: { error: "Something went wrong", details: exception.message }, status: :internal_server_error
    end
  
    def require_admin
      unless current_user&.admin?
        render json: { error: "You are not authorized to access this page." }, status: :forbidden
      end
    end
  end
  