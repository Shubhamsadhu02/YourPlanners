<?php
// Retrieve the request payload from the React component
$requestPayload = json_decode(file_get_contents('php://input'), true);

// Getting customer data
$vmail = $requestPayload['vContactNo'];  // Vendor email address
$cname = $requestPayload['fullName']; // Getting customer name
$cmail = $requestPayload['email']; // Getting customer email
$contactNo = $requestPayload['contactNo']; // Getting customer phone number
$id = $requestPayload['id'];
$subject2 = "Confirmation: Message was submitted successfully | HMA WebDesign"; // For customer confirmation

$vName = $requestPayload['vName'];

// Email body Customer will receive
$message = "Dear " . $cname . ",\n"
  ."Thank you for booking an appointment with us. Vendor will get back to you shortly!" . "\n"
  ."You submitted the following details: " . "\n" 
  ."Appointment Id: " . $id . "\n"
  . "Phone Number: " . $contactNo ;

// Message for Vendor will receive
$message2 = "Dear " . $vName . ",\n"
  ."Thank you for booking an appointment with us. Vendor will get back to you shortly!" . "\n"
  ."You submitted the following details: " . "\n" 
  ."Appointment Id: " . $id . "\n"
  . "Phone Number: " . $contactNo ;

// Email headers
$headers = "From: " . $cmail; // Client email, Vendor will receive
$headers2 = "From: " . $vmail; // This will receive client

// PHP mailer function
$result1 = mail($vmail, $subject2, $message, $headers); // This email sent to vendor address
$result2 = mail($cmail, $subject2, $message2, $headers2); // This confirmation email to client

// Checking if mails sent successfully
if ($result1 && $result2) {
  $response = array(
    'success' => true,
    'message' => 'Email sent successfully.'
  );
} else {
  $response = array(
    'success' => false,
    'message' => 'Failed to send the email.'
  );
}

// Set the response header to indicate JSON content
header('Content-Type: application/json');

echo json_encode($response);
?>
