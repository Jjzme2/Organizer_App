-- Task Operations

-- Create a new task
INSERT INTO ilytat_organizer.tasks (id,userId,name,description,notes,dueDate,priority)
VALUES (UUID(), ?, ?, ?, ?, ?, ?);

-- Get all tasks for a user
SELECT 
    t.*,
    GROUP_CONCAT(DISTINCT c.name) as categories,
    COUNT(DISTINCT r.id) as reminder_count
FROM ilytat_organizer.tasks t
LEFT JOIN ilytat_organizer.task_categories tc ON t.id = tc.task_id
LEFT JOIN ilytat_organizer.categories c ON tc.category_id = c.id
LEFT JOIN ilytat_organizer.reminders r ON t.id = r.task_id
WHERE t.userId = ?
GROUP BY t.id
ORDER BY t.dueDate ASC;

-- Get task by id with full details
SELECT 
    t.*,
    GROUP_CONCAT(DISTINCT c.name) as categories,
    GROUP_CONCAT(DISTINCT r.reminder_time) as reminders
FROM ilytat_organizer.tasks t
LEFT JOIN ilytat_organizer.task_categories tc ON t.id = tc.task_id
LEFT JOIN ilytat_organizer.categories c ON tc.category_id = c.id
LEFT JOIN ilytat_organizer.reminders r ON t.id = r.task_id
WHERE t.id = ?
GROUP BY t.id;

-- Update task
UPDATE ilytat_organizer.tasks 
SET 
    name = ?,
    description = ?,
    notes = ?,
    dueDate = ?,
    priority = ?,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = ? AND userId = ?;

-- Mark task as complete
UPDATE ilytat_organizer.tasks 
SET 
    isComplete = TRUE,
    status = 'completed',
    completed_at = CURRENT_TIMESTAMP,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = ? AND userId = ?;

-- Mark task as incomplete
UPDATE ilytat_organizer.tasks 
SET 
    isComplete = FALSE,
    status = 'pending',
    completed_at = NULL,
    updatedAt = CURRENT_TIMESTAMP
WHERE id = ? AND userId = ?;

-- Delete task
DELETE FROM ilytat_organizer.tasks WHERE id = ? AND userId = ?;

-- Get tasks due today
SELECT * FROM ilytat_organizer.tasks 
WHERE userId = ? 
AND DATE(dueDate) = CURDATE()
AND isComplete = FALSE
ORDER BY dueDate ASC;

-- Get overdue tasks
SELECT * FROM ilytat_organizer.tasks 
WHERE userId = ? 
AND dueDate < CURRENT_TIMESTAMP
AND isComplete = FALSE
ORDER BY dueDate ASC;

-- Get tasks by category
SELECT t.* 
FROM ilytat_organizer.tasks t
JOIN ilytat_organizer.task_categories tc ON t.id = tc.task_id
JOIN ilytat_organizer.categories c ON tc.category_id = c.id
WHERE t.userId = ? AND c.id = ?
ORDER BY t.dueDate ASC;

-- Get task statistics
SELECT 
    COUNT(*) as total_tasks,
    SUM(CASE WHEN isComplete = TRUE THEN 1 ELSE 0 END) as completed_tasks,
    SUM(CASE WHEN dueDate < CURRENT_TIMESTAMP AND isComplete = FALSE THEN 1 ELSE 0 END) as overdue_tasks,
    SUM(CASE WHEN priority = 'high' AND isComplete = FALSE THEN 1 ELSE 0 END) as high_priority_tasks
FROM ilytat_organizer.tasks
WHERE userId = ?;

-- Add task to category
INSERT INTO ilytat_organizer.task_categories (task_id, category_id)
VALUES (?, ?);

-- Remove task from category
DELETE FROM ilytat_organizer.task_categories 
WHERE task_id = ? AND category_id = ?;

-- Add reminder for task
INSERT INTO ilytat_organizer.reminders (id, task_id, reminder_time)
VALUES (UUID(), ?, ?);

