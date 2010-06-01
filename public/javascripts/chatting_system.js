var User = Class.create({
  initialize: function(options) {
    this.id = options.id;
    this.name = options.name;
    this.email = options.email;
    this.onlineStatus = options.onlineStatus;
    
    User.objects[User.objects.length] = this;
  },
  
  update: function(options) {
    this.name = options.name;
    this.onlineStatus = options.onlineStatus;
  },
  
  contactHtmlAttributes: function() {
    htmlAttributes = {
        "id":       'contact-' + this.id,
        "class":    'contact padding5 lightblue-background ' + this.onlineStatus,
        "onclick":  ''
      };
    
    return objectToAttributes(htmlAttributes);
    //return "id='contact-" + this.id + "' class='contact " + this.onlineStatus + "'";
  },
  
  contactHtml: function() {
    var html = "";
    html += "<div " + this.contactHtmlAttributes() + ">";
    html += this.name;
    html += "</div>";
    
    return html;
  }
})


User.objects = new Array;

User.findById = function(id) {
  for(var i = 0; i < User.objects.length; i++) {
    if(User.objects[i].id == id)
      return User.objects[i];
  }
  
  return false;
}