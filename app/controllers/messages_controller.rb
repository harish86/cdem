class MessagesController < ApplicationController
  def create
    @conference = Conference.find(params[:conference_id])
    @message = @conference.messages.new(params[:message])
    current_user.sent_messages << @message
    
    render :json=>"{test:'test'}"
  end
end
