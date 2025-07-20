CREATE DATABASE ai_agent_db;
CREATE USER 'ai_user'@'localhost' IDENTIFIED BY 'aiuser123';
GRANT ALL PRIVILEGES ON ai_agent_db.* TO 'ai_user'@'localhost';
FLUSH PRIVILEGES;