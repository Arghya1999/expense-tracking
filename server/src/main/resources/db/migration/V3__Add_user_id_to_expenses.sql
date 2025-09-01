ALTER TABLE expense ADD COLUMN user_id BIGINT;
UPDATE expense SET user_id = 1 WHERE user_id IS NULL; -- IMPORTANT: Replace 1 with an actual user_id from your 'users' table if needed.
ALTER TABLE expense ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE expense ALTER COLUMN user_id SET NOT NULL;