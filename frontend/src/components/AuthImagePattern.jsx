import { Code, Terminal, FileCode, Braces } from "lucide-react"
import { useEffect, useState } from "react"

const CodeBackground = ({ title, subtitle }) => {
  const [activeIndex, setActiveIndex] = useState(0)

  const codeSnippets = [
    `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function reverseList(head) {
  let prev = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}`,
    `function isValid(s) {
  const stack = [];
  const map = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let i = 0; i < s.length; i++) {
    if (s[i] in map) {
      stack.push(s[i]);
    } else {
      const last = stack.pop();
      if (map[last] !== s[i]) return false;
    }
  }
  
  return stack.length === 0;
}`,
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % codeSnippets.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [codeSnippets.length])

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center text-white p-12 relative overflow-hidden"
      style={{
        backgroundImage: `url('/lilycode-bg.png')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay to control visibility of bg image */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0" />

      {/* Floating icons */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute top-[10%] left-[15%] animate-pulse"><Braces size={40} /></div>
        <div className="absolute top-[30%] left-[80%] animate-pulse delay-300"><FileCode size={50} /></div>
        <div className="absolute top-[70%] left-[20%] animate-pulse delay-700"><Terminal size={45} /></div>
        <div className="absolute top-[60%] left-[75%] animate-pulse delay-500"><Code size={55} /></div>
        <div className="absolute top-[85%] left-[45%] animate-pulse delay-200"><Braces size={35} /></div>
        <div className="absolute top-[15%] left-[60%] animate-pulse delay-100"><Terminal size={30} /></div>
      </div>

      {/* Code card and content */}
      <div className="z-20 max-w-md flex flex-col items-center">
        <div className="w-full rounded-xl shadow-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-800/70 via-slate-900/80 to-slate-800/70 backdrop-blur-xl transition-all duration-500 hover:scale-[1.015] hover:shadow-[0_0_40px_rgba(100,255,100,0.15)]">
          {/* Top bar */}
          <div className="bg-slate-700/60 px-4 py-2 flex items-center border-b border-slate-600">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="text-xs font-mono text-slate-300">problem.js</div>
          </div>

          {/* Code area */}
          <div className="p-4 font-mono text-xs sm:text-sm relative h-64 text-green-400 bg-black/20">
            <pre className="whitespace-pre-wrap transition-opacity duration-1000">{codeSnippets[activeIndex]}</pre>
            <div className="absolute bottom-4 right-4 w-2 h-4 bg-white animate-blink" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center mt-6 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shadow-lg backdrop-blur-sm border border-primary/30">
            <Code className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
        <p className="text-slate-300 text-center">{subtitle}</p>
      </div>
    </div>
  )
}

export default CodeBackground


