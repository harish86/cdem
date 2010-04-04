class ChangeContactIdToFriendIdOfContacts < ActiveRecord::Migration
  def self.up
    rename_column :contacts, :contact_id, :friend_id
  end

  def self.down
    rename_column :contacts, :friend_id, :contact_id
  end
end
