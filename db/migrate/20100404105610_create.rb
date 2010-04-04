class Create < ActiveRecord::Migration
  def self.up
    add_column :users, :last_access_time, :datetime 
  end

  def self.down
  end
end
