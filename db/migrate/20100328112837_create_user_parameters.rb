class CreateUserParameters < ActiveRecord::Migration
  def self.up
    create_table :user_parameters do |t|
      t.integer :user_id
      t.integer :status

      t.timestamps
    end
  end

  def self.down
    drop_table :user_parameters
  end
end
