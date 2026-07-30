import { Card, CardHeader, CardContent, Chip, Text } from "@nithin-studio-app/ui-components";
import { services } from "./services";
import "./ServicesPage.css";

export function ServicesPage() {
  return (
    <div>
      <Text variant="h4">Services</Text>
      <div className="services-grid">
        {services.map((service) => (
          <Card key={service.name} variant="outlined">
            <CardHeader
              title={service.name}
              action={
                <Chip
                  label={service.apiUrl ? "Available" : "Not registered"}
                  color={service.apiUrl ? "#64dd17" : "#9aa0a6"}
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
        ))}
      </div>
    </div>
  );
}
