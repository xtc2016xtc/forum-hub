from flask import Flask, g
from dotenv import load_dotenv
import os
import logging  # 新增：导入logging
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from .utils.logger import setup_logger  # 修复：相对导入

# 加载.env文件
load_dotenv()

# 初始化Flask应用
app = Flask(__name__)

# 配置应用
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('PYTHON_RMYSQL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

# 初始化日志系统
setup_logger(app)

# 配置数据库
db_url = os.getenv("PYTHON_RMYSQL")
if db_url:
    engine = create_engine(db_url)
    db_session = scoped_session(sessionmaker(bind=engine))
else:
    print("⚠️ 环境变量PYTHON_RMYSQL未设置！")
    db_session = None

# 路由示例
@app.route("/")
def index():
    app.log_with_context(logging.INFO, "访问了首页", page="home", user="anonymous")
    return "Hello, Forum Hub!"

# 关闭数据库会话（修复：删除未使用的exception参数）
@app.teardown_appcontext
def shutdown_session():
    if db_session:
        db_session.remove()