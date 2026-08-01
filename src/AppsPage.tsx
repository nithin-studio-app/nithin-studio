import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Marquee,
  SearchIcon,
  Text,
  TextField,
} from "@nithin-studio-app/ui-components";
import { apps } from "./apps";
import { useServiceRegistry } from "./serviceRegistry";
import "./AppsPage.css";

const STATUS_LABEL = { healthy: "Available", down: "Down", "not-registered": "Not registered" } as const;
const STATUS_COLOR = { healthy: "#64dd17", down: "#ff5252", "not-registered": "#9aa0a6" } as const;

export function AppsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const registry = useServiceRegistry();

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
            fullWidth
            aria-label="Search apps"
          />
        </div>
      </div>

      <div className="apps-body">
        <aside className="apps-sidebar">
          <div className="apps-ticker-wrapper" aria-hidden="true">
            <Marquee duration={22}>
              {apps.map((app) => (
                <div className="apps-ticker-item" key={app.name}>
                  <Avatar alt={app.name} size={2} />
                  <span>{app.name}</span>
                </div>
              ))}
            </Marquee>
          </div>
        </aside>

        <div className="apps-grid">
          {filteredApps.length === 0 ? (
            <Text variant="body2" color="#9aa0a6">
              No apps match "{query}".
            </Text>
          ) : (
            filteredApps.map((app) => {
              const status = (app.backendServiceName && registry[app.backendServiceName]?.status) || "not-registered";
              return (
                <Card
                  key={app.name}
                  variant="outlined"
                  onClick={app.route ? () => navigate(`/apps/${app.route}`) : undefined}
                >
                  <CardHeader
                    title={app.name}
                    action={<Chip label={STATUS_LABEL[status]} color={STATUS_COLOR[status]} variant="outlined" />}
                  />
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
    </div>
  );
}
