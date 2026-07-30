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
import { services } from "./services";
import "./ServicesPage.css";

export function ServicesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (service) => service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="services-page">
      <div className="services-header">
        <Text variant="h4">Services</Text>
        <div className="services-search">
          <TextField
            placeholder="Search services"
            value={query}
            onChange={setQuery}
            startAdornment={<SearchIcon />}
            fullWidth
            aria-label="Search services"
          />
        </div>
      </div>

      <div className="services-body">
        <aside className="services-sidebar">
          <div className="services-ticker-wrapper" aria-hidden="true">
            <Marquee duration={22}>
              {services.map((service) => (
                <div className="services-ticker-item" key={service.name}>
                  <Avatar alt={service.name} size={2} />
                  <span>{service.name}</span>
                </div>
              ))}
            </Marquee>
          </div>
        </aside>

        <div className="services-grid">
          {filteredServices.length === 0 ? (
            <Text variant="body2" color="#9aa0a6">
              No services match "{query}".
            </Text>
          ) : (
            filteredServices.map((service) => {
              const isAvailable = Boolean(service.apiUrl);
              return (
                <Card
                  key={service.name}
                  variant="outlined"
                  onClick={service.route ? () => navigate(`/services/${service.route}`) : undefined}
                >
                  <CardHeader
                    title={service.name}
                    action={
                      <Chip
                        label={isAvailable ? "Available" : "Not registered"}
                        color={isAvailable ? "#64dd17" : "#9aa0a6"}
                        variant="outlined"
                      />
                    }
                  />
                  <CardContent>
                    <Text variant="body2" color="#9aa0a6">
                      {service.description}
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
