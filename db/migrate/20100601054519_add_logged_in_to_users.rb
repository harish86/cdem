class AddLoggedInToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :logged_in, :boolean, :default => false
  end

  def self.down
    remove_column :users, :logged_in
  end
end
