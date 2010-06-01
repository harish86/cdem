class Conference < ActiveRecord::Base
  default_scope :include=>:conference_users
  
  has_many :conference_users
  has_many :messages
  has_many :users, :through=>:conference_users
  
  def description
    output = []
    output << self.title if self.title.present?
    output << self.users.collect(&:name).join(", ")
    output << self.messages.last.text if self.messages.last
    
    return output.join(": ")
  end
end
