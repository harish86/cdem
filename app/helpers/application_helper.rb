# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def contact_to_html(contact)
    output = ""
    output += "<span class='contact-online-status'>#{contact.friend.is_online? ? '+' : '-'}</span>"
    output += "<span class='contact-name'>#{contact.friend.login}</span>"
    
    return output
  end
end
