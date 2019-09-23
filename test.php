<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_PORT => "8000",
  CURLOPT_URL => "http://172.30.174.148:8000/upload",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_TIMEOUT => 0,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "{\n\t\"imgData\": \"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv_-0XVBAlj81EKQu5CIFxFfquj1IKVFh2QhDMn30gIzr4GQKJqA\",\n\t\"ID\":123,\n\t\"isUrl\": true,\n\t\"name\": \"Name\"\n}\n",
  CURLOPT_HTTPHEADER => array(
    "Accept: */*",
    "Accept-Encoding: gzip, deflate",
    "Cache-Control: no-cache",
    "Connection: keep-alive",
    "Content-Length: 171",
    "Content-Type: application/json",
    "Host: 172.30.174.148:8000",
    "cache-control: no-cache"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}