import { useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { accent, Alert, Button, Chip, Drawer, NotificationsIcon, Select, Tab, Tabs, Text } from "@nithin-studio-app/ui-components";
import type { LogLevel } from "./notifications";
import { mockLogEntries as initialLogEntries } from "./notifications";
import "./Layout.css";

type EntryFilter = "all" | "unread" | LogLevel;

const LEVEL_COLOR: Record<LogLevel, string> = {
  info: "#00b0ff",
  warning: "#ffab00",
  error: "#e57373",
};

const LEVEL_FILTERS: Array<{ value: EntryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
];

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return `layout-link${isActive ? " is-active" : ""}`;
}

export function Layout() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [logEntries, setLogEntries] = useState(initialLogEntries);
  const [entryFilter, setEntryFilter] = useState<EntryFilter>("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const unreadCount = useMemo(() => logEntries.filter((entry) => !entry.read).length, [logEntries]);

  const sourceOptions = useMemo(() => {
    const sources = Array.from(new Set(logEntries.map((entry) => entry.source))).sort();
    return [{ value: "all", label: "All apps" }, ...sources.map((source) => ({ value: source, label: source }))];
  }, [logEntries]);

  const visibleEntries = useMemo(() => {
    let entries = logEntries;
    if (entryFilter === "unread") entries = entries.filter((entry) => !entry.read);
    else if (entryFilter !== "all") entries = entries.filter((entry) => entry.level === entryFilter);
    if (sourceFilter !== "all") entries = entries.filter((entry) => entry.source === sourceFilter);
    return entries;
  }, [logEntries, entryFilter, sourceFilter]);

  function dismissEntry(id: number) {
    setLogEntries((entries) => entries.filter((entry) => entry.id !== id));
  }

  function markRead(id: number) {
    setLogEntries((entries) => entries.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
  }

  function clearAll() {
    setLogEntries([]);
  }

  return (
    <div className="layout">
      <nav className="layout-nav">
        <span className="layout-title">nithin-studio</span>
        <div className="layout-links">
          <NavLink to="/dashboard" className={navLinkClassName}>
            Dashboard
          </NavLink>
          <NavLink to="/services" className={navLinkClassName}>
            Services
          </NavLink>
        </div>
        <div className="layout-nav-end">
          <button
            type="button"
            className="layout-notifications-button"
            style={{ color: unreadCount > 0 ? accent.primary : "#f0f0f0" }}
            aria-label={unreadCount > 0 ? "Notifications (unread)" : "Notifications"}
            onClick={() => setNotificationsOpen(true)}
          >
            <NotificationsIcon />
          </button>
        </div>
      </nav>

      <div className="layout-content">
        <Outlet />
      </div>

      <Drawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        anchor="right"
        aria-label="Notifications"
      >
        <div className="notifications-panel">
          <div className="notifications-header">
            <Text variant="h6">Notifications</Text>
            <Button variant="text" size="small" disabled={logEntries.length === 0} onClick={clearAll}>
              Clear all
            </Button>
          </div>

          <Tabs value={entryFilter} onChange={(value) => setEntryFilter(value as EntryFilter)} aria-label="Filter notifications">
            {LEVEL_FILTERS.map((filter) => (
              <Tab key={filter.value} value={filter.value} label={filter.label} />
            ))}
          </Tabs>

          <Select
            options={sourceOptions}
            value={sourceFilter}
            onChange={setSourceFilter}
            size="small"
            fullWidth
            aria-label="Filter by app"
          />

          {visibleEntries.length === 0 ? (
            <Text variant="body2" color="#9aa0a6">
              Nothing yet.
            </Text>
          ) : (
            <div className="notifications-list">
              {visibleEntries.map((entry) => (
                <div key={entry.id} onClick={() => markRead(entry.id)}>
                  <Alert
                    severity={entry.level}
                    variant="outlined"
                    onClose={() => dismissEntry(entry.id)}
                    title={
                      <span className="notifications-row-top">
                        {!entry.read && <span className="notifications-unread-dot" aria-hidden="true" />}
                        <Chip label={entry.source} variant="outlined" color={LEVEL_COLOR[entry.level]} />
                        <span className="notifications-time">
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </span>
                      </span>
                    }
                  >
                    {entry.message}
                  </Alert>
                </div>
              ))}
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
