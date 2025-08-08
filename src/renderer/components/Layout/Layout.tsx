import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props): React.ReactElement {
  // Minimal frameless-compatible header area can be added later
  return <div style={{ padding: 16 }}>{children}</div>;
}


