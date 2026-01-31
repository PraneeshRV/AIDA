/**
 * Assessment header with State of Work and Basic Information
 */
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatDate, getAssessmentStatusColor } from '../../utils/formatters';

const AssessmentHeader = ({ assessment, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const statusVariants = {
    in_progress: 'primary',
    completed: 'success',
    archived: 'default',
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Title and Status */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">{assessment.name}</h1>
          <p className="text-neutral-500 mt-1">
            Created {formatDate(assessment.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[assessment.status]} size="lg">
            {assessment.status.replace('_', ' ').toUpperCase()}
          </Badge>
          {assessment.workspace_path && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(assessment.workspace_path)}
            >
              📂 Copy Workspace Path
            </Button>
          )}
        </div>
      </div>

      {/* State of Work */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">State of Work</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            ✏️ Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-600">Client</label>
            <p className="text-base text-neutral-900 mt-1">
              {assessment.client_name || 'N/A'}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-600">Timeline</label>
            <p className="text-base text-neutral-900 mt-1">
              {assessment.start_date && assessment.end_date
                ? `${formatDate(assessment.start_date)} - ${formatDate(assessment.end_date)}`
                : 'N/A'}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-neutral-600">Scope</label>
            <p className="text-base text-neutral-900 mt-1 whitespace-pre-wrap">
              {assessment.scope || 'N/A'}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-neutral-600">Limitations</label>
            <p className="text-base text-neutral-900 mt-1 whitespace-pre-wrap">
              {assessment.limitations || 'N/A'}
            </p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <Card>
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-neutral-600">Target Domains</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {assessment.target_domains && assessment.target_domains.length > 0 ? (
                assessment.target_domains.map((domain, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-primary-100/50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-md text-sm font-mono"
                  >
                    {domain}
                  </span>
                ))
              ) : (
                <span className="text-neutral-400">No domains specified</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-600">IP Scopes</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {assessment.ip_scopes && assessment.ip_scopes.length > 0 ? (
                assessment.ip_scopes.map((ip, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md text-sm font-mono"
                  >
                    {ip}
                  </span>
                ))
              ) : (
                <span className="text-neutral-400">No IP scopes specified</span>
              )}
            </div>
          </div>

          {assessment.credentials && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-600">Credentials</label>
              <p className="text-base text-neutral-900 mt-1 font-mono text-sm bg-neutral-50 p-3 rounded">
                {assessment.credentials}
              </p>
            </div>
          )}

          {assessment.access_info && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-600">Access Info</label>
              <p className="text-base text-neutral-900 mt-1 whitespace-pre-wrap">
                {assessment.access_info}
              </p>
            </div>
          )}

          {assessment.environment_notes && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-600">Environment Setup</label>
              <p className="text-base text-neutral-900 mt-1 whitespace-pre-wrap">
                {assessment.environment_notes}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AssessmentHeader;
