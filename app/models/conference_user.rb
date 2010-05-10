class ConferenceUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :conference
  belongs_to :last_message_read, :class_name=>"Message", :foreign_key=>"last_message_read_id", :dependent=>:destroy
  
  def update_last_read_and_last_message_read_id(message_id)
    update_attributes(:last_read_at => Time.now, :last_message_read_id => message_id)
  end
  
  def read_messages(options={})
    options = {:select => "id, text, sender_id, created_at", :order => "created_at", :include => [:sender]}.merge(options)
    options[:conditions_string] = [] if options[:conditions_string].nil?
    options[:conditions_string] << "(created_at >= :today_midnight) AND (id > :last_message_read_id) AND (NOT sender_id = :sender_id)"
    condition_values = options[:condition_values] || {}
    condition_values = condition_values.merge({ :sender_id => self.user_id, :today_midnight => Date.today.midnight, :last_message_read_id => self.last_message_read_id})
    options[:conditions] = [options[:conditions_string].join(' AND '), condition_values]
    options.delete :condition_values
    options.delete :conditions_string
    
    messages = self.conference.messages.find(:all, options)
    self.update_last_read_and_last_message_read_id(messages.last.id) if messages.any?
    return messages
  end
end
