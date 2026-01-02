

import { describe, it, expect, vi, beforeEach } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen, fireEvent and waitFor.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent, waitFor } = RTL as any;
import ProfilePage from '../ProfilePage';
import { authService } from '../../services/authService';
import { skillService } from '../../services/skillService';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../src/store/slices/authSlice';
import '@testing-library/jest-dom';

vi.mock('../../services/authService');
vi.mock('../../services/userService');
vi.mock('../../services/skillService');
vi.mock('../../services/matchService');
vi.mock('../../services/mediaService');

const mockStore = configureStore({ reducer: { auth: authReducer } });

describe('ProfilePage (Feature Test)', () => {
  const mockUser = {
    id: 'u1',
    name: 'Aryan',
    uId: 'aryan_dev',
    email: 'aryan@test.com',
    isEmailVerified: true,
    skills: []
  };

  beforeEach(() => {
    (authService.me as any).mockResolvedValue({ success: true, data: mockUser });
    (skillService.getAllSkills as any).mockResolvedValue({ skills: [{ id: 's1', name: 'React', popularity: 1 }] });
  });

  it('enters editing mode and updates the UI', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage navigate={vi.fn()} />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText('Aryan')).toBeInTheDocument());

    const editBtn = screen.getByText(/Edit Profile/i);
    fireEvent.click(editBtn);

    expect(screen.getByDisplayValue('Aryan')).toBeInTheDocument();
    expect(screen.getByText(/Save Profile/i)).toBeInTheDocument();
  });

  it('opens the add skill modal', async () => {
    render(
      <Provider store={mockStore}>
        <ProfilePage navigate={vi.fn()} />
      </Provider>
    );

    await waitFor(() => expect(screen.getByText(/Add Skill/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Add Skill/i));

    expect(screen.getByText(/Find or create a skill/i)).toBeInTheDocument();
  });
});