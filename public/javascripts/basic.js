function encodeHtml() {
	encodedHtml = escape(encodeHtml.htmlToEncode.value);
	encodedHtml = encodedHtml.replace(/\//g,"%2F");
	encodedHtml = encodedHtml.replace(/\?/g,"%3F");
	encodedHtml = encodedHtml.replace(/=/g,"%3D");
	encodedHtml = encodedHtml.replace(/&/g,"%26");
	encodedHtml = encodedHtml.replace(/@/g,"%40");
	encodeHtml.htmlEncoded.value = encodedHtml;
}

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
  
function textToHtml(text) {
  return text.gsub(' ', '&nbsp;').gsub('\n', '<br />');
}

function objectToAttributes(attributes) {
  var attributeString = "";
  var sp = "";
  for(attribute in attributes) {
    attributeString += sp + attribute + "='" + attributes[attribute] + "'";
    sp = " ";
  }
  
  return attributeString;
}