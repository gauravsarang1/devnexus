

import { describe, it, expect, vi } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen and fireEvent.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent } = RTL as any;
import MatchCard from '../MatchCard';
import React from 'react';
import '@testing-library/jest-dom';

describe('MatchCard Component', () => {
  const mockUser = {
    id: 'u2',
    name: 'Sarah',
    uId: 'sarah_code',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'React Dev'
  };

  const mockMatch = {
    id: 'm1',
    userAId: 'u1',
    userBId: 'u2',
    status: 'PENDING' as const,
    matchedSkills: ['React', 'Node'],
    userA: { id: 'u1', name: 'Me' } as any,
    userB: mockUser as any,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('renders partner name and matched skills', () => {
    render(<MatchCard match={mockMatch} activeTab="Incoming" onStatusUpdate={vi.fn()} onNavigate={vi.fn()} />);
    
    expect(screen.getByText('Sarah')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  it('shows Accept/Decline buttons for Incoming tab', () => {
    const onStatusUpdate = vi.fn();
    render(<MatchCard match={mockMatch} activeTab="Incoming" onStatusUpdate={onStatusUpdate} onNavigate={vi.fn()} />);
    
    const acceptBtn = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptBtn);
    
    expect(onStatusUpdate).toHaveBeenCalledWith('m1', 'ACCEPTED');
  });

  it('shows Open Chat button for Active tab', () => {
    const onNavigate = vi.fn();
    const activeMatch = { ...mockMatch, status: 'ACCEPTED' as const };
    render(<MatchCard match={activeMatch} activeTab="Active" onStatusUpdate={vi.fn()} onNavigate={onNavigate} />);
    
    const chatBtn = screen.getByRole('button', { name: /open chat/i });
    fireEvent.click(chatBtn);
    
    expect(onNavigate).toHaveBeenCalledWith('/chat');
  });
});