<?php
// Set the response header to indicate JSON content
header('Content-Type: application/json');

// Retrieve the request payload from the React component
$requestPayload = json_decode(file_get_contents('php://input'), true);

$id = $requestPayload['id'];
// Getting customer data
$cname = $requestPayload['fullName']; // Getting customer name
$cmail = $requestPayload['email']; // Getting customer email
$contactNo = $requestPayload['contactNo']; // Getting customer phone number
$address1 = $requestPayload['address1'];
$address2 = $requestPayload['address2'];
$pinCode = $requestPayload['pinCode'];
$subject1 = "Confirmation: Appointment has been booked Successfully. Appointmet ID:" . $id; // For customer confirmation

// Getting Vendor data
$vmail = $requestPayload['vemail'];  // Vendor email address
$vName = $requestPayload['vName'];
$vcompany = $requestPayload['vCompany'];
$vregister = $requestPayload['vRegister'];
$subject2 = "New Appointment. Appointmet ID:" . $id;

$bookingdate = $requestPayload['BookingDate'];

// Email body Customer will receive
$message = "Dear " . $cname . ",\n\n"
  . "Thank you for booking an appointment with us. Vendor will get back to you shortly!" . "\n"
  . "You submitted the following details: " . "\n" 
  . "<strong>Appointment Id: </strong>" . $id . "\n"
  . "<strong>Phone Number:</strong> " . $contactNo . "\n"
  . "<strong>Address: </strong>" . $address1 . "," . $address2 . "," . $pinCode . "\n"
  . "<strong>Vendor Name:</strong> " . $vName . "\n"
  . "<strong>Vendor Company Name:</strong> " . $vcompany . "\n"
  . "<strong>Vendor Register As:</strong> " . $vregister . "\n"
  . "<strong>Booking Date:</strong> " . $bookingdate . "\n\n"
  . "The vendor will contact you within 24 hours. And this appointment will only be valid for 7 days." ."\n"
  . "Thank you for using our service. We look forward to seeing you soon." . "\n\n"
  . "***Note: This is system generated email. Please don't reply to this email. For any enquiry please contact this:<strong>+91 99323 33440</strong> ***" . "\n\n"
  . "Best Wishes" . "\n"
  . "Your Planner";

// Message for Vendor will receive
$message2 = "Dear " . $vName . ",\n\n"
  . $cname ." has scheduled an appointment with you. Please get in touch with them shortly." . "\n"
  . "Customer details:" . "\n" 
  . "<strong>Appointment Id: </strong>" . $id . "\n"
  . "<strong>Name: </strong>" . $cname . "\n"
  . "<strong>Phone Number: </strong>" . $contactNo . "\n"
  . "<strong>Email: </strong>" . $cmail . "\n"
  . "<strong>Address: </strong>" . $address1 . "," . $address2 . "," . $pinCode . "\n"
  . "<strong>Booking Date: </strong>" . $bookingdate . "\n\n"
  . "Thank you for using our service. We look forward to seeing you soon." . "\n\n"
  . "***Note: This is system generated email. Please don't reply to this email. For any enquiry please contact this:<b>+91 99323 33440 ***" . "\n\n"
  . "Best Wishes" . "\n"
  . "Your Planner";

// Email headers
$headers = "From: " . $cmail; // Client email, Vendor will receive
$headers2 = "From: " . $vmail; // This will receive client

// PHP mailer function
$result1 = mail($vmail, $subject2, $message2, $headers); // This email sent to vendor address
$result2 = mail($cmail, $subject1, $message, $headers2); // This confirmation email to client

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
