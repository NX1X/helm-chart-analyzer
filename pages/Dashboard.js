import React, { useState, useEffect } from "react";
import { HelmChart } from "@/entities/HelmChart";
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FilePlus, AlertTriangle, CheckCircle2, Shield, FileCode2, Upload, Loader2 } from "lucide-react";
import FileUploadZone from "../components/helm/FileUploadZone";
import ChartCard from "../components/helm/ChartCard";
import AnalysisDetails from "../components/helm/AnalysisDetails";

export default function Dashboard() {
  const [charts, setCharts] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    const fetchedCharts = await HelmChart.list("-created_date");
    setCharts(fetchedCharts);
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    try {
      const { file_url } = await UploadFile({ file });
      
      const result = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            content: { type: "string" }
          }
        }
      });

      if (result.status === "error") {
        throw new Error("Failed to read file content");
      }

      const content = result.output.content;
      
      // Create chart record
      const chart = await HelmChart.create({
        name: file.name.replace(".yaml", "").replace(".yml", ""),
        content: content,
        status: "analyzing"
      });

      // Analyze the chart
      const analysis = await InvokeLLM({
        prompt: `Analyze this Helm chart and provide detailed feedback:
                ${content}
                
                Focus on:
                1. Potential issues and risks
                2. Best practices implementation
                3. Security concerns
                
                Format the response as structured data.`,
        response_json_schema: {
          type: "object",
          properties: {
            potential_issues: {
              type: "array",
              items: { type: "string" }
            },
            best_practices: {
              type: "array",
              items: { type: "string" }
            },
            security_concerns: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      await HelmChart.update(chart.id, {
        analysis_result: analysis,
        status: "completed"
      });

      loadCharts();
    } catch (err) {
      setError("Failed to process the Helm chart. Please ensure it's a valid YAML file.");
    }
    setIsUploading(false);
  };

  const filteredCharts = charts.filter(chart => {
    if (activeTab === "all") return true;
    return chart.status === activeTab;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Helm Chart Analyzer</h1>
            <p className="text-gray-500 mt-1">Upload and analyze your Helm charts</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Helm Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUploadZone 
                  onFileUpload={handleFileUpload}
                  isUploading={isUploading}
                />
              </CardContent>
            </Card>

            <div className="mt-8">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All Charts</TabsTrigger>
                    <TabsTrigger value="analyzing">Analyzing</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="error">Failed</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid gap-4">
                    {filteredCharts.map(chart => (
                      <ChartCard
                        key={chart.id}
                        chart={chart}
                        onClick={() => setSelectedChart(chart)}
                        isSelected={selectedChart?.id === chart.id}
                      />
                    ))}
                    {filteredCharts.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
                        <FileCode2 className="w-12 h-12 mx-auto text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No Charts Found</h3>
                        <p className="mt-2 text-gray-500">Upload a Helm chart to get started</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-4">
            <ScrollArea className="h-[calc(100vh-8rem)] rounded-lg">
              {selectedChart ? (
                <AnalysisDetails chart={selectedChart} />
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
                  <Shield className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No Chart Selected</h3>
                  <p className="mt-2 text-gray-500">Select a chart to view its analysis</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}