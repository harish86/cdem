class UsersController < ApplicationController
  def search
    if params[:search_string]
      search_string = '%' + params[:search_string] + '%'
      @users = User.find(:all, :conditions=>["not id = ? and (login like ? or email like ?)", current_user.id, search_string, search_string])
    end
  end
  
  def add_to_contacts
    current_user.add_friend(params[:friend_id])
    
    redirect_to :controller=>"main", :action=>"index"
  end
end
