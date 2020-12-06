<?php
$_POST = json_decode(file_get_contents("php://input"), true);
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

$name = $_POST['name'];
$email = $_POST['email'];
$msg = $_POST['message'];

$title = 'Данные лоха';
$body = '<h1>Данные пользователя:</h1>';

if(trim(!empty($name))){
	$body.='<p><strong>Имя:</strong> '.$name.'</p>';
}
if(trim(!empty($email))){
	$body.='<p><strong>Почта:</strong> '.$email.'</p>';
}
if(trim(!empty($msg))){
	$body.='<p><strong>Сообщение:</strong> '.$msg.'</p>';
}

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
    $mail->isSMTP();   
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    // $mail->SMTPDebug = 2;
    // $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
    $mail->Host = 'smtp.gmail.com'; // SMTP сервера вашей почты
    $mail->Username   = 'iluha3211@gmail.com'; // Логин на почте
    $mail->Password   = '13Asuburus'; // Пароль на почте
    $mail->SMTPSecure = 'ssl';	
    $mail->Port       = 465;
	$mail->setFrom('iluha3211@gmail.com', 'PrimeOne'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('ilya.tsokota@gmail.com');  

// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;    

// Проверяем отравленность сообщения
	if(!$mail->send()) {
		$message = 'Что-то пошло не так!';
	} else {
		$message = 'Спасибо! Скоро мы с вами свяжемся';
	}

} catch (Exception $e) {
	$message = 'Что-то пошло не так!';
    // $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $message]);
