import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileCode2, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function ChartCard({ chart, onClick, isSelected }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'analyzing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'analyzing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileCode2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{chart.name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded {format(new Date(chart.created_date), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <Badge className={`flex items-center gap-1 ${getStatusColor(chart.status)}`}>
            {getStatusIcon(chart.status)}
            {chart.status.charAt(0).toUpperCase() + chart.status.slice(1)}
          </Badge>
        </div>

        {chart.status === 'completed' && chart.analysis_result && (
          <div className="mt-4 flex gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
              {chart.analysis_result.potential_issues?.length || 0} Issues
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
              {chart.analysis_result.best_practices?.length || 0} Best Practices
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
              {chart.analysis_result.security_concerns?.length || 0} Security Concerns
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}