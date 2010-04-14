class Conference < ActiveRecord::Base
  default_scope :include=>:conference_users
  
  has_many :conference_users
  has_many :messages
  has_many :users, :through=>:conference_users
end
