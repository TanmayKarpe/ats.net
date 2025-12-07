import { Link, useParams, useNavigate } from 'react-router-dom';
import { getInstrumentById, Instrument } from '@/data/instruments';

export default function InstrumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) return <div className="container py-12">Instrument not found.</div>;

  const instrument: Instrument | null = getInstrumentById(id);

  if (!instrument) {
    return (
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Instrument not found</h2>
        <p className="mb-4">We couldn't find the instrument you're looking for.</p>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="btn">
            Go Back
          </button>
          <Link to="/instruments" className="btn btn-ghost">
            Browse Instruments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link to="/instruments" className="text-sm text-muted-foreground underline">
          ← Back to instruments
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {instrument.image && (
            <img src={instrument.image} alt={instrument.name} className="w-full h-64 object-cover rounded-md" />
          )}
          <div className="mt-4">
            <h1 className="text-3xl font-bold">{instrument.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{instrument.category}</p>
          </div>
        </div>

        <div className="lg:col-span-2 prose">
          <h2>Overview</h2>
          <p>{instrument.summary}</p>

          {instrument.applications && (
            <>
              <h3>Applications</h3>
              <ul>
                {instrument.applications.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </>
          )}

          {instrument.specs && (
            <>
              <h3>Specifications</h3>
              <ul>
                {instrument.specs.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}

          {instrument.sampleRequirements && (
            <>
              <h3>Sample Requirements</h3>
              <p>{instrument.sampleRequirements}</p>
            </>
          )}

          {instrument.pricingNote && (
            <>
              <h3>Pricing</h3>
              <p>{instrument.pricingNote}</p>
            </>
          )}

          {instrument.contactEmail && (
            <>
              <h3>Contact</h3>
              <p>
                For booking or questions, email{' '}
                <a href={`mailto:${instrument.contactEmail}`} className="underline">
                  {instrument.contactEmail}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
