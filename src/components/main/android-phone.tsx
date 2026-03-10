/* eslint-disable */
import { useState, useEffect, useRef, useCallback, memo } from 'react';

// Moved AnalogClockDisplay to be a standalone, memoized component
const AnalogClockDisplay = memo(({ currentTime }: { currentTime: Date }) => {
  if (!currentTime) return null; // Safeguard, though currentTime should always be a Date

  const secDeg = (currentTime.getSeconds() / 60) * 360;
  const minDeg = ((currentTime.getMinutes() * 60 + currentTime.getSeconds()) / 3600) * 360;
  const hourDeg = (((currentTime.getHours() % 12) * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds()) / (12 * 3600)) * 360;

  return (
    <div className="relative w-64 h-64 mx-auto my-8 border-4 border-gray-700 rounded-full shadow-lg bg-gray-800">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
          <div className={`absolute top-2 left-1/2 -ml-px w-0.5 h-2 ${i % 3 === 0 ? 'bg-white h-4' : 'bg-gray-400'}`}></div>
        </div>
      ))}
      <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-white rounded-full z-10"></div>
      <div className="absolute w-full h-full flex justify-center items-center">
        <div className="absolute w-1 h-1/2 bg-gray-300 origin-bottom transform" style={{ transform: `rotate(${hourDeg}deg) translateY(-50%) scaleY(0.6)` }}></div>
        <div className="absolute w-1 h-1/2 bg-gray-200 origin-bottom transform" style={{ transform: `rotate(${minDeg}deg) translateY(-50%) scaleY(0.8)` }}></div>
        <div className="absolute w-0.5 h-1/2 bg-red-500 origin-bottom transform" style={{ transform: `rotate(${secDeg}deg) translateY(-50%) scaleY(0.9)` }}></div>
      </div>
    </div>
  );
});
AnalogClockDisplay.displayName = 'AnalogClockDisplay';


