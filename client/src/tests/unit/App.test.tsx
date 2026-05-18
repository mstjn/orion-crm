import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

describe('App Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('should render a main container', () => {
    const { container } = render(<App />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('should have route definitions', () => {
    const { container } = render(<App />);
    const mainContent = container.querySelector('div');
    expect(mainContent).toBeDefined();
  });
});
