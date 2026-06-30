const express = require("express");
const os = require("os");

const app = express();

const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || "Node Demo";
const VERSION = process.env.VERSION || "1.0.0";

app.use(express.json());

/*
----------------------------------------
Home Page
----------------------------------------
*/

app.get("/", (req, res) => {

    const uptime = process.uptime();
    const uptimeStr = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${APP_NAME} — Live</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

            :root {
                --bg:       #0d1117;
                --surface:  #161b22;
                --border:   #30363d;
                --green:    #3fb950;
                --green-dim:#1a4a27;
                --cyan:     #58d9f9;
                --yellow:   #e3b341;
                --red:      #f85149;
                --text:     #e6edf3;
                --muted:    #8b949e;
                --mono:     'JetBrains Mono', monospace;
                --sans:     'Inter', sans-serif;
            }

            body {
                background: var(--bg);
                color: var(--text);
                font-family: var(--sans);
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 32px 16px;
                gap: 24px;
            }

            /* ── TOP BANNER ── */
            .banner {
                display: flex;
                align-items: center;
                gap: 14px;
            }

            .live-badge {
                display: flex;
                align-items: center;
                gap: 8px;
                background: var(--green-dim);
                border: 1px solid var(--green);
                border-radius: 999px;
                padding: 4px 14px 4px 10px;
                font-family: var(--mono);
                font-size: 12px;
                font-weight: 700;
                color: var(--green);
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            .pulse-dot {
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: var(--green);
                animation: pulse 1.6s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(63,185,80,0.6); }
                50%       { opacity: 0.7; transform: scale(1.15); box-shadow: 0 0 0 6px rgba(63,185,80,0); }
            }

            .app-title {
                font-family: var(--mono);
                font-size: clamp(22px, 4vw, 34px);
                font-weight: 700;
                letter-spacing: -0.5px;
                color: var(--text);
            }

            .app-title span { color: var(--cyan); }

            /* ── MAIN GRID ── */
            .grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                width: 100%;
                max-width: 760px;
            }

            @media (max-width: 560px) {
                .grid { grid-template-columns: 1fr 1fr; }
            }

            .card {
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 10px;
                padding: 18px 20px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                transition: border-color 0.2s;
            }

            .card:hover { border-color: var(--cyan); }

            .card-label {
                font-family: var(--mono);
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--muted);
            }

            .card-value {
                font-family: var(--mono);
                font-size: 15px;
                font-weight: 600;
                color: var(--text);
                word-break: break-all;
            }

            .card-value.green  { color: var(--green); }
            .card-value.cyan   { color: var(--cyan); }
            .card-value.yellow { color: var(--yellow); }

            /* ── STATUS ROW ── */
            .status-row {
                display: flex;
                gap: 12px;
                width: 100%;
                max-width: 760px;
            }

            .status-item {
                flex: 1;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 10px;
                padding: 14px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .status-icon {
                font-size: 20px;
                line-height: 1;
            }

            .status-text {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .status-text .label {
                font-size: 10px;
                font-family: var(--mono);
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: var(--muted);
            }

            .status-text .value {
                font-family: var(--mono);
                font-size: 13px;
                font-weight: 600;
                color: var(--green);
            }

            /* ── ENDPOINTS ── */
            .endpoints {
                width: 100%;
                max-width: 760px;
                background: var(--surface);
                border: 1px solid var(--border);
                border-radius: 10px;
                padding: 20px;
            }

            .endpoints-title {
                font-family: var(--mono);
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--muted);
                margin-bottom: 14px;
            }

            .endpoint-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .endpoint {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 14px;
                background: var(--bg);
                border-radius: 6px;
                border: 1px solid transparent;
                text-decoration: none;
                transition: border-color 0.15s, background 0.15s;
                cursor: pointer;
            }

            .endpoint:hover {
                border-color: var(--border);
                background: #1c2128;
            }

            .method {
                font-family: var(--mono);
                font-size: 10px;
                font-weight: 700;
                color: var(--cyan);
                background: rgba(88,217,249,0.1);
                border-radius: 4px;
                padding: 2px 7px;
                letter-spacing: 0.05em;
                min-width: 38px;
                text-align: center;
            }

            .path {
                font-family: var(--mono);
                font-size: 13px;
                color: var(--text);
                flex: 1;
            }

            .desc {
                font-size: 12px;
                color: var(--muted);
            }

            /* ── FOOTER ── */
            .footer {
                font-family: var(--mono);
                font-size: 11px;
                color: var(--muted);
                letter-spacing: 0.05em;
            }

            /* ── UPTIME COUNTER ── */
            #uptime-display {
                font-family: var(--mono);
                font-size: 15px;
                font-weight: 600;
                color: var(--yellow);
            }
        </style>
    </head>
    <body>

        <div class="banner">
            <div class="live-badge">
                <div class="pulse-dot"></div>
                Live
            </div>
            <h1 class="app-title"><span>//</span> ${APP_NAME}</h1>
        </div>

        <div class="grid">
            <div class="card">
                <div class="card-label">Version</div>
                <div class="card-value cyan">${VERSION}</div>
            </div>
            <div class="card">
                <div class="card-label">Hostname</div>
                <div class="card-value">${os.hostname()}</div>
            </div>
            <div class="card">
                <div class="card-label">Platform</div>
                <div class="card-value">${os.platform()}</div>
            </div>
            <div class="card">
                <div class="card-label">CPUs</div>
                <div class="card-value yellow">${os.cpus().length} core${os.cpus().length !== 1 ? "s" : ""}</div>
            </div>
            <div class="card">
                <div class="card-label">Port</div>
                <div class="card-value cyan">${PORT}</div>
            </div>
            <div class="card">
                <div class="card-label">Uptime</div>
                <div id="uptime-display">${uptimeStr}</div>
            </div>
        </div>

        <div class="status-row">
            <div class="status-item">
                <div class="status-icon">💚</div>
                <div class="status-text">
                    <div class="label">Health</div>
                    <div class="value">UP</div>
                </div>
            </div>
            <div class="status-item">
                <div class="status-icon">✅</div>
                <div class="status-text">
                    <div class="label">Ready</div>
                    <div class="value">TRUE</div>
                </div>
            </div>
            <div class="status-item">
                <div class="status-icon">🚀</div>
                <div class="status-text">
                    <div class="label">Status</div>
                    <div class="value">RUNNING</div>
                </div>
            </div>
        </div>

        <div class="endpoints">
            <div class="endpoints-title">Available Endpoints</div>
            <div class="endpoint-list">
                <a class="endpoint" href="/health">
                    <span class="method">GET</span>
                    <span class="path">/health</span>
                    <span class="desc">Liveness probe</span>
                </a>
                <a class="endpoint" href="/ready">
                    <span class="method">GET</span>
                    <span class="path">/ready</span>
                    <span class="desc">Readiness probe</span>
                </a>
                <a class="endpoint" href="/api/info">
                    <span class="method">GET</span>
                    <span class="path">/api/info</span>
                    <span class="desc">App metadata</span>
                </a>
                <a class="endpoint" href="/api/env">
                    <span class="method">GET</span>
                    <span class="path">/api/env</span>
                    <span class="desc">Environment variables</span>
                </a>
                <a class="endpoint" href="/hostname">
                    <span class="method">GET</span>
                    <span class="path">/hostname</span>
                    <span class="desc">Pod hostname</span>
                </a>
            </div>
        </div>

        <div class="footer">node ${process.version} &nbsp;·&nbsp; pid ${process.pid}</div>

        <script>
            // Live uptime counter ticking in the browser
            const startUptime = ${Math.floor(uptime)};
            const startTime = Date.now();
            const el = document.getElementById('uptime-display');

            function fmt(s) {
                const h = Math.floor(s / 3600);
                const m = Math.floor((s % 3600) / 60);
                const sec = s % 60;
                return h + 'h ' + m + 'm ' + sec + 's';
            }

            setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                el.textContent = fmt(startUptime + elapsed);
            }, 1000);
        </script>

    </body>
    </html>
    `);

});

/*
----------------------------------------
Health
----------------------------------------
*/

app.get("/health", (req, res) => {

    res.json({
        status: "UP"
    });

});

/*
----------------------------------------
Ready
----------------------------------------
*/

app.get("/ready", (req, res) => {

    res.json({
        ready: true
    });

});

/*
----------------------------------------
App Info
----------------------------------------
*/

app.get("/api/info", (req, res) => {

    res.json({

        application: APP_NAME,
        version: VERSION,
        hostname: os.hostname(),
        platform: os.platform(),
        cpus: os.cpus().length

    });

});

/*
----------------------------------------
Environment Variables
----------------------------------------
*/

app.get("/api/env", (req, res) => {

    res.json({

        APP_NAME,
        VERSION,
        PORT

    });

});

/*
----------------------------------------
Hostname
----------------------------------------
*/

app.get("/hostname", (req, res) => {

    res.send(os.hostname());

});

app.listen(PORT, () => {

    console.log(`Application started on port ${PORT}`);

});
