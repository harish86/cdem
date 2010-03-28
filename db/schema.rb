# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100328113201) do

  create_table "conference_users", :force => true do |t|
    t.integer  "conference_id", :limit => 11
    t.integer  "user_id",       :limit => 11
    t.datetime "last_read_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "conferences", :force => true do |t|
    t.integer  "initiator_id", :limit => 11
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "contacts", :force => true do |t|
    t.integer  "user_id",    :limit => 11
    t.integer  "contact_id", :limit => 11
    t.boolean  "initiator"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "messages", :force => true do |t|
    t.string   "text",          :limit => 1000
    t.integer  "sender_id",     :limit => 11
    t.integer  "conference_id", :limit => 11
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_parameters", :force => true do |t|
    t.integer  "user_id",    :limit => 11
    t.integer  "status",     :limit => 11
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login"
    t.string   "email"
    t.string   "crypted_password",          :limit => 40
    t.string   "salt",                      :limit => 40
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.datetime "remember_token_expires_at"
    t.string   "pw_reset_code",             :limit => 40
  end

end
