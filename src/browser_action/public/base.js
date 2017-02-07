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

	// add new attributes
	$('.add-data').click(function(e){
		e.preventDefault();

		var type = $(this).attr('data-type'),
			top = $(this).offset().top,
			left = $(this).offset().left,
			width = $('.entry').outerWidth(),
			height = $('.entry').outerHeight();

		// set the hidden field
		$('#hidden-type').val(type);

		// display the form
		$('.entry-wrapper').outerHeight($(window).height());
		$('.entry').css({top: ($(window).height()/2)-(height/2), left: ($(window).width()/2)-(width/2)});
		$('.entry-wrapper').addClass('show');
	});
});