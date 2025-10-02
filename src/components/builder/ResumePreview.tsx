import { Experience } from "./ExperienceForm";
import { Education } from "./EducationForm";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
}

interface ResumePreviewProps {
  templateId: string;
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

const ModernTemplate = ({ personalInfo, experiences, education, skills }: Omit<ResumePreviewProps, 'templateId'>) => {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 -m-8 mb-6">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.title && <p className="text-xl text-blue-100 mb-3">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-4 text-sm">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">Experience</h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="pl-4 border-l-4 border-blue-200">
                <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                <p className="text-blue-600 font-semibold mb-1">{exp.company}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </p>
                {exp.description && <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="pl-4 border-l-4 border-blue-200">
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-blue-600">{edu.school} {edu.field && `• ${edu.field}`}</p>
                <p className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-blue-600 mb-3 pb-2 border-b-2 border-blue-600">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClassicTemplate = ({ personalInfo, experiences, education, skills }: Omit<ResumePreviewProps, 'templateId'>) => {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="text-center border-b-4 border-gray-800 pb-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-wide">{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.title && <p className="text-xl text-gray-600 italic mb-3">{personalInfo.title}</p>}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>|</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>|</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 uppercase tracking-wider">Summary</h2>
          <p className="text-gray-700 leading-loose whitespace-pre-wrap text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">Professional Experience</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                <p className="text-gray-800 font-semibold mb-2">{exp.company}</p>
                {exp.description && <p className="text-gray-700 leading-loose whitespace-pre-wrap text-justify">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.school} {edu.field && `• ${edu.field}`}</p>
                  </div>
                  <span className="text-sm text-gray-600 italic">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">Skills</h2>
          <p className="text-gray-700 leading-loose">
            {skills.join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};

const MinimalTemplate = ({ personalInfo, experiences, education, skills }: Omit<ResumePreviewProps, 'templateId'>) => {
  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month] = date.split("-");
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="space-y-2">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">{personalInfo.fullName || "Your Name"}</h1>
        {personalInfo.title && <p className="text-lg text-gray-600 font-light">{personalInfo.title}</p>}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 uppercase tracking-wide pt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div>
          <h2 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-widest">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{personalInfo.summary}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-widest">Experience</h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{exp.position}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.description && <p className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-widest">Education</h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.school} {edu.field && `• ${edu.field}`}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-widest">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="text-xs text-gray-700 px-3 py-1 border border-gray-300 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResumePreview = ({ 
  templateId, 
  personalInfo, 
  experiences, 
  education, 
  skills 
}: ResumePreviewProps) => {
  const renderTemplate = () => {
    const props = { personalInfo, experiences, education, skills };
    
    switch (templateId) {
      case 'classic':
        return <ClassicTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'modern':
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div id="resume-preview" className="bg-white p-8 rounded-lg shadow-lg min-h-[297mm] w-[210mm]">
      {renderTemplate()}
    </div>
  );
};
