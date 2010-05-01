function inspect(event) {
  var s = '';
  for(var i in event)
  {
    s += i + "; ";
  }
  alert(s);
}

function objectToParams(parameters) {
  var params = seperator = "";
  
  for(parameter in parameters) {
    params += seperator + parameter + "=" + encodeURIComponent(parameters[parameter]);
    seperator = "&";
  }
  
  return params;
}

function sendRequest(url, parameters, responseParser) {
  if(authenticityToken)
    parameters.authenticity_token = authenticityToken;
  
  new Ajax.Request(url, {
                          asynchronous: true,
                          evalScripts: true,
                          parameters: objectToParams(parameters),
                          onComplete: function(response){
                            responseParser(response);
                          }
                  });
}

var User = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.name = options.name;
  }
})

var Message = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.text = options.text;
    this.sender = options.sender;
  },
  
  textHtml: function() {
    return this.text.gsub(' ', '&nbsp;').gsub('\n', '<br />');
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
    this.input.observe("keypress", this.keyPress.bindAsEventListener(this))
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
    this.users = new Array;
    this.messageSender = new MessageSender({ container:document.getElementById(options.messageSender), messageDeliverUrl:options.messageDeliverUrl, conference:this, senderId:options.userId });
    this.messageList = new MessageList({ container:document.getElementById(options.messageList), messageFetchUrl:options.messageFetchUrl, rconference:this });
  },
  
  responseParser: function(response) {
    var json = response.responseJSON;
    //inspect(json);
  },

  getUserById: function(userId) {
    for(var i=0; i<this.users.length; i++) {
      var user = this.users[i];
      if(user.id == userId)
        return user;
    }
    return false;
  }
});