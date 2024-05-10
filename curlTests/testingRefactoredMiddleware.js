#!/usr/local/bin/fish

set root "free.local:3000/"
set login "free.local:3000/apiv1/login"
set signup "free.local:3000/apiv1/signup"
set test "free.local:3000/apiv1/test"



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
set token (curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{
      "userName":"testName",
      "password":"fourFourFour"
      }' \
    free.local:3000/apiv1/login | jq ".token"
)
set token (string replace --all '"' '' $token)



echo "Testing test route"
curl -s \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $token" \
      $test | jq
set token (string replace --all 'a' 'e' $token)

echo "Bad token"
curl -s \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $token" \
      $test | jq
