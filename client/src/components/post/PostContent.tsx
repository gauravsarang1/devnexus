
import React from 'react';
import MentionText from './MentionText';
import { MentionEntry } from '../../types';

interface PostContentProps {
  content: string;
  mentions: MentionEntry[];
}

const PostContent: React.FC<PostContentProps> = ({ content, mentions }) => {
  return (
    <div className="px-4 py-2">
      <MentionText content={content} mentions={mentions} />
    </div>
  );
};

export default PostContent;
