CREATE TABLE IF NOT EXISTS registration (
  user_id int not null auto_increment,
  user_name varchar(255) not null,
  user_email varchar(255) not null,
  password varchar(100) not null,
  PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS profile (
  user_profile_id int not null auto_increment,
  user_id int not null,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  PRIMARY KEY (user_profile_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id)
);

CREATE TABLE IF NOT EXISTS question (
  question_id int not null auto_increment unique,
  question_title varchar(100) not null,
  question_description text,
  tag varchar(20),
  user_id int not null,
  post_id int not null, 
  PRIMARY KEY (question_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id)
);

CREATE TABLE IF NOT EXISTS answer (
  answer_id int NOT NULL auto_increment,
  answer text NOT NULL,
  user_id int NOT NULL,
  question_id int NOT NULL,
  PRIMARY KEY (answer_id),
  FOREIGN KEY (user_id) REFERENCES registration(user_id),
  FOREIGN KEY (question_id) REFERENCES question(question_id)
);

