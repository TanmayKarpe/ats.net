import { Link, useParams, useNavigate } from 'react-router-dom';
import { getLeaderById, Leader } from '@/data/leaders';
import { Button } from '@/components/ui/button';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { buildGmailUrl } from '@/lib/email';

export default function LeaderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div className="container py-12">
        <p>Leader not found.</p>
      </div>
    );
  }

  const leader: Leader | undefined = getLeaderById(id);

  if (!leader) {
    return (
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-4">Leader not found</h2>
        <p className="mb-6">We couldn't find the leader you're looking for.</p>
        <Link to="/about">
          <Button>Back to Leadership</Button>
        </Link>
      </div>
    );
  }

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
          {/* Circular Portrait Image - 220px × 220px */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg ring-4 ring-background">
              {leader.image ? (
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <p className="text-7xl font-bold text-primary/20">{leader.name.charAt(0)}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2">Role</h3>
              <p className="text-sm text-muted-foreground">{leader.role}</p>
            </div>

            {leader.dob && (
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">Date of Birth</h3>
                <p className="text-sm text-muted-foreground">{leader.dob}</p>
              </div>
            )}

                {leader.email && leader.email.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </h3>
                    <div className="space-y-1">
                      {leader.email.map((email) => (
                        <a
                          key={email}
                          href={buildGmailUrl({
                            to: email,
                            subject: `Leadership Enquiry – ${leader.name}`,
                            body: ''
                          })}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

            {leader.phone && leader.phone.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Phone size={16} /> Phone
                </h3>
                <div className="space-y-1">
                  {leader.phone.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone}`}
                      className="text-sm text-primary hover:underline block"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{leader.name}</h1>
            <p className="text-lg text-primary font-semibold">{leader.role}</p>
          </div>

          {leader.qualifications && (
            <div>
              <h2 className="text-xl font-bold mb-3">Qualifications</h2>
              <p className="text-muted-foreground leading-relaxed">{leader.qualifications}</p>
            </div>
          )}

          {leader.bio && (
            <div>
              <h2 className="text-xl font-bold mb-3">Biography</h2>
              <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
            </div>
          )}

          {leader.achievements && (
            <div>
              <h2 className="text-xl font-bold mb-3">Key Achievements</h2>
              <p className="text-muted-foreground leading-relaxed">{leader.achievements}</p>
            </div>
          )}

          {/* Back Button at Bottom */}
          <div className="pt-6">
            <Link to="/about">
              <Button variant="outline">Back to Leadership</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
