class Contact < ActiveRecord::Base
  belongs_to :user
  belongs_to :friend, :class_name=>"User", :foreign_key=>"friend_id"
  
  def self.status_message
    ["not a friend", "pending", "accepted"]
  end
    
  def pending?
    #self.status == 0
  end
  
  def accepted?
    #not self.pending?
  end
end
