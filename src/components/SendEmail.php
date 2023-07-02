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
$subject1 = "Confirmation: Appointment has been booked Successfully. Appointmet ID: " . $id; // For customer confirmation

// Getting Vendor data
$vmail = $requestPayload['vemail'];  // Vendor email address
$vName = $requestPayload['vName'];
$vcompany = $requestPayload['vCompany'];
$vregister = $requestPayload['vRegister'];
$vContactNo = $requestPayload['vContactNo'];
$subject2 = "New Appointment. Appointmet ID: " . $id;

$bookingdate = $requestPayload['BookingDate'];

// Email body Customer will receive
$message = "<html><body>
  Dear $cname,<br><br>
  Thank you for booking an appointment with us. The vendor will get back to you shortly! <br>
  You submitted the following details: <br>
  <b>Appointment ID:</b> $id <br>
  Phone Number: $contactNo <br>
  Address: $address1 , $address2 , $pinCode <br>
  Vendor Name: $vName <br>
  Vendor Company Name: $vcompany <br>
  Vendor Register As: $vregister <br>
  Booking Date: <strong>$bookingdate</strong><br><br>
  The vendor will contact you within 24 hours. And this appointment will only be valid for 7 days. <br>
  Thank you for using our service. We look forward to seeing you soon.<br><br>
  <em><strong>Note:</strong> This is a system-generated email. Please don't reply to this email. For any inquiry, please contact us at +91 99323 33440.</em> <br><br>
  Best Wishes<br>
  Your Planner
  </body></html>";

// Message for Vendor will receive
$message2 = "<html><body>
  Dear $vName,<br><br>
  $cname has scheduled an appointment with you. Please get in touch with them shortly. <br>
  Customer details: <br>
  <b>Appointment ID:</b> $id <br>
  Name: $cname <br>
  Phone Number: $contactNo <br>
  Email: $cmail <br>
  Address: $address1, $address2, $pinCode <br>
  Booking Date: <strong>$bookingdate</strong> <br><br>
  Thank you for using our service. We look forward to seeing you soon. <br><br>
  <em><strong>Note:</strong> This is a system-generated email. Please don't reply to this email. For any inquiry, please contact us at +91 99323 33440.</em> <br><br>
  Best Wishes <br>
  Your Planner
  </body></html>";

// Email headers
$headers = "From: " . "no-reply@yourplanners.in"; // Client email, Vendor will receive
$headers .= "MIME-Version: Your Planner\r<br>";
$headers .= "Content-Type: text/html; charset=UTF-8\r<br>";

// PHP mailer function
$result1 = mail($vmail, $subject2, $message2, $headers); // This email sent to vendor address
$result2 = mail($cmail, $subject1, $message, $headers); // This confirmation email to client

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
