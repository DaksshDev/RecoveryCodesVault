import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useServices } from '../lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from '../components/ui/dialog';

export default function ServiceDetail() {
  const [, params] = useRoute('/service/:id');
  const [, setLocation] = useLocation();
  const { services, updateServiceCodes, clearServiceCodes, addMoreCodes } = useServices();

  const service = services.find(s => s.id === params?.id);

  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showAddCodes, setShowAddCodes] = useState(false);
  const [newCodes, setNewCodes] = useState('');
  const [usedCodesCollapsed, setUsedCodesCollapsed] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = useCallback((file: File) => {
    if (!file.name.endsWith('.txt')) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setNewCodes(content);
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  }, [parseFile]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = '';
  }, [parseFile]);

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
      const nc = service.codes.filter(c => c !== activeCode);
      const newUsed = [...service.usedCodes, { code: activeCode, usedAt: new Date().toISOString() }];
      updateServiceCodes(service.id, nc, newUsed);
      setActiveCode(null);
    }
  };

  const handleAddMore = () => {
    if (newCodes.trim()) {
      addMoreCodes(service.id, newCodes);
      setNewCodes('');
      setFileName(null);
      setShowAddCodes(false);
    }
  };

  const lineCount = newCodes.trim() ? newCodes.split('\n').filter(l => l.trim()).length : 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 40 }}>
      <button onClick={() => setLocation('/')} style={{ marginBottom: 20 }}>{'<'} Dashboard</button>

      {isLow && (
        <div className="red-banner">
          WARNING: ONLY {remaining} CODES REMAINING. GENERATE NEW CODES NOW.
        </div>
      )}

      <div className="window" name={`${service.name} Vault`} style={{ position: 'relative' }}>
        {/* Functional Titlebar Close Button - Positioned exactly over the 'x' in the titlebar */}
        <button 
          type="button"
          onClick={() => setLocation('/')}
          style={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: 25, 
            height: 18, 
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            zIndex: 20,
            padding: 0,
            color: 'transparent',
            outline: 'none'
          }} 
          title="Close Window"
          aria-label="Close"
        />

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
            <div style={{ minWidth: 0, flex: 1 }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: 32, 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {service.name}
              </h1>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <progress value={remaining} max={totalCodes || 1} style={{ width: 150, height: 12 }}></progress>
                {remaining} / {totalCodes} remaining
              </div>
            </div>
          </div>
        </div>

        <hr style={{ margin: '30px 0' }} />

        {!activeCode ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: '#9d9d9d', fontSize: 13, marginBottom: 20 }}>
              Clicking this button will pick a random <span style={{ color: '#fff', fontWeight: 'bold' }}>UNUSED</span> code from the list of codes.
            </p>
            <button
              onClick={handleGetCode}
              disabled={remaining === 0}
              className="greensteam-button"
              style={{
                padding: '15px 40px',
                fontSize: 24,
                height: 'auto',
                width: 'auto',
                cursor: remaining === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                textAlign: 'center',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
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
          <button onClick={() => { setShowAddCodes(true); setNewCodes(''); setFileName(null); }}>Add More Codes</button>
          <button onClick={() => setShowClearConfirm(true)} style={{ color: '#ffaaaa' }}>Clear All Codes</button>
        </div>
      </div>

      {/* ── Add More Codes Dialog ── */}
      <Dialog open={showAddCodes} onOpenChange={(open) => { setShowAddCodes(open); if (!open) { setFileName(null); setNewCodes(''); } }}>
        <DialogPortal>
          <DialogOverlay style={{ zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} />
          <DialogContent 
            className="window"
            style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10002,
              width: '100%',
              maxWidth: 560, 
              background: '#4c5844', 
              border: '1px solid #899281',
              borderBottom: '1px solid #292d23',
              borderRight: '1px solid #292d23',
              borderRadius: 0,
              padding: 15,
              display: 'flex',
              flexDirection: 'column',
              gap: 15,
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Functional Titlebar Close Button for Modal */}
            <button 
              type="button"
              onClick={() => setShowAddCodes(false)}
              style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: 25, 
                height: 18, 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 20,
                padding: 0,
                color: 'transparent',
                outline: 'none'
              }} 
              title="Close Modal"
              aria-label="Close"
            />
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'inherit', fontSize: 16, color: 'white', textTransform: 'uppercase', letterSpacing: 2 }}>
                Add More Codes — {service.name}
              </DialogTitle>
            </DialogHeader>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Drag & Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#55ff55' : '#899281'}`,
                borderRadius: 0,
                padding: '28px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragging ? 'rgba(85,255,85,0.06)' : 'rgba(0,0,0,0.1)',
                transition: 'border-color 0.15s, background 0.15s',
                userSelect: 'none',
              }}
            >
              {fileName ? (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
                  <div style={{ color: '#white', fontWeight: 'bold' }}>{fileName}</div>
                  <div style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>
                    {lineCount} code{lineCount !== 1 ? 's' : ''} detected — click to change file
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
                  <div style={{ color: '#ccc', fontWeight: 'bold' }}>Drop a .txt file here</div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 4 }}>or click to browse</div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#ccc', fontSize: 11, margin: '4px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#292d23' }} />
              <span>OR PASTE MANUALLY</span>
              <div style={{ flex: 1, height: 1, background: '#292d23' }} />
            </div>

            {/* Textarea preview / manual input */}
            <textarea
              value={newCodes}
              onChange={e => setNewCodes(e.target.value)}
              rows={7}
              placeholder="XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                resize: 'none',
                fontFamily: 'monospace',
                fontSize: 13,
                background: '#3e4637',
                border: '1px solid #292d23',
                borderBottom: '1px solid #899281',
                borderRight: '1px solid #899281',
                color: 'white'
              }}
            />

            {lineCount > 0 && (
              <div style={{ fontSize: 11, color: '#ccc', textAlign: 'right', marginTop: -8 }}>
                {lineCount} code{lineCount !== 1 ? 's' : ''} ready to add
              </div>
            )}

            <DialogFooter style={{ gap: 10, marginTop: 5 }}>
              <button
                type="button"
                className="greensteam-button"
                onClick={handleAddMore}
                disabled={!newCodes.trim()}
                style={{ 
                  opacity: newCodes.trim() ? 1 : 0.45,
                  minWidth: 150,
                  height: 30,
                  textAlign: 'center'
                }}
              >
                IMPORT {lineCount > 0 ? `${lineCount} ` : ''}CODES
              </button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* ── Clear Codes Confirm Dialog ── */}
      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
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
              maxWidth: 440, 
              background: '#4c5844', 
              border: '1px solid #aa3333',
              borderRadius: 0,
              padding: 15,
              display: 'flex',
              flexDirection: 'column',
              gap: 15
            }}
          >
            {/* Functional Titlebar Close Button for Modal */}
            <button 
              type="button"
              onClick={() => setShowClearConfirm(false)}
              style={{ 
                position: 'absolute', 
                top: 0, 
                right: 0, 
                width: 25, 
                height: 18, 
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                zIndex: 20,
                padding: 0,
                color: 'transparent',
                outline: 'none'
              }} 
              title="Close Modal"
              aria-label="Close"
            />
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'inherit', fontSize: 15, color: '#ffaaaa', textTransform: 'uppercase', letterSpacing: 2 }}>
                Confirm Clear Content
              </DialogTitle>
            </DialogHeader>
            <p style={{ margin: 0, color: 'white', fontSize: 13 }}>
              Are you sure you want to clear all codes for <strong>{service.name}</strong>?
              This will wipe all remaining unused codes and used history. 
              The service entry will remain.
            </p>
            <DialogFooter style={{ gap: 10, marginTop: 5 }}>
              <DialogClose asChild>
                <button type="button">Cancel</button>
              </DialogClose>
              <button
                type="button"
                onClick={() => { clearServiceCodes(service.id); setShowClearConfirm(false); }}
                style={{ color: '#ffaaaa', minWidth: 150 }}
              >
                Clear All Codes
              </button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}