
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
  
  const commonInputClass = "w-full p-2 rounded-md bg-white dark:bg-gray-800/60 backdrop-blur-sm border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300";

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Reward Management</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Reward Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">Create New Reward</h3>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={commonInputClass} placeholder="e.g., Weekend Outing" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className={commonInputClass} rows={2} placeholder="Brief description of the reward"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white transition-colors duration-300">XP Cost</label>
              <input type="number" value={xpCost} onChange={e => setXpCost(Number(e.target.value))} className={commonInputClass} min="50" step="50" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30">
              Add Reward
            </button>
          </form>

          {/* Existing Rewards List */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Existing Rewards</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {rewards.map(reward => (
                <div key={reward.id} className={`p-3 rounded-lg flex justify-between items-center text-sm border transition-colors duration-300 ${reward.redeemed ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{reward.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{reward.xpCost} XP</p>
                    {reward.redeemed && <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Redeemed</span>}
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
