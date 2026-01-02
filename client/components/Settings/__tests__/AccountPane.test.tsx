

import { describe, it, expect, vi } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen and fireEvent.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent } = RTL as any;
import AccountPane from '../AccountPane';
import React from 'react';
import '@testing-library/jest-dom';

describe('AccountPane Component', () => {
  const mockData = {
    name: 'Gaurav',
    uId: 'gaurav_dev',
    email: 'gaurav@test.com'
  };

  it('renders existing user data', () => {
    render(<AccountPane data={mockData} setData={() => {}} onSave={() => {}} isSaving={false} />);
    
    expect(screen.getByDisplayValue('Gaurav')).toBeInTheDocument();
    expect(screen.getByDisplayValue('gaurav_dev')).toBeInTheDocument();
    expect(screen.getByDisplayValue('gaurav@test.com')).toBeDisabled();
  });

  it('triggers setData on input change', () => {
    const setData = vi.fn();
    render(<AccountPane data={mockData} setData={setData} onSave={() => {}} isSaving={false} />);
    
    const nameInput = screen.getByDisplayValue('Gaurav');
    fireEvent.change(nameInput, { target: { value: 'Gaurav Sarang' } });
    
    expect(setData).toHaveBeenCalled();
  });

  it('shows loading state on button when isSaving is true', () => {
    render(<AccountPane data={mockData} setData={() => {}} onSave={() => {}} isSaving={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    // Lucide loader isn't easily selectable by text, but we check disabled status
  });
});