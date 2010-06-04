var ContactRequest = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.user = new User(options);
    this.message = options.message;
  },
  
  htmlAttributes: function() {
    var attributes = {
        "id":       'contact-request' + this.user.id,
        "class":    'contact-request border-radius-top5 font-size12 padding5'
      };
    
    return attributes;
  },
  
  innerHtml: function() {
    var html = "";
    html += "<div " + objectToHtmlProperties(this.htmlAttributes()) + ">";
    html += "<button class='close-button float-right border-radius10' onclick='contactRequestManager.close(" + this.user.id + ");'>X</button>";
    html += "<div class='bold font-size12'>Friendship requested by ";
    html += this.user.name;
    html += "</div>";
    if(this.message) {
      html += "<div class='font-size10'>";
      html += "Message: " + this.message;
      html += "</div>";
    }
      
    html += "<button class='menu-button' onclick='contactRequestManager.accept(" + this.user.id + ");'>Accept</button>";
    html += "</div>";
    
    return html;
  },
  
  htmlElement: function() {
    return document.getElementById(this.htmlAttributes().id);
  }
})

var ContactRequestManager = Class.create({
  initialize: function(options) {
    this.container = document.getElementById(options.container);
    this.contacts = new Array;
  },
  
  addContact: function(options) {
    var contact = this.findContactById(options.id);
    if(!contact) {
      try {
      contact = new ContactRequest(options);
      this.contacts[this.contacts.length] = contact;
      this.container.insert({ bottom:contact.innerHtml() });
      }catch(e){alert("In add contact: " + e)}
    }
  },
  
  removeContact: function(id) {
    var contact = this.findContactById(id);
    hideElement(contact.htmlAttributes().id);
  },
  
  notifyRequest: function(contacts) {
    var latestContactIds = new Array;
    try{
      for(var i=0; i<contacts.length; i++) {
        var contact = contacts[i];
        latestContactIds[latestContactIds.length] = contact.id;
        this.addContact(contacts[i]);
      }
    }catch(e){alert("In notifyRequest: " + e)}
    
    var contactsToBeRemoved = this.findContactsByIdNotIn(latestContactIds);
    for(var i=0; i<contactsToBeRemoved.length; i++) {
      this.removeContact(contactsToBeRemoved[i].id);
    }
  },
  
  accept: function(id) {
    channel.instructionsManager.send(['accept_contact', id], false);
    this.removeContact(id);
  },
  
  close: function(id) {
    this.removeContact(id);
  },
  
  findContactById: function(id) {
    for(var i=0; i<this.contacts.length; i++) {
      if(this.contacts[i].id == id)
        return this.contacts[i];
    }
    
    return false;
  },
  
  findContactsByIdNotIn: function(ids) {
    var c = new Array;
    for(var i=0; i<this.contacts.length; i++) {
      if(!ids.include(this.contacts[i].id))
        c[c.length] = this.contacts[i];
    }
    
    return c;
  }
})