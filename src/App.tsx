import "./App.scss";

import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const toggleExtension = (): void => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);
    chrome.storage.local.set({ enabled: newEnabledState });
    // send statusChange to background script
    chrome.runtime.sendMessage({ action: "statusChange" });
  };

  useEffect(() => {
    chrome.storage.local.get(["enabled"], function (result) {
      setIsEnabled(result.enabled || false);
    });
  }, []);

  return (
    <div className="extension__wrapper">
      <h2>Extension Settings</h2>
      <label>
        Enable Extension:
        <input type="checkbox" checked={isEnabled} onChange={toggleExtension} />
      </label>
    </div>
  );
};

export default App;
