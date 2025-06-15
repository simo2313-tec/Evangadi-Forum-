import React from 'react'

import styles from './About.module.css'

function About() {
  return (
    <>
      <div className={styles.about_section}>
        <p className={styles.about_title}>About</p>
        <h1>Evangadi Networks Q&A</h1>
        <p className={styles.about_text}>
          Evangadi Networks Q&A is a vibrant online community where individuals
          can ask questions, share knowledge, and connect with others on a wide
          range of topics. Whether you're seeking help with technology,
          education, or career advice, our platform is designed to foster
          learning and collaboration.
        </p>
        <p className={styles.about_text}>
          Our mission is to empower people by providing a supportive environment
          for asking questions and receiving answers from experienced members.
          We believe that everyone has something valuable to contribute, and
          together we can help each other grow and succeed.
        </p>
        <p className={styles.about_text}>
          Join the conversation by posting your own questions or sharing your
          expertise with others. By participating, you not only get the answers
          you need but also help build a stronger, more knowledgeable community
          for everyone.
        </p>
        <button className={styles.how_it_works_btn}>HOW IT WORKS</button>
      </div>
    </>
  );
}

export default About