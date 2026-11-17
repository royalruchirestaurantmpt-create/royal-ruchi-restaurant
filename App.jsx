import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Plus, Minus, Trash2, Phone, MapPin, Clock,
  Star, ShieldCheck, X, CheckCircle2, ChefHat, Sparkles,
  Lock, LogOut, Edit3, Search, ArrowRight, Flame
} from 'lucide-react';

const INITIAL_MENU = [
  // 1. Royal Biryanis
  { id: 1, name: "Royal Hyderabadi Chicken Dum Biryani", category: "Royal Biryanis", price: 260, veg: false, bestseller: true, desc: "Authentic slow-cooked basmati rice layered with spiced tender chicken & saffron.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  { id: 2, name: "Nizam Mutton Zafrani Biryani", category: "Royal Biryanis", price: 340, veg: false, bestseller: true, desc: "Succulent mutton pieces marinated overnight in royal spices and dum-cooked.", img: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80" },
  { id: 3, name: "Paneer Tikka Royal Biryani", category: "Royal Biryanis", price: 230, veg: true, bestseller: false, desc: "Char-grilled cottage cheese cubes tossed in aromatic dum rice.", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80" },
  // 2. Tandoori & Kebabs
  { id: 4, name: "Murgh Malai Kebab (8 Pcs)", category: "Tandoori & Kebabs", price: 280, veg: false, bestseller: true, desc: "Creamy, melt-in-mouth chicken kebabs infused with cardamom and cheese.", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80" },
  { id: 5, name: "Tandoori Chicken (Full)", category: "Tandoori & Kebabs", price: 460, veg: false, bestseller: true, desc: "Classic clay-oven roasted chicken marinated in hung curd and Kashmiri chilli.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80" },
  // 3. Telangana Specials
  { id: 6, name: "Telangana Kodi Vepudu", category: "Telangana Specials", price: 270, veg: false, bestseller: true, desc: "Fiery, aromatic country-style chicken fry with freshly ground Telangana masala.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 7, name: "Natukodi Pulusu", category: "Telangana Specials", price: 320, veg: false, bestseller: false, desc: "Traditional rustic country chicken curry simmered to perfection.", img: "https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80" },
  // 4. Royal Curries
  { id: 8, name: "Butter Chicken Masala", category: "Royal Curries", price: 275, veg: false, bestseller: true, desc: "Tandoori chicken tikka simmered in rich velvety tomato-butter gravy.", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80" },
  { id: 9, name: "Paneer Butter Masala", category: "Royal Curries", price: 240, veg: true, bestseller: true, desc: "Soft paneer cubes in a rich, creamy cashew and tomato gravy.", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80" },
  // 5. Starters & Appetizers
  { id: 10, name: "Chicken 65 (Royal Style)", category: "Starters & Appetizers", price: 240, veg: false, bestseller: true, desc: "Crispy spicy chicken bites tossed with curry leaves and green chillies.", img: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80" },
  { id: 11, name: "Crispy Chilli Baby Corn", category: "Starters & Appetizers", price: 195, veg: true, bestseller: false, desc: "Golden fried baby corn tossed in tangy Indo-Chinese garlic sauce.", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80" },
  // 6. Indian Breads
  { id: 12, name: "Butter Garlic Naan", category: "Indian Breads", price: 65, veg: true, bestseller: true, desc: "Soft leavened flatbread topped with roasted garlic and melted butter.", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" },
  { id: 13, name: "Tandoori Roti", category: "Indian Breads", price: 35, veg: true, bestseller: false, desc: "Whole wheat bread baked crisp in a traditional clay tandoor.", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80" },
  // 7. Chinese & Fried Rice
  { id: 14, name: "Schezwan Chicken Fried Rice", category: "Chinese & Fried Rice", price: 210, veg: false, bestseller: false, desc: "Wok-tossed basmati rice with diced chicken, veggies & fiery Schezwan sauce.", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80" },
  // 8. Family Combos
  { id: 15, name: "Royal Family Biryani Pack (Serves 4)", category: "Family Combos", price: 899, veg: false, bestseller: true, desc: "Jumbo Chicken Dum Biryani + Chicken 65 + 4 Drinks + Double Ka Meetha.", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80" },
  // 9. Royal Desserts
  { id: 16, name: "Shahi Double Ka Meetha", category: "Royal Desserts", price: 110, veg: true, bestseller: true, desc: "Hyderabadi royal bread pudding soaked in saffron milk, ghee & dry fruits.", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80" },
  // 10. Beverages & Mocktails
  { id: 17, name: "Royal Mango Lassi", category: "Beverages & Mocktails", price: 95, veg: true, bestseller: true, desc: "Thick, creamy churned yogurt blended with Alphonso mango pulp & pistachios.", img: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80" }
];

const CATEGORIES = [
  "All",
  "Royal Biryanis",
  "Tandoori & Kebabs",
  "Telangana Specials",
  "Royal Curries",
  "Starters & Appetizers",
  "Indian Breads",
  "Chinese & Fried Rice",
  "Family Combos",
  "Royal Desserts",
  "Beverages & Mocktails"
];

function App() {
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem('rrr_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('rrr_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderType, setOrderType] = useState("Delivery");
  const [paymentMethod, setPaymentMethod] = useState("UPI / GPay / PhonePe");

  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", category: "Royal Biryanis", price: "", veg: false, desc: "" });

  useEffect(() => {
    localStorage.setItem('rrr_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('rrr_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
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
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || item.veg;
    return matchesCat && matchesSearch && matchesVeg;
  });

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const orderId = `RRR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customer: customerName,
      phone: customerPhone,
      address: orderType === "Delivery" ? customerAddress : "Takeaway / Dine-in",
      items: cart,
      total: grandTotal,
      payment: paymentMethod,
      status: "Confirmed",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders([newOrder, ...orders]);

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

  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newDish.name || !newDish.price) return;
    const item = {
      id: Date.now(),
      name: newDish.name,
      category: newDish.category,
      price: Number(newDish.price),
      veg: newDish.veg,
      bestseller: true,
      desc: newDish.desc || "Chef's special royal preparation.",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"
    };
    setMenu([item, ...menu]);
    setNewDish({ name: "", category: "Royal Biryanis", price: "", veg: false, desc: "" });
  };

  return (
    <div className="min-h-screen bg-[#0B0908] text-stone-100 font-sans">
      {/* Top Bar */}
      <div className="bg-gradient-to
