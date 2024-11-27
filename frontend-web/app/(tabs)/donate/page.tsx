'use client';

import React from 'react';
import Header from '@/components/Header';
import { GradientContainer } from '@/components/GradientContainer';
import styles from './donate.module.scss';

export default function DonatePage() {
  return (
    <>
      <Header variant="home" />
      <div className={styles.pageContainer}>
        <GradientContainer>
          <div className={styles.content}>
            <h1>Support Our Project</h1>
            <p className={styles.message}>
              This project is currently in development and maintained by passionate 
              developers. While we're not accepting donations at this time, your 
              support through using and sharing the platform helps us grow!
            </p>

            <div className={styles.futureFeatures}>
              <h2>Coming Soon</h2>
              <ul>
                <li>User authentication</li>
                <li>Community voting system</li>
                <li>Performance comparison charts</li>
                <li>Expanded console support</li>
              </ul>
            </div>
          </div>
        </GradientContainer>
      </div>
    </>
  );
}