INSERT INTO ilytat_organizer.tasks (id,name,description,isComplete,dueDate,notes,isActive,userId,createdAt,updatedAt) VALUES
	 ('1a444713-44ce-445b-ad2f-5e0d978e7364','Test Task 2','This is a test task created at 2025-01-26 00:00:17',1,'2025-02-02 06:00:00',NULL,1,'f285510f-352c-439a-ba60-72217430d417','2025-01-26 06:00:17','2025-01-26 07:18:54'),
	 ('26149c2c-4050-42ba-ba61-e072422d2153','Retrieve a Single Task from the Database','Retrieve a Single task or user from the database',1,'2024-01-31 00:00:00',NULL,1,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-22 13:42:04','2025-01-22 13:42:04'),
	 ('38b875b2-9ecd-4ffa-92df-508a6fe48093','Integrate email/Text','Integrate email and text for users, to notify them of upcoming events.',0,'2025-03-10 06:46:00','"Consider how best to implement this"',1,'27376268-9ddf-4b46-be5e-464dc764959a','2025-01-26 07:47:08','2025-01-26 07:47:08'),
	 ('395c53f7-5377-4dda-a7ad-0c6e46713a5e','Retrieve data from database','Retrieve a Task from the database',1,'2024-01-31 00:00:00',NULL,1,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-22 13:31:24','2025-01-22 13:31:24'),
	 ('4b72c54d-118e-4d1b-a97d-2ff5fe043ed7','Test Task','This is a test task',1,'2025-02-01 23:52:27',NULL,1,'f285510f-352c-439a-ba60-72217430d417','2025-01-26 05:52:28','2025-01-26 07:18:52'),
	 ('57f7b3ac-a091-4428-a05a-ea9128848177','Add a route that will get all of a users tasks','We will access this using the route "Users/:Id/tasks"',0,'2024-01-31 00:00:00',NULL,1,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-22 14:05:32','2025-01-22 14:05:32'),
	 ('6413eb3e-9945-4321-915e-10160ffde85a','Example','Used for demonstration purposes.',1,'2000-01-01 00:00:00','"[\\"This is the first note.\\", \\"This is the second note.\\"]"',0,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-25 14:58:00','2025-01-25 14:58:00'),
	 ('9740713c-29b6-45ca-a65b-a5dd10dc3c6a','Retrieve a User from Database','Retrieve a User from the database',1,'2024-01-31 00:00:00','',1,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-22 13:41:05','2025-01-22 13:41:05'),
	 ('a3afcac5-b89b-4931-bbb3-39e8c01dc352','Create a new task from the client','Create a task from the client',1,'2025-01-31 07:20:00',NULL,1,'f285510f-352c-439a-ba60-72217430d417','2025-01-26 07:14:41','2025-01-26 07:18:51'),
	 ('c4912c5f-1e7e-4b84-a6fe-b0d564ba46b2','everything','always',0,'2025-01-27 07:35:00',NULL,1,'f285510f-352c-439a-ba60-72217430d417','2025-01-26 07:35:49','2025-01-26 07:35:49');
INSERT INTO ilytat_organizer.tasks (id,name,description,isComplete,dueDate,notes,isActive,userId,createdAt,updatedAt) VALUES
	 ('c84d63cc-1424-4ddf-ac3a-01afab416cbd','Create new functions for versatility','Create a function to get only active tasks by default. Optionally, the API should send all the items, including inactive.',0,'2024-01-31 00:00:00','["This might be done using a route ''api/tasks/active''"]',1,'6bcb949f-46ba-48f8-8b3f-21a6a7dde1ab','2025-01-22 14:05:32','2025-01-22 14:05:32'),
	 ('d6e5e83b-6f33-4b70-99fe-b35b67f6835a','create a new task','jj told me to',1,'2025-01-26 07:45:00',NULL,1,'69c9a6e0-f409-4cfa-9595-332a7204aded','2025-01-26 07:38:37','2025-01-26 07:38:42');
