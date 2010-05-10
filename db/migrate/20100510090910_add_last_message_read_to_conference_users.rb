class AddLastMessageReadToConferenceUsers < ActiveRecord::Migration
  def self.up
    add_column :conference_users, :last_message_read_id, :integer, :default => 0
  end

  def self.down
    remove_column :conference_users, :last_message_read_id
  end
end
