import React from 'react';
import { render } from '@testing-library/react';

import AppRoot from './AppRoot';

describe('<AppRoot>', () => {
  it('says hello', () => {
    const { getByText } = render(<AppRoot />);
    const textElement = getByText('Hello World!');
    expect(textElement).toBeInTheDocument();
  });
});
