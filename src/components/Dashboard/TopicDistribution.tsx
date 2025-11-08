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

  const topicIcons: { [key: string]: string } = {
    teaching_style: 'bi-person-video3',
    course_content: 'bi-book',
    infrastructure: 'bi-building',
    assessment_methods: 'bi-clipboard-check',
    classroom_environment: 'bi-people',
    support_services: 'bi-headset'
  };

  const colors: { [key: string]: { bg: string; text: string; bar: string } } = {
    teaching_style: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
    course_content: { bg: 'bg-green-50', text: 'text-green-700', bar: 'bg-green-500' },
    infrastructure: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-500' },
    assessment_methods: { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-500' },
    classroom_environment: { bg: 'bg-pink-50', text: 'text-pink-700', bar: 'bg-pink-500' },
    support_services: { bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-500' }
  };

  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const sortedEntries = Object.entries(data).sort(([,a], [,b]) => b - a);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Topic Distribution</h3>
        <span className="text-sm text-gray-500">Total: {total} topics</span>
      </div>
      
      {total === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <i className="bi bi-inbox text-4xl mb-2"></i>
          <p className="text-sm">No feedback topics analyzed yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEntries.map(([topic, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            const color = colors[topic] || { bg: 'bg-gray-50', text: 'text-gray-700', bar: 'bg-gray-500' };
            
            return (
              <div key={topic} className={`rounded-lg p-3 ${color.bg} transition-all duration-300 hover:shadow-md`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className={`bi ${topicIcons[topic] || 'bi-tag'} ${color.text}`}></i>
                    <span className={`text-sm font-semibold ${color.text}`}>
                      {topicLabels[topic] || topic}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg font-bold ${color.text}`}>{count}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${color.bar} transition-all duration-700 ease-out shadow-sm`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {count > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    Mentioned in {count} feedback{count !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};