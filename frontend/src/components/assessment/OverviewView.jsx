import { useMemo } from 'react';
import { Shield, AlertTriangle, TrendingUp, Target } from '../icons';
import CardsTable from './CardsTable';

const OverviewView = ({ cards, assessmentId, onUpdate }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const findings = cards.filter(c => c.card_type === 'finding');
    const observations = cards.filter(c => c.card_type === 'observation');
    const infos = cards.filter(c => c.card_type === 'info');
    
    const critical = findings.filter(f => f.severity === 'CRITICAL').length;
    const high = findings.filter(f => f.severity === 'HIGH').length;
    const medium = findings.filter(f => f.severity === 'MEDIUM').length;
    const low = findings.filter(f => f.severity === 'LOW').length;
    
    const totalFindings = findings.length;
    const totalCards = cards.length;
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentCards = cards.filter(card => 
      new Date(card.created_at) > sevenDaysAgo
    );
    
    const last24h = new Date();
    last24h.setDate(last24h.getDate() - 1);
    
    const last24hCards = cards.filter(card => 
      new Date(card.created_at) > last24h
    );
    
    return {
      findings: totalFindings,
      observations: observations.length,
      infos: infos.length,
      critical,
      high,
      medium,
      low,
      totalCards,
      recentCards: recentCards.length,
      last24hCards: last24hCards.length
    };
  }, [cards]);

  // Get top findings by severity
  const topFindings = useMemo(() => {
    const findings = cards.filter(c => c.card_type === 'finding');
    
    // Sort by severity priority (Critical > High > Medium > Low)
    const severityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
    
    return findings
      .sort((a, b) => {
        const aOrder = severityOrder[a.severity] || 0;
        const bOrder = severityOrder[b.severity] || 0;
        if (aOrder !== bOrder) return bOrder - aOrder;
        return new Date(b.created_at) - new Date(a.created_at);
      })
      .slice(0, 5); // Top 5
  }, [cards]);

  // Calculate risk distribution percentages
  const getRiskDistribution = () => {
    const total = stats.critical + stats.high + stats.medium + stats.low;
    if (total === 0) return { critical: 0, high: 0, medium: 0, low: 0 };
    
    return {
      critical: Math.round((stats.critical / total) * 100),
      high: Math.round((stats.high / total) * 100),
      medium: Math.round((stats.medium / total) * 100),
      low: Math.round((stats.low / total) * 100)
    };
  };

  const riskDistribution = getRiskDistribution();

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getSeverityBarColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-neutral-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Distribution Chart */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary-500" />
          Risk Distribution
        </h3>

        {stats.findings > 0 ? (
          <div className="space-y-4">
            {/* Visual Bar Chart */}
            <div className="flex h-8 bg-neutral-100 rounded-lg overflow-hidden">
              {riskDistribution.critical > 0 && (
                <div 
                  className={`${getSeverityBarColor('CRITICAL')} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${riskDistribution.critical}%` }}
                >
                  {riskDistribution.critical}%
                </div>
              )}
              {riskDistribution.high > 0 && (
                <div 
                  className={`${getSeverityBarColor('HIGH')} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${riskDistribution.high}%` }}
                >
                  {riskDistribution.high}%
                </div>
              )}
              {riskDistribution.medium > 0 && (
                <div 
                  className={`${getSeverityBarColor('MEDIUM')} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${riskDistribution.medium}%` }}
                >
                  {riskDistribution.medium}%
                </div>
              )}
              {riskDistribution.low > 0 && (
                <div 
                  className={`${getSeverityBarColor('LOW')} flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${riskDistribution.low}%` }}
                >
                  {riskDistribution.low}%
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.critical > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-sm text-neutral-600">
                    Critical: {stats.critical} ({riskDistribution.critical}%)
                  </span>
                </div>
              )}
              {stats.high > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-sm text-neutral-600">
                    High: {stats.high} ({riskDistribution.high}%)
                  </span>
                </div>
              )}
              {stats.medium > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-neutral-600">
                    Medium: {stats.medium} ({riskDistribution.medium}%)
                  </span>
                </div>
              )}
              {stats.low > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-neutral-600">
                    Low: {stats.low} ({riskDistribution.low}%)
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No findings yet</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Recent Activity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.last24hCards}</div>
            <div className="text-sm text-neutral-600">Last 24h</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.recentCards}</div>
            <div className="text-sm text-neutral-600">Last 7 days</div>
          </div>
          <div className="text-center p-4 bg-neutral-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">{stats.totalCards}</div>
            <div className="text-sm text-neutral-600">Total cards</div>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary-500" />
          Findings ({stats.findings})
        </h3>

        {stats.findings > 0 ? (
          <CardsTable
            cards={cards.filter(c => c.card_type === 'finding')}
            assessmentId={assessmentId}
            onUpdate={onUpdate}
          />
        ) : (
          <div className="text-center py-8 text-neutral-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">No findings yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewView;
