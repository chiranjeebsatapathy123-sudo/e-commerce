import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LayoutDashboard, Plus, Trash2, ArrowLeft, Check, X, Sparkles, Scale } from 'lucide-react';

const DecisionWorkspace = ({ userInfo, addToCart }) => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchWorkspaces();
  }, [userInfo, navigate]);

  const fetchWorkspaces = async () => {
    try {
      const { data } = await api.get('/commerce-brain/workspaces');
      setWorkspaces(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    const title = window.prompt("Enter a name for your decision workspace (e.g. 'Laptop for college')");
    if (!title) return;
    try {
      await api.post('/commerce-brain/workspaces', { title, productIds: [] });
      fetchWorkspaces();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteWorkspace = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this workspace?")) return;
    try {
      await api.delete(`/commerce-brain/workspaces/${id}`);
      if (activeWorkspace?.id === id) setActiveWorkspace(null);
      fetchWorkspaces();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // MOCK comparison data for the active workspace view
  const mockComparison = [
    {
      id: 1,
      name: "MacBook Pro M3 Max",
      price: "$3,199.00",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
      pros: ["Industry leading performance", "Incredible battery life", "Stunning Mini-LED display"],
      cons: ["Very expensive", "Cannot upgrade RAM/Storage after purchase"],
      specs: { Processor: "M3 Max (16-core CPU)", RAM: "64GB Unified", Storage: "2TB SSD", Weight: "4.7 lbs" }
    },
    {
      id: 2,
      name: "Razer Blade 16",
      price: "$3,299.00",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800",
      pros: ["Dual-mode Mini-LED display (4K/120Hz or FHD/240Hz)", "RTX 4090 GPU", "Premium aluminum build"],
      cons: ["Gets very hot under load", "Battery life is poor compared to Mac"],
      specs: { Processor: "Intel Core i9-14900HX", RAM: "64GB DDR5", Storage: "2TB SSD", Weight: "5.4 lbs" }
    }
  ];

  if (activeWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <button onClick={() => setActiveWorkspace(null)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors font-medium">
            <ArrowLeft size={20} /> Back to Workspaces
          </button>

          <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{activeWorkspace.title}</h1>
              </div>
              <p className="text-gray-500">Spark AI has analyzed your saved products and generated this comparison matrix.</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-2xl p-4 flex items-center gap-4">
               <div className="bg-white p-2 rounded-xl text-purple-600 shadow-sm"><Sparkles size={24} /></div>
               <div>
                 <p className="text-sm font-bold text-purple-900">AI Recommendation</p>
                 <p className="text-xs text-purple-700">Based on your browsing history, the MacBook Pro fits your workflow better.</p>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              {mockComparison.map(product => (
                <div key={product.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="w-full h-64 bg-gray-100 rounded-2xl mb-6 overflow-hidden border border-gray-200">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-xl font-black text-blue-600 mb-8">{product.price}</p>
                  
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Pros & Cons</h4>
                    <ul className="space-y-3 mb-6">
                      {product.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <Check size={18} className="text-green-500 mt-0.5 flex-shrink-0" /> <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-3">
                      {product.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <X size={18} className="text-red-500 mt-0.5 flex-shrink-0" /> <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Technical Specs</h4>
                    <div className="space-y-3">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">{key}</span>
                          <span className="font-medium text-gray-900">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full mt-10 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-md">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2.5 rounded-xl text-purple-600">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Decision Workspaces</h1>
            </div>
            <p className="text-gray-500 max-w-xl">
              Save products to a workspace and let Spark AI build a comprehensive comparison matrix to help you make the right choice.
            </p>
          </div>
          
          <button onClick={createWorkspace} className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md flex items-center gap-2 flex-shrink-0">
            <Plus size={18} /> New Workspace
          </button>
        </div>

        {workspaces.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 border border-purple-100">
              <Scale size={40} className="text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Decisions</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Create a workspace to save products, take notes, and get AI-powered side-by-side comparisons for large purchases.
            </p>
            <button onClick={createWorkspace} className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md">
              Start a Decision
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map(ws => {
              const productIds = ws.productIds ? JSON.parse(ws.productIds) : [];
              // Just mocking product counts for visual effect
              const mockCount = Math.floor(Math.random() * 3) + 2; 
              
              return (
                <div 
                  key={ws.id} 
                  onClick={() => setActiveWorkspace(ws)}
                  className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-gray-50 border border-gray-100 w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 group-hover:border-purple-200 transition-colors">
                      <Scale size={24} />
                    </div>
                    <button onClick={(e) => deleteWorkspace(ws.id, e)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Workspace">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{ws.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1">
                    Last updated {new Date(ws.updatedAt).toLocaleDateString()}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                      {mockCount} Products Saved
                    </span>
                    <span className="text-sm font-medium text-purple-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open <ArrowLeft size={16} className="rotate-180" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionWorkspace;
