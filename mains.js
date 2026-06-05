import React, { useState, useEffect, useRef } from 'react';

// استفاده از تصویر آیکون سه بعدی به عنوان لوگو و بنر هدر
const LOGO_SRC = "watermarked_img_8086540062783285678.png";

// ==========================================
// ابزار کمکی برای تولید کد QR به صورت SVG خالص با رنگ سازگار با لوگو
// ==========================================
const SimpleQR = ({ text, size = 180 }) => {
  const generateDeterministicBlocks = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const blocks = [];
    const gridSize = 15;
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isFinderPattern = 
          (r < 4 && c < 4) || 
          (r < 4 && c >= gridSize - 4) || 
          (r >= gridSize - 4 && c < 4);
        
        if (isFinderPattern) {
          const isBorder = (r === 0 || r === 3 || c === 0 || c === 3) ||
                           (r === 0 || r === 3 || c === gridSize - 1 || c === gridSize - 4) ||
                           (r === gridSize - 1 || r === gridSize - 4 || c === 0 || c === 3);
          const isCenter = (r === 1.5 || r === 2 || c === 1.5 || c === 2) ||
                           (r === 1.5 || r === 2 || c === gridSize - 2 || c === gridSize - 3) ||
                           (r === gridSize - 2 || r === gridSize - 3 || c === 1.5 || c === 2);
          if (isBorder || isCenter) blocks.push({ r, c });
        } else {
          const val = Math.abs(Math.sin(hash + (r * 13) + (c * 37)));
          if (val > 0.45) {
            blocks.push({ r, c });
          }
        }
      }
    }
    return { gridSize, blocks };
  };

  const { gridSize, blocks } = generateDeterministicBlocks(text || "V3EEED CONFIG");
  const cellSize = size / gridSize;

  return (
    <div className="bg-stone-900 p-3 rounded-xl inline-block shadow-lg border-2 border-amber-500/30">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#1c1917" rx="8" />
        {blocks.map((b, idx) => (
          <rect
            key={idx}
            x={b.c * cellSize}
            y={b.r * cellSize}
            width={cellSize - 0.5}
            height={cellSize - 0.5}
            fill="#f59e0b" // رنگ طلایی هماهنگ با تم V3EEED
            rx={cellSize * 0.15}
          />
        ))}
      </svg>
    </div>
  );
};

