class Conference < ActiveRecord::Base
  has_many :conference_users
  has_many :messages
end
