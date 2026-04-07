/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, Train, Plane, Bed, Utensils, 
  Camera, Ticket, ShoppingBag, Sun, CloudRain, Wind, 
  ChevronDown, ChevronUp, Plus, Phone, FileText, Check, 
  Navigation, Map as MapIcon, Info, Image as ImageIcon,
  Umbrella, Loader2, X, Cloud, Snowflake, Trash2,
  MessageCircle, Copy, CheckCheck, Volume2, RefreshCw, ZoomIn,
  Pencil, Save, MoreVertical, LogOut, LogIn
} from 'lucide-react';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import { mockData, defaultPackingList, generateId } from './data';

// --- CONSTANTS ---
const appId = 'nagoya-trip-app';

// --- GEMINI API SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const callGeminiAPI = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "AI 似乎睡著了，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "抱歉，AI 小助手目前有點忙碌，請稍後再試！🙏";
  }
};

// --- HELPERS ---
const getIconForType = (type: string, className: string) => {
  const props = { className, size: 20 };
  switch (type) {
    case '食物': return <Utensils {...props} />;
    case '活動': return <Ticket {...props} />;
    case '購物': return <ShoppingBag {...props} />;
    case '景點': return <Camera {...props} />;
    case '酒店': return <Bed {...props} />;
    case '交通': return <Train {...props} />;
    case '攻略': return <MapIcon {...props} />;
    default: return <MapPin {...props} />;
  }
};

const getBadgeStyle = (badge: string) => {
  switch (badge) {
    case '必吃': return 'bg-orange-100 text-orange-700';
    case '必買': return 'bg-pink-100 text-pink-700';
    case '必拍': return 'bg-blue-100 text-blue-700';
    case '必搶': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case '注意時間': return 'bg-red-100 text-red-700 border border-red-200';
    case '重要': return 'bg-red-500 text-white font-bold animate-pulse';
    case '放鬆': return 'bg-green-100 text-green-700';
    case '絕景': return 'bg-indigo-100 text-indigo-700';
    case '順路': return 'bg-teal-100 text-teal-700';
    case '乘換1回': return 'bg-cyan-100 text-cyan-700';
    case '實用地圖': return 'bg-orange-100 text-orange-800 border border-orange-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getWeatherIcon = (condition: string, props: any) => {
  switch(condition) {
    case 'Sunny': return <Sun {...props} className={`text-orange-400 ${props?.className || ''}`} />;
    case 'Cloudy': return <Cloud {...props} className={`text-gray-400 ${props?.className || ''}`} />;
    case 'Rain': return <CloudRain {...props} className={`text-blue-400 ${props?.className || ''}`} />;
    case 'Snow': return <Snowflake {...props} className={`text-cyan-400 ${props?.className || ''}`} />;
    case 'Wind': return <Wind {...props} className={`text-teal-400 ${props?.className || ''}`} />;
    default: return <Sun {...props} className={`text-orange-400 ${props?.className || ''}`} />;
  }
};

const getDocIconObj = (iconName: string) => {
  switch(iconName) {
    case 'Plane': return Plane;
    case 'Bed': return Bed;
    case 'MapPin': return MapPin;
    case 'Phone': return Phone;
    case 'Ticket': return Ticket;
    default: return FileText;
  }
};

const getDocColorClass = (iconName: string) => {
  switch(iconName) {
    case 'Plane': return 'bg-blue-50/80 text-blue-600 hover:bg-blue-100 border-blue-100/50';
    case 'Bed': return 'bg-teal-50/80 text-teal-600 hover:bg-teal-100 border-teal-100/50';
    case 'Ticket': return 'bg-pink-50/80 text-pink-600 hover:bg-pink-100 border-pink-100/50';
    case 'MapPin': return 'bg-orange-50/80 text-orange-600 hover:bg-orange-100 border-orange-100/50';
    case 'Phone': return 'bg-red-50/80 text-red-600 hover:bg-red-100 border-red-100/50';
    default: return 'bg-gray-50/80 text-gray-600 hover:bg-gray-100 border-gray-200/50';
  }
};

// --- COMPONENTS ---

const LoginScreen = () => {
  const handleLogin = () => signInWithPopup(auth, googleProvider);
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#773690] to-[#A39D78] text-white">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-[3rem] shadow-2xl border border-white/30 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
          <Plane className="text-[#773690]" size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-2">名古屋旅遊手冊</h1>
        <p className="text-white/80 mb-8 max-w-[200px]">登入以儲存您的專屬行程與清單</p>
        <button 
          onClick={handleLogin}
          className="flex items-center gap-3 bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-gray-50 transition-all active:scale-95"
        >
          <LogIn size={20} /> 使用 Google 登入
        </button>
      </div>
    </div>
  );
};

