

import { describe, it, expect, vi } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen and fireEvent.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent } = RTL as any;
import SecurityPane from '../SecurityPane';
import React from 'react';
import '@testing-library/jest-dom';

describe('SecurityPane Component', () => {
  it('disables update button if fields are empty', () => {
    render(<SecurityPane onSave={() => {}} onDelete={() => {}} isSaving={false} />);
    const button = screen.getByRole('button', { name: /update password/i });
    expect(button).toBeDisabled();
  });

  it('calls onSave with input values', () => {
    const onSave = vi.fn();
    render(<SecurityPane onSave={onSave} onDelete={() => {}} isSaving={false} />);
    
    const inputs = screen.getAllByPlaceholderText(/••••••••/i);
    // Note: SecurityPane uses same placeholder for current and new
    fireEvent.change(inputs[0], { target: { value: 'oldpass' } });
    fireEvent.change(inputs[1], { target: { value: 'newpass' } });
    
    const button = screen.getByRole('button', { name: /update password/i });
    fireEvent.click(button);
    
    expect(onSave).toHaveBeenCalledWith('oldpass', 'newpass');
  });
});