const AndroidProMaxPhone = () => {
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [unlockMessage, setUnlockMessage] = useState<string>('');
  const [isAttemptingUnlock, setIsAttemptingUnlock] = useState<boolean>(false);


  const [showApps, setShowApps] = useState<boolean>(false);
  const [currentApp, setCurrentApp] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [batteryLevel] = useState<number>(87);
  const [signalStrength] = useState<number>(4);
  const [volume, setVolume] = useState<number>(70);
  const [showVolumeOSD, setShowVolumeOSD] = useState<boolean>(false);
  const volumeOsdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const PIN_CODE = "1234";
  const [history, setHistory] = useState<string[]>([]);

  // 360 View State
  const [is360View, setIs360View] = useState<boolean>(false);
  const [rotationY, setRotationY] = useState<number>(0);
  const [isDragging360, setIsDragging360] = useState<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const initialRotationYRef = useRef<number>(0);
  const phoneFrameRef = useRef<HTMLDivElement>(null);


  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const startCamera = useCallback(async () => {
    if (cameraStream) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      setCameraStream(stream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCurrentApp(null);
      setShowApps(true);
      alert("Could not access camera. Please ensure permissions are granted.");
    }
  }, [cameraStream]);


  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    if (is360View) { // Stop camera if entering 360 view
      if (cameraStream) stopCamera();
      return;
    }
    if (currentApp === 'Camera') {
      if (!cameraStream) startCamera();
    } else {
      if (cameraStream) stopCamera();
    }
  }, [currentApp, startCamera, stopCamera, cameraStream, is360View]);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        stopCamera();
      }
    };
  }, [cameraStream, stopCamera]);


  const goHome = useCallback(() => {
    setCurrentApp(null);
    setShowApps(true);
    setHistory([]);
  }, []);

  const goBack = useCallback(() => {
    if (is360View) return;
    if (history.length > 0) {
      const newHistory = [...history];
      const destination = newHistory.pop();
      setHistory(newHistory);

      if (destination === 'home') {
        setCurrentApp(null);
        setShowApps(true);
      } else if (destination) {
        setCurrentApp(destination);
      } else {
        goHome();
      }
    } else {
      if (currentApp !== null) {
        goHome();
      }
    }
  }, [history, currentApp, goHome, is360View]);

  const openApp = (appName: string) => {
    if (is360View) return;
    if (currentApp) {
      setHistory(prev => [...prev, currentApp]);
    } else if (showApps) {
      setHistory(prev => [...prev, 'home']);
    }
    setCurrentApp(appName);
    setShowApps(false);
  };

  const openAppOrLink = (app: { name: string; link: string | null }) => {
    if (is360View) return;
    if (app.link) {
      window.open(app.link, '_blank');
    } else {
      openApp(app.name);
    }
  };

  const [clockTab, setClockTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');
  const [stopwatchValue, setStopwatchValue] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInputValue, setTimerInputValue] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentAnalogTime, setCurrentAnalogTime] = useState(new Date());

  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);

  const [notes, setNotes] = useState<{ id: number, text: string }[]>([]);
  const [newNote, setNewNote] = useState('');

  const [display, setDisplay] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string>('');
  const [operation, setOperation] = useState<string>('');
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  const [weatherData, setWeatherData] = useState({
    location: 'New York',
    temperature: 22,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 12
  });


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning && !is360View) {
      interval = setInterval(() => setStopwatchValue(s => s + 0.01), 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning, is360View]);

  const handleStopwatchToggle = () => { if (!is360View) setStopwatchRunning(prev => !prev); }
  const handleStopwatchReset = () => {
    if (!is360View) {
      setStopwatchRunning(false);
      setStopwatchValue(0);
    }
  };

  const formatStopwatchTime = (timeInSeconds: number) => {
    const totalMilliseconds = Math.floor(timeInSeconds * 100);
    const minutes = Math.floor(totalMilliseconds / 6000);
    const seconds = Math.floor((totalMilliseconds % 6000) / 100);
    const milliseconds = totalMilliseconds % 100;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timer > 0 && !is360View) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            setTimerRunning(false);
            alert("Timer Finished!");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else if (timer === 0 && timerRunning) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timer, is360View]);

  const handleTimerSet = () => {
    if (is360View) return;
    const parts = timerInputValue.split(':').map(Number);
    let totalSeconds = 0;
    if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    else if (parts.length === 2) totalSeconds = parts[0] * 60 + parts[1];
    else if (parts.length === 1 && !isNaN(parts[0])) totalSeconds = parts[0];

    if (totalSeconds > 0) {
      setTimer(totalSeconds);
      setTimerRunning(false);
    } else {
      alert("Invalid time format. Use HH:MM:SS, MM:SS, or SS.");
    }
  };
  const handleTimerToggle = () => {
    if (is360View) return;
    if (timer > 0) setTimerRunning(prev => !prev);
    else alert("Set timer duration first.");
  };
  const handleTimerReset = () => {
    if (is360View) return;
    setTimerRunning(false);
    setTimer(0);
    setTimerInputValue('');
  };

  useEffect(() => {
    if (is360View || clockTab !== 'clock' || currentApp !== 'Clock' || !isPoweredOn || isLocked) {
      return;
    }
    const interval = setInterval(() => setCurrentAnalogTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [clockTab, currentApp, isPoweredOn, isLocked, is360View]);


  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
      setCurrentDate(now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }));
    };
    if (!is360View) { // Only update time if not in 360 view, or it can run in bg.
      updateDateTime();
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [is360View]);

  const handlePowerPress = () => {
    if (is360View) return;
    if (!isPoweredOn) {
      setIsPoweredOn(true);
      setIsLocked(false);
      setShowApps(true);
      setCurrentApp(null);
      setPinInput('');
      setUnlockMessage('');
    } else {
      setIsPoweredOn(false);
      setShowApps(false);
      setCurrentApp(null);
      setIsLocked(true);
      setHistory([]);
      if (cameraStream) stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (volumeOsdTimeoutRef.current) {
        clearTimeout(volumeOsdTimeoutRef.current);
      }
    };
  }, []);

  const showVolumeWithTimeout = () => {
    setShowVolumeOSD(true);
    if (volumeOsdTimeoutRef.current) {
      clearTimeout(volumeOsdTimeoutRef.current);
    }
    volumeOsdTimeoutRef.current = setTimeout(() => {
      setShowVolumeOSD(false);
      volumeOsdTimeoutRef.current = null;
    }, 2000);
  };

  const handleVolumeUp = () => {
    if (!isPoweredOn || is360View) return;
    setVolume(prev => Math.min(100, prev + 10));
    showVolumeWithTimeout();
  };

  const handleVolumeDown = () => {
    if (!isPoweredOn || is360View) return;
    setVolume(prev => Math.max(0, prev - 10));
    showVolumeWithTimeout();
  };


  const calculateWinner = (squares: (string | null)[]): string | null => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) return 'Draw';
    return null;
  };

  useEffect(() => {
    setWinner(calculateWinner(board));
  }, [board]);

  const handleTicTacToeClick = (index: number) => {
    if (is360View || board[index] || winner || !isXNext) return; // Prevent clicking if not X's turn
    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
  };

  useEffect(() => {
    if (!isXNext && !winner && currentApp === 'TicTacToe') {
      const timer = setTimeout(() => {
        const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
        if (emptyIndices.length === 0) return;

        let move = -1;
        // 1. Check if bot (O) can win
        for (const idx of emptyIndices) {
          const testBoard = [...board];
          testBoard[idx] = 'O';
          if (calculateWinner(testBoard) === 'O') { move = idx; break; }
        }
        // 2. Check if player (X) can win and block
        if (move === -1) {
          for (const idx of emptyIndices) {
            const testBoard = [...board];
            testBoard[idx] = 'X';
            if (calculateWinner(testBoard) === 'X') { move = idx; break; }
          }
        }
        // 3. Take center if available
        if (move === -1 && emptyIndices.includes(4)) {
          move = 4;
        }
        // 4. Random move
        if (move === -1) {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        setIsXNext(true);
      }, 500); // 500ms delay to feel like the bot is thinking
      return () => clearTimeout(timer);
    }
  }, [board, isXNext, winner, currentApp]);

  const resetGame = () => {
    if (is360View) return;
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const inputNumber = (num: string) => {
    if (is360View) return;
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (is360View) return;
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const inputOperation = (nextOperation: string) => {
    if (is360View) return;
    const inputValue = parseFloat(display);

    if (previousValue === '') {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }
    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, op: string): number => {
    let result;
    switch (op) {
      case '+': result = firstValue + secondValue; break;
      case '-': result = firstValue - secondValue; break;
      case '×': result = firstValue * secondValue; break;
      case '÷': result = secondValue === 0 ? Infinity : firstValue / secondValue; break;
      default: result = secondValue;
    }
    return parseFloat(Number(result).toPrecision(12));
  };

  const performCalculation = () => {
    if (is360View) return;
    const inputValue = parseFloat(display);
    if (previousValue !== '' && operation) {
      const newValue = calculate(parseFloat(previousValue), inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue('');
      setOperation('');
      setWaitingForOperand(false);
    }
  };

  const clearCalculator = () => {
    if (is360View) return;
    setDisplay('0');
    setPreviousValue('');
    setOperation('');
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    if (is360View) return;
    setDisplay(prev => String(parseFloat(prev) * -1));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePinInput = (digit: string) => {
    if (is360View || isAttemptingUnlock || pinInput.length >= 4) return;

    const newPin = pinInput + digit;
    setPinInput(newPin);
    setUnlockMessage('');

    if (newPin.length === 4) {
      setIsAttemptingUnlock(true);
      setTimeout(() => attemptUnlock(newPin), 100);
    }
  };

  const handleDeletePin = () => {
    if (is360View || isAttemptingUnlock) return;
    setPinInput(prev => prev.slice(0, -1));
    setUnlockMessage('');
  };

  const attemptUnlock = (pin: string) => {
    if (is360View) return;
    if (pin === PIN_CODE) {
      setUnlockMessage('Unlocked!');
      setTimeout(() => {
        setIsLocked(false);
        setShowApps(true);
        setPinInput('');
        setUnlockMessage('');
        setIsAttemptingUnlock(false);
      }, 500);
    } else {
      setUnlockMessage('Incorrect PIN');
      setPinInput('');
      setTimeout(() => {
        setIsAttemptingUnlock(false);
      }, 1000);
    }
  };

  // 360 View Handlers
  const handleToggle360View = () => {
    setIs360View(prev => !prev);
  };

  const handle360MouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is360View) return;
    e.preventDefault();
    setIsDragging360(true);
    dragStartXRef.current = e.clientX;
    initialRotationYRef.current = rotationY;
  };

  const handle360MouseMoveGlobal = useCallback((e: MouseEvent) => {
    if (!is360View || !isDragging360) return;
    e.preventDefault();
    const dx = e.clientX - dragStartXRef.current;
    setRotationY(initialRotationYRef.current - dx * 0.3); // Adjust sensitivity
  }, [is360View, isDragging360]);

  const handle360MouseUpGlobal = useCallback(() => {
    if (!is360View || !isDragging360) return; // Ensure we only act if we were dragging in 360 view
    setIsDragging360(false);
  }, [is360View, isDragging360]); // Added isDragging360 here for safety.

  useEffect(() => {
    if (is360View && isDragging360) {
      document.addEventListener('mousemove', handle360MouseMoveGlobal);
      document.addEventListener('mouseup', handle360MouseUpGlobal);
      return () => {
        document.removeEventListener('mousemove', handle360MouseMoveGlobal);
        document.removeEventListener('mouseup', handle360MouseUpGlobal);
      };
    }
  }, [is360View, isDragging360, handle360MouseMoveGlobal, handle360MouseUpGlobal]);


  const apps = [
    { name: 'GitHub', icon: 'github', link: 'https://github.com/Aditya7594', description: 'View my code repositories' },
    { name: 'LinkedIn', icon: 'linkedin', link: 'https://linkedin.com/in/yourusername', description: 'Professional network' },
    { name: 'Clock', icon: 'clock', link: null, description: 'World clock & time zones' },
    { name: 'TicTacToe', icon: 'tictactoe', link: null, description: 'Classic X and O game' },
    { name: 'Camera', icon: 'camera', link: null, description: 'Take photos & selfies' },
    { name: 'Calculator', icon: 'calculator', link: null, description: 'Basic calculations' },
    { name: 'Weather', icon: 'weather', link: null, description: 'Weather forecast' },
    { name: 'Notes', icon: 'notes', link: null, description: 'Write down thoughts' },
    { name: 'Music', icon: 'music', link: null, description: 'Audio player' },
    { name: 'Gallery', icon: 'gallery', link: null, description: 'Photo gallery' },
    { name: 'Settings', icon: 'settings', link: null, description: 'Phone settings' }
  ];

  const AppIcon = ({ icon, className = "w-10 h-10" }: { icon: string, className?: string }) => {
    switch (icon) {
      case 'github': return <svg className={`${className} text-white`} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>;
      case 'linkedin': return <svg className={`${className} text-blue-400`} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
      case 'clock': return <svg className={`${className} text-yellow-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>;
      case 'tictactoe': return <svg className={`${className} text-purple-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>;
      case 'camera': return <svg className={`${className} text-green-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
      case 'calculator': return <svg className={`${className} text-orange-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="10" x2="16" y2="10" strokeWidth="2.5" strokeLinecap="round" /><line x1="12" y1="10" x2="12" y2="10" strokeWidth="2.5" strokeLinecap="round" /><line x1="8" y1="10" x2="8" y2="10" strokeWidth="2.5" strokeLinecap="round" /><line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5" strokeLinecap="round" /><line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5" strokeLinecap="round" /><line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5" strokeLinecap="round" /><line x1="16" y1="18" x2="16" y2="18" strokeWidth="2.5" strokeLinecap="round" /><line x1="12" y1="18" x2="12" y2="18" strokeWidth="2.5" strokeLinecap="round" /><line x1="8" y1="18" x2="8" y2="18" strokeWidth="2.5" strokeLinecap="round" /></svg>;
      case 'weather': return <svg className={`${className} text-cyan-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>;
      case 'notes': return <svg className={`${className} text-yellow-300`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
      case 'music': return <svg className={`${className} text-pink-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
      case 'gallery': return <svg className={`${className} text-indigo-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>;
      case 'settings': return <svg className={`${className} text-gray-400`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
      default: return null;
    }
  };
  AppIcon.displayName = 'AppIcon';

  const StatusBar = memo(() => (
    <div className="absolute top-0 left-0 right-0 h-8 bg-black bg-opacity-30 backdrop-blur-sm flex justify-between items-center px-4 text-white text-xs font-medium z-50">
      <div className="flex items-center gap-1">
        <span>{isPoweredOn ? currentTime.replace(/:\d\d /, ' ') : ''}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 bg-white rounded-sm ${bar <= signalStrength ? 'opacity-100' : 'opacity-30'}`}
              style={{ height: `${bar * 2 + 2}px` }}
            />
          ))}
        </div>
        <div className="flex items-center">
          <div className="w-5 h-2.5 border border-white rounded-sm relative p-0.5">
            <div className="h-full bg-white rounded-xs transition-all" style={{ width: `${batteryLevel}%` }} />
          </div>
        </div>
        <span className="text-xs">{batteryLevel}%</span>
      </div>
    </div>
  ));
  StatusBar.displayName = 'StatusBar';

  const VolumeOSD = memo(() => (
    showVolumeOSD && isPoweredOn && (
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-lg rounded-2xl px-6 py-4 z-[60]">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
          <div className="w-24 h-2 bg-gray-600 rounded-full"><div className="h-full bg-white rounded-full transition-all" style={{ width: `${volume}%` }} /></div>
          <span className="text-white text-sm">{volume}</span>
        </div>
      </div>
    )
  ));
  VolumeOSD.displayName = 'VolumeOSD';

  const NavigationBar = memo(() => (
    (isPoweredOn && !isLocked && (currentApp || showApps)) && (
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black bg-opacity-50 backdrop-blur-lg flex justify-around items-center px-6 z-50">
        <button onClick={goBack} className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={goHome} className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></svg>
        </button>
      </div>
    )
  ));
  NavigationBar.displayName = 'NavigationBar';

  const LockScreen = memo(() => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-80 backdrop-blur-md p-8 z-40">
      <div className="text-6xl font-thin mb-4">{currentTime.replace(/:\d\d /, ' ')}</div>
      <div className="text-xl opacity-80 mb-8">{currentDate}</div>

      <div className="mb-4 h-8">
        <p className={`text-center text-lg ${unlockMessage === 'Incorrect PIN' ? 'text-red-500' : 'text-green-500'}`}>
          {unlockMessage || 'Enter PIN'}
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 mb-8">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 ${pinInput.length > i ? 'bg-white border-white' : 'border-gray-500'} transition-all`}></div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <button
            key={digit}
            onClick={() => handlePinInput(String(digit))}
            disabled={isAttemptingUnlock}
            className="text-3xl font-light p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 aspect-square flex items-center justify-center disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <div />
        <button
          onClick={() => handlePinInput('0')}
          disabled={isAttemptingUnlock}
          className="text-3xl font-light p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 aspect-square flex items-center justify-center disabled:opacity-50"
        >0</button>
        <button
          onClick={handleDeletePin}
          disabled={isAttemptingUnlock}
          className="text-2xl p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 aspect-square flex items-center justify-center disabled:opacity-50"
        ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path><line x1="18" y1="9" x2="12" y2="15"></line><line x1="12" y1="9" x2="18" y2="15"></line></svg>
        </button>
      </div>
    </div>
  ));
  LockScreen.displayName = 'LockScreen';


  const CameraApp = memo(() => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
      {!cameraStream && <p className="absolute text-white">Starting camera...</p>}
    </div>
  ));
  CameraApp.displayName = 'CameraApp';

  const ClockApp = memo(() => {
    return (
      <div className="p-4 flex flex-col h-full text-white">
        <div className="flex justify-around mb-4 border-b border-gray-700">
          {['clock', 'stopwatch', 'timer'].map(tab => (
            <button key={tab} onClick={() => { if (!is360View) setClockTab(tab as any) }} className={`py-2 px-4 capitalize ${clockTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </div>
        {clockTab === 'clock' && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <AnalogClockDisplay currentTime={currentAnalogTime} />
            <p className="text-3xl mt-4">{currentAnalogTime.toLocaleTimeString()}</p>
            <p className="text-lg text-gray-400">{currentAnalogTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        )}
        {clockTab === 'stopwatch' && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-6xl font-mono mb-8">{formatStopwatchTime(stopwatchValue)}</p>
            <div className="flex gap-4">
              <button onClick={handleStopwatchToggle} className="px-6 py-3 bg-blue-600 rounded-full text-lg">{stopwatchRunning ? 'Pause' : 'Start'}</button>
              <button onClick={handleStopwatchReset} className="px-6 py-3 bg-gray-600 rounded-full text-lg">Reset</button>
            </div>
          </div>
        )}
        {clockTab === 'timer' && (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-6xl font-mono mb-6">{formatTime(timer)}</p>
            {!timerRunning && timer === 0 && (
              <div className="flex flex-col items-center w-full px-4">
                <input
                  type="text"
                  value={timerInputValue}
                  onChange={(e) => { if (!is360View) setTimerInputValue(e.target.value) }}
                  placeholder="HH:MM:SS or MM:SS or SS"
                  className="bg-gray-700 text-white p-3 rounded-lg mb-4 w-full text-center text-lg"
                />
                <button onClick={handleTimerSet} className="px-8 py-3 bg-green-600 rounded-full text-lg mb-4 w-full">Set Timer</button>
              </div>
            )}
            {(timer > 0 || timerRunning) && (
              <div className="flex gap-4">
                <button onClick={handleTimerToggle} className={`px-6 py-3 ${timerRunning ? 'bg-red-600' : 'bg-green-600'} rounded-full text-lg`}>{timerRunning ? 'Pause' : 'Start'}</button>
                <button onClick={handleTimerReset} className="px-6 py-3 bg-gray-600 rounded-full text-lg">Reset</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });
  ClockApp.displayName = 'ClockApp';

  const TicTacToeApp = memo(() => (
    <div className="p-4 flex flex-col items-center justify-center h-full text-white">
      <h2 className="text-3xl mb-6 font-semibold">Tic Tac Toe</h2>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((value, i) => (
          <button
            key={i}
            onClick={() => handleTicTacToeClick(i)}
            className="w-20 h-20 bg-gray-700 text-4xl font-bold rounded-lg flex items-center justify-center hover:bg-gray-600 disabled:opacity-80"
            disabled={!!value || !!winner || is360View}
          >
            {value === 'X' ? <span className="text-blue-400">{value}</span> : <span className="text-yellow-400">{value}</span>}
          </button>
        ))}
      </div>
      <div className="text-xl mb-6 h-8">
        {winner ? (winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`) : `Next player: ${isXNext ? 'X' : 'O'}`}
      </div>
      <button onClick={resetGame} className="px-6 py-3 bg-blue-600 rounded-full text-lg hover:bg-blue-700">
        Reset Game
      </button>
    </div>
  ));
  TicTacToeApp.displayName = 'TicTacToeApp';

  const CalculatorApp = memo(() => {
    const buttons = [
      { label: 'AC', type: 'clear', className: 'col-span-2 bg-gray-500 hover:bg-gray-600' },
      { label: '+/-', type: 'sign', className: 'bg-gray-500 hover:bg-gray-600' },
      { label: '÷', type: 'operator', value: '÷', className: 'bg-orange-500 hover:bg-orange-600' },
      { label: '7', type: 'number', value: '7' }, { label: '8', type: 'number', value: '8' },
      { label: '9', type: 'number', value: '9' }, { label: '×', type: 'operator', value: '×', className: 'bg-orange-500 hover:bg-orange-600' },
      { label: '4', type: 'number', value: '4' }, { label: '5', type: 'number', value: '5' },
      { label: '6', type: 'number', value: '6' }, { label: '-', type: 'operator', value: '-', className: 'bg-orange-500 hover:bg-orange-600' },
      { label: '1', type: 'number', value: '1' }, { label: '2', type: 'number', value: '2' },
      { label: '3', type: 'number', value: '3' }, { label: '+', type: 'operator', value: '+', className: 'bg-orange-500 hover:bg-orange-600' },
      { label: '0', type: 'number', value: '0', className: 'col-span-2' },
      { label: '.', type: 'decimal', value: '.' },
      { label: '=', type: 'equals', className: 'bg-orange-500 hover:bg-orange-600' },
    ];

    const handleClick = (btn: any) => {
      if (is360View) return;
      switch (btn.type) {
        case 'number': inputNumber(btn.value); break;
        case 'operator': inputOperation(btn.value); break;
        case 'decimal': inputDecimal(); break;
        case 'clear': clearCalculator(); break;
        case 'equals': performCalculation(); break;
        case 'sign': toggleSign(); break;
      }
    };

    return (
      <div className="p-4 flex flex-col h-full bg-gray-800 text-white">
        <div className="flex-grow flex items-end justify-end p-4 bg-gray-900 rounded-t-lg mb-px">
          <p className="text-5xl font-light break-all">{display}</p>
        </div>
        <div className="grid grid-cols-4 gap-px bg-gray-700 rounded-b-lg overflow-hidden">
          {buttons.map(btn => (
            <button
              key={btn.label}
              onClick={() => handleClick(btn)}
              disabled={is360View}
              className={`p-5 text-2xl ${btn.className || 'bg-gray-600 hover:bg-gray-700'} focus:outline-none transition-colors duration-150 disabled:opacity-50`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    );
  });
  CalculatorApp.displayName = 'CalculatorApp';


  const WeatherApp = memo(({ data, setData }: { data: typeof weatherData, setData: typeof setWeatherData }) => {
    useEffect(() => {
      if (is360View) return;
      const interval = setInterval(() => {
        setData(prev => ({
          ...prev,
          temperature: prev.temperature + (Math.random() > 0.5 ? 1 : -1) % 5 + 20,
          humidity: Math.min(100, Math.max(0, prev.humidity + (Math.random() > 0.5 ? 2 : -2))),
          windSpeed: Math.max(0, prev.windSpeed + (Math.random() > 0.5 ? 1 : -1))
        }));
      }, 5000);
      return () => clearInterval(interval);
    }, [setData, is360View]);

    return (
      <div className="p-6 flex flex-col items-center justify-center h-full text-white bg-gradient-to-br from-blue-500 to-indigo-700">
        <h2 className="text-4xl font-semibold mb-2">{data.location}</h2>
        <p className="text-7xl font-light mb-2">{data.temperature}°C</p>
        <p className="text-2xl mb-6">{data.condition}</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg">
          <p>Humidity:</p><p className="font-semibold">{data.humidity}%</p>
          <p>Wind:</p><p className="font-semibold">{data.windSpeed} km/h</p>
        </div>
      </div>
    );
  });
  WeatherApp.displayName = 'WeatherApp';


  const PlaceholderApp = memo(({ appName }: { appName: string }) => (
    <div className="p-4 flex flex-col items-center justify-center h-full text-white">
      <AppIcon icon={appName.toLowerCase()} className="w-16 h-16 mb-4" />
      <h2 className="text-3xl mb-4 font-semibold">{appName}</h2>
      <p className="text-xl text-gray-400">This app is under construction.</p>
      <p className="text-gray-500 mt-2">Coming soon!</p>
    </div>
  ));
  PlaceholderApp.displayName = 'PlaceholderApp';

  const NotesApp = memo(() => {
    const handleAddNote = () => {
      if (newNote.trim() && !is360View) {
        setNotes([...notes, { id: Date.now(), text: newNote }]);
        setNewNote('');
      }
    };
    return (
      <div className="p-4 flex flex-col h-full bg-[#fffbda] text-gray-800">
        <h2 className="text-3xl mb-4 font-bold text-yellow-600 border-b border-yellow-300 pb-2 flex items-center gap-2">
          <AppIcon icon="notes" className="w-8 h-8 text-yellow-600" />
          Notes
        </h2>
        <div className="flex-grow overflow-y-auto mb-4 space-y-3 app-content-scrollbar">
          {notes.length === 0 ? <p className="text-gray-400 italic text-center mt-10">No notes yet...</p> : notes.map(n => (
            <div key={n.id} className="p-3 bg-white rounded-xl shadow-sm border border-yellow-200 break-words">
              <p className="whitespace-pre-wrap text-sm md:text-base">{n.text}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={e => { if (!is360View) setNewNote(e.target.value) }}
            onKeyDown={e => { if (e.key === 'Enter') handleAddNote() }}
            placeholder="Type a note..."
            className="flex-grow p-3 rounded-xl border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm md:text-base"
          />
          <button onClick={handleAddNote} className="bg-yellow-500 text-white px-4 md:px-6 py-3 rounded-xl hover:bg-yellow-600 font-bold transition-colors">Add</button>
        </div>
      </div>
    );
  });
  NotesApp.displayName = 'NotesApp';


  const renderCurrentApp = () => {
    switch (currentApp) {
      case 'Camera': return <CameraApp />;
      case 'Clock': return <ClockApp />;
      case 'TicTacToe': return <TicTacToeApp />;
      case 'Calculator': return <CalculatorApp />;
      case 'Weather': return <WeatherApp data={weatherData} setData={setWeatherData} />;
      case 'Notes': return <NotesApp />;
      case 'Music': return <PlaceholderApp appName="Music" />;
      case 'Gallery': return <PlaceholderApp appName="Gallery" />;
      case 'Settings': return <PlaceholderApp appName="Settings" />;
      default: return null; // Should not be reached if logic is sound, covered by AppList display
    }
  };

  // Main layout with 360 view button and perspective
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8"
      style={is360View ? { perspective: '1000px' } : {}}
    >
      {!is360View && ( // Hide guides and app lists when in 360 view for clarity
        <>
          <div className="hidden lg:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 text-white text-sm max-w-xs z-10">
            <h3 className="font-bold mb-4 text-lg">📱 Phone Guide</h3>
            <div className="space-y-3">
              <div><span className="font-semibold">🔓 PIN:</span> 1234</div>
              <div><span className="font-semibold">⚡ Power:</span> Right edge button</div>
              <div><span className="font-semibold">🔊 Volume:</span> Left edge buttons</div>
              <div><span className="font-semibold">📱 Apps:</span> Tap icons to open</div>
              <div><span className="font-semibold">📷 Camera:</span> Uses your webcam</div>
              <div><span className="font-semibold">🔗 Links:</span> GitHub & LinkedIn</div>
            </div>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="mt-4 px-4 py-2 bg-blue-600 rounded-full text-xs hover:bg-blue-700 transition-colors"
            >
              {showGuide ? 'Hide' : 'Show'} Details
            </button>
            {showGuide && (
              <div className="mt-4 space-y-2 text-xs opacity-80">
                <div>• Realistic phone interactions</div>
                <div>• Working camera & apps</div>
                <div>• Auto-unlock with correct PIN</div>
                <div>• Volume controls with OSD</div>
                <div>• Professional portfolio piece</div>
              </div>
            )}
          </div>
          <div className="hidden lg:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 text-white text-sm max-w-xs z-10">
            <h3 className="font-bold mb-4 text-lg">📱 Available Apps</h3>
            <div className="space-y-2">
              {apps.filter(app => app.name !== 'Music' && app.name !== 'Gallery').slice(0, 7).map((app) => (
                <div key={app.name} className="flex items-start gap-3">
                  <AppIcon icon={app.icon} className="w-8 h-8 mt-0.5" />
                  <div>
                    <div className="font-semibold">{app.name}</div>
                    <div className="text-xs opacity-80">{app.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Phone container with metallic/glass styling and mobile responsiveness */}
      <div
        ref={phoneFrameRef}
        className="relative w-[320px] sm:w-[380px] h-[680px] sm:h-[800px] mt-8 mb-16 mx-auto bg-gradient-to-br from-slate-400 via-slate-700 to-slate-900 rounded-[48px] sm:rounded-[56px] p-[2px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] sm:shadow-[0_0_80px_rgba(168,85,247,0.3)] overflow-hidden select-none ring-1 ring-white/10"
      >
        {/* Inner bezel */}
        <div className="absolute inset-0 bg-gradient-to-bl from-black via-gray-900 to-black rounded-[46px] sm:rounded-[54px] p-2 sm:p-3 shadow-inner">
          <div className="w-full h-full bg-black rounded-[38px] sm:rounded-[44px] overflow-hidden relative border-[4px] border-black/80">
            {/* Notch with camera lens reflection */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-black rounded-b-[18px] z-40 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {/* Camera Lens */}
              <div className="w-3.5 h-3.5 bg-gray-900 rounded-full mr-3 border-2 border-slate-800 relative overflow-hidden flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 bg-blue-900 rounded-full opacity-60"></div>
                <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-80 shadow-[0_0_2px_rgba(255,255,255,0.8)]"></div>
              </div>
              {/* Speaker Grill */}
              <div className="w-10 h-1.5 bg-gray-800 rounded-full border border-gray-700 shadow-inner"></div>
            </div>

            {/* Physical Buttons - conditionally enable/disable styling and onClick */}
            <button
              onClick={handlePowerPress}
              className={`absolute right-[-6px] top-32 w-1.5 h-16 bg-gradient-to-r from-slate-600 to-slate-400 rounded-l-md z-50 shadow-md hover:from-slate-500 hover:to-slate-300 active:scale-95 transition-all duration-200`}
            />
            <button
              onClick={handleVolumeUp}
              className={`absolute left-[-6px] top-28 w-1.5 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-r-md shadow-md hover:from-slate-400 hover:to-slate-500 active:scale-95 transition-all duration-200`}
            />
            <button
              onClick={handleVolumeDown}
              className={`absolute left-[-6px] top-44 w-1.5 h-12 bg-gradient-to-r from-slate-500 to-slate-600 rounded-r-md shadow-md hover:from-slate-400 hover:to-slate-500 active:scale-95 transition-all duration-200`}
            />
            <div className={`absolute left-[-6px] top-20 w-1.5 h-6 bg-slate-700 rounded-r-md shadow-md`}></div>


            {/* Screen Content */}
            <div className={`w-full h-full 
                           bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden rounded-[34px] sm:rounded-[40px]`}>

              {/* Wallpaper Backdrop Darkening */}
              <div className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pt-6 transition-opacity duration-500 ${isPoweredOn ? 'opacity-100' : 'opacity-0'}`}></div>

              {isPoweredOn ? (
                <div className="w-full h-full text-white relative flex flex-col pt-[10px]">
                  <StatusBar />
                  <VolumeOSD />

                  <div className="flex-grow overflow-hidden relative z-10">
                    {isLocked ? (
                      <LockScreen />
                    ) : currentApp ? (
                      <div className="h-full pt-8 pb-16 overflow-y-auto app-content-scrollbar bg-black/90 backdrop-blur-md">
                        {renderCurrentApp()}
                      </div>
                    ) : ( // Default to App List (Home Screen) if unlocked and no current app
                      <div className="h-full pt-8 overflow-y-auto app-content-scrollbar">
                        <div className="text-center mt-12 mb-8 px-6 drop-shadow-lg">
                          <div className="text-6xl sm:text-7xl font-light text-white tracking-wider">{currentTime.replace(/:\d\d /, ' ')}</div>
                          <div className="text-lg sm:text-xl font-medium text-white/90 mt-2">{currentDate}</div>
                        </div>
                        <div className="grid grid-cols-4 gap-x-2 gap-y-6 px-4">
                          {apps.map((app) => (
                            <button
                              key={app.name}
                              onClick={() => openAppOrLink(app)}
                              className="flex flex-col items-center justify-start gap-1 p-2 rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all duration-200 focus:outline-none"
                              style={{ minHeight: '5rem' }}
                            >
                              <div className="bg-gradient-to-tr from-gray-800 to-gray-700 p-2 sm:p-2.5 rounded-[14px] sm:rounded-[18px] shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-200">
                                <AppIcon icon={app.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
                              </div>
                              <div className="text-white text-[10px] sm:text-xs font-semibold drop-shadow-md mt-1 truncate w-full text-center">{app.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {!isLocked && <NavigationBar /> /* Show nav bar only if unlocked */}
                </div>
              ) : (
                <div className="w-full h-full bg-black rounded-[36px] flex flex-col items-center justify-end pb-24 sm:pb-32 relative overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-50 rounded-b-[36px] pointer-events-none"></div>

                  <button
                    onClick={handlePowerPress}
                    className="relative z-10 flex flex-col items-center justify-center group focus:outline-none mb-4 sm:mb-6"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:bg-white/10 group-active:scale-95 transition-all duration-300">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white/40 group-hover:text-white/80 transition-all animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <span className="mt-4 text-white/30 text-[10px] sm:text-xs tracking-[0.2em] font-medium uppercase group-hover:text-white/60 transition-colors">Touch to Wake</span>
                  </button>
                </div> // Phone is off with fingerprint prompt
              )}
            </div>

            {/* Screen Glare effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none rounded-[36px]"></div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .app-content-scrollbar::-webkit-scrollbar { width: 4px; }
        .app-content-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 4px; }
        .app-content-scrollbar::-webkit-scrollbar-track { background-color: transparent; }
      `}</style>
    </div>
  );
}

export default AndroidProMaxPhone;