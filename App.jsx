import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, onSnapshot, doc,
  setDoc, deleteDoc, updateDoc, writeBatch
} from 'firebase/firestore';
import {
  ShoppingBag, Plus, Minus, Trash2, Phone, MapPin,
  X, CheckCircle2, Sparkles, Lock, LogOut, Search, ArrowRight, Flame
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDKlNRt4m4irDVOp_DiA7ANCnb_XOgakv4",
  authDomain: "royal-ruchi-restaurant.firebaseapp.com",
  projectId: "royal-ruchi-restaurant",
  storageBucket: "royal-ruchi-restaurant.firebasestorage.app",
  messagingSenderId: "717236348954",
  appId: "1:717236348954:web:1e5d99450ad950505289a3",
  measurementId: "G-BD2HF757FH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_MENU = [
  { id: "1", name: "Royal Hyderabadi Chicken Dum Biryani", category: "Royal Biryanis", price: 260, veg: false, bestseller: true, desc: "Authentic slow-cooked basmati rice layered with spiced tender chicken & saffron.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: "2", name: "Nizam Mutton Zafrani Biryani", category: "Royal Biryanis", price: 340, veg: false, bestseller: true, desc: "Succulent mutton pieces marinated overnight in royal spices and dum-cooked.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80" },
  { id: "3", name: "Paneer Tikka Royal Biryani", category: "Royal Biryanis", price: 230, veg: true, bestseller: false, desc: "Char-grilled cottage cheese cubes tossed in aromatic dum rice.", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80" },
  { id: "4", name: "Murgh Malai Kebab (8 Pcs)", category: "Tandoori & Kebabs", price: 280, veg: false, bestseller: true, desc: "Creamy, melt-in-mouth chicken kebabs infused with cardamom and cheese.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80" },
  { id: "5", name: "Tandoori Chicken (Full)", category: "Tandoori & Kebabs", price: 460, veg: false, bestseller: true, desc: "Classic clay-oven roasted chicken marinated in hung curd and Kashmiri chilli.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80" },
  { id: "6", name: "Telangana Kodi Vepudu", category: "Telangana Specials", price: 270, veg: false, bestseller: true, desc: "Fiery, aromatic country-style chicken fry with freshly ground Telangana masala.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: "7", name: "Natukodi Pulusu", category: "Telangana Specials", price: 320, veg: false, bestseller: false, desc: "Traditional rustic country chicken curry simmered to perfection.", img: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80" },
  { id: "8", name: "Butter Chicken Masala", category: "Royal Curries", price: 275, veg: false, bestseller: true, desc: "Tandoori chicken tikka simmered in rich velvety tomato-butter gravy.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: "9", name: "Paneer Butter Masala", category: "Royal Curries", price: 240, veg: true, bestseller: true, desc: "Soft paneer cubes in a rich, creamy cashew and tomato gravy.", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80" },
  { id: "10", name: "Chicken 65 (Royal Style)", category: "Starters & Appetizers", price: 240, veg: false, bestseller: true, desc: "Crispy spicy chicken bites tossed with curry leaves and green chillies.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80" },
  { id: "11", name: "Crispy Chilli Baby Corn", category: "Starters & Appetizers", price: 195, veg: true, bestseller: false, desc: "Golden fried baby corn tossed in tangy Indo-Chinese garlic sauce.", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80" },
  { id: "12", name: "Butter Garlic Naan", category: "Indian Breads", price: 65, veg: true, bestseller: true, desc: "Soft leavened flatbread topped with roasted garlic and melted butter.", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" },
  { id: "13", name: "Tandoori Roti", category: "Indian Breads", price: 35, veg: true, bestseller: false, desc: "Whole wheat bread baked crisp in a traditional clay tandoor.", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" },
  { id: "14", name: "Schezwan Chicken Fried Rice", category: "Chinese & Fried Rice", price: 210, veg: false, bestseller: false, desc: "Wok-tossed basmati rice with diced chicken, veggies & fiery Schezwan sauce.", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80" },
  { id: "15", name: "Royal Family Biryani Pack (Serves 4)", category: "Family Combos", price: 899, veg: false, bestseller: true, desc: "Jumbo Chicken Dum Biryani + Chicken 65 + 4 Drinks + Double Ka Meetha.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: "16", name: "Shahi Double Ka Meetha", category: "Royal Desserts", price: 110, veg: true, bestseller: true, desc: "Hyderabadi royal bread pudding soaked in saffron milk, ghee & dry fruits.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" },
  { id: "17", name: "Royal Mango Lassi", category: "Beverages & Mocktails", price: 95, veg: true, bestseller: true, desc: "Thick, creamy churned yogurt blended with Alphonso mango pulp & pistachios.", img: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80" }
];

const CATEGORIES = [
  "All", "Royal Biryanis", "Tandoori & Kebabs", "Telangana Specials",
  "Royal Curries", "Starters & Appetizers", "Indian Breads",
  "Chinese & Fried Rice", "Family Combos", "Royal Desserts", "Beverages & Mocktails"
];

function App() {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [dbSynced, setDbSynced] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("UPI / GPay / PhonePe");

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", category: "Royal Biryanis", price: "", veg: false, desc: "" });

  // Real-time Firebase Firestore Sync
  useEffect(() => {
    const menuRef = collection(db, "menu");
    const unsubscribe = onSnapshot(menuRef, async (snapshot) => {
      if (snapshot.empty) {
        const batch = writeBatch(db);
        INITIAL_MENU.forEach((item) => {
          batch.set(doc(db, "menu", item.id), item);
        });
        await batch.commit();
      } else {
        const liveItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMenu(liveItems);
        setDbSynced(true);
      }
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = orderType === "Delivery" && subtotal > 0 && subtotal < 500 ? 30 : 0;
  const grandTotal = subtotal + deliveryFee;

  const filteredMenu = menu.filter(item => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.desc || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.veg;
    return matchesCat && matchesSearch && matchesVeg;
  });

  const handleWhatsAppOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderId = `RRR-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      await setDoc(doc(db, "orders", orderId), {
        id: orderId,
        customer: customerName,
        phone: customerPhone,
        address: orderType === "Delivery" ? customerAddress : "Takeaway",
        items: cart,
        total: grandTotal,
        payment: paymentMethod,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("Order log skipped:", err);
    }

    const itemsText = cart.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('%0A');
    const msg = `*👑 ROYAL RUCHI RESTAURANT (RRR)*%0A` +
      `*Order ID:* ${orderId}%0A` +
      `*Customer:* ${customerName} (${customerPhone})%0A` +
      `*Type:* ${orderType}%0A` +
      (orderType === "Delivery" ? `*Address:* ${customerAddress}%0A` : "") +
      `*Payment:* ${paymentMethod}%0A%0A` +
      `*Order Items:*%0A${itemsText}%0A%0A` +
      `*Grand Total: ₹${grandTotal}*%0A` +
      `Please confirm my royal order!`;

    window.open(`https://wa.me/919640032003?text=${msg}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (adminPin === "RRR2026") {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPin("");
    } else {
      alert("Invalid Admin PIN! Try RRR2026");
    }
  };

  const handleAddDish = async (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    const id = Date.now().toString();
    await setDoc(doc(db, "menu", id), {
      id,
      name: newDish.name,
      category: newDish.category,
      price: Number(newDish.price),
      veg: newDish.veg,
      bestseller: true,
      desc: newDish.desc || "Chef's special royal preparation.",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    });
    setNewDish({ name: "", category: "Royal Biryanis", price: "", veg: false, desc: "" });
  };

  const handlePriceUpdate = async (id, currentPrice) => {
    const updated = prompt("Enter new price (₹):", currentPrice);
    if (updated && !isNaN(updated)) {
      await updateDoc(doc(db, "menu", id), { price: Number(updated) });
    }
  };

  const handleDeleteDish = async (id) => {
    if (window.confirm("Remove this dish from live menu?")) {
      await deleteDoc(doc(db, "menu", id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0908] text-stone-100 font-sans">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#5C0A0A] via-[#8B1111] to-[#5C0A0A] text-amber-200 text-xs py-2 px-4 text-center border-b border-amber-500/20">
        ✨ Free Delivery on Orders Above ₹499 across Telangana | Direct WhatsApp Ordering: +91 96400 32003 ✨
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#0B0908]/95 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-red-700 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-amber-500/20">
              RRR
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-wider text-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>
                ROYAL RUCHI
              </h1>
              <p className="text-[11px] text-stone-400 tracking-widest uppercase">Restaurant • Telangana</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
              className="px-3 py-2 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs flex items-center gap-1.5 transition"
            >
              {isAdmin ? <><LogOut className="w-3.5 h-3.5" /> Exit Admin</> : <><Lock className="w-3.5 h-3.5" /> Admin</>}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">Cart</span>
              {totalItems > 0 && (
                <span className="bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      {isAdmin ? (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="bg-[#15110F] border border-amber-500/30 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-amber-400">👑 RRR Live Cloud Admin Dashboard</h2>
                <p className="text-sm text-stone-400">Changes here update instantaneously for all customers across Telangana</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dbSynced ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {dbSynced ? '● Cloud Synced Live' : 'Connecting Cloud...'}
              </span>
            </div>

            <form onSubmit={handleAddDish} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-black/40 p-4 rounded-xl border border-stone-800 mb-8">
              <input
                type="text"
                placeholder="Dish Name"
                value={newDish.name}
                onChange={e => setNewDish({ ...newDish, name: e.target.value })}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white"
                required
              />
              <select
                value={newDish.category}
                onChange={e => setNewDish({ ...newDish, category: e.target.value })}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price (₹)"
                value={newDish.price}
                onChange={e => setNewDish({ ...newDish, price: e.target.value })}
                className="bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white"
                required
              />
              <label className="flex items-center gap-2 text-sm text-stone-300 px-2">
                <input
                  type="checkbox"
                  checked={newDish.veg}
                  onChange={e => setNewDish({ ...newDish, veg: e.target.checked })}
                  className="accent-emerald-500"
                />
                Pure Veg Dish
              </label>
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg px-4 py-2 text-sm">
                + Add to Live Menu
              </button>
            </form>

            <h3 className="text-lg font-bold text-amber-300 mb-3">Live Menu Items ({menu.length})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {menu.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-stone-900/80 p-3 rounded-xl border border-stone-800">
                  <div>
                    <p className="font-semibold text-white">{item.name} <span className="text-xs text-amber-400 ml-2">({item.category})</span></p>
                    <p className="text-xs text-stone-400">₹{item.price} • {item.veg ? "Veg" : "Non-Veg"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePriceUpdate(item.id, item.price)}
                      className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-500/30"
                    >
                      Edit Price
                    </button>
                    <button
                      onClick={() => handleDeleteDish(item.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-16 sm:py-24 px-4 border-b border-amber-500/15">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(180,20,20,0.28),_transparent_55%)]" />
            <div className="max-w-7xl mx-auto relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" /> Authentic Nizami & Telangana Cuisine
              </div>
              <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
                TASTE THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-red-500">ROYAL LEGACY</span>
              </h2>
              <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg mb-8">
                Slow-cooked Dum Biryanis, fiery Telangana delicacies, and royal kebabs crafted with hand-ground spices and served piping hot.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a href="#menu" className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold px-7 py-3.5 rounded-xl flex items-center gap-2 shadow-lg shadow-red-900/40 transition">
                  Explore Royal Menu <ArrowRight className="w-4 h-4" />
                </a>
                <a href="https://wa.me/919640032003" target="_blank" rel="noreferrer" className="bg-stone-900 hover:bg-stone-800 border border-amber-500/30 text-amber-300 font-semibold px-7 py-3.5 rounded-xl flex items-center gap-2 transition">
                  <Phone className="w-4 h-4" /> Order on WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* Menu Section */}
          <section id="menu" className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>
                  OUR ROYAL MENU
                </h3>
                <p className="text-sm text-stone-400">Select dishes and send your order directly to our kitchen on WhatsApp</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search biryani, kebab..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="bg-[#15110F] border border-stone-800 focus:border-amber-500/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none"
                  />
                </div>
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${vegOnly ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-[#15110F] border-stone-800 text-stone-400'}`}
                >
                  🟢 Veg Only
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-md'
                      : 'bg-[#15110F] text-stone-300 border border-stone-800 hover:border-amber-500/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map(item => {
                const inCart = cart.find(c => c.id === item.id);
                return (
                  <div key={item.id} className="bg-[#15110F] border border-stone-800/90 hover:border-amber-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition group">
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${item.veg ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/90 text-red-300 border border-red-500/40'}`}>
                            {item.veg ? '● Pure Veg' : '▲ Non-Veg'}
                          </span>
                          {item.bestseller && (
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500 text-black flex items-center gap-1">
                              <Flame className="w-3 h-3" /> Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-amber-400/80 font-medium mb-1">{item.category}</p>
                        <h4 className="text-lg font-bold text-white mb-1.5">{item.name}</h4>
                        <p className="text-xs text-stone-400">{item.desc}</p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-stone-800/60">
                      <span className="text-xl font-extrabold text-amber-400">₹{item.price}</span>
                      {inCart ? (
                        <div className="flex items-center gap-3 bg-amber-500 text-black font-bold rounded-xl px-3 py-1.5">
                          <button onClick={() => updateQty(item.id, -1)}><Minus className="w-4 h-4" /></button>
                          <span>{inCart.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)}><Plus className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-red-700 hover:bg-red-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-[#070605] border-t border-amber-500/20 py-10 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-lg font-bold text-amber-400" style={{ fontFamily: 'Cinzel, serif' }}>ROYAL RUCHI RESTAURANT (RRR)</h4>
            <p className="text-xs text-stone-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> Telangana, India • Open Daily: 11:30 AM – 11:30 PM
            </p>
          </div>
          <div className="text-xs text-stone-400">
            <p>Direct WhatsApp & Call Orders: <span className="text-amber-400 font-bold">+91 96400 32003</span></p>
            <p className="mt-1">© 2026 Royal Ruchi Restaurant. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Cart Button */}
      {totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-5 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold py-3.5 px-5 rounded-2xl shadow-2xl flex items-center justify-between"
          >
            <span>{totalItems} Item(s) • ₹{grandTotal}</span>
            <span className="flex items-center gap-1">View Cart & Order <ArrowRight className="w-4 h-4" /></span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#120E0C] h-full border-l border-amber-500/30 flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Your Royal Cart
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-1.5 bg-stone-900 rounded-lg text-stone-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-stone-400">
                  <p className="text-base mb-2">Your royal platter is empty!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 my-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-stone-900/90 p-3 rounded-xl border border-stone-800">
                        <div>
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-amber-400">₹{item.price} x {item.qty} = ₹{item.price * item.qty}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-2 py-1">
                          <button onClick={() => updateQty(item.id, -1)} className="text-amber-400"><Minus className="w-3.5 h-3.5" /></button>
                          <span className="text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-amber-400"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-stone-900/60 p-4 rounded-xl border border-stone-800 text-xs space-y-1.5 mb-5">
                    <div className="flex justify-between text-stone-400"><span>Item Total</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between text-stone-400"><span>Delivery Charge</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
                    <div className="flex justify-between text-base font-bold text-amber-400 pt-2 border-t border-stone-800">
                      <span>Grand Total</span><span>₹{grandTotal}</span>
                    </div>
                  </div>

                  <form onSubmit={handleWhatsAppOrder} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {["Delivery", "Takeaway"].map(type => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setOrderType(type)}
                          className={`py-2 rounded-lg text-xs font-bold border ${orderType === type ? 'bg-amber-500 text-black border-amber-500' : 'bg-stone-900 text-stone-400 border-stone-800'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                      required
                    />
                    {orderType === "Delivery" && (                    
                      <textarea
                        placeholder="Complete Delivery Address *"
                        value={customerAddress}
                        onChange={e => setCustomerAddress(e.target.value)}
                        rows="2"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                        required
                      />
                    )}
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    >
                      <option>UPI / GPay / PhonePe</option>
                      <option>Cash on Delivery (COD)</option>
                    </select>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Place Order via WhatsApp
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#15110F] border border-amber-500/40 rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-400">Owner Admin Access</h3>
              <button onClick={() => setShowAdminLogin(false)}><X className="w-5 h-5 text-stone-400" /></button>
            </div>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input
                type="password"
                placeholder="Enter Admin PIN (Default: RRR2026)"
                value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 text-sm text-white"
                required
              />
              <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl">
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 
