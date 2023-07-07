<?php
// Set the response header to indicate JSON content
header('Content-Type: application/json');

// Retrieve the request payload from the React component
$requestPayload = json_decode(file_get_contents('php://input'), true);

$id = $requestPayload['id'];
// Getting customer data
$fname = $requestPayload['fullName']; // Getting name
$cmail = $requestPayload['email']; // Getting vendor email
$contactNo = $requestPayload['contactNo']; // Getting vendor phone number
$message = $requestPayload['message'];

$subject1 = "Thank you! for submitting your inquiry.";  //Client subject
$subject2 = $fname . " has submitted a inquiry.";  


// Email body Customer will receive
$message1 = "Dear " . $fname . ",\n\n"
  . "Thank you for submitting your inquiry." . "\n"
  . "You submitted the following information:" . "\n"
  . "Full Name: " . $fname . "\n"
  . "Email: " . $cmail . "\n"
  . "Phone Number: " . $contactNo . "\n"
  . "Message: " . $message . "\n\n\n"
  . "Thank you for using our service. We look forward to seeing you soon." . "\n\n"
  . "Note: This is a system-generated email. Please don't reply to this email." . "\n\n"
  . "Best Wishes" . "\n"
  . "Your Planner";

$message2 = $fname . "has submitted a inquiry." . "\n"
  . "Submitted information:" . "\n"
  . "Full Name: " . $fname . "\n"
  . "Email: " . $cmail . "\n"
  . "Phone Number: " . $contactNo . "\n"
  . "Message: " . $message . "\n\n\n"
  . "Note: This is a system-generated email. Please don't reply to this email." . "\n\n"
  . "Best Wishes" . "\n"
  . "Your Planner";

// Email headers
$headers = "From: " . "no-reply@yourplanners.in"; // Client email, Vendor will receive
$headers .= "MIME-Version: Your Planner\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mail = "no-reply@yourplanners.in";
// PHP mailer function
$result1 = mail($cmail, $subject1, $message1, $headers); // This email sent to client address
$result2 = mail($mail, $subject2, $message2, $headers);

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

echo json_encode($response);

?>
