<?php
// Getting customer data
$mailto = $_POST['vContactNo'];  // Vendor email address
$cname = $_POST['fullName']; // Getting customer name
$fromEmail = $_POST['email']; // Getting customer email
$contactNo = $_POST['contactNo']; // Getting customer phone number
$id = $_POST['id'];
$subject2 = "Confirmation: Message was submitted successfully | HMA WebDesign"; // For customer confirmation

$vName = $_POST['vName'];

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
$headers = "From: " . $fromEmail; // Client email, Vendor will receive
$headers2 = "From: " . $mailto; // This will receive client

// PHP mailer function
$result1 = mail($mailto, $subject2, $message, $headers); // This email sent to vendor address
$result2 = mail($fromEmail, $subject2, $message2, $headers2); // This confirmation email to client

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
