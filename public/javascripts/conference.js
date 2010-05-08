var Message = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.text = options.text;
    this.sender = options.sender;
  },
  
  textHtml: function() {
    return this.text.gsub('\n', '<br />');
  },
  
  senderHtml: function() {
    var senderHtml = "<span class='message-sender'>";
    
    if(this.sender)
      senderHtml += this.sender.name + ": ";
    else
      senderHtml += "Unknown: ";
    
    senderHtml += "</span>";
    
    return senderHtml;
  },
  
  toHtmlWithoutSender: function() {
    var messageHtml = "<div class='message-block'>"
    if(!this.sender)
      messageHtml += this.senderHtml();
    
    messageHtml += this.textHtml();
    messageHtml += "</div>";
    
    return messageHtml
  },
  
  toHtmlWithSender: function() {
    var messageHtml = "<div class='message-block'>"
    messageHtml += this.senderHtml();
    messageHtml += this.textHtml();
    messageHtml += "</div>";
    
    return messageHtml
  }
})

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
      this.container.innerHTML += message.toHtmlWithSender();
    }
    
    this.container.parentNode.scrollTop = this.container.offsetHeight;
    
    this.lastMessageSender = message.sender;
  }
});

var Conference = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.users = new Array;
    this.messageSender = new MessageSender({ container:document.getElementById(options.messageSender), messageDeliverUrl:options.messageDeliverUrl, conference:this, senderId:options.userId });
    this.messageList = new MessageList({ container:document.getElementById(options.messageList), messageFetchUrl:options.messageFetchUrl, rconference:this });
    
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
  }
});