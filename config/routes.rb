Rails.application.routes.draw do
  resources :bookings
  resources :rooms
  resources :hotels do
    resources :room_types
    resources :comments, only: [:index, :create, :update, :edit, :destroy, :edit, :new] do
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
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "index#index"
  get '/search', to: 'hotels#search', as: 'search_hotels'
  get "/dashboard", to: "dashboard#index"
namespace :dashboard do
  resources :hotels
  resources :rooms
end
end
