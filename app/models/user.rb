class User < ActiveRecord::Base
  require 'open-uri'
  
  has_attached_file :image, :styles => { :medium => "200x200#", :thumb => "50x50#" }, :default_url => "/images/user/:style/missing.jpg"
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/
    
  def self.from_omniauth(auth)

    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.image = open(URI.parse(auth.info.image))
      user.save!
    end
    
  end
  
end
