<?php

// Function to send the email
function sendEmail($cfrom, $vmailto, $subject1, $subject2, $message1, $message2, $headers) {
    // $mail = new PHPMailer;
    // $mail->isSMTP();
    // $mail->Host = 'your-smtp-host';  // Replace with your SMTP host
    // $mail->SMTPAuth = true;
    // $mail->Username = 'yourplannercontact@gmail.com';  // Replace with your SMTP username
    // $mail->Password = 'your-smtp-password';  // Replace with your SMTP password
    // $mail->SMTPSecure = 'tls';
    // $mail->Port = 587;  // Replace with your SMTP port

    // $mail->setFrom('yourplanner2023@gmail.com', 'Your Planner');  // Replace with your email and name
    // $mail->addAddress($cfrom);

    // $mail->isHTML(true);
    // $mail->Subject = $subject1;
    // $mail->Body = $message1;

    // if (!$mail->send()) {
    //     return false;
    // } else {
    //     return true;
    // }
    if($cfrom!= NULL){
        mail($cfrom, $subject1, $message1, $headers);
        return true;
    }
}

// Get the POST data from the requests
$fullName = $_POST['fullName'];
$vName = $_POST['vName'];
$cfrom = $_POST['email'];
$vmailto = $_POST['vemail'];
$headers = "From: yourplannercontact@gmail.com"

// Compose the email message
$subject1 = 'Your Appointment Confirmation';
$message1 = "Dear $fullName,<br><br>";
$message1 .= "Thank you for booking an appointment. Vendor will contact you within 24hrs.<br><br>";
$message1 .= "Best regards,<br>Your Company";

$subject2 = 'New Appointment';
$message2 = "Dear $vName,<br><br>";
$message2 .= "$fullName is Booked an appointment with. Please connect them.";
$message2 .= "Best regards,<br>Your Company";
 
// Send the email
if (sendEmail($cfrom, $vmailto, $subject1, $subject2, $message1, $message2, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send the email.']);
}
?>
