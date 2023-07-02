<?php
// Set the response header to indicate JSON content
header('Content-Type: application/json');

// Retrieve the request payload from the React component
$requestPayload = json_decode(file_get_contents('php://input'), true);

$id = $requestPayload['id'];
// Getting customer data
$vfname = $requestPayload['firstName']; // Getting customer name
$vlname = $requestPayload['lastName'];
$vmail = $requestPayload['email']; // Getting customer email
$contactNo = $requestPayload['contactNo']; // Getting customer phone number
$company = $requestPayload['company'];
$register = $requestPayload['register'];
$address1 = $requestPayload['address1'];
$address2 = $requestPayload['address2'];
$pinCode = $requestPayload['pinCode'];
$subject1 = "Confirmation: Planner Profile Created. Account ID: " . $id; // For customer confirmation


// Email body Customer will receive
$message = "<html><body>
  Dear $vfname,<br><br>
  Thank you for become a planner. <br>
  You submitted the following details: <br>
  <b>Appointment ID:</b> $id <br>
  Phone Number: $contactNo <br>
  Address: $address1 , $address2 , $pinCode <br>
  Vendor Name: $vfname $vlname <br>
  Vendor Company Name: $company <br>
  Vendor Register As: $register <br><br>
  Your profile will be approved after verification with 24 hours. If not approved, please feel free to contact us.<br> Email: yourplaneer2023@gmail.com, Contact no.: +91 99323 33440 <br>
  Thank you for using our service. We look forward to seeing you soon.<br><br>
  <em><strong>Note:</strong> This is a system-generated email. Please don't reply to this email. For any inquiry, please contact us at +91 99323 33440.</em> <br><br>
  Best Wishes<br>
  Your Planner
  </body></html>";


// Email headers
$headers = "From: " . "no-reply@yourplanners.in"; // Client email, Vendor will receive
$headers .= "MIME-Version: Your Planner\r<br>";
$headers .= "Content-Type: text/html; charset=UTF-8\r<br>";

// PHP mailer function
$result1 = mail($vmail, $subject2, $message2, $headers); // This email sent to vendor address

// Checking if mails sent successfully
if ($result1) {
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
