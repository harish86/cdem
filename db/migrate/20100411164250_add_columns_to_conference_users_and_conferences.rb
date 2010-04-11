class AddColumnsToConferenceUsersAndConferences < ActiveRecord::Migration
  def self.up
    add_column :conference_users, :recomender_id, :integer
    add_column :conference_users, :status, :boolean, :default=>false
    add_column :conference_users, :terminated_at, :datetime
    add_column :conference_users, :terminator_id, :integer
    
    add_column :conferences, :title, :string
  end

  def self.down
    remove_columns :conference_users, :recomender_id, :status, :terminated_at, :terminator_id
    remove_column :conferences, :title
  end
end
