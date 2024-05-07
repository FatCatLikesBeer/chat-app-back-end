#!/usr/local/bin/fish

set root "free.local:3000/"
set login "free.local:3000/apiv1/login"
set signup "free.local:3000/apiv1/signup"

echo "Just ping root"
curl -s \
    $root | jq
printf "\n"
wait

echo "Sign up with 'testName' Account"
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{
      "userName":"testName",
      "password":"fourFourFour",
      "email":"testEmail@bmail.net"
      }' \
    $signup | jq
wait
printf "\n"

echo "Login with 'testName' Account"
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{
      "userName":"testName",
      "password":"fourFourFour"
      }' \
    $login | jq
wait
printf "\n"

echo "Login with 'testName' Account"
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{
      "userName":"testName",
      "password":"fourFourFour"
      }' \
    $login | jq
wait
printf "\n"
