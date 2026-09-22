import React from 'react';
import { highlightVisualG } from '../../utils/syntaxHighlight';

interface VisualGCodeViewProps {
  code: string;
  className?: string;
  fontSize?: number;
}

export const VisualGCodeView: React.FC<VisualGCodeViewProps> = ({
  code,
  className = '',
  fontSize = 12
}) => {
  const highlightedHtml = highlightVisualG(code);

  return (
    <pre
      className={`font-mono-code leading-relaxed overflow-x-auto select-text ${className}`}
      style={{ fontSize: `${fontSize}px`, tabSize: 3 }}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
};
