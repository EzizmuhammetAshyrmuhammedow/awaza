Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :hotels
      resource :session
      resource :registration
    end
  end

  resources :bookings
  resources :rooms
  resources :hotels do
    resources :room_types, module: :hotels do
      collection do
        get :rooms_for_hotel
      end
    end
    resources :comments, only: [ :index, :create, :update, :edit, :destroy, :edit, :new ] do
      member do
        post :like
        post :dislike
        post :unlike
        post :undislike
      end
    end
    member do
      get :book
    end
  end

  resource :session
  resources :passwords, param: :token
  resource :registration, only: %i[new create]

  # Health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # PWA routes (commented out)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Localized root route
  root "index#index"

  # Search route
  get "/search", to: "hotels#search", as: "search_hotels"

  # Dashboard routes
  get "/dashboard", to: "dashboard#index"
  namespace :dashboard do
    resources :hotels
    resources :rooms
    resources :room_types do
      collection do
        get :rooms_for_hotel
      end
    end
    resources :employees, only: [ :create, :index ]
  end
  get "/hotels_lazy", to: "hotels#lazy"
end
