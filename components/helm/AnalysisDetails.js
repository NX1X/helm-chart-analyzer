import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Shield, FileCode2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AnalysisDetails({ chart }) {
  if (chart.status !== 'completed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5" />
            {chart.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            {chart.status === 'analyzing' ? (
              <div className="animate-pulse">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="mt-4 text-gray-600">Analyzing chart...</p>
              </div>
            ) : (
              <div>
                <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
                <p className="mt-4 text-gray-600">Analysis failed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5" />
            {chart.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{chart.content.slice(0, 200)}...</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Potential Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chart.analysis_result.potential_issues.map((issue, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                {issue}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chart.analysis_result.best_practices.map((practice, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                {practice}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            Security Concerns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {chart.analysis_result.security_concerns.map((concern, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg text-sm text-red-800">
                {concern}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}