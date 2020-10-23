<?php 
	$_POST = json_decode(file_get_contents("php://input"), true);
	
	$name = $_POST['name'];
	$phone = $_POST['phone'];
	$email = $_POST['email'];
	$msg = $_POST['message'];

	require_once('phpmailer/PHPMailerAutoload.php');
	
	$mail = new PHPMailer;
	$mail->CharSet = 'utf-8';
	
	$mail->isSMTP();                                  
	$mail->Host = 'smtp.gmail.com'; 
	$mail->SMTPAuth = true;                             
	$mail->Username = 'iluha3211@gmail.com';                
	$mail->Password = '13Asuburus';                          
	$mail->SMTPSecure = 'ssl';                            
	$mail->Port = 465;                                   
	
	$mail->setFrom('iluha3211@gmail.com', 'GlobalOpt');
	$mail->addAddress('cokota3@gmail.com');   
	$mail->isHTML(true);                                  
	
	$mail->Subject = 'Данные';
	$body = '<h1>Данные пользователя:</h1>';

	if(trim(!empty($name))){
		$body.='<p><strong>Имя:</strong> '.$name.'</p>';
	}
	if(trim(!empty($phone))){
		$body.='<p><strong>Телефон:</strong> '.$phone.'</p>';
	}
	if(trim(!empty($email))){
		$body.='<p><strong>Почта:</strong> '.$email.'</p>';
	}
	if(trim(!empty($msg))){
		$body.='<p><strong>Сообщение:</strong> '.$msg.'</p>';
	}

	$mail->Body = $body;
	

	if(!$mail->send()) {
		$message = 'Ошибка';
	} else {
		$message = 'Данные отправлены';
	}
	$response = ['message' => $message];
	
	// header('Content-type: application/json');
	echo json_encode($response);
?>