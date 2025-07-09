"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DirectusService } from "@/lib/directus";
import { useInterval, useRequest } from "ahooks";
import {
  AlertCircle,
  CheckCircle,
  Database,
  RefreshCw,
  Server,
  Wifi,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "./loading-spinner";

const formatUptime = (seconds?: number) => {
  if (!seconds) return "Unknown";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

interface DirectusStatus {
  isConnected: boolean;
  version?: string;
  database?: string;
  uptime?: number;
  lastChecked: Date;
  info?: Record<string, any>;
  error?: string;
}

export function DirectusStatus() {
  const [status, setStatus] = useState<DirectusStatus>({
    isConnected: false,
    lastChecked: new Date(),
  });

  const { loading: isChecking, runAsync: checkStatus } = useRequest(
    DirectusService.testConnection,
    {
      manual: true,
      onSuccess: (result) => {
        if (result.isConnected) {
          setStatus({
            isConnected: true,
            version: result.version,
            database: result.database,
            uptime: result.uptime,
            info: result.info,
            lastChecked: new Date(),
          });
        } else {
          setStatus({
            isConnected: false,
            lastChecked: new Date(),
            error: result.error || "Connection failed",
          });
        }
      },
      onError: (error) => {
        console.error("Directus status check failed:", error);
        setStatus({
          isConnected: false,
          lastChecked: new Date(),
          error: error instanceof Error ? error.message : "Connection failed",
        });
      },
    }
  );

  const { data: serverInfo } = useRequest(DirectusService.getServerInfo, {
    pollingInterval: 60000,
  });

  useInterval(checkStatus, 30000, {
    immediate: true,
  });

  useEffect(() => {
    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Directus Status
            </CardTitle>
            <CardDescription>
              Connection status to your Directus backend
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            disabled={isChecking}
          >
            {isChecking ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {status.isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className="font-medium">
                {status.isConnected ? "Connected" : "Disconnected"}
              </p>
              <p className="text-sm text-muted-foreground">
                Last checked: {status.lastChecked.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <Badge variant={status.isConnected ? "default" : "destructive"}>
            {status.isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Server Information */}
        {status.isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Version</span>
              </div>
              <p className="text-lg font-semibold">
                {serverInfo?.version || "Unknown"}
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <p className="text-lg font-semibold">
                {status.database || "Unknown"}
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <p className="text-lg font-semibold">
                {formatUptime(status.uptime)}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {!status.isConnected && status.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to connect to Directus: {status.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Configuration Info */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Configuration</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Endpoint:</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_DIRECTUS_URL ||
                  "http://localhost:8055"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-refresh:</span>
              <span>Every 30 seconds</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055",
                "_blank"
              )
            }
          >
            Open Directus Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                `${
                  process.env.NEXT_PUBLIC_DIRECTUS_URL ||
                  "http://localhost:8055"
                }/admin/settings/data-model`,
                "_blank"
              )
            }
          >
            Data Model
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
