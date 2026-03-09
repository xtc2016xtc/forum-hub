import logging
import sys
import os
import json
import traceback
from datetime import datetime, timezone  # 修复：添加timezone
from logging.handlers import RotatingFileHandler  # 修复：删除未使用的TimedRotatingFileHandler
from flask import request, g  # 修复：删除未使用的current_app，添加g
from sqlalchemy.orm import scoped_session, sessionmaker

# 修复：JSON格式化器（使用timezone-aware时间）
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",  # 修复：弃用utcnow()
            "level": record.levelname,
            "module": record.module,
            "line": record.lineno,
            "message": record.getMessage(),
            "request_id": getattr(record, 'request_id', None),
            "user_agent": getattr(record, 'user_agent', None),
            "path": getattr(record, 'path', None),
            "method": getattr(record, 'method', None),
            "remote_addr": getattr(record, 'remote_addr', None),
            "exception": traceback.format_exception(*record.exc_info) if record.exc_info else None,
        }
        return json.dumps(log_record, ensure_ascii=False)

# 修复：setup_logger函数（无语法错误）
def setup_logger(app):
    # 创建日志目录
    log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
    os.makedirs(log_dir, exist_ok=True)

    # 设置日志级别
    log_level = getattr(logging, os.getenv('LOG_LEVEL', 'INFO').upper())

    # 创建根日志记录器
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # 清除已有处理器
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # 控制台处理器（修复：拼写错误pastime/levelness）
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_formatter = logging.Formatter(  # 修复：行49拼写错误
        '%(asctime)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s'  # 正确拼写
    )
    console_handler.setFormatter(console_formatter)
    root_logger.addHandler(console_handler)

    # 文件处理器（JSON格式）
    file_handler = RotatingFileHandler(
        os.path.join(log_dir, 'forum_hub.log'),
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(log_level)
    file_handler.setFormatter(JsonFormatter())
    root_logger.addHandler(file_handler)

    # 请求上下文钩子（修复：用g对象保存信息）
    @app.before_request
    def before_request():
        g.request_id = os.urandom(16).hex()
        g.remote_addr = request.remote_addr
        g.method = request.method
        g.path = request.path
        g.user_agent = request.user_agent.string if request.user_agent else None

    # 错误日志钩子
    @app.errorhandler(Exception)
    def handle_exception(e):
        logger = logging.getLogger(__name__)
        logger.error(
            f"未捕获的异常: {str(e)}",
            exc_info=True,
            extra={
                'request_id': getattr(g, 'request_id', 'no-request-id'),
                'remote_addr': getattr(g, 'remote_addr', 'no-request'),
                'method': getattr(g, 'method', 'no-method'),
                'path': getattr(g, 'path', 'no-path'),
                'user_agent': getattr(g, 'user_agent', 'no-user-agent')
            }
        )
        return "服务器内部错误", 500

    # 日志方法（绑定到app）
    def log_with_context(level, msg, **kwargs):
        logger = logging.getLogger(__name__)
        extra = {
            'request_id': getattr(g, 'request_id', 'no-request-id'),
            'remote_addr': getattr(g, 'remote_addr', 'no-request'),
            'method': getattr(g, 'method', 'no-method'),
            'path': getattr(g, 'path', 'no-path'),
            'user_agent': getattr(g, 'user_agent', 'no-user-agent')
        }
        extra.update(kwargs)
        logger.log(level, msg, extra=extra)

    app.log_with_context = log_with_context  # 绑定到app实例

    # 禁用Werkzeug默认日志（避免重复）
    werkzeug_logger = logging.getLogger('werkzeug')
    werkzeug_logger.disabled = True  # 修复：语法错误

    # 记录启动日志
    logger = logging.getLogger(__name__)
    logger.info("日志系统初始化完成")