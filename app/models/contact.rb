class Contact < ActiveRecord::Base
  belongs_to :user
  belongs_to :friend, :class_name=>"User", :foreign_key=>"friend_id"
  
  def self.status_message
    ["not a friend", "pending", "accepted"]
  end
    
  def pending?
    self.status == 0
  end
  
  def accepted?
    not self.pending?
  end
  
  def accept
    if self.status == 0
      self.update_attribute(:status, 1)
      contact = Contact.find_by_user_id_and_friend_id(self.friend_id, self.user_id)
      contact.update_attribute(:status, 1)
    end
  end
end
