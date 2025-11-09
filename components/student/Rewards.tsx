
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BADGES, LEVELS } from '../../constants';
import Card, { CardHeader, CardContent } from '../common/Card';
import { motion } from 'framer-motion';

const Rewards: React.FC = () => {
  const { student, rewards, redeemReward } = useAppContext();
  
  if (!student) return null;
  
  const currentLevelInfo = LEVELS.slice().reverse().find(l => student.totalXP >= l.minXp) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.minXp > student.totalXP);
  
  const progressToNextLevel = nextLevelInfo 
    ? ((student.totalXP - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100 
    : 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">Rewards & Achievements</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP and Level */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{currentLevelInfo.name}</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white transition-colors duration-300">{student.totalXP} / {nextLevelInfo ? nextLevelInfo.minXp : 'Max'} XP</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700/50 rounded-full h-4 transition-colors duration-300">
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(BADGES).map(badge => (
              <div
                key={badge.key}
                title={badge.description}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  student.badges.includes(badge.key)
                    ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/50'
                    : 'bg-gray-200 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                }`}
              >
                {badge.icon}
              </div>
            ))}
          </div>
        </div>
        
        {/* Redeemable Rewards */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">Redeem Rewards</h3>
          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className={`p-3 rounded-lg flex justify-between items-center border transition-colors duration-300 ${
                reward.redeemed ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
              }`}>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{reward.title}</p>
                  <p className="text-sm font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">{reward.xpCost} XP</p>
                </div>
                <button
                  onClick={() => redeemReward(reward.id)}
                  disabled={reward.redeemed || student.totalXP < reward.xpCost}
                  className="px-3 py-1 text-sm font-semibold rounded-full text-white bg-gradient-to-r from-orange-500 to-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30"
                >
                  {reward.redeemed ? 'Redeemed' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Rewards;
