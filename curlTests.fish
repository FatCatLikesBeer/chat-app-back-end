#!/bin/fish

set root "free.local:3000/"
set login "free.local:3000/login"
set signup "free.local:3000/signup"

echo "Just ping root"
curl -s \
    $root
printf "\n\n"

# echo "Login Password too short "
# curl -s \
#     --header "Content-Type: application/json" \
#     --request POST \
#     --data '{"userName":"someName", "password":"four"}' \
#     # --data "{'userName":"someName", "password":"four"}" \
#     # Using single quotes INSIDE double quotes leads to fucking errors
#     $login
# printf "\n\n"
#
# echo "Login Username too short "
# curl -s \
#     --header "Content-Type: application/json" \
#     --request POST \
#     --data '{"userName":"so", "password":"four"}' \
#     $login
# printf "\n\n"
#
# echo "Login Username too short "
# curl -s \
#     --header "Content-Type: application/json" \
#     --request POST \
#     --data '{"userName":"so", "password":"four"}' \
#     $login
# printf "\n\n"
#
# echo "Signup Username too short "
# curl -s \
#     --header "Content-Type: application/json" \
#     --request POST \
#     --data '{"userName":"so", "password":"four"}' \
#     $signup
# printf "\n\n"
#
# echo "Nonexistent values "
# curl -s \
#     --header "Content-Type: application/json" \
#     --request POST \
#     $login
# printf "\n\n"

echo "/login/test Route "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"someName", "password":"four"}' \
    free.local:3000/login/test
printf "\n\n"
