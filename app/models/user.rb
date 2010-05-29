require 'digest/sha1'
class User < ActiveRecord::Base
  include Authentication
  # Virtual attribute for the unencrypted password
  attr_accessor :password
  
  has_many :contacts
  has_many :friends, :through=>:contacts, :class_name=>"User", :foreign_key=>"contact_id"
  has_one :parameter, :class_name=>"UserParameter", :foreign_key=>"user_id", :dependent=>:destroy
  has_many :initiated_conferences, :class_name=>"Conference", :foreign_key=>"initiator_id", :dependent=>:destroy
  has_many :conference_users, :dependent=>:destroy
  has_many :conferences, :through=>:conference_users
  has_many :sent_messages, :class_name=>"Message", :foreign_key=>"sender_id", :dependent=>:destroy
  
  validates_presence_of     :login, :email
  validates_presence_of     :password,                   :if => :password_required?
  validates_presence_of     :password_confirmation,      :if => :password_required?
  validates_length_of       :password, :within => 4..40, :if => :password_required?
  validates_confirmation_of :password,                   :if => :password_required?
  validates_length_of       :login,    :within => 3..40
  validates_length_of       :email,    :within => 3..100
  validates_uniqueness_of   :login, :email, :case_sensitive => false
  
  before_save :encrypt_password
  after_save :create_parameter
  
  include Channel::Responder
  
  def name
    self.login
  end
  
  def create_parameter
    unless self.parameter
      self.parameter = UserParameter.new
    end
  end
  
  def parameter!
    create_parameter unless self.parameter
    
    self.parameter
  end

  # Authenticates a user by their login name and unencrypted password.  Returns the user or nil.
  def self.authenticate(login, password)
    if login.match(Authentication.email_regex)
      u = find_by_email(login) # Login with email
    else
      u = find_by_login(login) # need to get the salt
    end
    u && u.authenticated?(password) ? u : nil
  end

  # Encrypts some data with the salt.
  def self.encrypt(password, salt)
    Digest::SHA1.hexdigest("--#{salt}--#{password}--")
  end

  # Encrypts the password with the user salt
  def encrypt(password)
    self.class.encrypt(password, salt)
  end

  def authenticated?(password)
    crypted_password == encrypt(password)
  end

  def remember_token?
    remember_token_expires_at && Time.now.utc < remember_token_expires_at 
  end

  # These create and unset the fields required for remembering users between browser closes
  def remember_me
    self.remember_token_expires_at = 2.weeks.from_now.utc
    self.remember_token            = encrypt("#{email}--#{remember_token_expires_at}")
    save(false)
  end

  def forget_me
    self.remember_token_expires_at = nil
    self.remember_token            = nil
    save(false)
  end
  
  def forgot_password
    self.password_forgotten = true
    create_pw_reset_code
  end

  def reset_password
    update_attributes(:password_reset_code => nil)
  end
  
  #--------------------------------- Custom Methods --------------------------------
  def is_online?
    return false if self.last_access_time.nil?
    self.last_access_time >= 5.seconds.ago
  end
  
  def is_friend?(friend_id)
    contact = self.contacts.find_by_friend_id(friend_id)
    if contact.nil?
      return 0
    else
      if contact.pending?
        return 1
      else
        return 2
      end
    end
  end
  
  def add_friend(friend_id)
    if friend_id != self.id
      if self.is_friend?(friend_id) == 0
        friend = User.find(friend_id)
        contact = self.contacts.new
        contact.initiator = true
        contact.friend = friend
        contact.save
      end
      
      if friend.is_friend?(self.id) == 0
        contact = friend.contacts.new
        contact.initiator = false
        contact.friend = self
        contact.save
      end
    end
  end
  
  def friendship_status_message(friend_id)
    Contact.status_message[self.is_friend?(friend_id)]
  end
  #-----------------------------------------------------------------

  protected
    def create_pw_reset_code
      self.pw_reset_code = Digest::SHA1.hexdigest("secret-#{Time.now}")
    end

    # before filter 
    def encrypt_password
      return if password.blank?
      self.salt = Digest::SHA1.hexdigest("--#{Time.now.to_s}--#{login}--") if new_record?
      self.crypted_password = encrypt(password)
    end
    
    def password_required?
      crypted_password.blank? || !password.blank?
    end
end
