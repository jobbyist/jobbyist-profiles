import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface EducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationForm = ({ education, onChange }: EducationFormProps) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: ""
    };
    onChange([...education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Education</h3>
          <p className="text-muted-foreground">Add your educational background</p>
        </div>
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id} className="p-6 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>

            <div className="space-y-4 pr-12">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>School *</Label>
                  <Input
                    placeholder="University Name"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, "school", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input
                    placeholder="Bachelor of Science"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Field of Study *</Label>
                  <Input
                    placeholder="Computer Science"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Start</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {education.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground mb-4">No education added yet</p>
            <Button onClick={addEducation} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Education
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
