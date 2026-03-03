import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useServices } from '../lib/store';

export default function ServiceDetail() {
  const [, params] = useRoute('/service/:id');
  const [, setLocation] = useLocation();
  const { services, updateServiceCodes, deleteService, addMoreCodes } = useServices();
  
  const service = services.find(s => s.id === params?.id);
  
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddCodes, setShowAddCodes] = useState(false);
  const [newCodes, setNewCodes] = useState('');
  const [usedCodesCollapsed, setUsedCodesCollapsed] = useState(true);

  if (!service) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div className="window" style={{ display: 'inline-block', padding: 20 }}>
          <p>Service not found.</p>
          <button onClick={() => setLocation('/')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const remaining = service.codes.length;
  const totalCodes = service.codes.length + service.usedCodes.length;
  const isLow = remaining <= 3 && totalCodes > 0;

  const handleGetCode = () => {
    if (remaining === 0) return;
    const randomIndex = Math.floor(Math.random() * remaining);
    setActiveCode(service.codes[randomIndex]);
  };

  const handleCopy = () => {
    if (activeCode) {
      navigator.clipboard.writeText(activeCode);
    }
  };

  const handleMarkUsed = () => {
    if (activeCode) {
      const newCodes = service.codes.filter(c => c !== activeCode);
      const newUsed = [...service.usedCodes, { code: activeCode, usedAt: new Date().toISOString() }];
      updateServiceCodes(service.id, newCodes, newUsed);
      setActiveCode(null);
    }
  };

  const handleAddMore = () => {
    if (newCodes.trim()) {
      addMoreCodes(service.id, newCodes);
      setNewCodes('');
      setShowAddCodes(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <button onClick={() => setLocation('/')} style={{ marginBottom: 20 }}>&lt; Dashboard</button>

      {isLow && (
        <div className="red-banner">
          WARNING: ONLY {remaining} CODES REMAINING. GENERATE NEW CODES NOW.
        </div>
      )}

      <div className="window" name={`${service.name} Vault`}>
        <div className="flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <img 
              src={service.icon} 
              alt={service.name} 
              className="service-icon"
              style={{ width: 48, height: 48, padding: 6 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%232a2c27"/><text x="24" y="30" font-size="20" text-anchor="middle" fill="%23888">?</text></svg>';
              }}
            />
            <div>
              <h1 style={{ margin: 0, fontSize: 32 }}>{service.name}</h1>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <progress value={remaining} max={totalCodes || 1} style={{ width: 150, height: 12 }}></progress>
                {remaining} / {totalCodes} remaining
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '30px 0' }} />

        {!activeCode ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <button 
              onClick={handleGetCode} 
              disabled={remaining === 0}
              style={{ 
                padding: '20px 50px', 
                fontSize: 28, 
                cursor: remaining === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: remaining > 0 ? '0 4px 10px rgba(0,0,0,0.5)' : 'none'
              }}
            >
              {remaining === 0 ? 'NO CODES AVAILABLE' : 'GET CODE'}
            </button>
          </div>
        ) : (
          <div className="box inset" style={{ textAlign: 'center', padding: 30, margin: '20px 0', background: '#222623' }}>
            <p style={{ fontSize: 18, margin: 0 }}>Your retrieved code:</p>
            <div className="terminal-box">
              {activeCode}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <button onClick={handleCopy} style={{ padding: '10px 20px', fontSize: 16 }}>Copy Code</button>
              <button onClick={handleMarkUsed} style={{ padding: '10px 20px', fontSize: 16, border: '2px solid #55ff55' }}>Mark as Used</button>
              <button onClick={() => setActiveCode(null)} style={{ padding: '10px 20px', fontSize: 16 }}>Cancel</button>
            </div>
            <p style={{ fontSize: 12, marginTop: 25, color: '#999' }}>
              Note: If you cancel, the code returns to the unused pool safely.
            </p>
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          <fieldset className="flex-column" style={{ padding: 15 }}>
            <legend onClick={() => setUsedCodesCollapsed(!usedCodesCollapsed)} style={{ cursor: 'pointer', userSelect: 'none', fontWeight: 'bold' }}>
              {usedCodesCollapsed ? '▶ Show Used Codes' : '▼ Hide Used Codes'} ({service.usedCodes.length})
            </legend>
            {!usedCodesCollapsed && (
              <div className="box inset" style={{ maxHeight: 250, overflowY: 'auto', padding: 15, background: '#222623' }}>
                {service.usedCodes.length === 0 ? (
                  <p style={{ color: '#888', margin: 0 }}>No used codes yet.</p>
                ) : (
                  <ul className="used-codes-list">
                    {service.usedCodes.map((uc, i) => (
                      <li key={i} className="used-code-item">
                        <span>{uc.code}</span>
                        <span style={{ fontSize: 12, opacity: 0.7 }}>
                          {new Date(uc.usedAt).toLocaleDateString()} {new Date(uc.usedAt).toLocaleTimeString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </fieldset>
        </div>

        <div style={{ display: 'flex', gap: 15, marginTop: 40, justifyContent: 'space-between' }}>
          <button onClick={() => setShowAddCodes(true)}>Add More Codes</button>
          <button onClick={() => setShowDeleteConfirm(true)} style={{ color: '#ff5555' }}>Delete Service</button>
        </div>
      </div>

      {showAddCodes && (
        <div className="modal-overlay">
          <div className="window headless modal-content">
            <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Add More Codes</span>
              <button type="button" style={{ height: 20, width: 24, padding: 0, lineHeight: '18px' }} onClick={() => setShowAddCodes(false)}>x</button>
            </div>
            <div className="flex-column" style={{ padding: 15 }}>
              <p style={{ margin: '0 0 10px 0' }}>Paste new codes for <strong>{service.name}</strong> (one per line):</p>
              <textarea 
                value={newCodes} 
                onChange={e => setNewCodes(e.target.value)}
                rows={8}
                autoFocus
                placeholder="XXXX-XXXX-XXXX"
              />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 15 }}>
                <button onClick={() => setShowAddCodes(false)}>Cancel</button>
                <button onClick={handleAddMore}>Add Codes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="window headless modal-content">
            <div className="titlebar" style={{ background: '#800' }}>Confirm Deletion</div>
            <div className="flex-column" style={{ padding: 15 }}>
              <p style={{ margin: '0 0 10px 0' }}>Are you sure you want to delete <strong>{service.name}</strong>? This will remove all remaining unused codes and history.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 15 }}>
                <button onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button 
                  onClick={() => {
                    deleteService(service.id);
                    setLocation('/');
                  }} 
                  style={{ color: '#ff5555' }}
                >
                  Yes, Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}