const ItineraryView = ({ 
  user, dailyJournals, setDailyJournals,
  aiTips, setAiTips, setPreviewImage, itineraryData, setItineraryData, updateFirestoreItinerary, showToast, showConfirm
}: any) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const currentDay = itineraryData[selectedDayIdx];
  
  const viewRef = useRef<HTMLDivElement>(null);
  const [loadingTips, setLoadingTips] = useState<any>({});

  const [isGeneratingJournal, setIsGeneratingJournal] = useState(false);
  const [copiedJournal, setCopiedJournal] = useState(false);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalMood, setJournalMood] = useState('');
  const [journalStyle, setJournalStyle] = useState('活潑可愛');
  const [journalLength, setJournalLength] = useState('短 (約50字)');

  const [activeMenuIdx, setActiveMenuIdx] = useState<number | null>(null); 
  const [editModal, setEditModal] = useState<any>({ isOpen: false, placeIdx: null, insertIdx: null, data: null });

  useEffect(() => {
    if (viewRef.current) viewRef.current.scrollTop = 0;
    setShowJournalForm(false);
    setActiveMenuIdx(null); 
  }, [selectedDayIdx]);

  const handleAiExplore = async (placeName: string, placeType: string) => {
    if (loadingTips[placeName]) return;
    setLoadingTips((prev: any) => ({ ...prev, [placeName]: true }));
    
    const prompt = `你是一個專業的日本旅遊嚮導。旅客現在正在看「${placeName}」(類別:${placeType})。請提供一個實用的短建議或冷知識。請用繁體中文回答，50字以內。`;
    const tip = await callGeminiAPI(prompt);
    
    setAiTips((prev: any) => ({ ...prev, [placeName]: tip }));
    setLoadingTips((prev: any) => ({ ...prev, [placeName]: false }));
  };

  const handleGenerateJournal = async () => {
    if (isGeneratingJournal) return;
    setIsGeneratingJournal(true);
    const prompt = `我今天去了：${currentDay.places.map((p: any) => p.name).join('、')}。心情：${journalMood}。請幫我寫一篇 Instagram 貼文，風格：${journalStyle}，長度：${journalLength}。`;
    const result = await callGeminiAPI(prompt);
    setDailyJournals((prev: any) => ({ ...prev, [selectedDayIdx]: result }));
    setIsGeneratingJournal(false);
    setShowJournalForm(false);
  };

  const openEditModal = (placeIdx = null, placeData = null, insertIdx = null) => {
    const defaultData = { id: '', type: '景點', name: '', description: '', duration: '約 1 小時', badges: '' };
    const formData = placeData ? { ...defaultData, ...placeData, badges: placeData.badges ? placeData.badges.join('，') : '' } : defaultData;
    setEditModal({ isOpen: true, placeIdx, insertIdx, data: formData });
  };

  const saveEditModal = () => {
    const newData = [...itineraryData];
    const dayData = { ...newData[selectedDayIdx] };
    const newPlaces = [...dayData.places];
    const processedData = { ...editModal.data, id: editModal.data.id || generateId(), badges: editModal.data.badges ? editModal.data.badges.split(/[,，]/).map((b: string) => b.trim()) : [] };
    
    if (editModal.placeIdx !== null) newPlaces[editModal.placeIdx] = processedData;
    else if (editModal.insertIdx !== null) newPlaces.splice(editModal.insertIdx, 0, processedData);
    else newPlaces.push(processedData);

    dayData.places = newPlaces;
    newData[selectedDayIdx] = dayData;
    setItineraryData(newData);
    updateFirestoreItinerary(newData);
    setEditModal({ isOpen: false, placeIdx: null, insertIdx: null, data: null });
  };

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(currentDay.mapKeyword || currentDay.places[0]?.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 hide-scrollbar" ref={viewRef}>
      <div className="grid grid-cols-6 gap-1.5 mb-6">
        {itineraryData.map((day: any, idx: number) => (
          <button 
            key={idx} 
            onClick={() => setSelectedDayIdx(idx)} 
            className={`py-2.5 rounded-xl text-[11px] font-bold transition-all text-center ${selectedDayIdx === idx ? 'bg-[#773690] text-white shadow-md scale-105' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            {day.day.replace('Day ', 'D')}
          </button>
        ))}
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-[#773690] mb-2">{currentDay.dateInfo}</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
            <Sun size={16} className="text-[#A39D78]" /> {currentDay.weatherHint}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
            <Umbrella size={16} className="text-[#A39D78]" /> {currentDay.clothingHint}
          </div>
        </div>
      </div>

      <div className="w-full h-48 rounded-3xl overflow-hidden mb-6 border border-gray-100 shadow-inner">
        <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} title="map"></iframe>
      </div>

      {currentDay.parkMapUrl && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6 overflow-hidden cursor-pointer group" onClick={() => setPreviewImage(currentDay.parkMapUrl)}>
          <div className="p-4 flex justify-between items-center border-b border-gray-50">
            <span className="text-sm font-bold text-[#773690] flex items-center gap-2"><MapIcon size={16}/> 園區導覽地圖</span>
            <ZoomIn size={16} className="text-gray-300 group-hover:text-[#773690] transition-colors" />
          </div>
          <img src={currentDay.parkMapUrl} alt="park map" className="w-full h-auto" />
        </div>
      )}

      <div className="space-y-4">
        {currentDay.places.map((place: any, idx: number) => {
          const isStrategy = place.type === '攻略';
          return (
            <div key={place.id} className={`p-5 rounded-3xl shadow-sm border relative group transition-all hover:shadow-md ${isStrategy ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-100' : 'bg-white border-gray-100'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-2xl ${isStrategy ? 'bg-orange-500 text-white' : 'bg-[#773690]/10 text-[#773690]'}`}>
                    {getIconForType(place.type, "")}
                  </div>
                  <h3 className={`font-bold text-lg ${isStrategy ? 'text-orange-800' : 'text-gray-800'}`}>{place.name}</h3>
                </div>
                <button onClick={() => setActiveMenuIdx(activeMenuIdx === idx ? null : idx)} className="p-1 text-gray-300 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
                {activeMenuIdx === idx && (
                  <div className="absolute right-4 top-12 bg-white shadow-xl border border-gray-100 rounded-2xl py-2 z-10 w-36 animate-in fade-in zoom-in-95">
                    <button onClick={() => { openEditModal(idx, place); setActiveMenuIdx(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><Pencil size={14}/> 編輯卡片</button>
                    {idx > 0 && (
                      <button onClick={() => {
                        const newData = [...itineraryData];
                        const places = [...newData[selectedDayIdx].places];
                        [places[idx], places[idx-1]] = [places[idx-1], places[idx]];
                        newData[selectedDayIdx].places = places;
                        setItineraryData(newData);
                        updateFirestoreItinerary(newData);
                        setActiveMenuIdx(null);
                      }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><ChevronUp size={14}/> 往上移</button>
                    )}
                    {idx < currentDay.places.length - 1 && (
                      <button onClick={() => {
                        const newData = [...itineraryData];
                        const places = [...newData[selectedDayIdx].places];
                        [places[idx], places[idx+1]] = [places[idx+1], places[idx]];
                        newData[selectedDayIdx].places = places;
                        setItineraryData(newData);
                        updateFirestoreItinerary(newData);
                        setActiveMenuIdx(null);
                      }} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex items-center gap-2"><ChevronDown size={14}/> 往下移</button>
                    )}
                    <button onClick={() => { 
                      showConfirm('刪除卡片', `確定要刪除「${place.name}」嗎？`, () => {
                        const newData = [...itineraryData];
                        newData[selectedDayIdx].places.splice(idx, 1);
                        setItineraryData(newData);
                        updateFirestoreItinerary(newData);
                        showToast('已刪除卡片');
                      });
                      setActiveMenuIdx(null);
                    }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm flex items-center gap-2"><Trash2 size={14}/> 刪除卡片</button>
                  </div>
                )}
              </div>
              <p className={`text-sm mb-4 whitespace-pre-wrap leading-relaxed ${isStrategy ? 'text-orange-700' : 'text-gray-600'}`}>{place.description}</p>
              
              {place.badges && place.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {place.badges.map((b: string) => <span key={b} className={`text-[10px] px-2 py-1 rounded-full font-bold ${getBadgeStyle(b)}`}>{b}</span>)}
                </div>
              )}

              {place.extraImages && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar">
                  {place.extraImages.map((img: any, i: number) => (
                    <img key={i} src={img.url} alt={img.title} className="h-20 w-32 object-cover rounded-xl border border-gray-100 cursor-pointer" onClick={() => setPreviewImage(img.url)} />
                  ))}
                </div>
              )}

              {place.goshuins && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {place.goshuins.map((gs: any, gIdx: number) => (
                    <div key={gIdx} className="inline-flex items-center gap-1.5 bg-[#773690]/10 text-[#773690] px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-[#773690]/20 shadow-sm">
                      ⛩️ {gs.name} ({gs.price})
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={() => handleAiExplore(place.name, place.type)} className="flex-1 bg-[#773690]/5 text-[#773690] py-2.5 rounded-xl text-xs font-bold hover:bg-[#773690]/10 transition-colors">
                  {loadingTips[place.name] ? <Loader2 size={14} className="animate-spin mx-auto" /> : '✨ AI 探索'}
                </button>
                {!isStrategy && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 text-gray-500 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1">
                    <Navigation size={14}/> 導航
                  </a>
                )}
              </div>
              {aiTips[place.name] && (
                <div className="mt-4 p-4 bg-purple-50 rounded-2xl text-xs text-purple-700 border border-purple-100 animate-in slide-in-from-top-2">
                  <div className="font-bold mb-1 flex items-center gap-1"><Info size={12}/> AI 建議</div>
                  {aiTips[place.name]}
                </div>
              )}
            </div>
          );
        })}
        <button onClick={() => openEditModal()} className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-400 font-bold hover:border-[#773690] hover:text-[#773690] transition-all flex items-center justify-center gap-2 bg-white/50">
          <Plus size={20} /> 新增行程卡片
        </button>
      </div>

      <div className="mt-10 mb-10">
        {dailyJournals[selectedDayIdx] ? (
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-[2rem] border border-pink-100 shadow-sm animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#773690] flex items-center gap-2">✨ 專屬 IG 貼文</span>
              <button onClick={() => setDailyJournals({...dailyJournals, [selectedDayIdx]: null})} className="text-gray-400"><X size={16}/></button>
            </div>
            <p className="text-sm text-gray-700 bg-white/50 p-4 rounded-2xl mb-4 whitespace-pre-wrap">{dailyJournals[selectedDayIdx]}</p>
            <button onClick={() => { navigator.clipboard.writeText(dailyJournals[selectedDayIdx]); setCopiedJournal(true); setTimeout(()=>setCopiedJournal(false), 2000); }} className="w-full py-3 bg-white border border-purple-100 rounded-xl text-[#773690] font-bold text-sm flex items-center justify-center gap-2">
              {copiedJournal ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>} {copiedJournal ? '已複製' : '複製貼文'}
            </button>
          </div>
        ) : (
          <button onClick={() => setShowJournalForm(true)} className="w-full py-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-[2rem] text-[#773690] font-bold text-sm shadow-sm hover:shadow-md transition-all">
            ✨ 讓 AI 幫我寫今日 IG 貼文
          </button>
        )}
      </div>

      {showJournalForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#773690]">訂製 IG 貼文</h3>
              <button onClick={() => setShowJournalForm(false)}><X size={24}/></button>
            </div>
            <textarea value={journalMood} onChange={e => setJournalMood(e.target.value)} placeholder="今天的心情或特別的事..." className="w-full p-4 bg-gray-50 rounded-2xl mb-4 h-24 border-none focus:ring-2 focus:ring-[#773690]" />
            <div className="flex gap-2 mb-6">
              {['活潑', '文青', '幽默'].map(s => (
                <button key={s} onClick={() => setJournalStyle(s)} className={`flex-1 py-2 rounded-xl font-bold text-xs ${journalStyle === s ? 'bg-[#773690] text-white' : 'bg-gray-50 text-gray-400'}`}>{s}</button>
              ))}
            </div>
            <button onClick={handleGenerateJournal} disabled={isGeneratingJournal} className="w-full py-4 bg-[#773690] text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2">
              {isGeneratingJournal ? <Loader2 size={20} className="animate-spin"/> : '開始生成'}
            </button>
          </div>
        </div>
      )}

      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 bg-[#773690] text-white flex justify-between items-center">
              <h3 className="font-bold">編輯行程</h3>
              <button onClick={() => setEditModal({ isOpen: false })}><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">標題</label>
                <input type="text" value={editModal.data.name} onChange={e => setEditModal({...editModal, data: {...editModal.data, name: e.target.value}})} placeholder="標題" className="w-full p-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#773690]" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">描述</label>
                <textarea value={editModal.data.description} onChange={e => setEditModal({...editModal, data: {...editModal.data, description: e.target.value}})} placeholder="描述" className="w-full p-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#773690] h-32" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1">標籤 (逗號分隔)</label>
                <input type="text" value={editModal.data.badges} onChange={e => setEditModal({...editModal, data: {...editModal.data, badges: e.target.value}})} placeholder="標籤 (逗號分隔)" className="w-full p-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#773690]" />
              </div>
            </div>
            <div className="p-6">
              <button onClick={saveEditModal} className="w-full bg-[#773690] text-white py-4 rounded-2xl font-bold shadow-lg">儲存行程</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const GuideView = ({ user, packingList, setPackingList, updateFirestore, showToast }: any) => {
  const [newItem, setNewItem] = useState('');
  const [activeCat, setActiveCat] = useState('carryOn');
  const [translateInput, setTranslateInput] = useState('');
  const [translateResult, setTranslateResult] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [emergencyModal, setEmergencyModal] = useState(false);

  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      showToast('您的瀏覽器不支援語音功能', 'error');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleCheck = (cat: string, id: string) => {
    const newList = { ...packingList, [cat]: packingList[cat].map((i: any) => i.id === id ? { ...i, checked: !i.checked } : i) };
    setPackingList(newList);
    updateFirestore(newList);
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    const newList = { ...packingList, [activeCat]: [...packingList[activeCat], { id: Date.now().toString(), text: newItem, checked: false }] };
    setPackingList(newList);
    updateFirestore(newList);
    setNewItem('');
  };

  const handleTranslate = async () => {
    if (!translateInput.trim()) return;
    setIsTranslating(true);
    const prompt = `請將「${translateInput}」翻譯成道地、有禮貌的日文。回傳 JSON 格式：{"jp": "日文", "romaji": "羅馬拼音", "tip": "文化提醒"}`;
    const res = await callGeminiAPI(prompt);
    try {
      const match = res.match(/\{[\s\S]*\}/);
      if (match) setTranslateResult(JSON.parse(match[0]));
      else setTranslateResult({ jp: res, romaji: '', tip: '' });
    } catch (e) {
      setTranslateResult({ jp: res, romaji: '', tip: '' });
    }
    setIsTranslating(false);
  };

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 hide-scrollbar">
      <div className="grid grid-cols-4 gap-2 mb-6">
        <button onClick={() => setEmergencyModal(true)} className="aspect-square bg-red-50 rounded-2xl flex flex-col items-center justify-center gap-1.5 border border-red-100 shadow-sm">
          <Phone className="text-red-500" size={20}/>
          <span className="text-[9px] font-bold text-red-600">緊急求助</span>
        </button>
        {mockData.documents.map((doc: any, i: number) => {
          const Icon = getDocIconObj(doc.icon);
          return (
            <a key={i} href={doc.url} target="_blank" rel="noreferrer" className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border shadow-sm ${getDocColorClass(doc.icon)}`}>
              <Icon size={20}/>
              <span className="text-[9px] font-bold text-center px-1 truncate w-full">{doc.title}</span>
            </a>
          );
        })}
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4 text-[#773690] font-bold">
          <MessageCircle size={20}/> 隨身翻譯蒟蒻
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {['謝謝', '多少錢？', '廁所在哪？', '可以拍照嗎？'].map(phrase => (
            <button key={phrase} onClick={() => { setTranslateInput(phrase); }} className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-xs hover:bg-[#773690]/10 hover:text-[#773690] transition-colors">
              {phrase}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input type="text" value={translateInput} onChange={e => setTranslateInput(e.target.value)} placeholder="想說的話..." className="flex-1 p-3 bg-gray-50 rounded-2xl border-none text-sm" />
          <button onClick={handleTranslate} className="px-4 bg-[#773690] text-white rounded-2xl font-bold text-sm">
            {isTranslating ? <Loader2 size={16} className="animate-spin"/> : '翻譯'}
          </button>
        </div>
        {translateResult && (
          <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#A39D78]/20 animate-in fade-in relative">
            <div className="absolute top-3 right-3 flex gap-1">
              <button 
                onClick={() => speak(translateResult.jp)}
                className="p-2 bg-white rounded-full shadow-sm text-[#773690] hover:bg-[#773690] hover:text-white transition-all"
                title="播放語音"
              >
                <Volume2 size={16}/>
              </button>
              <button 
                onClick={() => { navigator.clipboard.writeText(translateResult.jp); showToast('已複製翻譯'); }}
                className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#773690] transition-all"
                title="複製翻譯"
              >
                <Copy size={16}/>
              </button>
            </div>
            <div className="text-lg font-bold text-gray-800 mb-1 pr-20">{translateResult.jp}</div>
            <div className="text-xs text-gray-400 mb-3">{translateResult.romaji}</div>
            <div className="text-xs text-[#A39D78] bg-white p-2 rounded-xl border border-gray-50">{translateResult.tip}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 text-[#773690] font-bold">
          <ShoppingBag size={20}/> 行李打包與購物
        </div>
        <div className="flex gap-2 mb-6">
          {['carryOn', 'checked', 'shopping'].map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${activeCat === cat ? 'bg-[#A39D78] text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}>
              {cat === 'carryOn' ? '隨身' : cat === 'checked' ? '托運' : '購物'}
            </button>
          ))}
        </div>
        <div className="space-y-3 mb-6">
          {packingList[activeCat].map((item: any) => (
            <div key={item.id} className="flex items-center justify-between group">
              <label className="flex items-center gap-3 cursor-pointer flex-1" onClick={(e) => { e.preventDefault(); toggleCheck(activeCat, item.id); }}>
                <input type="checkbox" className="opacity-0 absolute w-0 h-0" checked={item.checked} readOnly />
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-[#773690] border-[#773690]' : 'border-gray-200'}`}>
                  {item.checked && <Check size={16} className="text-white" />}
                </div>
                <span className={`font-medium transition-all ${item.checked ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{item.text}</span>
              </label>
              <button onClick={() => {
                const newList = { ...packingList, [activeCat]: packingList[activeCat].filter((i: any) => i.id !== item.id) };
                setPackingList(newList);
                updateFirestore(newList);
              }} className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="新增項目..." className="flex-1 p-3 bg-gray-50 rounded-2xl border-none text-sm" />
          <button onClick={addItem} className="p-3 bg-[#773690] text-white rounded-2xl shadow-lg"><Plus size={20} /></button>
        </div>
      </div>

      {emergencyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-end p-4" onClick={() => setEmergencyModal(false)}>
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 animate-in slide-in-from-bottom-10" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-red-600 mb-4 flex items-center gap-2"><Phone size={20}/> 緊急求助電話</h3>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-bold">台北駐日經濟文化代表處</div>
                  <div className="text-xs text-gray-400">+81 3 3280 7811</div>
                </div>
                <button onClick={() => { navigator.clipboard.writeText('+81332807811'); showToast('已複製電話'); }} className="p-2 bg-white rounded-full shadow-sm text-blue-500"><Copy size={16}/></button>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                <div>
                  <div className="font-bold">日本緊急報警 (警察)</div>
                  <div className="text-xs text-gray-400">110</div>
                </div>
                <a href="tel:110" className="p-2 bg-white rounded-full shadow-sm text-green-500"><Phone size={16}/></a>
              </div>
            </div>
            <button onClick={() => setEmergencyModal(false)} className="w-full py-4 bg-gray-100 rounded-2xl font-bold text-gray-500">關閉</button>
          </div>
        </div>
      )}
    </div>
  );
};

const WeatherView = () => {
  const forecast = [
    { day: '4/21', weekday: '二', temp: '15° / 22°', condition: 'Sunny', desc: '晴朗舒適', clothingHint: '薄長袖加上休閒外套' },
    { day: '4/22', weekday: '三', temp: '8° / 15°', condition: 'Rain', desc: '山區陣雨', clothingHint: '山區濕冷，需防水保暖外套' },
    { day: '4/23', weekday: '四', temp: '0° / 5°', condition: 'Wind', desc: '雪谷寒冷', clothingHint: '嚴寒！厚羽絨衣、手套與毛帽' },
    { day: '4/24', weekday: '五', temp: '15° / 22°', condition: 'Sunny', desc: '晴朗舒適', clothingHint: '洋蔥式穿搭，早晚微涼' },
    { day: '4/25', weekday: '六', temp: '16° / 21°', condition: 'Sunny', desc: '晴時多雲', clothingHint: '薄長袖加上輕便外套' },
    { day: '4/26', weekday: '日', temp: '16° / 21°', condition: 'Sunny', desc: '晴朗', clothingHint: '舒適休閒服與好走的鞋' },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 pb-24 hide-scrollbar">
      <h2 className="text-xl font-bold text-[#773690] mb-6 flex items-center gap-2 px-2"><Sun/> 每日天氣預測</h2>
      <div className="space-y-4">
        {forecast.map((w, i) => (
          <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="flex flex-col items-center min-w-[60px]">
              <span className="text-xs text-gray-400 mb-1">{w.day} ({w.weekday})</span>
              {getWeatherIcon(w.condition, { size: 32 })}
              <span className="text-sm font-bold mt-1">{w.temp}</span>
            </div>
            <div className="flex-1 border-l border-gray-50 pl-4">
              <div className="font-bold text-[#A39D78] mb-1">{w.desc}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-xl">{w.clothingHint}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [itineraryData, setItineraryData] = useState(mockData.itinerary);
  const [packingList, setPackingList] = useState(defaultPackingList);
  const [dailyJournals, setDailyJournals] = useState({});
  const [aiTips, setAiTips] = useState({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const itinRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'itinerary');
    const unsubItin = onSnapshot(itinRef, (docSnap) => {
      if (docSnap.exists()) setItineraryData(docSnap.data().data);
      else setDoc(itinRef, { data: mockData.itinerary });
    });
    const packRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'packingList');
    const unsubPack = onSnapshot(packRef, (docSnap) => {
      if (docSnap.exists()) setPackingList(docSnap.data());
      else setDoc(packRef, defaultPackingList);
    });
    return () => { unsubItin(); unsubPack(); };
  }, [user]);

  const updateFirestoreItinerary = (data: any) => {
    if (!user) return;
    setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'itinerary'), { data });
  };

  const updateFirestorePacking = (data: any) => {
    if (!user) return;
    setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'packingList'), data);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FAF9F6]"><Loader2 className="animate-spin text-[#773690]" size={48} /></div>;
  if (!user) return <LoginScreen />;

  return (
    <div className="h-screen flex flex-col bg-[#FAF9F6] max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <header className="bg-white px-6 py-5 shadow-sm flex items-center justify-between z-20 border-b border-gray-100">
        <div>
          <h1 className="text-lg font-bold text-[#773690]">{mockData.tripInfo.title}</h1>
          <p className="text-xs text-[#A39D78] font-bold">{user.displayName} 的專屬手冊</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            showConfirm('重設行程', '確定要重設為官方行程嗎？這將覆蓋您的所有修改（包含 Day 1-6）。', () => {
              const freshData = JSON.parse(JSON.stringify(mockData.itinerary));
              setItineraryData(freshData);
              updateFirestoreItinerary(freshData);
              showToast('已重設為官方 6 天行程');
            });
          }} className="p-2 text-[#A39D78] hover:text-[#773690] transition-colors" title="重設行程">
            <RefreshCw size={20} />
          </button>
          <button onClick={() => signOut(auth)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </div>
      </header>

      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10">
          <div className={`px-6 py-3 rounded-2xl shadow-xl text-white font-bold flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-[#773690]'
          }`}>
            {toast.type === 'success' && <CheckCheck size={18}/>}
            {toast.message}
          </div>
        </div>
      )}

      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'itinerary' && (
          <ItineraryView 
            user={user} 
            dailyJournals={dailyJournals} setDailyJournals={setDailyJournals}
            aiTips={aiTips} setAiTips={setAiTips}
            setPreviewImage={setPreviewImage}
            itineraryData={itineraryData} setItineraryData={setItineraryData}
            updateFirestoreItinerary={updateFirestoreItinerary}
            showToast={showToast}
            showConfirm={showConfirm}
          />
        )}
        {activeTab === 'guide' && (
          <GuideView 
            user={user}
            packingList={packingList} setPackingList={setPackingList}
            updateFirestore={updateFirestorePacking}
            showToast={showToast}
          />
        )}
        {activeTab === 'weather' && <WeatherView />}
      </main>

      <nav className="bg-white border-t border-gray-100 flex justify-around p-4 pb-8 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'itinerary' ? 'text-[#773690] scale-110' : 'text-gray-300'}`}>
          <MapPin size={24} strokeWidth={activeTab === 'itinerary' ? 3 : 2} />
          <span className="text-[10px] font-bold">行程</span>
        </button>
        <button onClick={() => setActiveTab('guide')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'guide' ? 'text-[#773690] scale-110' : 'text-gray-300'}`}>
          <FileText size={24} strokeWidth={activeTab === 'guide' ? 3 : 2} />
          <span className="text-[10px] font-bold">指南</span>
        </button>
        <button onClick={() => setActiveTab('weather')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'weather' ? 'text-[#773690] scale-110' : 'text-gray-300'}`}>
          <Sun size={24} strokeWidth={activeTab === 'weather' ? 3 : 2} />
          <span className="text-[10px] font-bold">天氣</span>
        </button>
      </nav>

      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-6 right-6 text-white bg-white/10 rounded-full p-2"><X size={24}/></button>
          <img src={previewImage} alt="preview" className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" />
        </div>
      )}

      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 bg-gray-50 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">{confirmModal.title}</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="p-6 flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm"
              >
                取消
              </button>
              <button 
                onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                className="flex-1 py-3 bg-[#773690] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#773690]/20"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
