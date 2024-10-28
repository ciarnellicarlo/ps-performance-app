'use client';

import { useState } from 'react';
import { ConsoleType } from '@/types/game';
import { submitPerformanceData } from '@/services/api';
import { PerformanceSubmission } from '@/types/game'
import styles from '../styles/SubmitForm.module.scss';

interface SubmitFormProps {
  gameId: string;
  consoleName: ConsoleType;
  onSubmit: (data: PerformanceSubmission) => void;  // Now accepts the submission data
}

export const SubmitForm = ({ gameId, consoleName, onSubmit }: SubmitFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasGraphicsSettings, setHasGraphicsSettings] = useState<boolean>(false);

  const [performanceFPS, setPerformanceFPS] = useState<string>('30');
  const [performanceResolution, setPerformanceResolution] = useState<string>('1080p');
  
  const [fidelityFPS, setFidelityFPS] = useState<string>('30');
  const [fidelityResolution, setFidelityResolution] = useState<string>('1080p');

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
  
      const submissionData: PerformanceSubmission = {
        gameId,
        consoleType: consoleName,
        consolePerformance: {
          hasGraphicsSettings,
          performanceMode: {
            fps: parseInt(performanceFPS),
            resolution: performanceResolution
          },
          ...(hasGraphicsSettings && {
            fidelityMode: {
              fps: parseInt(fidelityFPS),
              resolution: fidelityResolution
            }
          }),
          ...(!hasGraphicsSettings && {
            standardMode: {
              fps: parseInt(performanceFPS),
              resolution: performanceResolution
            }
          })
        }
      };
  
      await submitPerformanceData(submissionData);
      onSubmit(submissionData);
    } catch (error) {
      console.error('Failed to submit performance data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Submit Missing Information</h2>
      <h3 className={styles.subtitle}>{consoleName}</h3>

      <div className={styles.field}>
        <label>Available Graphics Mode</label>
        <select 
          value={hasGraphicsSettings ? 'yes' : 'no'}
          onChange={(e) => setHasGraphicsSettings(e.target.value === 'yes')}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div className={styles.modeSection}>
        <h4>{hasGraphicsSettings ? 'Performance Mode' : 'Standard Mode'}</h4>
        <div className={styles.field}>
          <label>Select FPS</label>
          <select 
            value={performanceFPS}
            onChange={(e) => setPerformanceFPS(e.target.value)}
          >
            <option value="30">30 FPS</option>
            <option value="60">60 FPS</option>
            <option value="120">120 FPS</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>Resolution</label>
          <select 
            value={performanceResolution}
            onChange={(e) => setPerformanceResolution(e.target.value)}
          >
            <option value="1080p">1080p</option>
            <option value="4K">4K</option>
          </select>
        </div>
      </div>

      {hasGraphicsSettings && (
        <div className={styles.modeSection}>
          <h4>Fidelity Mode</h4>
          <div className={styles.field}>
            <label>Select FPS</label>
            <select 
              value={fidelityFPS}
              onChange={(e) => setFidelityFPS(e.target.value)}
            >
              <option value="30">30 FPS</option>
              <option value="60">60 FPS</option>
              <option value="120">120 FPS</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Resolution</label>
            <select 
              value={fidelityResolution}
              onChange={(e) => setFidelityResolution(e.target.value)}
            >
              <option value="1080p">1080p</option>
              <option value="4K">4K</option>
            </select>
          </div>
        </div>
      )}

      <button 
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
    </div>
  );
};