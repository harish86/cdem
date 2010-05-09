var Message = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.text = options.text;
    this.sender = options.sender;
  },
  
  textHtml: function() {
    return this.text.gsub('\n', '<br />');
  },
  
  senderHtml: function(thisUserId) {
    var senderHtml = "<span class='message-sender'>";
    
    if(this.sender)
      if(this.sender.id == thisUserId)
        senderHtml += "Me: ";
      else
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
  
  toHtmlWithSender: function(thisUserId) {
    var messageHtml = "<div class='message-block'>"
    messageHtml += this.senderHtml(thisUserId);
    messageHtml += this.textHtml();
    messageHtml += "</div>";
    
    return messageHtml
  }
})