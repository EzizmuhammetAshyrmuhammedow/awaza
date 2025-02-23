require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Awaza
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])
config.autoload_paths << Rails.root.join("app/components")
config.eager_load_paths << Rails.root.join("app/components")

config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # Allow all origins (or specify your Flutter app's origin, e.g., 'http://localhost:8080')
    resource '*',
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end

    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
    I18n.available_locales = [ :en, :tk ]

    # Set default locale to something other than :en
    I18n.default_locale = :tk

  end
end
