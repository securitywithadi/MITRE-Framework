import React, { useState, useEffect } from 'react';
import { Shield, Play, FileText, AlertTriangle, CheckCircle, Clock, Server, Activity, Terminal, Crosshair, Cpu, Download, Printer } from 'lucide-react';

// Comprehensive Data based on the MITRE ATT&CK Framework
const mitreData = {
  "Reconnaissance": {
    "Active Scanning": ["Port Scan", "Vulnerability Scan", "Wordlist Scanning"],
    "Gather Victim Host Information": ["Hardware", "Software", "Firmware", "Client Configurations"],
    "Gather Victim Identity Information": ["Credentials", "Email Addresses", "Employee Names"],
    "Gather Victim Network Information": ["Domain Properties", "DNS", "Network Topology", "IP Addresses"],
    "Gather Victim Org Information": ["Business Relationships", "Identify Business Tempo", "Identify Roles"],
    "Phishing for Information": ["Spearphishing Service", "Spearphishing Attachment", "Spearphishing Link"],
    "Search Open Websites/Domains": ["Search Engines", "Social Media", "Public Code Repositories"]
  },
  "Resource Development": {
    "Acquire Access": ["Web Services", "Botnet"],
    "Acquire Infrastructure": ["Domains", "Virtual Private Server", "Web Services", "Botnet"],
    "Compromise Accounts": ["Social Media Accounts", "Email Accounts", "Cloud Accounts"],
    "Compromise Infrastructure": ["Botnet", "Web Services", "Server"],
    "Develop Capabilities": ["Malware", "Code Signing Certificates", "Exploits"],
    "Establish Accounts": ["Social Media Accounts", "Email Accounts", "Cloud Accounts"]
  },
  "Initial Access": {
    "Drive-by Compromise": ["Web Browsers", "Browser Extensions"],
    "Exploit Public-Facing Application": ["SQL Injection", "Cross-Site Scripting", "Remote Code Execution"],
    "External Remote Services": ["VPN", "Citrix", "RDP"],
    "Hardware Additions": ["USB Implants", "Network Interception Devices"],
    "Phishing": ["Spearphishing Attachment", "Spearphishing Link", "Spearphishing via Service"],
    "Supply Chain Compromise": ["Software Dependencies", "Hardware Components"],
    "Trusted Relationship": ["Third-Party Vendors", "Managed Service Providers"],
    "Valid Accounts": ["Default Credentials", "Domain Accounts", "Local Accounts", "Cloud Accounts"]
  },
  "Execution": {
    "Command and Scripting Interpreter": ["PowerShell", "AppleScript", "Windows Command Shell", "Unix Shell", "Python", "JavaScript"],
    "Container Administration Command": ["Docker Exec", "Kubernetes Exec"],
    "Deploy Container": ["Docker", "Kubernetes"],
    "Exploitation for Client Execution": ["Browser Exploits", "Office Exploits"],
    "Scheduled Task/Job": ["Cron", "Scheduled Task", "Systemd Timers"],
    "System Services": ["Service Execution", "Launchctl"],
    "User Execution": ["Malicious File", "Malicious Link"],
    "Windows Management Instrumentation": ["WMI Exec", "WMI Event Subscription"]
  },
  "Persistence": {
    "Account Manipulation": ["Exchange Email Delegate Permissions", "Device Registration"],
    "BITS Jobs": ["Download", "Execute"],
    "Boot or Logon Autostart Execution": ["Registry Run Keys", "Startup Folder", "Services"],
    "Create Account": ["Local Account", "Domain Account", "Cloud Account"],
    "Create or Modify System Process": ["Windows Service", "Systemd Service"],
    "Event Triggered Execution": ["WMI Event Subscription", "AppCert DLLs"],
    "Hijack Execution Flow": ["DLL Search Order Hijacking", "DLL Side-Loading"],
    "Office Application Startup": ["Office Template Macros", "Office Test"],
    "Scheduled Task/Job": ["Cron", "Scheduled Task", "Systemd Timers"]
  },
  "Privilege Escalation": {
    "Abuse Elevation Control Mechanism": ["Bypass UAC", "Sudo and Sudo Caching"],
    "Access Token Manipulation": ["Token Impersonation/Theft", "Create Process with Token"],
    "Exploitation for Privilege Escalation": ["Kernel Exploits", "Local Privilege Escalation"],
    "Hijack Execution Flow": ["DLL Search Order Hijacking", "DLL Side-Loading"],
    "Process Injection": ["Dynamic-link Library Injection", "Portable Executable Injection", "Thread Execution Hijacking"],
    "Valid Accounts": ["Local Administrator", "Domain Administrator", "Root"]
  },
  "Defense Evasion": {
    "Clear Windows Event Logs": ["Security", "System", "Application"],
    "Deobfuscate/Decode Files or Information": ["Base64", "XOR"],
    "Hide Artifacts": ["Hidden Files and Directories", "Hidden Window", "NTFS File Attributes"],
    "Impair Defenses": ["Disable or Modify Tools", "Disable Windows Event Logging", "Modify Cloud Compute Firewall Rules"],
    "Indicator Removal on Host": ["Clear Command History", "File Deletion"],
    "Masquerading": ["Invalid Code Signature", "Right-to-Left Override", "Rename System Utilities"],
    "Modify Registry": ["Add/Modify Keys", "Delete Keys"],
    "Obfuscated Files or Information": ["Software Packing", "Steganography", "Command Obfuscation"],
    "Process Injection": ["DLL Injection", "Process Hollowing"],
    "Virtualization/Sandbox Evasion": ["System Checks", "User Activity Checks"]
  },
  "Credential Access": {
    "Brute Force": ["Password Guessing", "Password Cracking", "Credential Stuffing"],
    "Credentials from Password Stores": ["Keychain", "Windows Credential Manager", "Web Browsers"],
    "Exploitation for Credential Access": ["LSASS Memory Exploitation", "Keylogger"],
    "Forced Authentication": ["SMB Relay", "NTLM Relay"],
    "Input Capture": ["Keylogging", "GUI Input Capture"],
    "OS Credential Dumping": ["LSASS Memory", "Security Account Manager (SAM)", "NTDS", "LSA Secrets"],
    "Steal or Forge Kerberos Tickets": ["Golden Ticket", "Silver Ticket", "Kerberoasting"],
    "Unsecured Credentials": ["Credentials in Files", "Credentials in Registry"]
  },
  "Discovery": {
    "Account Discovery": ["Local Account", "Domain Account", "Cloud Account"],
    "File and Directory Discovery": ["Windows Command Shell", "Unix Shell"],
    "Network Service Discovery": ["Port Scan", "Banner Grabbing"],
    "Network Sniffing": ["Packet Capture", "Promiscuous Mode"],
    "Process Discovery": ["Tasklist", "ps"],
    "Remote System Discovery": ["ARP", "Ping Sweep"],
    "System Information Discovery": ["Systeminfo", "uname"],
    "System Network Configuration Discovery": ["Ipconfig", "Ifconfig"],
    "System Network Connections Discovery": ["Netstat", "lsof"]
  },
  "Lateral Movement": {
    "Exploitation of Remote Services": ["SMB Exploits", "RDP Exploits"],
    "Internal Spearphishing": ["Malicious Attachment", "Malicious Link"],
    "Lateral Tool Transfer": ["SMB/Windows Admin Shares", "SCP", "FTP"],
    "Remote Service Session Hijacking": ["RDP Hijacking", "SSH Hijacking"],
    "Remote Services": ["Remote Desktop Protocol", "SMB/Windows Admin Shares", "SSH", "VNC"],
    "Use Alternate Authentication Material": ["Pass the Hash", "Pass the Ticket", "Web Session Cookie"]
  },
  "Collection": {
    "Archive Collected Data": ["Archive via Utility", "Archive via Custom Method"],
    "Audio Capture": ["Microphone Interception", "VoIP Capture"],
    "Automated Collection": ["Local Network", "Cloud Data"],
    "Clipboard Data": ["Windows Clipboard", "macOS Clipboard"],
    "Data from Cloud Storage": ["AWS S3", "Azure Blob Storage", "GCP Storage"],
    "Data from Local System": ["Files", "Databases"],
    "Data from Network Shared Drive": ["SMB/Windows Admin Shares", "NFS"],
    "Email Collection": ["Local Email Collection", "Remote Email Collection"],
    "Screen Capture": ["Take Screenshot", "Record Screen"]
  },
  "Command and Control": {
    "Application Layer Protocol": ["Web Protocols", "File Transfer Protocols", "Mail Protocols"],
    "Data Encoding": ["Standard Encoding", "Non-Standard Encoding"],
    "Data Obfuscation": ["Steganography", "Protocol Impersonation"],
    "Encrypted Channel": ["Symmetric Cryptography", "Asymmetric Cryptography"],
    "Fallback Channels": ["Secondary C2 Server", "Alternative Protocol"],
    "Ingress Tool Transfer": ["Download via Web", "Download via SMB"],
    "Non-Application Layer Protocol": ["ICMP", "UDP", "TCP"],
    "Proxy": ["Internal Proxy", "External Proxy", "Domain Fronting"],
    "Web Service": ["Dead Drop Resolver", "Bidirectional Communication"]
  },
  "Exfiltration": {
    "Automated Exfiltration": ["Scheduled Scripts", "Continuous Sync"],
    "Data Transfer Size Limits": ["Chunking", "Rate Limiting"],
    "Exfiltration Over Alternative Protocol": ["Symmetric Cryptography", "Asymmetric Cryptography"],
    "Exfiltration Over C2 Channel": ["Standard Protocol", "Custom Protocol"],
    "Exfiltration Over Other Network Medium": ["Bluetooth", "Wi-Fi"],
    "Exfiltration Over Physical Medium": ["USB Drive", "External Hard Drive"],
    "Exfiltration Over Web Service": ["Exfiltration to Cloud Storage", "Exfiltration to Code Repository"],
    "Scheduled Transfer": ["Time of Day", "Event Triggered"]
  },
  "Impact": {
    "Account Access Removal": ["Change Password", "Disable Account", "Delete Account"],
    "Data Destruction": ["File Deletion", "Overwrite Data"],
    "Data Encrypted for Impact": ["Ransomware", "In-Place Encryption"],
    "Data Manipulation": ["Stored Data Manipulation", "Transmitted Data Manipulation"],
    "Defacement": ["Internal Defacement", "External Defacement"],
    "Disk Wipe": ["Overwrite Disk", "Format Disk"],
    "Endpoint Denial of Service": ["OS Exhaustion Flood", "Service Exhaustion Flood"],
    "Inhibit System Recovery": ["Delete Volume Shadow Copies", "Disable Windows Recovery"],
    "System Shutdown/Reboot": ["Shutdown Command", "Reboot Command"]
  }
};

