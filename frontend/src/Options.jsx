import React, { useEffect, useState } from 'react';
// Import Shadcn UI components (adjust the import paths as per your project structure)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Options = () => {
  const [autoScan, setAutoScan] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  const [whitelist, setWhitelist] = useState('');

  useEffect(() => {
    chrome.storage.sync.get(
      ['autoScan', 'sensitivity', 'whitelist'],
      (data) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        setAutoScan(data.autoScan ?? false);
        setSensitivity(data.sensitivity ?? 50);
        setWhitelist(data.whitelist ?? '');
      }
    );
  }, []);

  // Save options to chrome.storage.sync
  const handleSave = () => {
    chrome.storage.sync.set(
      {
        autoScan,
        sensitivity,
        whitelist,
      },
      () => {
        // You might want to show a notification/toast here
        console.log('Options saved successfully!');
      }
    );
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Extension Options</h1>

      {/* Automatic Scan Toggle */}
      <div className="mb-4">
        <Label htmlFor="auto-scan" className="block mb-1">
          Auto Scan Mails
        </Label>
        <input
          id="auto-scan"
          type="checkbox"
          checked={autoScan}
          onChange={(e) => setAutoScan(e.target.checked)}
          className="mr-2"
        />
        <span>{autoScan ? 'Enabled' : 'Disabled'}</span>
      </div>

      {/* Phishing Sensitivity */}
      <div className="mb-4">
        <Label htmlFor="sensitivity" className="block mb-1">
          Phishing Sensitivity: {sensitivity}
        </Label>
        <input
          id="sensitivity"
          type="range"
          min="0"
          max="100"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Whitelist / Safe Sender Domains */}
      <div className="mb-6">
        <Label htmlFor="whitelist" className="block mb-1">
          Safe Sender Domains (comma separated)
        </Label>
        <Input
          id="whitelist"
          value={whitelist}
          onChange={(e) => setWhitelist(e.target.value)}
          placeholder="e.g. example.com, trusted.com"
        />
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Save Options
      </Button>
    </div>
  );
};

export default Options;
