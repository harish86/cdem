class UserParameter < ActiveRecord::Base
  belongs_to :user
  
  validates_pressence_of :user_id
end
