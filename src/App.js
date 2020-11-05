import './App.css';
import axios from 'axios'
import { useState } from 'react';

function App() {
  var paymentMethodId;
  var paymentIntentId;
  var clientKey;

  const cardInformation = {
    card_number: 4343434343434345,
    brand: 'Visa',
    cvc: '123',
    expiration_month: '03',
    expiratation_year: '25'
  }


  function getPaymentMethod(){
        fetch("https://api.paymongo.com/v1/payment_methods", {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Basic c2tfdGVzdF82eFhBMTRaajg0RUx5YWNKeEI5WGt5bTk6"
        },
        "body": "{\"data\":{\"attributes\":{\"details\":{\"card_number\":\"4343434343434345\",\"exp_month\":12,\"exp_year\":24,\"cvc\":\"123\"},\"type\":\"card\"}}}"
      })
      .then(response => response.json())
      .then((res) => {
        paymentMethodId = res.data.id;
        console.log(paymentMethodId)
      })
      .catch(err => {
        console.error(err);
      });
  }


  function getPaymentIntent(){
    fetch("https://api.paymongo.com/v1/payment_intents", {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Basic c2tfdGVzdF82eFhBMTRaajg0RUx5YWNKeEI5WGt5bTk6"
    },
    "body": "{\"data\":{\"attributes\":{\"amount\":10000,\"payment_method_allowed\":[\"card\"],\"payment_method_options\":{\"card\":{\"request_three_d_secure\":\"any\"}},\"currency\":\"PHP\"}}}"
  })
  .then(response => response.json())
      .then((res) => {
        paymentIntentId = res.data.id;
        clientKey = res.data.attributes.client_key;
        console.log(clientKey)
      })
  .catch(err => {
    console.error(err);
  });
  
  }

  function processPayment(){
    alert('Fuck')
    console.log('fuck')
    axios.post(
      'https://api.paymongo.com/v1/payment_intents/' + paymentIntentId + '/attach',
      {
        data: {
          attributes: {
            client_key: clientKey,
            payment_method: paymentMethodId
          }
        }
      },
      {
        headers: {
          // Base64 encoded public PayMongo API key.
          Authorization: `Basic ${window.btoa('sk_test_6xXA14Zj84ELyacJxB9Xkym9')}`
        }
        }
    ).then(function(response) {
      var paymentIntent = response.data.data;
      var paymentIntentStatus = paymentIntent.attributes.status;
      
      if (paymentIntentStatus === 'awaiting_next_action') {
        console.log('await next action')
        // Render your modal for 3D Secure Authentication since next_action has a value. You can access the next action via paymentIntent.attributes.next_action.
      } else if (paymentIntentStatus === 'succeeded') {
        console.log('sucess')
        // You already received your customer's payment. You can show a success message from this condition.
      } else if(paymentIntentStatus === 'awaiting_payment_method') {
        console.log('await method')
        // The PaymentIntent encountered a processing error. You can refer to paymentIntent.attributes.last_payment_error to check the error and render the appropriate error message.
      }  else if (paymentIntentStatus === 'processing'){
        console.log('loading')
        // You need to requery the PaymentIntent after a second or two. This is a transitory status and should resolve to `succeeded` or `awaiting_payment_method` quickly.
      }
    })
  }
  
  
  
  useState(() => {
    getPaymentIntent();
    getPaymentMethod();
  },[])






  return (
    <div className="App">
        <button onClick={processPayment}>Process Payment</button>
    </div>
  );
}

export default App;
