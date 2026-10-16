import React from 'react';

const SafetyAlerts = ({ warnings }) => {
  // If no warnings exist or list is empty, don't render anything
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-4 space-y-3">
      {warnings.map((warning, index) => {
        // Normalize severity check
        const severityText = warning.severity || 'HIGH RISK';
        const isCritical = severityText.includes('CRITICAL') || severityText.includes('HIGH');

        const badgeBg = isCritical
          ? 'bg-red-50 border-red-300 text-red-900'
          : 'bg-amber-50 border-amber-300 text-amber-900';

        const headerBg = isCritical ? 'bg-red-600' : 'bg-amber-500';

        // Format severity display without duplicating "RISK"
        const displaySeverity = severityText.includes('RISK') 
          ? severityText 
          : `${severityText} RISK`;

        return (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 shadow-sm ${badgeBg} transition-all duration-200 w-full`}
          >
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-red-200">
              <div className="flex flex-wrap items-center gap-2">
                {/* Warning Badge */}
                <span className={`px-2 py-1 text-xs font-bold text-white rounded tracking-wide ${headerBg}`}>
                  {displaySeverity}
                </span>
                
                {/* Interaction Title */}
                <h4 className="text-base font-bold text-gray-900">
                  {warning.title}
                </h4>
              </div>

              {/* Drug Pair Tag */}
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-white/80 px-2 py-0.5 rounded border border-gray-200 w-fit">
                {warning.drug_1} + {warning.drug_2}
              </span>
            </div>

            {/* Description Body */}
            <p className="text-sm text-gray-800 mb-3 leading-relaxed">
              {warning.description}
            </p>

            {/* Actionable Recommendation Box */}
            <div className="text-xs font-medium bg-white/90 p-2.5 rounded border border-gray-200 text-gray-800 shadow-inner">
              <span className="font-bold text-red-800">सल्ला / Recommendation: </span>
              {warning.recommendation}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SafetyAlerts;