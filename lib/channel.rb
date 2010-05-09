module Channel
  module Responder
    def conference_updates
      output = {}
      for conference_user in self.conference_users.find(:all, :select => "id, conference_id, last_read_at, user_id", :include => [:conference])
        conference_data = {}
        conference_data[:members] = []
        for user in conference_user.conference.users
          conference_data[:members] << {
              :id           =>  user.id,
              :name         =>  user.name,
              :onlineStatus =>  user.is_online?
            }
        end
        
        messages = conference_user.read_messages
        conference_data[:messages] = []
        for message in messages
          conference_data[:messages] << {
              :id       =>  message.id,
              :text     =>  message.text,
              :sentAt   =>  message.created_at,
              :senderId =>  message.sender.id
            }
        end
        
        output[conference_user.conference_id] = conference_data
      end
      
      return output
    end
    
    def contact_statuses
      output = []
      for contact in self.contacts.find_all_accepted.find(:all, :order=>"status asc, initiator asc, created_at asc", :include => [:friend])
        output << {
            :id               =>  contact.id,
            :name             =>  contact.friend.login,
            :email            =>  contact.friend.email,
            :onlineStatus     =>  contact.friend.is_online?
          }
      end
      
      return output
    end
    
    def channel_response
      output = {}
      output[:conferenceUpdates] = self.conference_updates
      output[:contactUpdates] = self.contact_statuses
      
      return output
    end
  end
  
  module Reciever
    def parse_commands(instructions)
      errors = []
      for instruction in instructions
        case instruction[:command]
          when "send_message":
            conference = Conference.find(instruction[:params][1])
            message = conference.messages.new(:text => instruction[:params][0])
            current_user.sent_messages << message
            
          when "set_status":
            if command[:params][1]
              conference_user = current_user.conference_users.find_by_conference_id(instruction[:params][1])
              conference_user.update_attribute(:status, instruction[:params][0])
            else
              current_user.parameter.update_attribute(:status, instruction[:params][0])
            end
            
          else
            errors << "error: Unrecognised command #{instruction[:command]}"
        end
      end
    end
  end
end