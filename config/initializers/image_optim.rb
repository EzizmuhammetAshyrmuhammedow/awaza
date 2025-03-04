# config/initializers/image_optim.rb
if defined?(ImageOptim)
  Rails.application.config.assets.image_optim = {
    pngout: false,
    svgo: false,
    # Add other optimizers you wish to disable
  }
end
