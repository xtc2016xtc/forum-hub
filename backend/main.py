# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# 解决跨域问题
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境替换为前端实际域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义导航数据模型
class NavItem(BaseModel):
    label: str
    href: str
    children: Optional[List["NavItem"]] = None

# 导航数据
nav_data = [
    {"label": "首页", "href": "/"},
    {
        "label": "活动",
        "href": "/products",
        "children": [
            {"label": "通知 1", "href": "/products/1"},
            {"label": "通知 2", "href": "/products/2"},
        ],
    },
    {"label": "关键", "href": "/about"},
    {"label": "内容", "href": "/contact"},
]

# 提供导航数据接口
@app.get("/api/nav", response_model=List[NavItem])
async def get_nav():
    return nav_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)