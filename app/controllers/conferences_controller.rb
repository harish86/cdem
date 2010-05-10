class ConferencesController < ApplicationController
  before_filter :membership_required, :only=>:show
  
  def index
  end

  def new
    conferences = current_user.conferences
    contact = Contact.find(params[:contact_id])
    @conference = nil
    for conference in conferences
      if conference.conference_users.size == 2 and conference.conference_users.find_by_user_id(contact.friend_id)
        @conference = conference
        break
      end
    end
    
    if @conference.nil?
      @conference = current_user.initiated_conferences.create
      @conference.users << current_user
      @conference.users << contact.friend
    end
    
    redirect_to conference_path(@conference)
  end
  
  def show
    @conference = Conference.find(params[:id])
    @messages = @conference.messages.find(:all, :conditions => ["created_at >= ?", Date.today.midnight])
    @message = @conference.messages.new
  end
  
  protected
  def membership_required
    return allow_access unless current_user.conference_users.find_by_conference_id(params[:id]).nil?
    
    deny_access
  end
end