class ConferenceUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :conference
  
  def update_last_read
    update_attribute(:last_read_at, Time.now)
  end
  
  def read_messages(options={})
    options = {:select => "id, text, sender_id, created_at", :order => "created_at", :include => [:sender]}.merge(options)
    options[:conditions_string] = [] if options[:conditions_string].nil?
    options[:conditions_string] << "(created_at >= :last_read_at) AND (NOT sender_id = :sender_id)"
    condition_values = options[:condition_values] || {}
    condition_values = condition_values.merge({ :sender_id => self.user_id, :last_read_at => self.last_read_at})
    options[:conditions] = [options[:conditions_string].join(' AND '), condition_values]
    options.delete :condition_values
    options.delete :conditions_string
    
    messages = self.conference.messages.find(:all, options)
    self.update_last_read
    return messages
  end
end
