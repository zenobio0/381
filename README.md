curl -X GET https://three81-0inu.onrender.com/api/posts

# 1. GET 所有文章（Read all）
curl -X GET https://three81-0inu.onrender.com/api/posts | jq

# 2. POST 新增一篇測試文章（Create）—— 會回傳 _id
curl -X POST https://three81-0inu.onrender.com/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "老師好，這是 Demo 測試文章",
    "category": "Demo",
    "content": "<p>這是用 curl 建立的文章，用來展示 RESTful API 功能</p>",
    "description": "Demo 展示用文章"
  }'

# 3. GET 單一文章（Read one） → 把上面回傳的 _id 貼進來
curl -X GET https://three81-0inu.onrender.com/api/posts/67a9f8e1c2d3456789abc123

# 4. PUT 更新剛剛那篇（Update）
curl -X PUT https://three81-0inu.onrender.com/api/posts/67a9f8e1c2d3456789abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "老師已經看到我被更新成功了！",
    "category": "Demo 完成",
    "content": "<p>group 9</p>",
    "description": "PUT 更新成功"
  }' 

# 5. DELETE 刪除剛剛那篇（Delete）
curl -X DELETE https://three81-0inu.onrender.com/api/posts/67a9f8e1c2d3456789abc123
