
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardHeader, CardContent } from '../common/Card';
import { CheckCircleIcon } from '../icons/Icons';

const RewardManagement: React.FC = () => {
  const { rewards, addReward } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpCost, setXpCost] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    addReward({ title, description, xpCost });
    setTitle('');
    setDescription('');
    setXpCost(100);
  };
  
  const commonInputClass = "w-full p-2 rounded-md bg-light-background dark:bg-dark-background/50 border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold">Reward Management</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Reward Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold">Create New Reward</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClass} placeholder="e.g., Weekend Outing" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={commonInputClass} rows={2} placeholder="Brief description of the reward"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">XP Cost</label>
              <input type="number" value={xpCost} onChange={e => setXpCost(Number(e.target.value))} className={commonInputClass} min="50" step="50" />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
              Add Reward
            </button>
          </form>

          {/* Existing Rewards List */}
          <div>
            <h3 className="font-semibold mb-4">Existing Rewards</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {rewards.map(reward => (
                <div key={reward.id} className={`p-3 rounded-lg flex justify-between items-center text-sm ${reward.redeemed ? 'bg-success/20' : 'bg-light-background dark:bg-dark-background/50'}`}>
                  <div>
                    <p className="font-medium">{reward.title}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-primary">{reward.xpCost} XP</p>
                    {reward.redeemed && <span className="text-xs text-success flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Redeemed</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardManagement;
