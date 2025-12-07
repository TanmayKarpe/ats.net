import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/data/services';

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  return (
    <Card className="group overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
        <CardDescription className="text-sm">{service.category}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{service.summary}</p>
      </CardContent>

      <CardFooter>
        <Link to={`/services/${service.id}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
