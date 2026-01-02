

import { describe, it, expect, vi, beforeEach } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen, fireEvent and waitFor.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent, waitFor } = RTL as any;
import RegisterPage from '../RegisterPage';
import { aiService } from '../../services/aiService';
import { skillService } from '../../services/skillService';
import React from 'react';
import '@testing-library/jest-dom';

vi.mock('../../services/aiService');
vi.mock('../../services/skillService');
vi.mock('../../services/authService');

describe('RegisterPage (Feature Test)', () => {
  beforeEach(() => {
    (skillService.getAllSkills as any).mockResolvedValue({ skills: [{ id: '1', name: 'JavaScript', popularity: 10 }] });
  });

  it('navigates through steps after validating inputs', async () => {
    const navigate = vi.fn();
    render(<RegisterPage navigate={navigate} />);

    fireEvent.change(screen.getByPlaceholderText(/Aryan Sharma/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/hello@example.com/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'StrongPass123!' } });

    const continueBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(screen.getByText(/What can you teach\?/i)).toBeInTheDocument();
    });
  });

  it('triggers AI UID suggestion', async () => {
    (aiService.suggestUid as any).mockResolvedValue({ success: true, data: ['dev_tester', 'test_pro'] });
    
    render(<RegisterPage navigate={vi.fn()} />);
    
    fireEvent.change(screen.getByPlaceholderText(/Aryan Sharma/i), { target: { value: 'Tester' } });
    const suggestBtn = screen.getByText(/Suggest/i);
    fireEvent.click(suggestBtn);

    await waitFor(() => {
      expect(screen.getByText('@dev_tester')).toBeInTheDocument();
    });
  });
});