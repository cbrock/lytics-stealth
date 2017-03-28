$(document).ready(function() {
  $('.entry-wrapper').outerHeight($(window).height());
  $('.entry-wrapper div').css({'margin-top': ($(window).height()/2)-25 + 'px'});

  // global click listener to hide modals
  $('.entry-wrapper').click(function(e){
    var needModalHide = $('.entry-wrapper').hasClass('show');

    if(needModalHide){
      $('.entry-wrapper').removeClass('show');
    }
  });

  $('#segment-field').click(function(e){
    e.stopPropagation();
  });

  stealth.init(function(){
    stealth.script.load('interface.js');
  })
});