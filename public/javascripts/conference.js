var ConferenceHeader = Class.create({
  initialize: function(options) {
    this.container = document.getElementById(options.conferenceHeader);
    this.conference = options.conference;
    this.setUp();
  },
  
  setUp: function() {
    this.container.innerHTML = this.innerHtml();
    this.titleContainer = document.getElementById(this.titleAttributes().id);
    this.titleInputContainer = document.getElementById(this.titleInputAttributes().id);
    this.titleInput = this.titleInputContainer.getElementsByTagName('INPUT')[0];
    
    this.updateTitle();
    
    this.hideTitleInput();
    this.showTitleContainer();
    
    this.titleContainer.observe("click", this.titleInputMode.bindAsEventListener(this));
    this.titleInput.observe("keypress", this.titleInputKeyPress.bindAsEventListener(this));
    this.titleInput.observe("blur", this.titleShowMode.bindAsEventListener(this));
  },
  
  titleAttributes: function() {
    return {id: 'conference-title-' + this.conference.id, className: 'conference-title'};
  },
  
  titleInputAttributes: function() {
    return {id: 'conference-title-input-' + this.conference.id, className: 'conference-title-input'};
  },
  
  showTitleContainer: function() {
    this.titleContainer.style.display = "inline";
  },
  
  hideTitleContainer: function() {
    this.titleContainer.style.display = "none";
  },
  
  showTitleInput: function() {
    this.titleInputContainer.style.display = "block";
  },
  
  hideTitleInput: function() {
    this.titleInputContainer.style.display = "none";
  },
  
  updateTitle: function() {
    this.titleContainer.innerHTML = this.conference.title.empty() ? "Clicke here to set title for this conference" : this.conference.title + " - [Click here to change]";
    document.title = "Conference" + (this.conference.title.empty() ? "" : " - " + this.conference.title);
  },
  
  innerHtml: function() {
    output = ""
    output += "<span id='" + this.titleAttributes().id + "' class='" + this.titleAttributes().className + "'>";
    output += "</span>";
    output += "<div id='" + this.titleInputAttributes().id + "' class='" + this.titleInputAttributes().className + "'>";
    output += "<input type='text' value='' class='lightblue-background align-center no-border'>";
    output += "</div>";
    
    return output;
  },
  
  titleInputKeyPress: function(event) {
    switch(event.keyCode)
    {
      case 13:
        if(this.conference.title != this.titleInput.value) {
          var temp = this.conference.title;
          this.conference.title = this.titleInput.value;
          this.updateTitle();
          this.conference.title = temp;
          if(window.opener.channel)
            window.opener.channel.instructionsManager.send(['set_title', this.titleInput.value, this.conference.id], false);
        }
        event.stop();
        this.titleShowMode();
      case 27:
        event.stop();
        this.titleShowMode();
    }
  },
  
  titleInputMode: function() {
    this.titleInput.value = this.conference.title;
    this.hideTitleContainer();
    this.showTitleInput();
    
    this.titleInput.focus();
    this.titleInput.select();
  },
  
  titleShowMode: function() {
    this.hideTitleInput();
    this.showTitleContainer();
  }
});

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
        
      case 27:
        event.stop();
        this.form.reset();
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
    options.conference = this;
    this.id = options.id;
    this.users = new Array;
    this.userId = options.userId;
    this.title = options.title;
    this.conferenceHeader = new ConferenceHeader(options);
    this.messageSender = new MessageSender({ container:document.getElementById(options.messageSenderContainer), messageDeliverUrl:options.messageDeliverUrl, conference:this, senderId:options.userId });
    this.messageList = new MessageList({ container:document.getElementById(options.messageListContainer), messageFetchUrl:options.messageFetchUrl, conference:this });
    
    this.setUp();
  },
  
  setUp: function() {
    document.observe('dom:loaded', this.setFocus.bind(this));
    this.messageList.container.parentNode.observe("click", this.setFocus.bind(this));
    //document.body.setAttribute("onfocus", "conference.setFocus();");
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
      
      if(updates.conferenceDetails)
      {
        if(this.title != updates.conferenceDetails.title) {
          this.title = updates.conferenceDetails.title;
          this.conferenceHeader.updateTitle();
        }
      }
    }catch(e){alert(e);}
  }
});