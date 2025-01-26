-- User Operations

-- Create a new user
INSERT INTO users (id, username, email, password_hash, first_name, last_name)
VALUES (UUID(), ?, ?, ?, ?, ?);

-- Get user by email
SELECT * FROM users WHERE email = ?;

-- Get user by username
SELECT * FROM users WHERE username = ?;

-- Update user profile
UPDATE users 
SET 
    first_name = ?,
    last_name = ?,
    email = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Update user password
UPDATE users 
SET 
    password_hash = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Update user preferences
UPDATE users 
SET 
    preferences = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Update last login
UPDATE users 
SET 
    last_login = CURRENT_TIMESTAMP
WHERE id = ?;

-- Deactivate user
UPDATE users 
SET 
    is_active = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;

-- Delete user and all related data (cascade will handle related tables)
DELETE FROM users WHERE id = ?;

-- Get user statistics
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(DISTINCT CASE WHEN t.is_complete = TRUE THEN t.id END) as completed_tasks,
    COUNT(DISTINCT CASE WHEN t.due_date < CURRENT_TIMESTAMP AND t.is_complete = FALSE THEN t.id END) as overdue_tasks,
    COUNT(DISTINCT c.id) as total_categories
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
LEFT JOIN task_categories tc ON t.id = tc.task_id
LEFT JOIN categories c ON u.id = c.user_id
WHERE u.id = ?
GROUP BY u.id, u.username;

INSERT INTO ilytat_organizer.users (id,name,password,email,isActive,createdAt,updatedAt) VALUES
	 ('27376268-9ddf-4b46-be5e-464dc764959a','Jj Zettler','$2a$10$kehcH6BRCtJK6jlOnaPcRON7Llt3SF75iopmIBidP4nuOUsXqXP3q','Jjzettler@gmail.com',1,'2025-01-26 07:42:55','2025-01-26 07:42:55'),
	 ('69c9a6e0-f409-4cfa-9595-332a7204aded','Nicole','$2a$10$Jr9jTspysnub6PvP5F5lcOQwE7.01nWmsfsbgDvo5U9tfvznoS41m','Nicole@awesome.com',1,'2025-01-26 07:38:05','2025-01-26 07:38:05'),
	 ('6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','Admin','Pass123','Admin@myEmail.com',1,'2025-01-22 19:04:42','2025-01-22 19:04:42'),
	 ('f285510f-352c-439a-ba60-72217430d417','Test User','$2a$10$qBT0ONE6nCmL6YNVfM6YEegsQlF/J2T02lZIdpDZgd1Cj9dNwsH2S','test@example.com',1,'2025-01-26 05:18:01','2025-01-26 05:18:01');
