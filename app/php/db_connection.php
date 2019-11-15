<?php
$host = //HOSTNAME;
$port = //PORT;
$dbname = //DATABASE;
$user = //USERNAME;
$password = //PASSWORD;

$db_connection = pg_connect("host=" . $host . " port=" . $port . " dbname=" . $dbname . " user=" . $user . " password=" . $password);

if(!$db_connection){
    echo "Erro na conexão à BD!";
}
?>