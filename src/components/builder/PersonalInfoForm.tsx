import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFormProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  onChange: (field: string, value: string) => void;
}

export const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
        <p className="text-muted-foreground mb-6">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Professional Title *</Label>
        <Input
          id="title"
          placeholder="Senior Software Engineer"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          placeholder="Write a brief summary of your professional background and career objectives..."
          value={data.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};
