#!/bin/fish

set root "free.local:3000/"
set login "free.local:3000/login"
set signup "free.local:3000/signup"

echo "Just ping root"
curl -s \
    $root | jq
printf "\n"

echo "Login Password too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"someName", "password":"four"}' \
    # --data "{'userName":"someName", "password":"four"}" \
    # Using single quotes INSIDE double quotes leads to fucking errors
    $login | jq
printf "\n"

echo "Login Username too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"so", "password":"four"}' \
    $login | jq
printf "\n"

echo "Login Username too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"so", "password":"four"}' \
    $login | jq
printf "\n"

echo "Signup Username too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"so", "password":"four"}' \
    $signup | jq
printf "\n"

echo "Nonexistent values "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    $login | jq
printf "\n"

echo "/login/test Route "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"someName", "password":"four"}' \
    free.local:3000/login/test | jq
printf "\n"
