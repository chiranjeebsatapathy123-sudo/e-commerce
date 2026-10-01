import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { LayoutDashboard, Plus, Trash2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const DecisionWorkspace = ({ userInfo, addToCart }) => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteWorkspace = async (id) => {
    if (!window.confirm("Delete this workspace?")) return;
    try {
      await api.delete(`/commerce-brain/workspaces/${id}`);
      fetchWorkspaces();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>Loading workspaces...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={32} className="text-primary" />
          <h1 style={{ margin: 0 }}>Decision Workspace</h1>
        </div>
        <button onClick={createWorkspace} className="btn btn-primary">
          <Plus size={18} /> New Workspace
        </button>
      </div>

      {workspaces.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <h3>No Active Decisions</h3>
          <p className="text-muted" style={{ marginBottom: '24px' }}>Create a workspace to save products, notes, and AI comparisons for large purchases.</p>
          <button onClick={createWorkspace} className="btn btn-primary">Start a Decision</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {workspaces.map(ws => {
            const productIds = ws.productIds ? JSON.parse(ws.productIds) : [];
            return (
              <div key={ws.id} className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0 }}>{ws.title}</h3>
                  <button onClick={() => deleteWorkspace(ws.id)} className="btn btn-icon" style={{ color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-muted text-small" style={{ flex: 1 }}>
                  {productIds.length} saved products • Last updated {new Date(ws.updatedAt).toLocaleDateString()}
                </p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Open Workspace</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DecisionWorkspace;
