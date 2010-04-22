class MainController < ApplicationController
  before_filter :login_required
  
  def index
  end
    
  def accept_friend
  end

  def unauthorized
    render :text=>"You are not authorized"
  end
end
