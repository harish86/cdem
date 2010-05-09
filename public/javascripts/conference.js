var MessageSender = Class.create({
  initialize: function(options) {
    this.container = options.container;
    this.form = options.container.getElementsByTagName('FORM')[0];
    this.input = this.form.getElementsByTagName('TEXTAREA')[0];
    this.messageDeliverUrl = options.messageDeliverUrl;
    this.conference = options.conference;
    this.senderId = options.senderId;
    
    this.setUp();
  },
  
  setUp: function() {
    this.input.observe("keypress", this.keyPress.bindAsEventListener(this));
  },
  
  setFocus: function() {
    this.input.focus();
  },
  
  keyPress: function(event) {
    switch(event.keyCode)
    {
      case 13:
        if(event.shiftKey != true)
        {
          if(this.input.value.gsub(' ', '') != '')
          {
            if(window.opener.channel)
              window.opener.channel.instructionsManager.send(['send_message', this.input.value, this.conference.id], true);
            else
              sendRequest(this.messageDeliverUrl, {'message[text]': this.input.value}, this.conference.responseParser);
            
            var message = new Message({ text:this.input.value, sender:this.conference.getUserById(this.senderId) });
            this.conference.messageList.addMessage(message);
            this.form.reset();
          }
          event.stop();
        }
    }
  }
});

var MessageList = Class.create({
  initialize: function(options) {
    this.container = options.container;
    this.messageFetchUrl = options.messageFetchUrl;
    this.conference = options.conference;
    this.lastMessageSender = null;
    this.messages = new Array;
  },
  
  addMessage: function(message) {
    this.messages[this.messages.length] = message;
    message.id = this.messages.length;
    
    if(this.lastMessageSender == message.sender) {
      this.container.innerHTML += message.toHtmlWithoutSender();
    }
    else {
      this.container.innerHTML += message.toHtmlWithSender(this.conference.userId);
    }
    
    this.container.parentNode.scrollTop = this.container.offsetHeight;
    
    this.lastMessageSender = message.sender;
  }
});

var Conference = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.users = new Array;
    this.userId = options.userId;
    this.messageSender = new MessageSender({ container:document.getElementById(options.messageSender), messageDeliverUrl:options.messageDeliverUrl, conference:this, senderId:options.userId });
    this.messageList = new MessageList({ container:document.getElementById(options.messageList), messageFetchUrl:options.messageFetchUrl, conference:this });
    
    document.observe('dom:loaded', this.setFocus.bind(this));
  },
  
  responseParser: function(response) {
    var json = response.responseJSON;
  },

  getUserById: function(userId) {
    for(var i=0; i<this.users.length; i++) {
      var user = this.users[i];
      if(user.id == userId)
        return user;
    }
    return false;
  },
  
  setFocus: function() {
    this.messageSender.setFocus();
  },
  
  update: function(updates) {
    try{
    for(var i=0; i < updates.messages.length; i++) {
      var message = new Message({ text:updates.messages[i].text, sender:this.getUserById(updates.messages[i].senderId) });
      this.messageList.addMessage(message);
    }
    }catch(e){alert(e);}
  }
});