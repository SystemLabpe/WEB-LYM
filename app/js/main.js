"use strict";
jQuery(document).ready(function($){
  var secondaryNav = $('.lym-nav'),
  secondaryNavTopPosition = secondaryNav.offset().top,
  contentSections = $('.myl-section');

  $(window).on('scroll', function(){

    if($(window).scrollTop() > secondaryNavTopPosition ) {
      secondaryNav.addClass('is-fixed');
      setTimeout(function() {
        $('#logo-header').addClass('slide-in');
        secondaryNav.addClass('animate-children');
      }, 50);
    } else {
      secondaryNav.removeClass('is-fixed');
      setTimeout(function() {
        secondaryNav.removeClass('animate-children');
        $('#logo-header').removeClass('slide-in');
      }, 50);
    }

    updateSecondaryNavigation();
  });

  function updateSecondaryNavigation() {
    contentSections.each(function(){
      var actual = $(this),
      actualHeight = actual.height() + parseInt(actual.css('paddingTop').replace('px', '')) + parseInt(actual.css('paddingBottom').replace('px', '')),
      actualAnchor = secondaryNav.find('a[href="#'+actual.attr('id')+'"]');
      if ( ( actual.offset().top - secondaryNav.height() <= $(window).scrollTop() ) && ( actual.offset().top +  actualHeight - secondaryNav.height() > $(window).scrollTop() ) ) {
        actualAnchor.addClass('active');
      }else {
        actualAnchor.removeClass('active');
      }
    });
  }

  //on mobile - open/close secondary navigation clicking/tapping the .cd-secondary-nav-trigger
  $('.lym-nav-trigger').on('click', function(event){
    event.preventDefault();
    $(this).toggleClass('menu-is-open');
    secondaryNav.find('ul').toggleClass('is-visible');
  });

  //smooth scrolling when clicking on the secondary navigation items
  secondaryNav.find('ul a').on('click', function(event){
    event.preventDefault();
    var target= $(this.hash);
    $('body,html').animate({
      'scrollTop': target.offset().top - secondaryNav.height() + 1
    }, 400
    );
    //on mobile - close secondary navigation
    $('.lym-nav-trigger').removeClass('menu-is-open');
    secondaryNav.find('ul').removeClass('is-visible');
  });

  $('#logo-header').find('a').on('click', function(event){
   event.preventDefault();
   var target= $(this.hash);
   $('body,html').animate({
    'scrollTop': target.offset().top - secondaryNav.height() + 1
   },400);
  });

  $('#logo-home').on('click',function(){
    var target = $('#services');
    $('body,html').animate({
      'scrollTop': target.offset().top - secondaryNav.height() + 1
    },400);
  });

  //on mobile - open/close primary navigation clicking/tapping the menu icon
  $('.cd-primary-nav').on('click', function(event){
    if($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
  });

  $(".testimonials-slider").nerveSlider({
    sliderHeightAdaptable: true,
    sliderResizable: true,
    slideTransitionSpeed: 1800,
    slideTransitionEasing: "easeInOutExpo"
  });


  $(".home-slider").nerveSlider({
    sliderFullscreen: true
  });

  $("#contact-submit").on('click',function() {
    var $contact_form = $('#lym-contact');
    var fields = $contact_form.serialize();

    $.ajax({
      type: "POST",
      url: "php/contact.php",
      data: fields,
      dataType: 'json',
      success: function(response) {

        if(response.status){
          $('#contact-form input').val('');
          $('#contact-form textarea').val('');
        }

        $('#contact-response').empty().html(response.html);
      }
    });
    return false;
  });

});
