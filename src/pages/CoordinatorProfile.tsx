import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Phone, ArrowLeft } from 'lucide-react';

export default function CoordinatorProfile() {
  const navigate = useNavigate();

  const coordinator = {
    name: 'Dr. Bhushan B. Chaudhari',
    designation: 'Coordinator, Analytical Testing Services Cell',
    email: 'bhushan.food@gmail.com',
    phone: '+91 91685 31101',
    image: `${import.meta.env.BASE_URL}coats.png`,
    role: 'ATS Coordinator',
    bio: 'The Coordinator of the ATS Cell serves as the strategic lead and technical liaison, responsible for overseeing the seamless delivery of advanced analytical and characterization services. The role encompasses planning, coordination, and supervision of all ATS activities to ensure accuracy, reliability, and timely execution of testing and analysis.',
    responsibilities: 'The Coordinator facilitates effective communication between faculty experts, technical staff, researchers, industry partners, and external stakeholders, thereby aligning service outcomes with institutional and client requirements. This position ensures that all ATS services meet the highest standards of quality and reliability.',
  };

  return (
    <div className="container py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image & Contact */}
        <div className="md:col-span-1">
          {/* Circular Portrait Image */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg ring-4 ring-background">
              <img
                src={coordinator.image}
                alt={coordinator.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Role</h3>
              <p className="text-sm text-muted-foreground">{coordinator.role}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </h3>
              <a
                href={`mailto:${coordinator.email}`}
                className="text-sm text-primary hover:underline block"
              >
                {coordinator.email}
              </a>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Phone size={16} /> Phone
              </h3>
              <a
                href={`tel:${coordinator.phone}`}
                className="text-sm text-primary hover:underline block"
              >
                {coordinator.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{coordinator.name}</h1>
            <p className="text-lg text-primary font-semibold">{coordinator.designation}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">About the Role</h2>
            <p className="text-muted-foreground leading-relaxed">{coordinator.bio}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Key Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">{coordinator.responsibilities}</p>
          </div>

          {/* Back Button at Bottom */}
          <div className="pt-6">
            <Button variant="outline" onClick={() => navigate('/contact')}>
              Back to Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