export default function App() {
  const [target, setTarget] = useState('');
  const [tactic, setTactic] = useState('');
  const [technique, setTechnique] = useState('');
  const [procedure, setProcedure] = useState('');
  
  const [availableTechniques, setAvailableTechniques] = useState([]);
  const [availableProcedures, setAvailableProcedures] = useState([]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [report, setReport] = useState(null);

  // Update Techniques when Tactic changes
  useEffect(() => {
    if (tactic && mitreData[tactic]) {
      setAvailableTechniques(Object.keys(mitreData[tactic]));
      setTechnique('');
      setProcedure('');
    } else {
      setAvailableTechniques([]);
    }
  }, [tactic]);

  // Update Procedures when Technique changes
  useEffect(() => {
    if (tactic && technique && mitreData[tactic][technique]) {
      setAvailableProcedures(mitreData[tactic][technique]);
      setProcedure('');
    } else {
      setAvailableProcedures([]);
    }
  }, [technique, tactic]);

  // Generate simulated log stream based on progress
  useEffect(() => {
    if (isRunning) {
      const allLogs = [
        `[INFO] Initializing simulation framework v2.4.1...`,
        `[INFO] Target resolved: ${target}`,
        `[WARN] Bypassing preliminary network checks...`,
        `[EXEC] Loading module for ${tactic || 'General Discovery'}...`,
        `[EXEC] Preparing payload for ${technique || 'Standard Assessment'}...`,
        `[INFO] Transmitting benign telemetry packets to target...`,
        `[WARN] Intercepting target EDR / Firewall response...`,
        `[INFO] Analyzing behavioral signatures...`,
        `[INFO] Compiling assessment report...`,
        `[SUCCESS] Simulation engine halting.`
      ];
      
      const logCount = Math.floor((progress / 100) * allLogs.length);
      setLogs(allLogs.slice(0, Math.max(1, logCount)));
    }
  }, [progress, isRunning, target, tactic, technique]);

  const handleRunTest = () => {
    if (!target) return;
    
    setIsRunning(true);
    setProgress(0);
    setReport(null);
    setLogs([]);

    // Simulate test execution
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 8; // Slower for better log reading
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          generateReport();
        }, 800);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 300);
  };

  const generateReport = () => {
    const isSuccess = Math.random() > 0.4; // 60% chance of "finding" something
    
    setReport({
      id: `SIM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      timestamp: new Date().toLocaleString(),
      target: target,
      tactic: tactic || "Discovery (Blind)",
      technique: technique || "Automated Assessment",
      procedure: procedure || "Multi-vector Analysis",
      status: isSuccess ? "Vulnerability Detected" : "Blocked by Defenses",
      severity: isSuccess ? (tactic === "Execution" || tactic === "Defense Evasion" ? "Critical" : "Medium") : "Low",
      details: isSuccess 
        ? `The simulated procedure [${procedure || technique || 'Automated Assessment'}] successfully executed and bypassed primary security controls on ${target}. Evidence of execution was recorded without triggering active blocking mechanisms.`
        : `The target ${target} actively blocked or null-routed the simulated procedure [${procedure || technique || 'Automated Assessment'}]. Security controls functioned as expected.`,
      recommendation: isSuccess
        ? "URGENT: Review EDR logs, update host-based firewall rules, and restrict administrative privileges for public-facing services immediately."
        : "Current defensive posture is sufficient against this specific threat vector. Continue baseline monitoring."
    });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Critical': return 'text-rose-400 bg-rose-400/10 border-rose-400/20 print:text-red-700 print:bg-red-100 print:border-red-300';
      case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20 print:text-amber-700 print:bg-amber-100 print:border-amber-300';
      case 'Low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 print:text-green-700 print:bg-green-100 print:border-green-300';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20 print:text-slate-700 print:bg-slate-100 print:border-slate-300';
    }
  };

  const handleExportCSV = () => {
    if (!report) return;
    
    // Create CSV content
    const headers = ['Simulation ID', 'Timestamp', 'Target', 'Tactic', 'Technique', 'Procedure', 'Status', 'Severity', 'Details', 'Recommendation'];
    const row = [
      report.id,
      `"${report.timestamp}"`,
      `"${report.target}"`,
      `"${report.tactic}"`,
      `"${report.technique}"`,
      `"${report.procedure}"`,
      `"${report.status}"`,
      report.severity,
      `"${report.details}"`,
      `"${report.recommendation}"`
    ];
    
    const csvContent = headers.join(',') + '\n' + row.join(',');
    
    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ATTACK_Sim_Report_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,78,216,0.15),rgba(255,255,255,0))] print:bg-white print:bg-none text-slate-200 print:text-slate-900 p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - Hidden on Print */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4 print:hidden">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Adversary Emulation Engine</h1>
              <p className="text-slate-400 text-sm mt-1">MITRE ATT&CK® TTP Simulation Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Engine Ready</span>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Configuration Panel - Hidden on Print */}
          <div className="xl:col-span-4 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl p-6 space-y-6 relative overflow-hidden print:hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
            
            <div className="flex items-center space-x-2 pb-2 border-b border-white/5">
              <Crosshair className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Target Parameters</h2>
            </div>
            
            {/* Target Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Target Vector (IP / Domain)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Server className="h-4 w-4 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/40 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="e.g., 10.0.0.54 or prod-server.local"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Tactic Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">ATT&CK Tactic</label>
              <select
                className="block w-full px-3 py-3 border border-white/10 rounded-xl bg-black/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm appearance-none cursor-pointer"
                value={tactic}
                onChange={(e) => setTactic(e.target.value)}
                disabled={isRunning}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="">Auto-Discover (Go Blind)</option>
                {Object.keys(mitreData).map((t) => (
                  <option key={t} value={t} className="bg-slate-900">{t}</option>
                ))}
              </select>
            </div>

            {/* Technique Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">ATT&CK Technique</label>
              <select
                className="block w-full px-3 py-3 border border-white/10 rounded-xl bg-black/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm disabled:opacity-50 appearance-none cursor-pointer disabled:cursor-not-allowed"
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                disabled={!tactic || availableTechniques.length === 0 || isRunning}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="" className="bg-slate-900">All Available Techniques</option>
                {availableTechniques.map((t) => (
                  <option key={t} value={t} className="bg-slate-900">{t}</option>
                ))}
              </select>
            </div>

            {/* Procedure Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Specific Procedure</label>
              <select
                className="block w-full px-3 py-3 border border-white/10 rounded-xl bg-black/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm disabled:opacity-50 appearance-none cursor-pointer disabled:cursor-not-allowed"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                disabled={!technique || availableProcedures.length === 0 || isRunning}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="" className="bg-slate-900">Execute All Procedures</option>
                {availableProcedures.map((p) => (
                  <option key={p} value={p} className="bg-slate-900">{p}</option>
                ))}
              </select>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRunTest}
              disabled={isRunning || !target}
              className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold tracking-wide transition-all duration-200 ${
                isRunning || !target 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-indigo-500/50'
              }`}
            >
              {isRunning ? (
                <>
                  <Activity className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-400" />
                  EMULATING THREAT...
                </>
              ) : (
                <>
                  <Play className="-ml-1 mr-2 h-5 w-5 fill-current" />
                  LAUNCH SIMULATION
                </>
              )}
            </button>
          </div>

          {/* Main Execution / Report Area */}
          <div className="xl:col-span-8 print:col-span-12 space-y-8 flex flex-col">
            
            {/* Execution Status Panel / Fake Terminal - Hidden on Print */}
            <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-1 flex flex-col relative overflow-hidden flex-shrink-0 print:hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border-b border-white/5 rounded-t-xl">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono text-slate-400 tracking-wider">tty1 - engine.exe</span>
                </div>
                {isRunning && <span className="text-xs font-mono text-indigo-400 animate-pulse">{Math.round(progress)}%</span>}
              </div>
              
              <div className="p-4 h-[200px] overflow-y-auto font-mono text-sm space-y-1.5 custom-scrollbar">
                {!isRunning && !report && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3 opacity-50">
                    <Cpu className="w-12 h-12" />
                    <p>Awaiting operational parameters...</p>
                  </div>
                )}
                
                {logs.map((log, index) => (
                  <div key={index} className="flex animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-slate-600 mr-3">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                    <span className={`
                      ${log.includes('[SUCCESS]') ? 'text-emerald-400' : ''}
                      ${log.includes('[WARN]') ? 'text-amber-400' : ''}
                      ${log.includes('[EXEC]') ? 'text-indigo-400' : ''}
                      ${log.includes('[INFO]') ? 'text-blue-300' : ''}
                    `}>
                      {log}
                    </span>
                  </div>
                ))}
                
                {isRunning && (
                  <div className="flex mt-2">
                    <span className="text-slate-600 mr-3">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                    <span className="text-slate-400 animate-pulse">_</span>
                  </div>
                )}
              </div>
              
              {/* Progress Bar overlay at bottom of terminal */}
              {isRunning && (
                <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {/* Report Panel */}
            {report && (
              <div className="flex-grow bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 print:shadow-none print:border-slate-300 print:bg-white">
                <div className="px-6 py-5 border-b border-white/5 print:border-slate-200 flex flex-wrap items-center justify-between bg-white/[0.02] gap-4 print:bg-slate-50">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 mr-3 print:bg-blue-100 print:border-blue-300">
                      <FileText className="w-5 h-5 text-blue-400 print:text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white print:text-slate-900">Post-Simulation Analysis</h2>
                      <p className="text-xs font-mono text-slate-400 mt-0.5 print:text-slate-500">ID: {report.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase flex items-center ${getSeverityColor(report.severity)}`}>
                      {report.severity === 'Critical' && <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />}
                      {report.severity === 'Low' && <CheckCircle className="w-3.5 h-3.5 mr-1.5" />}
                      {report.severity} RISK
                    </div>
                    
                    {/* Export Actions - Hidden on Print */}
                    <div className="flex items-center space-x-2 border-l border-white/10 pl-4 print:hidden">
                      <button 
                        onClick={handleExportCSV}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-slate-300 hover:text-white"
                        title="Download CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleExportPDF}
                        className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-slate-300 hover:text-white"
                        title="Print / Save as PDF"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl border flex items-start space-x-4 bg-black/20 ${
                    report.severity === 'Critical' ? 'border-rose-500/30 print:bg-red-50 print:border-red-200' : 
                    report.severity === 'Medium' ? 'border-amber-500/30 print:bg-amber-50 print:border-amber-200' : 
                    'border-emerald-500/30 print:bg-green-50 print:border-green-200'
                  }`}>
                    <div className="mt-1">
                      {report.severity === 'Low' ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400 print:text-green-600" />
                      ) : (
                        <AlertTriangle className={`w-6 h-6 ${report.severity === 'Critical' ? 'text-rose-400 print:text-red-600' : 'text-amber-400 print:text-amber-600'}`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-base font-bold tracking-wide ${
                        report.severity === 'Critical' ? 'text-rose-400 print:text-red-800' : 
                        report.severity === 'Medium' ? 'text-amber-400 print:text-amber-800' : 
                        'text-emerald-400 print:text-green-800'
                      }`}>
                        {report.status}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-300 print:text-slate-700 leading-relaxed">{report.details}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-white print:border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">Target</span>
                      <span className="block text-slate-200 print:text-slate-800 font-mono text-sm truncate" title={report.target}>{report.target}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-white print:border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">Execution Time</span>
                      <span className="flex items-center text-slate-200 print:text-slate-800 text-sm">
                        <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400 print:text-slate-500" /> 
                        {report.timestamp.split(', ')[1]}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-white print:border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">Tactic</span>
                      <span className="block text-slate-200 print:text-slate-800 text-sm truncate" title={report.tactic}>{report.tactic}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 print:bg-white print:border-slate-200 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">Technique</span>
                      <span className="block text-slate-200 print:text-slate-800 text-sm truncate" title={report.technique}>{report.technique}</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 print:bg-indigo-50 print:border-indigo-200 p-5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 print:text-indigo-800 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Recommended Action Plan
                    </h4>
                    <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed">
                      {report.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        
        @media print {
          @page { margin: 1cm; size: auto; }
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />
    </div>
  );
}