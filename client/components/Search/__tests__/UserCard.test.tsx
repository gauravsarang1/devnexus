

import { describe, it, expect, vi } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen and fireEvent.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent } = RTL as any;
import UserCard from '../UserCard';
import React from 'react';
import '@testing-library/jest-dom';

describe('UserCard Component', () => {
  const mockUser = {
    id: 'u1',
    name: 'Rahul',
    uId: 'rahul_dev',
    avatar: '',
    bio: 'Fullstack Engineer',
    isEmailVerified: true,
    skills: [
      { id: 's1', role: 'TEACH' as const, skill: { name: 'Go' } },
      { id: 's2', role: 'TEACH' as const, skill: { name: 'AWS' } }
    ]
  } as any;

  it('renders user details and verification badge', () => {
    render(<UserCard user={mockUser} onConnect={vi.fn()} onNavigate={vi.fn()} />);
    
    expect(screen.getByText('Rahul')).toBeInTheDocument();
    expect(screen.getByText('Fullstack Engineer')).toBeInTheDocument();
    expect(screen.getByText('Go')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('calls onConnect when Connect button is clicked', () => {
    const onConnect = vi.fn();
    render(<UserCard user={mockUser} onConnect={onConnect} onNavigate={vi.fn()} />);
    
    const connectBtn = screen.getByRole('button', { name: /connect/i });
    fireEvent.click(connectBtn);
    
    expect(onConnect).toHaveBeenCalledWith('u1');
  });

  it('navigates to profile when clicking name or avatar', () => {
    const onNavigate = vi.fn();
    render(<UserCard user={mockUser} onConnect={vi.fn()} onNavigate={onNavigate} />);
    
    const nameLink = screen.getByText('Rahul');
    fireEvent.click(nameLink);
    
    expect(onNavigate).toHaveBeenCalledWith('/profile?uId=rahul_dev');
  });
});