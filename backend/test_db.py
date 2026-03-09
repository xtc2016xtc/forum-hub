from app import db_session, engine
from sqlalchemy import text

try:
    # 测试连接（执行简单 SQL）
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ 数据库连接成功！返回结果：", result.scalar())

    # 测试会话操作（可选）
    db_session.execute(text("CREATE TABLE IF NOT EXISTS test (id INT, name VARCHAR(50))"))
    db_session.commit()
    print("✅ 表创建成功（或已存在）！")

except Exception as e:
    print(f"❌ 数据库操作失败：{e}")
finally:
    db_session.remove()  # 关闭会话