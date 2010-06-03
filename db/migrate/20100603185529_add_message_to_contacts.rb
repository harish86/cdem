class AddMessageToContacts < ActiveRecord::Migration
  def self.up
    add_column :contacts, :message, :string
  end

  def self.down
    remove_column :contacts, :message
  end
end
