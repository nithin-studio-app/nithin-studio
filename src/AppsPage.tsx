import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CloseIcon,
  Divider,
  SearchIcon,
  Text,
  TextField,
} from "@nithin-studio-app/ui-components";
import { apps } from "./apps";
import { useServiceRegistry } from "./serviceRegistryContext";
import { StatusDot } from "./StatusDot";
import type { StatusKind } from "./StatusDot";
import "./AppsPage.css";

const STATUS_LABEL: Record<StatusKind, string> = {
  healthy: "Available",
  down: "Down",
  "not-registered": "Not registered",
  unknown: "Can't reach gatekeeper-api",
};

export function AppsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { registry, connected } = useServiceRegistry();

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((app) => app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="apps-page">
      <div className="apps-header">
        <Text variant="h4">Apps</Text>
        <div className="apps-search">
          <TextField
            placeholder="Search apps"
            value={query}
            onChange={setQuery}
            startAdornment={<SearchIcon />}
            endAdornment={
              query && (
                <button
                  type="button"
                  className="apps-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </button>
              )
            }
            fullWidth
            aria-label="Search apps"
          />
        </div>
      </div>

      <div className="apps-grid">
        {filteredApps.length === 0 ? (
          <div className="apps-empty-state-wrapper">
            <Card variant="outlined">
              <div className="apps-empty-state">
                <span className="apps-empty-state-icon" aria-hidden="true">
                  <SearchIcon />
                </span>
                <Text variant="h6">No apps found</Text>
                <Text variant="body2" color="#9aa0a6">
                  Nothing matches "{query}". Try a different search.
                </Text>
                <Button variant="outlined" size="small" color="#b39ddb" onClick={() => setQuery("")}>
                  Clear search
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          filteredApps.map((app) => {
            const status: StatusKind = !connected
              ? "unknown"
              : (app.backendServiceName && registry[app.backendServiceName]?.status) || "not-registered";
            return (
              <Card
                key={app.name}
                variant="outlined"
                onClick={app.route ? () => navigate(`/apps/${app.route}`) : undefined}
              >
                <CardHeader
                  title={<span className="apps-card-title">{app.name}</span>}
                  action={<StatusDot status={status} label={STATUS_LABEL[status]} />}
                />
                <div className="apps-card-divider">
                  <Divider inset />
                </div>
                <CardContent>
                  <Text variant="body2" color="#9aa0a6">
                    {app.description}
                  </Text>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
