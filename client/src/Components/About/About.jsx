import React from 'react'

import styles from './About.module.css'

function About() {
  return (
    <>
      

        <div className={styles.about_section}>
          <p className={styles.about_title}>About</p>
          <h1>Evangadi Networks Q&A</h1>
          <p className={styles.about_text}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem
            voluptate officiis beatae nobis pariatur omnis facere accusamus
            laboriosam hic, adipisci vero recilendis, recusandae sit ad, eum
            quisquam! Molestias, ut commodi!
          </p>
          <p className={styles.about_text}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem
            voluptate officiis beatae nobis pariatur omnis facere accusamus
            laboriosam hic, adipisci vero recilendis, recusandae sit ad, eum
            quisquam! Molestias, ut commodi!
          </p>
          <p className={styles.about_text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            ipsum, provident minus laudantium esse soluta maiores nostrum nisi
            sunt perferendis dolorum. Praesentium necessitatibus quia
            consectetur sunt tempora possimus eveniet voluptates?
          </p>
          <button className={styles.how_it_works_btn}>HOW IT WORKS</button>
        </div>
    

    
    </>
  );
}

export default About