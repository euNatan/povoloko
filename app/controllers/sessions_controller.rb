class SessionsController < ApplicationController
  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = user.id
    user.update_attributes(online: true)
    
    redirect_to root_url
  end

  def destroy
    User.find(session[:user_id]).update_attributes(online: false)
    session[:user_id] = nil
    
    redirect_to root_url
  end
  
end
