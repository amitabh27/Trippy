<?php

  echo "I dont know";
  $hubVerifyToken = "EAATQVDgjwJ0BADbefQ8NonZBOgTuYhVg7ahJrhAs1VyrH7OO6oosljTb1c33jqukPgnueNsDeAUaAhsj9dnb1JaJHNvQKZCPw2ZB1OL56WkD8BDZBo0bqADSRZCxJK34B1yojMFORCVSroQqDATze4j5ZABZBTHaI41Dpqmf59s8wZDZD";
  $accessToken = "EAATQVDgjwJ0BADbefQ8NonZBOgTuYhVg7ahJrhAs1VyrH7OO6oosljTb1c33jqukPgnueNsDeAUaAhsj9dnb1JaJHNvQKZCPw2ZB1OL56WkD8BDZBo0bqADSRZCxJK34B1yojMFORCVSroQqDATze4j5ZABZBTHaI41Dpqmf59s8wZDZD";


  if ($_REQUEST['hub_verify_token'] === $hubVerifyToken) {
  echo $_REQUEST['hub_challenge'];
  exit;
  }


  $input = json_decode(file_get_contents('php://input'), true);
  file_put_contents("fb.txt",file_get_contents('php://input'));
  $senderId = $input['entry'][0]['messaging'][0]['sender']['id'];
  $messageText = $input['entry'][0]['messaging'][0]['message']['text'];

  if(!empty($messageText))
  {
	
	$answer = "I don't understand. Ask me 'hi'.";
        if($messageText == "hi") 
	{

	$answer ="Hey I am Trippy, How may I help you";
   
        }
        $response = [
        'recipient' => [ 'id' => $senderId ],
        'message' => [ 'text' => $answer ]];
           $ch = curl_init('https://graph.facebook.com/v2.6/me/messages?access_token='.$accessToken);
            
           curl_setopt($ch, CURLOPT_POST, 1);
           curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($response));
           curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
		   
		   
           curl_exec($ch);
           curl_close($ch);
  }

?>