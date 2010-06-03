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

ActiveRecord::Schema.define(:version => 20100603185529) do

  create_table "conference_users", :force => true do |t|
    t.integer  "conference_id"
    t.integer  "user_id"
    t.datetime "last_read_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "recomender_id"
    t.boolean  "status",               :default => false
    t.datetime "terminated_at"
    t.integer  "terminator_id"
    t.integer  "last_message_read_id", :default => 0
  end

  create_table "conferences", :force => true do |t|
    t.integer  "initiator_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "title"
  end

  create_table "contacts", :force => true do |t|
    t.integer  "user_id"
    t.integer  "friend_id"
    t.boolean  "initiator"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "status",     :default => 0
    t.string   "message"
  end

  create_table "messages", :force => true do |t|
    t.string   "text",          :limit => 1000
    t.integer  "sender_id"
    t.integer  "conference_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_parameters", :force => true do |t|
    t.integer  "user_id"
    t.integer  "status"
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
    t.datetime "last_access_time"
    t.boolean  "logged_in",                               :default => false
  end

end
