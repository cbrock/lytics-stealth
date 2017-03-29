var sizeForm = function() {
  $('.entry-wrapper').outerHeight($(window).height());
  $('.entry-wrapper div').css({'margin-top': ($(window).height()/2)-25 + 'px'});
}

$(document).ready(function() {
  sizeForm();

  $(window).resize(function() {
    sizeForm();
  });

  stealth.init(function(){
    stealth.script.load('interface.js');
  })
});