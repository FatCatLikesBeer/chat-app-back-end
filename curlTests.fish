#!/bin/fish

set root "free.local:3000/"
set login "free.local:3000/api/login"
set signup "free.local:3000/api/signup"

echo "Just ping root"
curl -s \
    $root | jq
printf "\n"

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
printf "\n"
