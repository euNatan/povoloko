module ApplicationHelper

  def loged
    name = ''
    image = ''
    if current_user
      name = current_user.name
      image = current_user.image(:thumb)
    end
    return name, image 
  end
  
  def online
    User.where(online: true)
  end

end
