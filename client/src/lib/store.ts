import { useState, useEffect } from 'react';

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

const DEFAULT_SERVICES = [
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
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const stored = localStorage.getItem('recovery_vault_services');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse services from localStorage", e);
    }
    return DEFAULT_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem('recovery_vault_services', JSON.stringify(services));
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

  return { services, addService, deleteService, updateServiceCodes, addMoreCodes };
}