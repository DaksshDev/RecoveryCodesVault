import { useState } from 'react';
import { useLocation } from 'wouter';
import { useServices } from '../lib/store';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { services, addService } = useServices();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCodes, setNewServiceCodes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newServiceName.trim()) {
      addService(newServiceName, newServiceCodes);
      setNewServiceName('');
      setNewServiceCodes('');
      setShowAddModal(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
      <div className="flex-between" style={{ marginBottom: 30 }}>
        <h1 style={{ margin: 0, textShadow: '2px 2px #000' }}>Recovery Code Vault</h1>
        <button onClick={() => setShowAddModal(true)} style={{ padding: '8px 16px' }}>Add Service</button>
      </div>

      <div className="grid-container">
        {services.map(service => {
          const totalCodes = service.codes.length + service.usedCodes.length;
          const remaining = service.codes.length;
          const isLow = remaining <= 3 && totalCodes > 0;

          return (
            <div 
              key={service.id} 
              className={`window service-card ${isLow ? 'low-codes' : ''}`}
              onClick={() => setLocation(`/service/${service.id}`)}
            >
              <div className="service-card-header">
                <img 
                  src={service.icon} 
                  alt={service.name} 
                  className="service-icon"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%232a2c27"/><text x="16" y="22" font-size="16" text-anchor="middle" fill="%23888">?</text></svg>';
                  }}
                />
                <h2 style={{ margin: 0 }}>{service.name}</h2>
                {isLow && <span className="warning-badge">LOW</span>}
              </div>
              
              <div style={{ marginTop: 10 }}>
                <div className="flex-between" style={{ fontSize: 12, marginBottom: 5 }}>
                  <span>{remaining} / {totalCodes} codes remaining</span>
                </div>
                <progress value={remaining} max={totalCodes || 1} style={{ width: '100%' }}></progress>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="window headless modal-content">
            <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Add New Service</span>
              <button 
                type="button" 
                style={{ height: 20, width: 24, padding: 0, lineHeight: '18px' }} 
                onClick={() => setShowAddModal(false)}
              >
                x
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex-column" style={{ padding: '15px' }}>
              <label>Service Name:</label>
              <input 
                type="text" 
                value={newServiceName} 
                onChange={e => setNewServiceName(e.target.value)}
                required 
                autoFocus
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <label>Recovery Codes (one per line):</label>
                <button 
                  type="button" 
                  style={{ fontSize: 10, padding: '2px 8px' }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const content = event.target?.result as string;
                          setNewServiceCodes(content);
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                >
                  Import .txt
                </button>
              </div>
              <textarea 
                value={newServiceCodes} 
                onChange={e => setNewServiceCodes(e.target.value)}
                rows={8}
                placeholder="XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY"
              />
              
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit">Add Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}