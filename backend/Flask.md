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
