class ChannelsController < ApplicationController
  include Channel::Reciever
  
  def create
    parse_commands(params[:instructions] || [])
    render :json => current_user.channel_response.to_json
  end
end
