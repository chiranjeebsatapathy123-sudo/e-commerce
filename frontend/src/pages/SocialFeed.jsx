import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, ShoppingBag, User, Music, Play, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_VIDEOS = [
  {
    id: 1,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    creator: "@techreviewer",
    description: "Check out this amazing new smartwatch! #tech #gadgets #review",
    song: "Original Sound - techreviewer",
    likes: "12.4K",
    comments: 85,
    shares: 42,
    productId: 1,
    productName: "Premium Smartwatch Series 9",
    price: 299.99
  },
  {
    id: 2,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    creator: "@fashionista",
    description: "The only headphones you'll ever need. The sound quality is insane! 🎧✨ #audio #musthave",
    song: "Trending Audio - TopHits",
    likes: "89.2K",
    comments: 420,
    shares: 210,
    productId: 2,
    productName: "Noise Cancelling Headphones Pro",
    price: 349.00
  },
  {
    id: 3,
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    creator: "@homehacks",
    description: "Smart home setup complete! 🏠💡 You need these lights in your life.",
    song: "Chill Vibes - LoFi Beats",
    likes: "3.4K",
    comments: 112,
    shares: 18,
    productId: 3,
    productName: "Smart Light Bulbs Pack (4-Count)",
    price: 45.99
  }
];

const VideoPost = ({ post, addToCart, isActive }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(e => console.log("Auto-play prevented", e));
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] snap-start snap-always flex justify-center bg-black overflow-hidden">
      <div className="relative w-full max-w-[500px] h-full flex flex-col justify-center bg-gray-900 group" onClick={togglePlay}>
        
        <video 
          ref={videoRef}
          src={post.url} 
          loop 
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover cursor-pointer"
        ></video>

        {/* Play/Pause Overlay Indicator (shows briefly when clicked) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play size={40} fill="white" className="text-white ml-2" />
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-6 right-4 z-20 flex gap-4 pointer-events-auto">
          <button onClick={toggleMute} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        {/* Bottom Info Section (Creator, Description, Product) */}
        <div className="absolute bottom-4 left-4 right-20 text-white z-10 pointer-events-auto">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 hover:underline cursor-pointer drop-shadow-md">
                {post.creator}
              </h3>
              <p className="text-sm mt-1 text-gray-100 drop-shadow-md line-clamp-2">{post.description}</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-200 drop-shadow-md mb-2">
              <Music size={14} className="animate-pulse" />
              <div className="overflow-hidden w-48 whitespace-nowrap">
                <span className="inline-block animate-[marquee_5s_linear_infinite]">{post.song}</span>
              </div>
            </div>
            
            {/* Shoppable Product Card Overlay */}
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-between pointer-events-auto hover:bg-white/20 transition-colors shadow-lg cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/product/${post.productId}`); }}>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white drop-shadow-sm">{post.productName}</span>
                <span className="text-sm font-black text-[#00E5FF] drop-shadow-sm">${post.price}</span>
              </div>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  addToCart({ id: post.productId, name: post.productName, price: post.price, stock: 10 }); 
                }}
                className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <ShoppingBag size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Action Sidebar */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6 items-center z-20 pointer-events-auto">
          {/* Profile Avatar */}
          <div className="relative mb-4 cursor-pointer hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-800 flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white shadow-md">
              <span className="text-lg leading-none mt-[-2px]">+</span>
            </div>
          </div>

          <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} className="flex flex-col items-center group">
            <div className="p-3 bg-black/20 backdrop-blur-md rounded-full group-hover:bg-red-500/20 transition">
              <Heart size={30} fill={isLiked ? "#ef4444" : "transparent"} className={`${isLiked ? 'text-red-500' : 'text-white'} group-hover:text-red-500 transition`} />
            </div>
            <span className="text-white text-xs mt-1 font-bold drop-shadow-md">{isLiked ? '12.4K' : post.likes}</span>
          </button>
          
          <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center group">
            <div className="p-3 bg-black/20 backdrop-blur-md rounded-full group-hover:bg-white/20 transition">
              <MessageCircle size={30} fill="transparent" className="text-white" />
            </div>
            <span className="text-white text-xs mt-1 font-bold drop-shadow-md">{post.comments}</span>
          </button>

          <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center group">
            <div className="p-3 bg-black/20 backdrop-blur-md rounded-full group-hover:bg-white/20 transition">
              <Share2 size={30} fill="transparent" className="text-white" />
            </div>
            <span className="text-white text-xs mt-1 font-bold drop-shadow-md">{post.shares}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

const SocialFeed = ({ addToCart }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const containerHeight = containerRef.current.clientHeight;
      const scrollPosition = containerRef.current.scrollTop;
      
      // Calculate which video is most visible
      const newIndex = Math.round(scrollPosition / containerHeight);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeIndex]);

  return (
    <div className="bg-black">
      <div 
        ref={containerRef}
        className="w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {MOCK_VIDEOS.map((post, index) => (
          <VideoPost 
            key={post.id} 
            post={post} 
            addToCart={addToCart} 
            isActive={index === activeIndex} 
          />
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
