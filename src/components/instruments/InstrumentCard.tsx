import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Instrument } from '@/data/instruments';

type Props = {
  instrument: Instrument;
};

export function InstrumentCard({ instrument }: Props) {
  return (
    <Card className="group overflow-hidden border-0 bg-card">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
        {instrument.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={instrument.image}
            alt={instrument.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {instrument.name}
          </span>
        </div>
      </div>

      <CardContent className="pt-6">
        <h3 className="font-bold text-lg mb-1">{instrument.name}</h3>
        {/* Description removed for compact card layout */}
        <div className="flex items-center gap-3">
          <Link to={`/instruments/${instrument.id}`} className="flex-1">
            <Button className="w-full">View details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstrumentCard;
