class AddStatusToContacts < ActiveRecord::Migration
  def self.up
    add_column :contacts, :status, :integer, :default=>0
  end

  def self.down
  end
end
