# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  include AuthenticatedSystem  
  before_filter :login_from_cookie
  protect_from_forgery # See ActionController::RequestForgeryProtection for details

  before_filter :set_access_time
  
  def set_access_time
    if logged_in?
      #current_user.update_attribute(:last_access_time, Time.now)
    end
  end
end