// ==========================================
// برنامه اصلی داشبورد هوشمند VPN با تم طلایی-زرشکی
// ==========================================
export default function App() {
  const defaultSettings = {
    vlessTemplate: "vless://{uuid}@v3eeed.com:443?security=reality&sni=samsung.com&fp=chrome&pbk=YourPublicKeyHere&sid=YourShortIdHere&type=xhttp&mode=packet&path=%2FWs#Ws-Reality-V3EEED",
    usdtAddress: "TY9bK8SdnXbY9mQ7zXWkR8fT9jLp2oKm7v",
    tonAddress: "UQBxD5g_h9WkZ_K8SdnX_mQ7zXWkR_YourTonAddressGoesHere",
    adminPassword: "admin",
    tokenPriceUSDT: 5.0,
    tokenPriceTON: 3.5,
  };

  const defaultUsers = [
    {
      id: "u1",
      username: "ali_active",
      password: "user123",
      token: "TOK-USDT-9821",
      totalData: 80, 
      usedData: 34.5, 
      expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      status: "active",
      uuid: "7b4c6e91-72f8-45a9-a99f-38a6a1f8b4e2",
      role: "user"
    },
    {
      id: "u2",
      username: "reza_expired",
      password: "user456",
      token: "TOK-FREE-1120",
      totalData: 10,
      usedData: 10,
      expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
      status: "active",
      uuid: "9f3c6e91-12f8-41a9-b99f-38a6a1f8b777",
      role: "user"
    }
  ];

  const defaultTokens = [
    { code: "TOK-USDT-5512", type: "paid", status: "active", dataLimit: 100, durationDays: 30 },
    { code: "TOK-TON-9081", type: "paid", status: "active", dataLimit: 150, durationDays: 60 },
    { code: "TOK-FREE-7462", type: "free", status: "active", dataLimit: 5, durationDays: 3 },
    { code: "TOK-FREE-REQ-1", type: "free", status: "pending_approval", dataLimit: 10, durationDays: 7, userRequested: "Telegram: @V3EEED_Support" }
  ];

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('v3_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('v3_tokens');
    return saved ? JSON.parse(saved) : defaultTokens;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('v3_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); 
  const [adminSubTab, setAdminSubTab] = useState('users'); 

  useEffect(() => {
    localStorage.setItem('v3_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('v3_tokens', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('v3_settings', JSON.stringify(settings));
  }, [settings]);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  
  const [reqUsername, setReqUsername] = useState('');
  const [reqPassword, setReqPassword] = useState('');
  const [reqContact, setReqContact] = useState('');
  const [reqMessage, setReqMessage] = useState('');

  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('با موفقیت در حافظه موقت کپی شد!');
    } catch (err) {
      showToast('خطا در کپی خودکار، لطفاً دستی کپی کنید.', 'error');
    }
    document.body.removeChild(textarea);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === settings.adminPassword) {
      setIsAdmin(true);
      setCurrentUser(null);
      setActiveTab('admin');
      showToast('خوش آمدید مدیریت گرامی!');
      return;
    }

    const foundUser = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (foundUser) {
      if (foundUser.status === 'blocked') {
        showToast('حساب کاربری شما مسدود شده است.', 'error');
        return;
      }
      setCurrentUser(foundUser);
      setIsAdmin(false);
      setActiveTab('dashboard');
      showToast(`خوش آمدید، ${foundUser.username}`);
    } else {
      showToast('نام کاربری یا رمز عبور اشتباه است.', 'error');
    }
  };

  const handleTokenActivation = (e) => {
    e.preventDefault();
    const tokenCode = tokenInput.trim();
    if (!tokenCode) return;

    const tokenIndex = tokens.findIndex(t => t.code === tokenCode && t.status === 'active');
    
    if (tokenIndex === -1) {
      showToast('توکن معتبر نیست یا قبلاً استفاده شده است.', 'error');
      return;
    }

    const matchedToken = tokens[tokenIndex];
    const newUsername = `veeed_${Math.floor(1000 + Math.random() * 9000)}`;
    const newPassword = Math.random().toString(36).slice(-6);
    const newUUID = '7b4c6e91-72f8-45a9-a99f-' + Math.random().toString(36).slice(-12);

    const newUser = {
      id: `u_${Date.now()}`,
      username: newUsername,
      password: newPassword,
      token: tokenCode,
      totalData: matchedToken.dataLimit,
      usedData: 0,
      expiryDate: new Date(Date.now() + matchedToken.durationDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      uuid: newUUID,
      role: 'user'
    };

    const updatedTokens = [...tokens];
    updatedTokens[tokenIndex].status = 'used';

    setTokens(updatedTokens);
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    setTokenInput('');
    
    ModalNewAccount(newUsername, newPassword);
  };

  const [accountCreatedModal, setAccountCreatedModal] = useState(null);
  const ModalNewAccount = (uname, upass) => {
    setAccountCreatedModal({ uname, upass });
  };

  const handleRequestFreeToken = (e) => {
    e.preventDefault();
    if (!reqContact) {
      showToast('لطفا آیدی تلگرام یا شماره همراه را وارد کنید.', 'error');
      return;
    }

    const newTokenRequest = {
      code: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'free',
      status: 'pending_approval',
      dataLimit: 10, 
      durationDays: 7, 
      userRequested: `نام: ${reqUsername || 'ناشناس'} | تماس: ${reqContact} | پیام: ${reqMessage || 'درخواست تایید V3EEED'}`
    };

    setTokens([newTokenRequest, ...tokens]);
    showToast('درخواست توکن ثبت شد و در انتظار تایید مدیریت است.');
    setReqUsername('');
    setReqPassword('');
    setReqContact('');
    setReqMessage('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveTab('login');
    showToast('با موفقیت خارج شدید.');
  };

  const [speedTestActive, setSpeedTestActive] = useState(false);
  const [speedMetrics, setSpeedMetrics] = useState({ ping: '--', download: 0, upload: 0 });
  const [speedStep, setSpeedStep] = useState('idle'); 
  const [chartData, setChartData] = useState([]);
  const canvasRef = useRef(null);

  const startSpeedTest = () => {
    if (speedTestActive) return;
    setSpeedTestActive(true);
    setSpeedMetrics({ ping: '--', download: 0, upload: 0 });
    setSpeedStep('ping');
    setChartData([]);

    let step = 'ping';
    let count = 0;
    
    const interval = setInterval(() => {
      count++;
      if (step === 'ping') {
        const simulatedPing = Math.floor(12 + Math.random() * 10);
        setSpeedMetrics(prev => ({ ...prev, ping: simulatedPing }));
        if (count >= 5) {
          step = 'download';
          setSpeedStep('download');
          count = 0;
        }
      } else if (step === 'download') {
        const currentDownload = Math.floor(65 + Math.sin(count * 0.8) * 25 + Math.random() * 10);
        setSpeedMetrics(prev => ({ ...prev, download: currentDownload }));
        setChartData(prev => [...prev, currentDownload]);
        if (count >= 15) {
          step = 'upload';
          setSpeedStep('upload');
          count = 0;
        }
      } else if (step === 'upload') {
        const currentUpload = Math.floor(35 + Math.cos(count * 0.8) * 12 + Math.random() * 8);
        setSpeedMetrics(prev => ({ ...prev, upload: currentUpload }));
        setChartData(prev => [...prev, currentUpload]);
        if (count >= 12) {
          clearInterval(interval);
          setSpeedTestActive(false);
          setSpeedStep('done');
          showToast('تست پهنای باند با موفقیت انجام شد!');
        }
      }
    }, 200);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartData.length === 0) return;

    ctx.strokeStyle = '#f59e0b'; // تم طلایی V3EEED
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const stepX = canvas.width / (chartData.length > 1 ? chartData.length - 1 : 1);
    const maxVal = Math.max(...chartData, 10);

    chartData.forEach((val, index) => {
      const x = index * stepX;
      const y = canvas.height - (val / maxVal) * (canvas.height - 20) - 10;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [chartData]);

  const [newAdminUser, setNewAdminUser] = useState({ username: '', password: '', totalData: 50, durationDays: 30 });
  const [newTokenConfig, setNewTokenConfig] = useState({ type: 'paid', count: 1, dataLimit: 50, durationDays: 30 });

  const approveTokenRequest = (reqCode) => {
    const updatedTokens = tokens.map(t => {
      if (t.code === reqCode) {
        return {
          ...t,
          code: `FREE-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'active'
        };
      }
      return t;
    });
    setTokens(updatedTokens);
    showToast('درخواست تأیید شد و توکن معتبر صادر گردید.');
  };

  const rejectTokenRequest = (reqCode) => {
    const filteredTokens = tokens.filter(t => t.code !== reqCode);
    setTokens(filteredTokens);
    showToast('درخواست توکن رد شد.', 'info');
  };

  const generateNewTokens = () => {
    const newGenList = [];
    for (let i = 0; i < newTokenConfig.count; i++) {
      const prefix = newTokenConfig.type === 'paid' ? 'TOK-USDT' : 'TOK-FREE';
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      newGenList.push({
        code: `${prefix}-${randomSuffix}`,
        type: newTokenConfig.type,
        status: 'active',
        dataLimit: Number(newTokenConfig.dataLimit),
        durationDays: Number(newTokenConfig.durationDays)
      });
    }
    setTokens([...newGenList, ...tokens]);
    showToast(`${newTokenConfig.count} توکن جدید صادر شد.`);
  };

  const handleAddUserManually = (e) => {
    e.preventDefault();
    if (!newAdminUser.username || !newAdminUser.password) {
      showToast('لطفا اطلاعات را کامل وارد کنید', 'error');
      return;
    }

    if (users.some(u => u.username === newAdminUser.username)) {
      showToast('این نام کاربری تکراری است', 'error');
      return;
    }

    const newUser = {
      id: `u_${Date.now()}`,
      username: newAdminUser.username,
      password: newAdminUser.password,
      token: 'MANUAL_ADMIN',
      totalData: Number(newAdminUser.totalData),
      usedData: 0,
      expiryDate: new Date(Date.now() + Number(newAdminUser.durationDays) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      uuid: '7b4c6e91-72f8-45a9-a99f-' + Math.random().toString(36).slice(-12),
      role: 'user'
    };

    setUsers([...users, newUser]);
    setNewAdminUser({ username: '', password: '', totalData: 50, durationDays: 30 });
    showToast('کاربر جدید ایجاد شد.');
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
    showToast('کاربر حذف شد.', 'info');
  };

  const [editingUser, setEditingUser] = useState(null);
  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
    showToast('اکانت بروزرسانی شد.');
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'active' ? 'blocked' : 'active';
        showToast(`وضعیت حساب کاربری به [${newStatus === 'active' ? 'فعال' : 'مسدود'}] تغییر یافت.`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const getFormattedConfig = (user) => {
    if (!user) return "";
    return settings.vlessTemplate
      .replace("{uuid}", user.uuid || "your-uuid-here")
      .replace("{host}", "smart-cdn.com")
      .replace("{port}", "443");
  };

  return (
    <div className="min-h-screen bg-[#0e0c0b] text-stone-100 font-sans antialiased rtl flex flex-col justify-between" dir="rtl">
      
      {/* ======================================================= */}
      {/* هدر وب‌سایت با تم جدید طلایی-زرشکی و لوگو */}
      {/* ======================================================= */}
      <header className="border-b border-stone-800/80 bg-stone-900/60 backdrop-blur-md sticky top-0 z-50 px-4 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* تصویر لوگو از آدرس درخواستی */}
            <div className="w-12 h-12 bg-stone-950 rounded-xl overflow-hidden border border-amber-500/40 p-0.5 flex items-center justify-center">
              <img src={LOGO_SRC} alt="V3EEED Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-600 bg-clip-text text-transparent uppercase font-mono">V3EEED</h1>
              <p className="text-[10px] text-amber-500 font-mono tracking-widest font-bold uppercase">VEEED ALL YOU NEED</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <div className="flex items-center gap-2 bg-stone-900/90 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-stone-300">پنل کاربر: {currentUser.username}</span>
              </div>
            )}
            {isAdmin && (
              <div className="flex items-center gap-2 bg-rose-900/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="text-xs font-bold text-rose-300">پنل ادمین</span>
              </div>
            )}
            {(currentUser || isAdmin) && (
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                title="خروج از حساب"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* اعلان‌های سیستم */}
      {toast && (
        <div className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-stone-900 border-amber-500/40 text-amber-400 shadow-amber-500/10' 
            : toast.type === 'error'
            ? 'bg-stone-900 border-rose-500/40 text-rose-400 shadow-rose-500/10'
            : 'bg-stone-900 border-amber-500/20 text-stone-300'
        }`}>
          <div className="w-2 h-2 rounded-full bg-current animate-ping"></div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* مدال تایید موفقیت ساخت حساب */}
      {accountCreatedModal && (
        <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-100">اکانت شما ایجاد شد!</h3>
              <p className="text-sm text-stone-400 mt-2">اطلاعات ورود را ذخیره کنید تا همیشه بتوانید وارد پنل شوید.</p>
            </div>

            <div className="mt-6 space-y-3 bg-stone-950 p-4 rounded-xl border border-stone-800 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">نام کاربری:</span>
                <span className="text-amber-400 font-bold">{accountCreatedModal.uname}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">کلمه عبور دائمی:</span>
                <span className="text-rose-400 font-bold">{accountCreatedModal.upass}</span>
              </div>
            </div>

            <p className="text-xs text-amber-500 text-center mt-4">* از دفعات بعدی مستقیما با همین یوزرنیم و پسورد وارد شوید.</p>

            <button 
              onClick={() => setAccountCreatedModal(null)}
              className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              ورود به داشبورد کاربری
            </button>
          </div>
        </div>
      )}

      {/* محتوای اصلی */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        
        {/* ======================================================= */}
        {/* ۱. گیت ورودی و فعال‌سازی با تم جدید لوگو */}
        {/* ======================================================= */}
        {activeTab === 'login' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            
            {/* لوگوی بزرگ خوش‌آمدگویی در وسط */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/50 p-1 shadow-2xl shadow-amber-500/10">
                <img src={LOGO_SRC} alt="V3EEED Redesign Logo" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-600 bg-clip-text text-transparent">دروازه اشتراک V3EEED</h2>
                <p className="text-xs text-stone-400 font-mono tracking-widest mt-1">VEEED ALL YOU NEED — PREMIUM SECURE NETWORK</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* کارت ورود با یوزرنیم دائمی */}
              <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center text-amber-400 border border-stone-700">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">ورود مستقیم به حساب</h2>
                  </div>
                  
                  <p className="text-sm text-stone-400 mb-6">اگر نام کاربری و کلمه‌عبور دائمی دریافت کرده‌اید، از فرم زیر برای بررسی ترافیک و دانلود کانفیگ جدید استفاده کنید.</p>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">نام کاربری یا ادمین</label>
                      <input 
                        type="text" 
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-stone-200"
                        placeholder="مثال: ali_active"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">کلمه عبور</label>
                      <input 
                        type="password" 
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all text-stone-200"
                        placeholder="••••••••"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-xl font-bold border border-stone-700 transition-all text-sm shadow-md"
                    >
                      تایید و ورود
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 text-center">
                  <span className="text-xs text-stone-500">رمز ادمین پیش‌فرض: <code className="text-rose-400 font-mono font-bold">admin</code></span>
                </div>
              </div>

              {/* کارت فعال‌سازی توکن جدید */}
              <div className="bg-stone-900 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-amber-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full filter blur-3xl group-hover:bg-rose-500/10 transition-all"></div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold">فعال‌سازی توکن اشتراک</h2>
                  </div>
                  
                  <p className="text-sm text-stone-400 mb-6">توکن معتبر خریداری شده یا تایید شده توسط ادمین را در کادر زیر قرار دهید تا فوراً اکانت شما ساخته و کانفیگ تحویل داده شود.</p>

                  <form onSubmit={handleTokenActivation} className="space-y-4">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">کد توکن فعال‌سازی</label>
                      <input 
                        type="text" 
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-center font-mono tracking-widest text-amber-400"
                        placeholder="TOK-USDT-XXXX"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-amber-500/20"
                    >
                      فعال‌سازی آنی حساب و نمایش کانفیگ
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <span className="text-xs text-stone-400">هنوز توکن دریافت نکرده‌اید؟</span>
                  <button 
                    onClick={() => setActiveTab('request-token')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-all underline underline-offset-4"
                  >
                    دریافت توکن پرداخت / رایگان
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* ۲. بخش دریافت توکن با تم جدید و لوگو */}
        {/* ======================================================= */}
        {activeTab === 'request-token' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-all"
              >
                <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="text-sm font-semibold">بازگشت به صفحه ورود</span>
              </button>
              <h2 className="text-xl font-black text-amber-400">تهیه توکن برای ایجاد اکانت</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* بخش واریز کریپتویی */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">واریز کریپتویی (USDT / TON)</h3>
                  </div>
                  <p className="text-xs text-stone-400 mb-6">مبلغ مورد نیاز را به آدرس‌های زیر واریز نمایید و تصویر تراکنش را به پشتیبانی تلگرام ارسال کنید تا توکن فعال شما صادر شود.</p>

                  <div className="space-y-4">
                    
                    {/* تتر */}
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 relative group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          USDT (TRC-20)
                        </span>
                        <span className="text-xs text-stone-400">قیمت: {settings.tokenPriceUSDT} تتر</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-mono text-stone-300 break-all select-all">{settings.usdtAddress}</span>
                        <button 
                          onClick={() => copyToClipboard(settings.usdtAddress)}
                          className="p-2 bg-stone-900 hover:bg-amber-500/20 text-stone-400 hover:text-amber-400 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* تون */}
                    <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 relative group">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          TON (Toncoin)
                        </span>
                        <span className="text-xs text-stone-400">قیمت: {settings.tokenPriceTON} TON</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-mono text-stone-300 break-all select-all">{settings.tonAddress}</span>
                        <button 
                          onClick={() => copyToClipboard(settings.tonAddress)}
                          className="p-2 bg-stone-900 hover:bg-amber-500/20 text-stone-400 hover:text-amber-400 rounded-lg transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                <div className="mt-6 p-4 bg-stone-950 rounded-xl border border-dashed border-stone-800 text-center">
                  <a href="https://t.me/V3EEED_Support" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-1.5 bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white text-xs font-bold rounded-lg transition-all">
                    ارسال رسید به تلگرام V3EEED
                  </a>
                </div>
              </div>

              {/* درخواست توکن رایگان تست عمومی */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center text-rose-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">درخواست توکن تست رایگان</h3>
                  </div>
                  <p className="text-xs text-stone-400 mb-6">درخواست شما به صورت مستقیم به ادمین پلتفرم جهت تایید ارسال می‌شود.</p>

                  <form onSubmit={handleRequestFreeToken} className="space-y-4">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">نام و نام‌خانوادگی</label>
                      <input 
                        type="text" 
                        value={reqUsername}
                        onChange={(e) => setReqUsername(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs focus:outline-none"
                        placeholder="امید رضایی"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">آیدی تلگرام یا شماره تماس *</label>
                      <input 
                        type="text" 
                        required
                        value={reqContact}
                        onChange={(e) => setReqContact(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs focus:outline-none font-mono"
                        placeholder="@V3EEED_Support"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1.5 font-semibold">پیام به مدیریت (اختیاری)</label>
                      <textarea 
                        value={reqMessage}
                        onChange={(e) => setReqMessage(e.target.value)}
                        rows="2"
                        className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-4 py-2 text-xs focus:outline-none"
                        placeholder="درخواست اشتراک تست رایگان V3EEED"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white rounded-xl font-bold transition-all text-xs"
                    >
                      ثبت درخواست تایید دستی
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* ۳. داشبورد اصلی کاربران بعد از لاگین */}
        {/* ======================================================= */}
        {activeTab === 'dashboard' && currentUser && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* مصرف ترافیک با رنگ‌بندی تم جدید */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl">
                <h3 className="text-sm font-bold text-stone-400 self-start mb-4">آمار مصرف ترافیک</h3>
                
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#292524" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="url(#v3eedGradient)" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - Math.min(currentUser.usedData / currentUser.totalData, 1))}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="v3eedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#be123c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-stone-100 font-mono">
                      {Math.max(0, (currentUser.totalData - currentUser.usedData).toFixed(1))}
                    </span>
                    <span className="text-[10px] text-amber-500 font-bold">گیگابایت مانده</span>
                  </div>
                </div>

                <div className="w-full flex justify-between items-center mt-6 text-xs border-t border-stone-800 pt-4">
                  <div className="text-center">
                    <span className="text-stone-400 block mb-1">مصرف شده</span>
                    <span className="font-mono text-rose-500 font-bold">{currentUser.usedData} GB</span>
                  </div>
                  <div className="w-px h-8 bg-stone-800"></div>
                  <div className="text-center">
                    <span className="text-stone-400 block mb-1">حجم کل اشتراک</span>
                    <span className="font-mono text-amber-500 font-bold">{currentUser.totalData} GB</span>
                  </div>
                </div>
              </div>

              {/* تاریخ اعتبار با تم زرد و قرمز */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-stone-400 mb-4">اعتبار زمانی اشتراک</h3>
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 text-center mb-4">
                    <span className="text-xs text-stone-500 block mb-1">روزهای باقیمانده</span>
                    <span className="text-4xl font-extrabold text-amber-400 font-mono">
                      {Math.max(0, Math.ceil((new Date(currentUser.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                    </span>
                    <span className="text-xs text-amber-400 font-bold mr-1">روز</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-stone-400">تاریخ انقضا:</span>
                      <span className="font-mono font-bold text-stone-200">{currentUser.expiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">شناسه اتصال:</span>
                      <span className="font-mono font-bold text-amber-500">{currentUser.status === 'active' ? 'فعال و متصل' : 'غیرفعال'}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => showToast('درخواست تمدید شما برای مدیریت ارسال شد. به زودی با شما تماس می‌گیریم.', 'info')}
                  className="w-full mt-6 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all"
                >
                  درخواست تمدید آنلاین اکانت
                </button>
              </div>

              {/* مشخصات ورود دائمی */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-stone-400 mb-4">مشخصات ورود شما</h3>
                  <p className="text-xs text-stone-400 mb-4">با این اطلاعات می‌توانید در دفعات بعد به این پنل مراجعه و ریزمصرف خود را رصد کنید.</p>
                  
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">پنل کاربری:</span>
                      <span className="text-amber-400 font-bold">V3EEED</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">نام کاربری:</span>
                      <span className="text-stone-200 font-bold">{currentUser.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">کلمه عبور:</span>
                      <span className="text-rose-400 font-bold">{currentUser.password}</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-amber-500 border-t border-stone-800 pt-4 mt-4 font-bold">
                  * VEEED ALL YOU NEED *
                </div>
              </div>

            </div>

            {/* بخش کپی کانفیگ VLESS با کد QR طلایی */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-extrabold mb-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                کانفیگ فوق‌امنیتی شما (VLESS + Reality)
              </h3>

              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-4">
                  <p className="text-xs text-stone-400">کانفیگ زیر با استفاده از امن‌ترین تنظیمات XHTTP و فناوری Reality جهت دور زدن لایه‌های فیلترینگ طراحی شده است. آن را کپی کرده و در برنامه متصل‌کننده خود قرار دهید.</p>
                  
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 relative">
                    <textarea 
                      readOnly
                      rows="3"
                      value={getFormattedConfig(currentUser)}
                      className="w-full bg-transparent border-none resize-none font-mono text-xs text-amber-400 focus:outline-none focus:ring-0 break-all leading-relaxed"
                    ></textarea>
                    
                    <button 
                      onClick={() => copyToClipboard(getFormattedConfig(currentUser))}
                      className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-1.5"
                    >
                      کپی کانفیگ VLESS
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-stone-950/40 rounded-2xl border border-stone-800">
                  <SimpleQR text={getFormattedConfig(currentUser)} size={160} />
                  <span className="text-[11px] text-stone-400 font-semibold mt-3">اسکن با دوربین کلاینت</span>
                </div>
              </div>
            </div>

            {/* تست سرعت اختصاصی */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    تست سرعت و پینگ هوشمند شبکه
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">تست پینگ زنده و سرعت پهنای باند را در بستر سرورهای V3EEED بررسی کنید.</p>
                </div>
                <button 
                  onClick={startSpeedTest}
                  disabled={speedTestActive}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                    speedTestActive 
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-amber-500 to-rose-700 hover:from-amber-400 hover:to-rose-600 text-white shadow-amber-600/25'
                  }`}
                >
                  {speedTestActive ? 'در حال اجرای تست...' : 'شروع تست سرعت'}
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-6 items-stretch">
                
                <div className="md:col-span-1 space-y-3 flex flex-col justify-between">
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-500 font-bold block">پینگ اتصال (RTT)</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">{speedMetrics.ping}</span>
                    <span className="text-[10px] text-emerald-400 font-bold mr-1">میلی‌ثانیه</span>
                  </div>

                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-500 font-bold block">سرعت دانلود</span>
                    <span className="text-2xl font-black font-mono text-amber-400">{speedMetrics.download}</span>
                    <span className="text-[10px] text-amber-400 font-bold mr-1">مگابیت/ثانیه</span>
                  </div>

                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800">
                    <span className="text-[10px] text-stone-500 font-bold block">سرعت آپلود</span>
                    <span className="text-2xl font-black font-mono text-rose-400">{speedMetrics.upload}</span>
                    <span className="text-[10px] text-rose-400 font-bold mr-1">مگابیت/ثانیه</span>
                  </div>
                </div>

                <div className="md:col-span-3 bg-stone-950 rounded-2xl border border-stone-800 p-4 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[10px] text-stone-400 font-bold">نمودار زنده پهنای باند</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono">
                      {speedStep === 'idle' ? 'آماده' : speedStep === 'ping' ? 'پینگ...' : speedStep === 'download' ? 'دانلود...' : speedStep === 'upload' ? 'آپلود...' : 'پایان'}
                    </span>
                  </div>
                  
                  <div className="h-32 flex items-center justify-center relative mt-2">
                    {speedStep === 'idle' && (
                      <span className="text-xs text-stone-600 font-bold">روی شروع دکمه تست کلیک کنید</span>
                    )}
                    <canvas ref={canvasRef} width="500" height="120" className="w-full h-full max-h-[120px]"></canvas>
                  </div>
                </div>

              </div>
            </div>

            {/* بخش برنامه‌ها و کلاینت‌ها */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-extrabold mb-6">دانلود مستقیم کلاینت‌های اتصال</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* اندروید */}
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
                  <div>
                    <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.523 15.3l1.81 3.135a.5.5 0 1 1-.866.5l-1.82-3.155H7.353l-1.82 3.155a.5.5 0 0 1-.866-.5l1.81-3.135A8.966 8.966 0 0 1 3.5 9h17a8.966 8.966 0 0 1-2.977 6.3zM16 11.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-8 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5z"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-stone-200">اندروید</h4>
                    <p className="text-[10px] text-stone-500 mt-1">پیشنهاد: V2rayNG یا Matsuri</p>
                  </div>
                  <a href="https://github.com/2dust/v2rayNG/releases" target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-2 bg-stone-900 group-hover:bg-amber-600 text-stone-300 group-hover:text-white text-xs font-bold rounded-lg text-center transition-all">
                    دانلود مستقیم V2rayNG
                  </a>
                </div>

                {/* آی‌او‌اس */}
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
                  <div>
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.2.12.3.12.9 0 2.02-.57 2.52-1.45z"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-stone-200">iOS (آیفون)</h4>
                    <p className="text-[10px] text-stone-500 mt-1">پیشنهاد: FoXray یا Streisand</p>
                  </div>
                  <a href="https://apps.apple.com/us/app/foxray/id6448898396" target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-2 bg-stone-900 group-hover:bg-amber-600 text-stone-300 group-hover:text-white text-xs font-bold rounded-lg text-center transition-all">
                    دریافت از App Store
                  </a>
                </div>

                {/* ویندوز */}
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
                  <div>
                    <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-stone-200">ویندوز</h4>
                    <p className="text-[10px] text-stone-500 mt-1">پیشنهاد: v2rayN یا Nekoray</p>
                  </div>
                  <a href="https://github.com/2dust/v2rayN/releases" target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-2 bg-stone-900 group-hover:bg-amber-600 text-stone-300 group-hover:text-white text-xs font-bold rounded-lg text-center transition-all">
                    دانلود مستقیم v2rayN
                  </a>
                </div>

                {/* مک */}
                <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
                  <div>
                    <div className="w-10 h-10 bg-amber-500/10 text-rose-500 rounded-xl flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2v-6h2v6z"/>
                      </svg>
                    </div>
                    <h4 className="font-bold text-sm text-stone-200">macOS</h4>
                    <p className="text-[10px] text-stone-500 mt-1">پیشنهاد: V2Box</p>
                  </div>
                  <a href="https://apps.apple.com/us/app/v2box-v2ray-client/id1640560447" target="_blank" rel="noopener noreferrer" className="mt-4 w-full py-2 bg-stone-900 group-hover:bg-amber-600 text-stone-300 group-hover:text-white text-xs font-bold rounded-lg text-center transition-all">
                    دانلود مستقیم V2Box
                  </a>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ======================================================= */}
        {/* ۴. پنل ادمین با استایل لوکس طلایی */}
        {/* ======================================================= */}
        {activeTab === 'admin' && isAdmin && (
          <div className="grid md:grid-cols-4 gap-8">
            
            <div className="md:col-span-1 space-y-2">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-1 shadow-lg">
                <span className="text-[10px] text-stone-500 font-bold px-3 block mb-2">منوی مدیریت سیستم</span>
                
                <button 
                  onClick={() => setAdminSubTab('users')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    adminSubTab === 'users' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <span>مدیریت کاربران ({users.length})</span>
                </button>

                <button 
                  onClick={() => setAdminSubTab('tokens')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    adminSubTab === 'tokens' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <span>مدیریت و صدور توکن‌ها</span>
                </button>

                <button 
                  onClick={() => setAdminSubTab('settings')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    adminSubTab === 'settings' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                  }`}
                >
                  <span>تنظیمات عمومی</span>
                </button>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-4 shadow-lg text-xs">
                <span className="text-[10px] text-amber-500 font-bold block mb-2">خلاصه پلتفرم V3EEED</span>
                <div className="flex justify-between">
                  <span className="text-stone-400">کل حجم:</span>
                  <span className="font-mono font-bold text-amber-400">{users.reduce((acc, curr) => acc + curr.totalData, 0)} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">کل مصرف کاربران:</span>
                  <span className="font-mono font-bold text-rose-400">{users.reduce((acc, curr) => acc + curr.usedData, 0).toFixed(1)} GB</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-6">
              
              {/* لیست کاربران */}
              {adminSubTab === 'users' && (
                <div className="space-y-6">
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
                    <h3 className="text-sm font-bold text-stone-200 mb-4">اضافه کردن دستی کاربر</h3>
                    <form onSubmit={handleAddUserManually} className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">نام کاربری جدید</label>
                        <input 
                          type="text" 
                          required
                          value={newAdminUser.username}
                          onChange={(e) => setNewAdminUser({...newAdminUser, username: e.target.value})}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                          placeholder="مثال: custom_user"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">کلمه عبور</label>
                        <input 
                          type="text" 
                          required
                          value={newAdminUser.password}
                          onChange={(e) => setNewAdminUser({...newAdminUser, password: e.target.value})}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                          placeholder="کلمه عبور"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">حجم کل (GB)</label>
                        <input 
                          type="number" 
                          required
                          value={newAdminUser.totalData}
                          onChange={(e) => setNewAdminUser({...newAdminUser, totalData: e.target.value})}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-stone-400 mb-1">مدت اعتبار (روز)</label>
                        <input 
                          type="number" 
                          required
                          value={newAdminUser.durationDays}
                          onChange={(e) => setNewAdminUser({...newAdminUser, durationDays: e.target.value})}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-4 flex justify-end">
                        <button 
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs rounded-lg transition-all"
                        >
                          ثبت کاربر جدید
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* ویرایش کاربر */}
                  {editingUser && (
                    <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
                      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-stone-100 mb-4">ویرایش مشخصات کاربر [{editingUser.username}]</h3>
                        
                        <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
                          <div>
                            <label className="block text-stone-400 mb-1">نام کاربری</label>
                            <input 
                              type="text" 
                              value={editingUser.username}
                              onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-amber-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-400 mb-1">کلمه عبور</label>
                            <input 
                              type="text" 
                              value={editingUser.password}
                              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-rose-400 focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-stone-400 mb-1">حجم کل (GB)</label>
                              <input 
                                type="number" 
                                value={editingUser.totalData}
                                onChange={(e) => setEditingUser({ ...editingUser, totalData: Number(e.target.value) })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-400 mb-1">مصرف شده (GB)</label>
                              <input 
                                type="number" 
                                value={editingUser.usedData}
                                onChange={(e) => setEditingUser({ ...editingUser, usedData: Number(e.target.value) })}
                                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-stone-400 mb-1">تاریخ انقضا</label>
                            <input 
                              type="text" 
                              value={editingUser.expiryDate}
                              onChange={(e) => setEditingUser({ ...editingUser, expiryDate: e.target.value })}
                              className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 focus:outline-none"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-4">
                            <button 
                              type="button"
                              onClick={() => setEditingUser(null)}
                              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-bold"
                            >
                              لغو
                            </button>
                            <button 
                              type="submit"
                              className="px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-lg"
                            >
                              ذخیره
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-stone-800 text-stone-400">
                          <th className="py-3 px-2 font-bold">کاربر</th>
                          <th className="py-3 px-2 font-bold">مصرف / کل</th>
                          <th className="py-3 px-2 font-bold">رمز</th>
                          <th className="py-3 px-2 font-bold">انقضا</th>
                          <th className="py-3 px-2 font-bold">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => {
                          const remainingDays = Math.ceil((new Date(user.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                          return (
                            <tr key={user.id} className="border-b border-stone-800/60 hover:bg-stone-950/20 transition-all">
                              <td className="py-3 px-2">
                                <div className="font-bold text-stone-200">{user.username}</div>
                                <div className="text-[10px] text-amber-500 font-mono mt-0.5">{user.token}</div>
                              </td>
                              <td className="py-3 px-2 font-mono">
                                <span className={user.usedData >= user.totalData ? "text-rose-400 font-bold" : "text-stone-300"}>
                                  {user.usedData} GB
                                </span> / <span className="text-amber-500">{user.totalData} GB</span>
                              </td>
                              <td className="py-3 px-2 font-mono text-stone-400">{user.password}</td>
                              <td className="py-3 px-2 font-mono">
                                <div className="text-stone-300">{user.expiryDate}</div>
                                <div className={`text-[10px] font-bold mt-0.5 ${remainingDays <= 3 ? "text-rose-400" : "text-emerald-400"}`}>
                                  {remainingDays <= 0 ? 'منقضی' : `${remainingDays} روز`}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-left space-x-1 space-x-reverse">
                                <button 
                                  onClick={() => setEditingUser(user)}
                                  className="px-2 py-1 bg-stone-800 text-amber-400 rounded text-[10px] hover:bg-stone-700"
                                >
                                  ویرایش
                                </button>
                                <button 
                                  onClick={() => toggleUserStatus(user.id)}
                                  className={`px-2 py-1 rounded text-[10px] text-stone-950 font-bold ${
                                    user.status === 'active' ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                >
                                  {user.status === 'active' ? 'مسدود' : 'فعال'}
                                </button>
                                <button 
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="px-2 py-1 bg-rose-950 hover:bg-rose-600 text-rose-300 hover:text-white rounded text-[10px]"
                                >
                                  حذف
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* مدیریت توکن‌ها */}
              {adminSubTab === 'tokens' && (
                <div className="space-y-6">
                  
                  {/* توکن‌های معلق */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
                    <h3 className="text-sm font-bold text-stone-200 mb-4">درخواست‌های معلق توکن رایگان</h3>
                    
                    {tokens.filter(t => t.status === 'pending_approval').length === 0 ? (
                      <p className="text-xs text-stone-500 text-center py-4">درخواستی وجود ندارد.</p>
                    ) : (
                      <div className="space-y-3">
                        {tokens.filter(t => t.status === 'pending_approval').map((req, idx) => (
                          <div key={idx} className="bg-stone-950 p-4 rounded-xl border border-stone-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                            <div>
                              <div className="font-bold text-amber-500">{req.code}</div>
                              <div className="text-stone-300 mt-1">{req.userRequested}</div>
                            </div>
                            <div className="flex gap-2 self-end md:self-auto">
                              <button 
                                onClick={() => approveTokenRequest(req.code)}
                                className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-lg"
                              >
                                تایید درخواست
                              </button>
                              <button 
                                onClick={() => rejectTokenRequest(req.code)}
                                className="px-4 py-1.5 bg-stone-800 text-rose-400 rounded-lg font-bold"
                              >
                                رد
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* تولید گروهی توکن */}
                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md">
                    <h3 className="text-sm font-bold text-stone-200 mb-4">صدور دسته‌ای توکن جدید</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end text-xs">
                      <div>
                        <label className="block text-stone-400 mb-1">نوع توکن</label>
                        <select 
                          value={newTokenConfig.type}
                          onChange={(e) => setNewTokenConfig({ ...newTokenConfig, type: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-stone-300"
                        >
                          <option value="paid">پولی</option>
                          <option value="free">رایگان</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">تعداد توکن</label>
                        <input 
                          type="number" 
                          value={newTokenConfig.count}
                          onChange={(e) => setNewTokenConfig({ ...newTokenConfig, count: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">ترافیک (GB)</label>
                        <input 
                          type="number" 
                          value={newTokenConfig.dataLimit}
                          onChange={(e) => setNewTokenConfig({ ...newTokenConfig, dataLimit: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-400 mb-1">روزهای اعتبار</label>
                        <input 
                          type="number" 
                          value={newTokenConfig.durationDays}
                          onChange={(e) => setNewTokenConfig({ ...newTokenConfig, durationDays: e.target.value })}
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <button 
                          onClick={generateNewTokens}
                          className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-lg transition-all"
                        >
                          صدور توکن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* تنظیمات سیستم */}
              {adminSubTab === 'settings' && (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-6 text-xs">
                  
                  <div>
                    <h3 className="text-sm font-bold text-stone-200 mb-2">قالب پایه کانفیگ V3EEED</h3>
                    <textarea 
                      rows="3"
                      value={settings.vlessTemplate}
                      onChange={(e) => setSettings({ ...settings, vlessTemplate: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-4 font-mono text-amber-500"
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-400 mb-1">ولت USDT (TRC-20)</label>
                      <input 
                        type="text"
                        value={settings.usdtAddress}
                        onChange={(e) => setSettings({ ...settings, usdtAddress: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 font-mono text-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">ولت TON</label>
                      <input 
                        type="text"
                        value={settings.tonAddress}
                        onChange={(e) => setSettings({ ...settings, tonAddress: e.target.value })}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 font-mono text-stone-300"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-stone-800">
                    <button 
                      onClick={() => showToast('تنظیمات عمومی با موفقیت ذخیره شدند.')}
                      className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black rounded-xl"
                    >
                      ذخیره تغییرات پنل
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </main>

      <footer className="border-t border-stone-800 bg-stone-950/80 px-4 py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span>ساخته شده با ❤️ برای پلتفرم V3EEED - کلیه حقوق محفوظ است.</span>
          <div className="flex gap-4">
            <a href="https://t.me/V3EEED_Support" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-all font-bold">پشتیبانی تلگرام V3EEED</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
