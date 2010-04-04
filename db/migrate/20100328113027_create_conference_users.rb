class CreateConferenceUsers < ActiveRecord::Migration
  def self.up
    create_table :conference_users do |t|
      t.integer :conference_id
      t.integer :user_id
      t.timestamp :last_read_at

      t.timestamps
    end
  end

  def self.down
    drop_table :conference_users
  end
end
