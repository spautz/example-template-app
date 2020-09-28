import React from 'react';
import type { Story } from '@storybook/react';

import AppRoot from './AppRoot';
import type { AppRootProps } from './AppRoot';

export default {
  title: 'AppRoot',
  component: AppRoot,
  decorators: [],
  argTypes: {},
};

/**
 * Just "Hello World!"
 */
export const BasicStory: Story<AppRootProps> = () => {
  return <AppRoot />;
};
BasicStory.storyName = 'Basic Demo';
BasicStory.args = {};
