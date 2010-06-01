class UsersController < ApplicationController
  include ApplicationHelper
  
  def search
    if params[:search_string]
      search_string = '%' + params[:search_string] + '%'
      @users = User.find(:all, :conditions=>["not id = ? and (login like ? or email like ?)", current_user.id, search_string, search_string])
    end
    
    respond_to do |format|
      format.html {}
      format.js {
          render :update do |page|
            page.replace_html "search-results", :partial => "search_results", :locals => {:users => @users}
          end
        }
    end
  end
  
  def add_to_contacts
    current_user.add_friend(params[:friend_id])
    
    redirect_to :controller=>"main", :action=>"index"
  end
  
  def accept_contact
    contact = current_user.contacts.find_by_id(params[:contact_id])
    contact.accept
    
    redirect_to :controller=>"main", :action=>"index"
  end
  
  def contact_list
    user = User.find(params[:id])
    json_response = { :contacts => []}
    
    for contact in user.contacts.find_all_accepted.find(:all, :order=>"status asc, initiator asc, created_at asc")
      json_response[:contacts] << {
        :id               =>  contact.id,
        :name             =>  contact.friend.login,
        :email            =>  contact.friend.email,
        :onlineStatus     =>  contact.friend.is_online? ? 'Online' : 'Offline',
        :htmlString       =>  contact_to_html(contact)
      }
    end
    
    render :json => json_response.to_json
  end
end
