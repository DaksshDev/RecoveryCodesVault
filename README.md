<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recovery Code Vault - README</title>
    <link rel="stylesheet" type="text/css" href="./client/public/vgui/styles/greensteam/greensteam.css">
    <style>
        body {
            padding: 20px;
            background: #0e1e1e;
        }
        
        .logo-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .logo-header img {
            width: 48px;
            height: 48px;
        }
        
        .screenshot-container {
            margin: 20px 0;
            text-align: center;
        }
        
        .screenshot-container img {
            max-width: 100%;
            height: auto;
            border: 2px solid #2a4a4a;
        }
        
        .feature-grid {
            display: grid;
            gap: 12px;
            margin: 20px 0;
        }
        
        .feature-item {
            display: flex;
            gap: 8px;
            align-items: baseline;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 16px 0;
        }
        
        .tech-badge {
            padding: 4px 12px;
            background: rgba(42, 74, 74, 0.5);
            border: 1px solid #2a4a4a;
            border-radius: 3px;
            font-size: 13px;
            color: #8fbc8f;
        }
        
        code {
            background: #0a1616;
            padding: 2px 6px;
            border-radius: 3px;
            color: #8fbc8f;
            font-family: 'Courier New', monospace;
        }
        
        pre {
            margin: 12px 0;
        }
        
        .window-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .window-row {
                grid-template-columns: 1fr;
            }
        }
        
        .credit-footer {
            text-align: center;
            font-style: italic;
            opacity: 0.8;
            margin-top: 24px;
        }
        
        hr {
            margin: 24px 0;
            border: none;
            border-top: 2px solid #2a4a4a;
        }
    </style>
</head>
<body>
    <!-- Main README Window -->
    <window name="Recovery Code Vault - README.md">
        <div class="logo-header">
            <img src="./docs/logo.png" alt="Recovery Vault Logo">
            <h1>Recovery Code Vault</h1>
        </div>
        
        <p>
            A secure, client-side application for managing recovery codes with AES-256 encryption. 
            Features an authentic nostalgic Green Steam (VGUI) aesthetic straight from the early 2000s.
        </p>
        
        <div class="screenshot-container">
            <img src="./docs/screenshots/dashboard.png" alt="Dashboard Screenshot">
            <p style="margin-top: 8px; font-size: 12px; opacity: 0.8;">Dashboard Interface</p>
        </div>
    </window>

    <!-- Features Window -->
    <window name="Features">
        <div class="feature-grid">
            <div class="feature-item">
                <span style="color: #8fbc8f; font-weight: bold;">▸</span>
                <div>
                    <strong>AES-256 Encryption</strong><br>
                    <span style="font-size: 13px; opacity: 0.9;">Codes are encrypted locally before storage - zero trust architecture</span>
                </div>
            </div>
            
            <div class="feature-item">
                <span style="color: #8fbc8f; font-weight: bold;">▸</span>
                <div>
                    <strong>Zero Server</strong><br>
                    <span style="font-size: 13px; opacity: 0.9;">Everything stays on your machine - no data leaves your browser</span>
                </div>
            </div>
            
            <div class="feature-item">
                <span style="color: #8fbc8f; font-weight: bold;">▸</span>
                <div>
                    <strong>Auto-Import</strong><br>
                    <span style="font-size: 13px; opacity: 0.9;">Drag & drop <code>.txt</code> files to import codes instantly</span>
                </div>
            </div>
            
            <div class="feature-item">
                <span style="color: #8fbc8f; font-weight: bold;">▸</span>
                <div>
                    <strong>Usage Tracking</strong><br>
                    <span style="font-size: 13px; opacity: 0.9;">Mark codes as used and monitor remaining balance in real-time</span>
                </div>
            </div>
        </div>
    </window>

    <!-- Quick Start Window -->
    <window name="Quick Start">
        <p style="margin-bottom: 12px;">Get up and running in seconds:</p>
        
        <box class="inset">
            <pre style="margin: 0; font-size: 13px;"><code>git clone https://github.com/DaksshDev/RecoveryCodesVault.git
cd RecoveryCodesVault
npm install
npm run dev</code></pre>
        </box>
        
        <p style="margin-top: 12px;">
            Open <a href="http://localhost:5173" target="_blank">http://localhost:5173</a> in your browser
        </p>
    </window>

    <!-- Tech Stack & Styling Windows Row -->
    <div class="window-row">
        <window name="Tech Stack">
            <div class="tech-stack">
                <span class="tech-badge">React</span>
                <span class="tech-badge">Vite</span>
                <span class="tech-badge">Zustand</span>
                <span class="tech-badge">CryptoJS</span>
                <span class="tech-badge">Tailwind CSS</span>
                <span class="tech-badge">VGUI CSS</span>
            </div>
            
            <p style="font-size: 13px; margin-top: 12px;">
                Built with modern tools while maintaining that classic aesthetic.
            </p>
        </window>
        
        <window name="Styling">
            <p style="font-size: 13px;">
                Uses authentic VGUI styles from <code>./client/public/vgui/styles</code> 
                based on the <a href="https://github.com/AlpyneDreams/vgui.css" target="_blank">vgui.css framework</a>.
            </p>
            
            <p style="font-size: 13px; margin-top: 12px; opacity: 0.9;">
                The classic Green Steam interface brings that nostalgic Half-Life / CS 1.6 vibe 
                to modern web applications.
            </p>
        </window>
    </div>

    <!-- Security Window -->
    <window name="Security" class="headless">
        <titlebar>
            <span>🔒 Security</span>
        </titlebar>
        
        <box class="rounded">
            <p style="font-size: 13px; margin-bottom: 8px;">
                <strong>Client-Side Encryption:</strong> All encryption happens in your browser using AES-256.
            </p>
            <p style="font-size: 13px; margin-bottom: 8px;">
                <strong>No Backend:</strong> No servers, no databases, no tracking. Your data never leaves your machine.
            </p>
            <p style="font-size: 13px;">
                <strong>Open Source:</strong> Fully auditable code. Check it yourself on GitHub.
            </p>
        </box>
    </window>

    <!-- Footer Window -->
    <window name="Info" class="no-resize">
        <div style="text-align: center;">
            <p style="font-size: 14px; margin-bottom: 8px;">
                <strong>Secure. Simple. Local.</strong>
            </p>
            
            <hr>
            
            <p class="credit-footer" style="font-size: 12px;">
                Made with ⚡ by a student who vibes with tech<br>
                Styled with <a href="https://github.com/AlpyneDreams/vgui.css" target="_blank">VGUI CSS</a> - 
                Thanks for the amazing design system!
            </p>
            
            <p style="font-size: 11px; margin-top: 12px; opacity: 0.7;">
                Check out the repo: 
                <a href="https://github.com/DaksshDev/RecoveryCodesVault" target="_blank">github.com/DaksshDev/RecoveryCodesVault</a>
            </p>
        </div>
    </window>

</body>
</html>