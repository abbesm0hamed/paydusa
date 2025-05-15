import { Banner } from '@payloadcms/ui/elements/Banner';
import React from 'react';

import { SeedButton } from './SeedButton';
import './index.scss';

const baseClass = 'before-dashboard';

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your Holmena dashboard!</h4>
      </Banner>
      Here&apos;s what to do next:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <SeedButton />
          {
            ' with a few pages, posts, and projects to jump-start your new site, then '
          }
          <a href="/" target="_blank">
            visit your website
          </a>
          {' to see the results.'}
        </li>
        <li>
          Commit and push your changes to the repository to trigger a
          redeployment of your project.
        </li>
      </ul>
      {'Pro Tip: This block is a custom component '}, you can remove it at any
      time by updating your <strong>payload.config</strong>.
    </div>
  );
};

export default BeforeDashboard;
