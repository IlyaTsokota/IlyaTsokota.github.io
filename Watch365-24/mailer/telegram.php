<?php

$_POST = json_decode(file_get_contents("php://input"), true);
$name = $_POST['name'];
$phone = $_POST['phone'];
$items = $_POST['items'];
$token = "1538663959:AAEuoev1zJvOguxSf_jyfn-xipp8apW2ODo";
$chat_id = "-440147685";

if(trim(!empty($name))){
	$body.='<b>Имя: '.$name.'</b>%0A';
}
if(trim(!empty($phone))){
	$body.='<b>Телефон: </b><a href="tel:+'.$phone.'">'.$phone.'</a>%0A';
}
foreach($items as $key) {
	$key = (object)$key;
	$body.= '<b>Товар: </b><u>'.$key->product.'</u><b>%0AКоличество: </b><b>'.$key->count.'</b>%0A';
}

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$body}","r");

if (!$sendToTelegram) {
	$message = 'Упс...! Что-то пошло не так (';
} else {
	$message = 'Благодарим за оформление заказа! Наш менеджер свяжется с Вами в ближайшее время :)';
}
echo json_encode(["result" => $message]);
?>