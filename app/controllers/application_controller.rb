class ApplicationController < ActionController::Base
  include Authentication
  include HttpAcceptLanguage::AutoLocale
  helper_method :current_user # Expose current_user to the views
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  before_action :set_locale

  def current_user
    @current_user ||= User.find_by(id: cookies[:user_id]) if cookies[:user_id]
  end

  def require_admin
    unless current_user.admin?
      redirect_to root_path, alert: "You are not authorized to access this page."
    end
  end

  around_action :switch_locale # Method will execute before and after action
  # Defines selected language or gets default
  def switch_locale(&action)
    locale = params[:locale] || I18n.default_locale
    I18n.with_locale(locale, &action)
  end

  def set_locale
    I18n.locale = extract_locale || I18n.default_locale
  end

  def extract_locale
    parsed_locale = params[:locale] || http_accept_language.compatible_language_from(I18n.available_locales)
    I18n.available_locales.include?(parsed_locale&.to_sym) ? parsed_locale : nil
  end

  def default_url_options
    { locale: I18n.locale }
  end
end
