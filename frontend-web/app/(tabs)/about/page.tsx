'use client';

import React from 'react';
import Header from '@/components/Header';
import { GradientContainer } from '@/components/GradientContainer';
import styles from './about.module.scss';

export default function AboutPage() {
  return (
    <>
      <Header variant="home" />
      <div className={styles.pageContainer}>
        <GradientContainer>
          <div className={styles.content}>
            <h1>About PlayStation Performance</h1>
            <section className={styles.section}>
              <h2>Our Mission</h2>
              <p>
                We aim to provide accurate performance metrics for PlayStation games, 
                helping gamers make informed decisions about their gaming experience 
                across different PlayStation consoles.
              </p>
            </section>

            <section className={styles.section}>
              <h2>How It Works</h2>
              <p>
                Our platform collects and verifies performance data including FPS 
                and resolution across different graphics modes. We rely on community 
                contributions to maintain accurate and up-to-date information.
              </p>
            </section>
          </div>
        </GradientContainer>
      </div>
    </>
  );
}