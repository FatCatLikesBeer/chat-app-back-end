echo "Login Password too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"someName", "password":"four"}' \
    # --data "{'userName":"someName", "password":"four"}" \
    # Using single quotes INSIDE double quotes leads to fucking errors
    free.local:3000/login
printf "\n\n"

echo "Login Username too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"so", "password":"four"}' \
    free.local:3000/login
printf "\n\n"

echo "Signup Username too short "
curl -s \
    --header "Content-Type: application/json" \
    --request POST \
    --data '{"userName":"so", "password":"four"}' \
    free.local:3000/signup
printf "\n\n"
