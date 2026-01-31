import { useState, useMemo } from 'react';
import { Shield } from '../icons';
import CardsTable from './CardsTable';
import OverviewView from './OverviewView';

const CardsSection = ({ cards, assessmentId, onUpdate }) => {
  const [activeFilter, setActiveFilter] = useState('overview');

  // Filter cards based on active filter
  const filteredCards = useMemo(() => {
    if (activeFilter === 'overview' || activeFilter === 'all') return cards;
    
    switch (activeFilter) {
      case 'findings':
        return cards.filter(c => c.card_type === 'finding');
      case 'observations':
        return cards.filter(c => c.card_type === 'observation');
      case 'info':
        return cards.filter(c => c.card_type === 'info');
      case 'critical':
        return cards.filter(c => c.severity === 'CRITICAL');
      case 'high':
        return cards.filter(c => c.severity === 'HIGH');
      case 'medium':
        return cards.filter(c => c.severity === 'MEDIUM');
      case 'low':
        return cards.filter(c => c.severity === 'LOW');
      default:
        return cards;
    }
  }, [cards, activeFilter]);

  const getFilterCounts = () => {
    const counts = {
      overview: cards.length,
      findings: cards.filter(c => c.card_type === 'finding').length,
      observations: cards.filter(c => c.card_type === 'observation').length,
      info: cards.filter(c => c.card_type === 'info').length,
      critical: cards.filter(c => c.severity === 'CRITICAL').length,
      high: cards.filter(c => c.severity === 'HIGH').length,
      medium: cards.filter(c => c.severity === 'MEDIUM').length,
      low: cards.filter(c => c.severity === 'LOW').length,
    };
    return counts;
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-header">
          <Shield className="w-5 h-5 text-primary-500" />
          Cards & Findings
        </h2>
        <div className="text-sm text-neutral-500">
          {filteredCards.length} total
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'overview', label: 'Overview', count: filterCounts.overview },
          { key: 'findings', label: 'Findings', count: filterCounts.findings },
          { key: 'observations', label: 'Observations', count: filterCounts.observations },
          { key: 'info', label: 'Info', count: filterCounts.info },
          { key: 'critical', label: 'Critical', count: filterCounts.critical },
          { key: 'high', label: 'High', count: filterCounts.high },
          { key: 'medium', label: 'Medium', count: filterCounts.medium },
          { key: 'low', label: 'Low', count: filterCounts.low },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              activeFilter === key
                ? 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            {label} {count > 0 && `(${count})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeFilter === 'overview' ? (
        <OverviewView cards={cards} assessmentId={assessmentId} onUpdate={onUpdate} />
      ) : filteredCards.length === 0 ? (
        <div className="empty-state py-12">
          <Shield className="empty-state-icon" />
          <p className="empty-state-title">No cards found</p>
          <p className="empty-state-text">
            {activeFilter === 'all' 
              ? 'No cards have been created yet. Claude will add findings, observations, and information as the assessment progresses.'
              : `No ${activeFilter} cards found. Try selecting a different filter.`
            }
          </p>
        </div>
      ) : (
        <CardsTable 
          cards={filteredCards} 
          assessmentId={assessmentId}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default CardsSection;
