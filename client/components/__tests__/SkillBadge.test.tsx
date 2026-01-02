

import { describe, it, expect, vi } from 'vitest';
// Fixed: Use star import and cast to any to resolve missing export errors for screen and fireEvent.
import * as RTL from '@testing-library/react';
const { render, screen, fireEvent } = RTL as any;
import SkillBadge from '../Profile/SkillBadge';
import React from 'react';
import '@testing-library/jest-dom';

describe('SkillBadge Component', () => {
  const mockSkill = {
    id: '1',
    skillId: 's1',
    userId: 'u1',
    role: 'TEACH' as const,
    level: 'EXPERT' as const,
    skill: { name: 'React' } as any
  };

  it('renders skill name and level', () => {
    render(<SkillBadge skill={mockSkill} isOwnProfile={false} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('EXPERT')).toBeInTheDocument();
  });

  it('shows remove button when isOwnProfile is true', () => {
    const onRemove = vi.fn();
    render(<SkillBadge skill={mockSkill} isOwnProfile={true} onRemove={onRemove} />);
    
    // The button has opacity-0 until hover, but it's in the DOM
    const removeBtn = screen.getByRole('button');
    expect(removeBtn).toBeInTheDocument();
  });

  it('calls onUpdateLevel when selection changes', () => {
    const onUpdateLevel = vi.fn();
    render(<SkillBadge skill={mockSkill} isOwnProfile={true} onUpdateLevel={onUpdateLevel} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'BEGINNER' } });
    
    expect(onUpdateLevel).toHaveBeenCalledWith('1', 'BEGINNER');
  });
});