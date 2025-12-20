import { Link, useParams, useNavigate } from 'react-router-dom';
import { getFacilityById, Facility } from '@/data/facilities';
import { buildGmailUrl } from '@/lib/email';

export default function FacilityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <div className="container py-12">Facility not found.</div>;

  const facility: Facility | undefined = getFacilityById(id);

  if (!facility) {
    return (
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Facility not found</h2>
        <p className="mb-4">We couldn't find the facility you're looking for.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-primary text-primary-foreground rounded">
            Go Back
          </button>
          <Link to="/facilities" className="px-4 py-2 border border-primary text-primary rounded">
            Browse Facilities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/facilities" className="text-sm text-muted-foreground underline">
          ← Back to facilities
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl">
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold mb-2">{facility.name}</h1>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">{facility.summary}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {facility.capabilities && facility.capabilities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Capabilities</h3>
              <ul className="space-y-2">
                {facility.capabilities.map((cap, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {facility.majorInstruments && facility.majorInstruments.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Major Instruments & Resources</h3>
              <ul className="space-y-2">
                {facility.majorInstruments.map((instrument, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{instrument}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {facility.sampleTypes && facility.sampleTypes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Sample Types Accepted</h3>
              <ul className="space-y-2">
                {facility.sampleTypes.map((type, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>{type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {facility.contactEmail && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-foreground mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">
                For inquiries about this facility, email{' '}
                <a
                  href={buildGmailUrl({
                    to: facility.contactEmail,
                    subject: `Inquiry – ${facility.name}`,
                    body: ''
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-primary font-semibold"
                >
                  {facility.contactEmail}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
