CREATE TABLE IF NOT EXISTS registration (
  user_id int NOT NULL AUTO_INCREMENT,
  user_uuid varchar(36) NOT NULL UNIQUE,
  user_name varchar(50) NOT NULL,
  user_email varchar(254) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  password varchar(100) NOT NULL,
  is_verified boolean DEFAULT FALSE,
  verification_token varchar(255),
  PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS profile (
  user_profile_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL UNIQUE,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  PRIMARY KEY (user_profile_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS question (
  question_id int NOT NULL AUTO_INCREMENT,
  question_uuid varchar(36) NOT NULL UNIQUE,
  question_title varchar(500) NOT NULL,
  question_description text,
  tag varchar(20),
  user_id int NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (question_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answer (
  answer_id int NOT NULL AUTO_INCREMENT,
  answer text NOT NULL,
  user_id int NOT NULL,
  question_id int NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (answer_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
  INDEX (token)
);

-- The 'comment' table is now created BEFORE 'likes_dislikes'
CREATE TABLE IF NOT EXISTS comment (
  comment_id INT NOT NULL AUTO_INCREMENT,
  comment_text TEXT NOT NULL,
  user_id INT NOT NULL,
  answer_id INT NOT NULL,
  parent_comment_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
  FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes_dislikes (
      like_dislike_id int NOT NULL AUTO_INCREMENT,
      user_id int NOT NULL,
      question_id int NULL,
      answer_id int NULL,
      comment_id int NULL,
      is_like boolean NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (like_dislike_id),
      FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
      FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE,
      FOREIGN KEY (comment_id) REFERENCES comment(comment_id) ON DELETE CASCADE,
      CONSTRAINT unique_user_question_vote UNIQUE (user_id, question_id),
      CONSTRAINT unique_user_answer_vote UNIQUE (user_id, answer_id),
      CONSTRAINT unique_user_comment_vote UNIQUE (user_id, comment_id),
      CONSTRAINT check_single_target CHECK (
        (question_id IS NOT NULL AND answer_id IS NULL AND comment_id IS NULL) OR 
        (question_id IS NULL AND answer_id IS NOT NULL AND comment_id IS NULL) OR
        (question_id IS NULL AND answer_id IS NULL AND comment_id IS NOT NULL)
      )
);

-- Add indexes for performance optimization
CREATE INDEX idx_question_user_id ON question(user_id);
CREATE INDEX idx_question_uuid ON question(question_uuid);
CREATE INDEX idx_registration_uuid ON registration(user_uuid);
CREATE INDEX idx_question_tag ON question(tag);
CREATE INDEX idx_answer_question_id ON answer(question_id);
CREATE INDEX idx_comment_answer_id ON comment(answer_id);
CREATE INDEX idx_comment_parent_comment_id ON comment(parent_comment_id);
