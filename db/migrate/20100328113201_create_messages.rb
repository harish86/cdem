class CreateMessages < ActiveRecord::Migration
  def self.up
    create_table :messages do |t|
      t.string :text, :limit=>1000
      t.integer :sender_id
      t.integer :conference_id

      t.timestamps
    end
  end

  def self.down
    drop_table :messages
  end
end
