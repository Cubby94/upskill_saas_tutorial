/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  
  //Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  
  //When user clicks form submit button,
  submitBtn.click(function(event){
    //we will prevent default submission behavior
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
    //Collect credit card fields
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    //Use Stripe JS lib to check for card errors.
    var error = false;
    
    //Validate card num
    if(!Stripe.card.validateCardNumber(ccNum)){
      error = true;
      alert('The credit card number is invalid');
    }
    //Validate cvc num
    if(!Stripe.card.validateCVC(cvcNum)){
      error = true;
      alert('The CVC number is invalid');
    }
    //Validate exp date
    if(!Stripe.card.validateExpiry(expMonth, expYear)){
      error = true;
      alert('The expiration date is invalid');
    }
    
    
    if (error){
     //Don't send to Stripe if there are card errors 
     submitBtn.prop('disabled', false).val("Sign Up");
    }
    else{
      //Send to Stripe
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    return false;
  });
  
  //Stripe will return a card token
  function stripeResponseHandler(status, response){
    //Get token from response.
    var token = response.id;
    
    //Inject card token as hidden field into form
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //Submit form to rails app.
    theForm.get(0).submit();
  }
});