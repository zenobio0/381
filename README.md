curl -c cookie.txt -X POST https://three81-0inu.onrender.com/auth/login -d "username=admin&password=nok"

curl -b cookie.txt -X POST https://three81-0inu.onrender.com/api/tasks ^
 -H "Content-Type: application/json" ^
 -d "{\"title\":\"Render 醒來測試\",\"status\":\"completed\",\"priority\":\"high\"}"


curl -b cookie.txt -X DELETE https://three81-0inu.onrender.com/api/tasks/69257a934d469f6e8891afb5
