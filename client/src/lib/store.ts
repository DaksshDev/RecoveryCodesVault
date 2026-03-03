import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// In a real app, this should be a user-provided master password.
// For this "client-side only" request, we use a fixed key.
const ENCRYPTION_KEY = 'vgui-recovery-vault-secret-key';

export interface UsedCode {
  code: string;
  usedAt: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  codes: string[];
  usedCodes: UsedCode[];
}

const DEFAULT_SERVICES: Service[] = [
  "GitHub", "Google", "Discord", "Notion", "NPM", "Twitter", "Dropbox",
  "Heroku", "Cloudflare", "GitLab", "Bitbucket", "Vercel", "Railway",
  "Netlify", "Stripe", "AWS", "Digital Ocean", "Fastmail"
].map(name => {
  const domainName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  let domain = `${domainName}.com`;
  if (domainName === 'github') domain = 'github.com';
  if (domainName === 'twitter') domain = 'twitter.com';
  if (domainName === 'x') domain = 'x.com';
  if (domainName === 'digitalocean') domain = 'digitalocean.com';
  if (domainName === 'npm') domain = 'npmjs.com';

  return {
    id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name,
    icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    codes: [],
    usedCodes: []
  };
});

export function useServices() {
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  // Load and Decrypt
  useEffect(() => {
    const hasLoadedBefore = localStorage.getItem('recovery_vault_has_loaded');
    const loadingDuration = hasLoadedBefore ? 1100 : 2500;

    setIsInitialLoading(true);

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      if (!hasLoadedBefore) {
        localStorage.setItem('recovery_vault_has_loaded', 'true');
      }
      loadData();
    }, loadingDuration);

    function loadData() {
      try {
        const encrypted = localStorage.getItem('recovery_vault_services_enc');
        if (encrypted) {
          const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          if (decryptedData) {
            setServices(JSON.parse(decryptedData));
          }
        } else {
          // Fallback for transition from unencrypted
          const stored = localStorage.getItem('recovery_vault_services');
          if (stored) {
            setServices(JSON.parse(stored));
          }
        }
      } catch (e) {
        console.error("Failed to decrypt services", e);
      }
    }

    return () => clearTimeout(timer);
  }, []);

  // Encrypt and Save
  useEffect(() => {
    if (services !== DEFAULT_SERVICES) {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(services), ENCRYPTION_KEY).toString();
      localStorage.setItem('recovery_vault_services_enc', encrypted);
      // Clean up old unencrypted key if it exists
      localStorage.removeItem('recovery_vault_services');
    }
  }, [services]);

  const addService = (name: string, codesText: string) => {
    const codes = codesText.split('\n').map(c => c.trim()).filter(Boolean);
    const id = Date.now().toString();
    const domainName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    let domain = `${domainName}.com`;
    if (domainName === 'github') domain = 'github.com';
    if (domainName === 'twitter') domain = 'twitter.com';
    if (domainName === 'x') domain = 'x.com';
    if (domainName === 'digitalocean') domain = 'digitalocean.com';
    if (domainName === 'npm') domain = 'npmjs.com';

    const newService: Service = {
      id,
      name,
      icon: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
      codes,
      usedCodes: []
    };
    setServices(prev => [...prev, newService]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateServiceCodes = (id: string, newCodes: string[], usedCodes: UsedCode[]) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, codes: newCodes, usedCodes };
      }
      return s;
    }));
  };

  const addMoreCodes = (id: string, codesText: string) => {
    const newCodes = codesText.split('\n').map(c => c.trim()).filter(Boolean);
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, codes: [...s.codes, ...newCodes] };
      }
      return s;
    }));
  };

  const clearServiceCodes = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, codes: [], usedCodes: [] };
      }
      return s;
    }));
  };

  return { services, isInitialLoading, addService, deleteService, updateServiceCodes, addMoreCodes, clearServiceCodes };
}