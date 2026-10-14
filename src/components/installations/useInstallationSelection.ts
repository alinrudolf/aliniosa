import { useState } from 'react';
import { installations } from '../../data/installations';

export function useInstallationSelection() {
  const [selectedInstallationIndex, setSelectedInstallationIndex] = useState(0);

  const selectInstallation = (direction: -1 | 1) => {
    setSelectedInstallationIndex((index) => (index + direction + installations.length) % installations.length);
  };

  return { selectedInstallationIndex, selectInstallation };
}
