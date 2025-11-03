import React from 'react';

interface TopicDistributionProps {
  data: { [key: string]: number };
}

export const TopicDistribution: React.FC<TopicDistributionProps> = ({ data }) => {
  const topicLabels: { [key: string]: string } = {
    teaching_style: 'Teaching Style',
    course_content: 'Course Content',
    infrastructure: 'Infrastructure',
    assessment_methods: 'Assessment Methods',
    classroom_environment: 'Classroom Environment',
    support_services: 'Support Services'
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500'
  ];

  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const sortedEntries = Object.entries(data).sort(([,a], [,b]) => b - a);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Distribution</h3>
      <div className="space-y-4">
        {sortedEntries.map(([topic, count], index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          
          return (
            <div key={topic} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {topicLabels[topic] || topic}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{count}</span>
                  <span className="text-xs text-gray-500">({percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500 ease-out`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};