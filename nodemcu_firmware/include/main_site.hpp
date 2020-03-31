#include <Arduino.h>

String getMainHtml(String ip, int lock)
{
  return "\
<iframe name=\"dummyframe\" id=\"dummyframe\" style=\"display: none;\"></iframe>\
<form class=\"form-horizontal\" target=\"dummyframe\" action=\"/update_config\" method=\"POST\">\
<fieldset>\
<!-- Text input-->\
<div class=\"form-group\">\
  <label class=\"col-md-4 control-label\" for=\"ip\"></label>  \
  <div class=\"col-md-4\">\
  <input id=\"ip\" name=\"ip\" type=\"text\" value=\"" + ip + "\" placeholder=\"IP Address\" class=\"form-control input-md\">\
    \
  </div>\
</div>\
\
<!-- Text input-->\
<div class=\"form-group\">\
  <label class=\"col-md-4 control-label\" for=\"ip\"></label>  \
  <div class=\"col-md-4\">\
  <input id=\"lock\" name=\"lock\" type=\"text\" value=\"" + lock + "\" placeholder=\"Lock state\" class=\"form-control input-md\">\
    \
  </div>\
</div>\
\
<!-- Button -->\
<div class=\"form-group\">\
  <label class=\"col-md-4 control-label\" for=\"submit\"></label>\
  <div class=\"col-md-4\">\
    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\">Submit</button>\
  </div>\
</div>\
\
</fieldset>\
</form>\
<form class=\"form-horizontal\" target=\"dummyframe\" action=\"/begin_registration\" method=\"POST\">\
<!-- Button -->\
<div class=\"form-group\">\
  <label class=\"col-md-4 control-label\" for=\"submit\"></label>\
  <div class=\"col-md-4\">\
    <button id=\"submit\" name=\"submit\" class=\"btn btn-primary\">Register device</button>\
  </div>\
</div>\
<form>\
";
}