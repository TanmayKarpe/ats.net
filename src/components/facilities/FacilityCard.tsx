import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Facility } from '@/data/facilities';

type Props = {
  facility: Facility;
};

export function FacilityCard({ facility }: Props) {
  return (
    <Card className="group overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{facility.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{facility.summary}</p>
        {facility.capabilities.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-foreground mb-2">Key Capabilities:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {facility.capabilities.slice(0, 3).map((cap, i) => (
                <li key={i}>• {cap}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Link to={`/facilities/${facility.id}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default FacilityCard;
