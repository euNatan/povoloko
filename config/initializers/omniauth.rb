OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '900199340040322', '9e553009f8fd9160f7c4987fa440af39',
           :scope => 'email',
           :image_size => 'large',
           :secure_image_url => true
end


