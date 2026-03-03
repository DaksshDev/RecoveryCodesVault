import { useState } from 'react';
import { useLocation } from 'wouter';
import { useServices } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from '../components/ui/dialog';

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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', paddingBottom: 60, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="flex-between" style={{ marginBottom: 30, alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ margin: 0, textShadow: '2px 2px #000' }}>Recovery Code Vault</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginTop: 5 }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 'bold' }}>By DaksshDev</span>
            <button 
              onClick={() => window.open('https://github.com/DaksshDev/RecoveryCodesVault.git', '_blank')}
              style={{ padding: '2px 8px', fontSize: 10, minWidth: 'auto', background: '#3e4637' }}
            >
              View Source
            </button>
          </div>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ padding: '8px 16px' }}>Add Service</button>
      </div>

      <div className="grid-container" style={{ flex: 1 }}>
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

      <footer style={{ 
        marginTop: 60, 
        padding: '30px 0', 
        borderTop: '1px solid #292d23', 
        textAlign: 'center',
        color: '#888',
        fontSize: 13
      }}>
        <p style={{ margin: '0 0 10px 0' }}>By DaksshDev</p>
        <p style={{ margin: '0 0 15px 0' }}>RecoveryCodesVault is open source!</p>
        <button 
          onClick={() => window.open('https://github.com/DaksshDev/RecoveryCodesVault.git', '_blank')}
          style={{ padding: '4px 12px', fontSize: 12, minWidth: 'auto' }}
        >
          View Source
        </button>
      </footer>

      {/* ── Add New Service Modal (Converted to Dialog) ── */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogPortal>
          <DialogOverlay style={{ zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <DialogContent 
            className="window"
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10002,
              width: '100%',
              maxWidth: 450, 
              background: '#4c5844', 
              border: '1px solid #899281',
              borderRadius: 0,
              padding: 15,
              display: 'flex',
              flexDirection: 'column',
              gap: 15,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'inherit', fontSize: 16, color: 'white', textTransform: 'uppercase', letterSpacing: 2 }}>
                Add New Service
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSubmit} className="flex-column">
              <label style={{ fontSize: 13, color: '#ccc' }}>Service Name:</label>
              <input 
                type="text" 
                value={newServiceName} 
                onChange={e => setNewServiceName(e.target.value)}
                required 
                autoFocus
                style={{ width: '100%', background: '#3e4637', color: 'white', border: '1px solid #292d23' }}
              />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                <label style={{ fontSize: 13, color: '#ccc' }}>Recovery Codes:</label>
                <button 
                  type="button" 
                  style={{ fontSize: 10, padding: '2px 8px', minWidth: 'auto' }}
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
                style={{ 
                  width: '100%', 
                  background: '#3e4637', 
                  color: 'white', 
                  border: '1px solid #292d23',
                  resize: 'none',
                  fontFamily: 'monospace'
                }}
              />
              
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <DialogClose asChild>
                  <button type="button">Cancel</button>
                </DialogClose>
                <button type="submit" style={{ minWidth: 120 }}>Add Service</button>
              </div>
            </form>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}