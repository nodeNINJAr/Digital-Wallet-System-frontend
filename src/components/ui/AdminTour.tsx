'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

interface AdminTourProps {
  onComplete: () => void;
}

export function AdminTour({ onComplete }: AdminTourProps) {
  useEffect(() => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#nav-overview',
          popover: {
            title: 'Navigation Menu',
            description: 'Use the navigation menu to switch between different sections of the admin dashboard. Access user management, agent management, transactions, and settings.',
            position: 'bottom',
          },
        },
        {
          element: '#stats-cards',
          popover: {
            title: 'Dashboard Stats Cards',
            description: 'Get a quick summary of key metrics: total users, agents, transactions, and transaction volume. These cards provide real-time insights into your platform\'s performance.',
            position: 'bottom',
          },
        },
        {
          element: '#charts-section',
          popover: {
            title: 'Data Visualization',
            description: 'Visualize transaction trends and distributions with interactive charts. Monitor monthly patterns and identify growth opportunities.',
            position: 'top',
          },
        },
        {
          element: '#theme-toggle',
          popover: {
            title: 'Theme Toggle',
            description: 'Switch between light and dark mode for comfortable viewing. Your preference will be saved automatically.',
            position: 'left',
          },
        },
        {
          popover: {
            title: 'Tour Complete! 🎉',
            description: 'You\'re all set! Explore the admin dashboard to manage users, agents, and monitor system performance. You can restart this tour anytime from the "Start Tour" button.',
          },
        },
      ],
      onDestroyStarted: () => {
        localStorage.setItem('admin-tour-completed', 'true');
        driverObj.destroy();
        onComplete();
      },
    });

    driverObj.drive();

    return () => {
      driverObj.destroy();
    };
  }, [onComplete]);

  return null;
}