import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  index?: number;
}

export const StatsCard = ({ label, value, icon: Icon, color, trend, index = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {value}
          </h3>
          {trend && (
            <p className="text-xs text-primary-600 font-medium">
              {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};
