import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { ComponentItem } from '@/services/components';

type Props = { component: ComponentItem };

export function ComponentCard({ component }: Props) {
  return (
    <Card className="group overflow-hidden border-0 bg-card hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{component.name}</CardTitle>
        <CardDescription className="text-sm">{component.short_description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">{component.description}</p>
      </CardContent>

      <CardFooter>
        <Link to={`/components/${component.slug}`} className="w-full">
          <Button className="w-full" variant="default">
            View Details
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ComponentCard;
