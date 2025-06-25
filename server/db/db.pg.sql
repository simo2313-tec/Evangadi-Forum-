-- PostgreSQL schema for Evangadi Forum

CREATE TABLE IF NOT EXISTS registration (
  user_id SERIAL PRIMARY KEY,
  user_uuid VARCHAR(36) NOT NULL UNIQUE,
  user_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(254) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS profile (
  user_profile_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES registration(user_id) ON DELETE CASCADE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS question (
  question_id SERIAL PRIMARY KEY,
  question_uuid VARCHAR(36) NOT NULL UNIQUE,
  question_title VARCHAR(500) NOT NULL,
  question_description TEXT,
  tag VARCHAR(20),
  user_id INTEGER NOT NULL REFERENCES registration(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS answer (
  answer_id SERIAL PRIMARY KEY,
  answer TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES registration(user_id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES question(question_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES registration(user_id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comment (
  comment_id SERIAL PRIMARY KEY,
  comment_text TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES registration(user_id) ON DELETE CASCADE,
  answer_id INTEGER NOT NULL REFERENCES answer(answer_id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES comment(comment_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to update updated_at on comment update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_updated_at BEFORE UPDATE
ON comment FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE IF NOT EXISTS likes_dislikes (
  like_dislike_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES registration(user_id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES question(question_id) ON DELETE CASCADE,
  answer_id INTEGER REFERENCES answer(answer_id) ON DELETE CASCADE,
  comment_id INTEGER REFERENCES comment(comment_id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_question_vote UNIQUE (user_id, question_id),
  CONSTRAINT unique_user_answer_vote UNIQUE (user_id, answer_id),
  CONSTRAINT unique_user_comment_vote UNIQUE (user_id, comment_id),
  CONSTRAINT check_single_target CHECK (
    (question_id IS NOT NULL AND answer_id IS NULL AND comment_id IS NULL) OR 
    (question_id IS NULL AND answer_id IS NOT NULL AND comment_id IS NULL) OR
    (question_id IS NULL AND answer_id IS NULL AND comment_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX idx_question_user_id ON question(user_id);
CREATE INDEX idx_question_uuid ON question(question_uuid);
CREATE INDEX idx_registration_uuid ON registration(user_uuid);
CREATE INDEX idx_question_tag ON question(tag);
CREATE INDEX idx_answer_question_id ON answer(question_id);
CREATE INDEX idx_comment_answer_id ON comment(answer_id);
CREATE INDEX idx_comment_parent_comment_id ON comment(parent_comment_id);
