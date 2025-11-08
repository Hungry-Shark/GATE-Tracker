
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BADGES, LEVELS } from '../../constants';
import Card, { CardHeader, CardContent } from '../common/Card';
import { motion } from 'framer-motion';

const Rewards: React.FC = () => {
  const { student, rewards, redeemReward } = useAppContext();
  
  const currentLevelInfo = LEVELS.slice().reverse().find(l => student.totalXP >= l.minXp) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.minXp > student.totalXP);
  
  const progressToNextLevel = nextLevelInfo 
    ? ((student.totalXP - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100 
    : 100;

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-lg font-bold">Rewards & Achievements</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP and Level */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="font-semibold">{currentLevelInfo.name}</span>
            <span className="font-mono text-sm">{student.totalXP} / {nextLevelInfo ? nextLevelInfo.minXp : 'Max'} XP</span>
          </div>
          <div className="w-full bg-light-background dark:bg-dark-background/50 rounded-full h-4">
            <motion.div
              className="bg-gradient-to-r from-secondary to-primary h-4 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNextLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="font-semibold mb-2">Badges</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(BADGES).map(badge => (
              <div
                key={badge.key}
                title={badge.description}
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  student.badges.includes(badge.key)
                    ? 'bg-warning text-white shadow-lg'
                    : 'bg-light-background dark:bg-dark-background/50 text-gray-400'
                }`}
              >
                {badge.icon}
              </div>
            ))}
          </div>
        </div>
        
        {/* Redeemable Rewards */}
        <div>
          <h3 className="font-semibold mb-2">Redeem Rewards</h3>
          <div className="space-y-2">
            {rewards.map(reward => (
              <div key={reward.id} className={`p-3 rounded-lg flex justify-between items-center ${
                reward.redeemed ? 'bg-success/20' : 'bg-light-background dark:bg-dark-background/50'
              }`}>
                <div>
                  <p className="font-medium">{reward.title}</p>
                  <p className="text-sm font-mono text-primary">{reward.xpCost} XP</p>
                </div>
                <button
                  onClick={() => redeemReward(reward.id)}
                  disabled={reward.redeemed || student.totalXP < reward.xpCost}
                  className="px-3 py-1 text-sm font-semibold rounded-full text-white bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
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
