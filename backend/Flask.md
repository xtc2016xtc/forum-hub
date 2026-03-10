<!-- markdownlint-disable ALL -->
# Flask 项目日志系统搭建指南
## 什么是日志系统？
### 日志就像应用的「黑匣子」，记录程序运行时的关键信息，帮助我们在出错时快速定位问题。例如：
### 用户注册失败时，日志会记录错误原因
### 数据库连接断开时，日志会发出警报
### 可以统计用户访问量、页面停留时间等行为数据
## 准备工作
###  1.创建项目目录结构

```
my_forum/
├── app/              # 项目核心目录
│   ├── __init__.py   # Flask 应用入口
│   └── utils/        # 工具目录
│       └── logger.py # 日志配置文件
├── requirements.txt  # 依赖管理文件
└── .env              # 环境变量配置
```
### 2.安装依赖包

```bash
    pip install flask python-dotenv  # 基础依赖
    pip install python-json-logger     # JSON 格式日志（可选）
```
## 日志系统搭建步骤
### Step 1：创建日志目录
#### 在 app/utils/目录下新建 logger.py文件，这是日志系统的核心配置文件。
```python

# app/utils/logger.py
import logging
from logging.handlers import RotatingFileHandler
import os

def setup_logger(app):
    # 创建日志目录（如果不存在）
    log_dir = os.path.join(os.path.dirname(__file__), '../logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # 设置日志级别（DEBUG > INFO > WARNING > ERROR > CRITICAL）
    log_level = logging.INFO  # 生产环境建议设为 WARNING
    
    # 创建日志记录器
    logger = logging.getLogger('my_forum')
    logger.setLevel(log_level)
    
    # 创建控制台处理器（开发时查看日志）
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)
    
    # 创建文件处理器（保存到文件，自动轮转）
    file_handler = RotatingFileHandler(
        filename=os.path.join(log_dir, 'forum.log'),
        maxBytes=10 * 1024 * 1024,  # 单个文件最大 10MB
        backupCount=5           # 保留 5 个备份文件
    )
    file_handler.setLevel(log_level)
    
    # 定义日志格式
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    
    # 将处理器添加到记录器
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

```
### Step 2：在 Flask 应用中初始化日志
#### 修改 app/__init__.py文件，接入日志系统：
```python
# app/__init__.py
from flask import Flask
from .utils.logger import setup_logger

app = Flask(__name__)

# 加载环境变量（.env 文件）
app.config.from_envvar('APP_SETTINGS')

# 初始化日志系统
logger = setup_logger(app)

# 测试日志输出
logger.info("论坛系统已启动！")
```
### Step 3：记录不同级别的日志
#### 在代码中通过不同方法记录日志：
```python

# 记录普通信息
logger.info("用户 %s 登录成功", user.username)

# 记录警告信息
logger.warning("数据库连接池即将耗尽")

# 记录错误信息（自动记录堆栈跟踪）
try:
    1 / 0
except ZeroDivisionError as e:
    logger.error("数学运算错误", exc_info=True)


```
### Step 4：查看日志文件
#### 运行应用后，日志会保存在 app/utils/logs/forum.log文件中。内容类似：
```
2023-10-01 14:30:00 - INFO - 论坛系统已启动！
2023-10-01 14:31:15 - WARNING - 数据库连接池剩余 5 个连接
2023-10-01 14:32:45 - ERROR - 数学运算错误
Traceback (most recent call last):
  File "app/utils/test.py", line 5, in <module>
    1 / 0
ZeroDivisionError: division by zero
```
### Step 5：进阶功能（可选）
#### 1.添加请求追踪ID
```python
# 在 before_request 钩子中生成唯一请求 ID
@app.before_request
def add_request_id():
    request_id = uuid.uuid4().hex
    logger.info("新请求开始", extra={'request_id': request_id})
```
#### 2.记录用户操作日志
```python
@app.route("/delete_post/<int:post_id>")
def delete_post(post_id):
    try:
        post = Post.query.get(post_id)
        db.session.delete(post)
        db.session.commit()
        logger.info("用户 %s 删除了帖子 %s", current_user.username, post.title)
        return "删除成功"
    except Exception as e:
        logger.error("删除帖子失败", exc_info=True)
        return "删除失败", 500
```
## 最佳实践
### 1.环境隔离
```
开发环境：LOG_LEVEL=DEBUG
生产环境：LOG_LEVEL=WARNING
```
### 2.日志轮转
```
使用 RotatingFileHandler自动清理旧日志，避免磁盘空间耗尽。
```
### 3.敏感信息过滤
```
不要在日志中记录密码、密钥等敏感数据。
```
### 4.日志分析工具
```
可将 JSON 格式日志接入 ELK（Elasticsearch + Logstash + Kibana）进行可视化分析。
```
## 常见问题排查
### Q1：日志不输出怎么办？
```
✅ 检查文件权限：chmod 755 app/utils/logs/
✅ 确认日志目录存在：ls app/utils/logs/
```
### Q2:日志看不过来怎么办？
```
✅ 使用 grep过滤关键字：grep "ERROR" forum.log
✅ 添加时间戳筛选：tail -f forum.log | grep "2023-10-01"
```
# flask日志系统进阶功能详解
## 请求追踪ID(RequestID)
### 作用：为每一个请求生成唯一ID，方便在日志系统中追踪完整请求链路(尤其在微服务架构中)
### 实现步骤：
#### 1.在logger.py中添加请求上下文
```python
# app/utils/logger.py
import logging
import os
from flask import has_request_context, request
from uuid import uuid4

class RequestContextFilter(logging.Filter):
    """自定义过滤器，自动注入请求上下文"""
    def filter(self, record):
        if has_request_context():
            record.request_id = getattr(request, 'request_id', 'unknown')
            record.remote_addr = request.remote_addr
            record.user_agent = request.user_agent.string if request.user_agent else 'unknown'
        else:
            record.request_id = 'no-request-context'
        return True

def setup_logger(app):
    # ...（基础配置保持不变）
    
    # 创建过滤器实例
    request_filter = RequestContextFilter()
    console_handler.addFilter(request_filter)
    file_handler.addFilter(request_filter)
    
    # ...（其他配置保持不变）
```
### 2.在视图函数生成请求ID
```python
# app/__init__.py
from flask import Flask, request
from .utils.logger import setup_logger

app = Flask(__name__)
logger = setup_logger(app)

@app.before_request
def add_request_id():
    """在请求开始时生成唯一 ID"""
    request.request_id = str(uuid4())

@app.route("/")
def index():
    logger.info("访问首页", extra={"page": "home"})
    return "Hello, World!"
```
### 3.日志输出效果
```log
2023-10-01 14:30:00 - INFO - [req-123abc] 192.168.1.1 - Mozilla/5.0 - 访问首页
```
## 记录用户操作日志
### 作用：跟踪用户关键操作(如登录，删除数据)，便于审计和安全分析
#### 实验步骤：
##### 1.在logger.py中添加上下文
```python
# app/utils/logger.py
# ...（原有代码）

class UserContextFilter(logging.Filter):
    """自动注入用户上下文"""
    def filter(self, record):
        if has_request_context() and hasattr(request, 'user'):
            record.user_id = request.user.id
            record.username = request.user.username
        else:
            record.user_id = 'anonymous'
            record.username = 'guest'
        return True

# 初始化时添加过滤器
user_filter = UserContextFilter()
console_handler.addFilter(user_filter)
file_handler.addFilter(user_filter)

```
##### 2.在视图函数记录操作
```python
# app/routes.py
from flask import g
from .models import User

@app.route("/delete_post/<int:post_id>")
def delete_post(post_id):
    try:
        post = Post.query.get(post_id)
        db.session.delete(post)
        db.session.commit()
        
        # 记录操作日志
        logger.info(
            "用户删除帖子",
            extra={
                "action": "delete_post",
                "post_title": post.title,
                "user_id": g.user.id,
                "user_role": g.user.role
            }
        )
        return "删除成功"
    except Exception as e:
        logger.error("删除失败", exc_info=True)
        return "删除失败", 500
```
##### 3.日志输出效果
```log
2023-10-01 14:35:00 - INFO - [req-123abc] user-456def (admin) 删除了帖子 "Python 日志教程"
```
## 日志的分级与过滤
### 作用：根据(开发、生产)控制日志详细程度
