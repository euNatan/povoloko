module ApplicationHelper

  def loged
    name = ''
    id = ''
    image = ''
    if current_user
      name = current_user.name
      id = current_user.id
      image = current_user.image(:thumb)
    end
    return name, image, id 
  end
  
  def online
    User.where(online: true)
  end
  
  def online_users users
    binding.pry
  end

end
