/**
 * Reconnaissance summary section with tables
 */
import Card from '../common/Card';

const ReconSection = ({ reconData }) => {
  const { endpoints = [], technologies = [], services = [], subdomains = [] } = reconData;

  const ReconTable = ({ title, items, icon }) => (
    <div>
      <h3 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-neutral-900">{item.name}</span>
                {item.discovered_in_phase && (
                  <span className="text-xs text-neutral-500">
                    Phase {item.discovered_in_phase}
                  </span>
                )}
              </div>
              {item.details && Object.keys(item.details).length > 0 && (
                <div className="mt-1 text-xs text-neutral-600">
                  {Object.entries(item.details).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key}: {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400 italic">No {title.toLowerCase()} discovered yet</p>
      )}
    </div>
  );

  return (
    <Card className="mb-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">📊 Reconnaissance Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReconTable title="Endpoints" items={endpoints} icon="🌐" />
        <ReconTable title="Technologies" items={technologies} icon="⚙️" />
        <ReconTable title="Services" items={services} icon="🔧" />
        <ReconTable title="Subdomains" items={subdomains} icon="🔗" />
      </div>
    </Card>
  );
};

export default ReconSection;
