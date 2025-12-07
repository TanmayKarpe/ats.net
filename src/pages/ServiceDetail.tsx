import { Link, useParams, useNavigate } from 'react-router-dom';
import { getServiceById, Service } from '@/data/services';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <div className="container py-12">Service not found.</div>;

  const service: Service | undefined = getServiceById(id);

  if (!service) {
    return (
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Service not found</h2>
        <p className="mb-4">We couldn't find the service you're looking for.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Go Back
          </button>
          <Link to="/services" className="px-4 py-2 border border-primary text-primary rounded">
            Browse Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/services" className="text-sm text-muted-foreground underline">
          ← Back to services
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl">
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
          <p className="text-sm text-muted-foreground mb-4">{service.category}</p>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">{service.summary}</p>
            {service.turnaroundTime && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-semibold text-foreground mb-1">Turnaround Time:</p>
                <p className="text-sm">{service.turnaroundTime}</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {service.applications && service.applications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Applications</h3>
              <ul className="space-y-2">
                {service.applications.map((app, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.workflow && service.workflow.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Workflow</h3>
              <ol className="space-y-3">
                {service.workflow.map((step, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {service.pricingNote && (
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-foreground mb-2">Pricing</h3>
              <p className="text-sm text-muted-foreground">{service.pricingNote}</p>
            </div>
          )}

          {service.contactEmail && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-foreground mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                For more information or to request service, email{' '}
                <a href={`mailto:${service.contactEmail}`} className="underline text-primary font-semibold">
                  {service.contactEmail}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
