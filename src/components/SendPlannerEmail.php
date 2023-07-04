<?php
// Set the response header to indicate JSON content
header('Content-Type: application/json');

// Retrieve the request payload from the React component
$requestPayload = json_decode(file_get_contents('php://input'), true);

$id = $requestPayload['id'];
// Getting customer data
$vfname = $requestPayload['firstName']; // Getting name
$vlname = $requestPayload['lastName'];
$vmail = $requestPayload['email']; // Getting vendor email
$contactNo = $requestPayload['contactNo']; // Getting vendor phone number
$company = $requestPayload['company'];
$register = $requestPayload['register'];
$address1 = $requestPayload['address1'];
$address2 = $requestPayload['address2'];
$pinCode = $requestPayload['pinCode'];
$subject1 = "Confirmation: Planner Profile Created. Account ID: " . $id; 


// Email body Customer will receive
$message = "Dear " . $vfname . ",\n\n"
  . "Thank you for becoming a planner." . "\n"
  . "You submitted the following details:" . "\n"
  . "Appointment ID: " . $id . "\n"
  . "Vendor First Name: " . $vfname . "\n"
  . "Vendor Last Name: " . $vlname . "\n"
  . "Vendor Company Name: " . $company . "\n"
  . "Vendor Register As: " . $register . "\n"
  . "Phone Number: " . $contactNo . "\n"
  . "Address: " . $address1 . ", " . $address2 . ", " . $pinCode . "\n\n"
  . "Your profile will be approved after checking within 24 hours. If it is not approved, feel free to contact us." . "\n"
  . "Email: yourplanner2023@gmail.com" . "\n" . "Contact no.: +91 99323 33440" . "\n"
  . "Thank you for using our service. We look forward to seeing you soon." . "\n\n"
  . "Note: This is a system-generated email. Please don't reply to this email. For any inquiry, please contact us at +91 99323 33440." . "\n\n"
  . "Best Wishes" . "\n"
  . "Your Planner";



// Email headers
$headers = "From: " . "no-reply@yourplanners.in"; // Client email, Vendor will receive
$headers .= "MIME-Version: Your Planner\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// PHP mailer function
$result1 = mail($vmail, $subject1, $message, $headers); // This email sent to vendor address

// Checking if mails sent successfully
if ($result1) {
  $response = array(
    'success' => true,
    'message' => 'Email sent successfully.',
    'id' => $id,
    'firstName' => $vfname,
    'lastName' => $vlname,
    'contactNo' => $contactNo,
    'email' => $vmail,
    'register' => $register,
    'address1' => $address1,
    'address2' => $address2,
    'pinCode' => $pinCode
            
  );
} else {
  $response = array(
    'success' => false,
    'message' => 'Failed to send the email.'
  );
}

echo json_encode($response);

?>
