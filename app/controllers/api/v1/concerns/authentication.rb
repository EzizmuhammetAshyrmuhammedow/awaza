module Authentication
    extend ActiveSupport::Concern
  
    included do
      before_action :require_authentication
      helper_method :authenticated?
    end
  
    class_methods do
      def allow_unauthenticated_access(**options)
        skip_before_action :require_authentication, **options
      end
    end
  
    private
  
    def authenticated?
      resume_session.present?
    end
  
    def require_authentication
      resume_session || request_authentication
    end
  
    def resume_session
      Current.session ||= find_session_by_cookie
    end
  
    def find_session_by_cookie
      Session.find_by(id: cookies.signed[:session_id]) if cookies.signed[:session_id]
    end
  
    def request_authentication
      render json: { error: "Authentication required" }, status: :unauthorized
    end
  
    def after_authentication_url
      root_url # Not used in API but kept for reference
    end
  
    def start_new_session_for(user)
      user.sessions.create!(user_agent: request.user_agent, ip_address: request.remote_ip).tap do |session|
        Current.session = session
        cookies.permanent[:user_id] = { value: user.id }
        cookies.signed.permanent[:session_id] = { value: session.id, httponly: true, same_site: :lax }
      end
    end
  
    def terminate_session
      Current.session&.destroy
      cookies.delete(:user_id)
      cookies.delete(:session_id)
    end
  end
  