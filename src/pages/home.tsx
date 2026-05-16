import { useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Download, RefreshCw, Briefcase, GraduationCap, User, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

interface Experience {
  id: string;
  company: string;
  position: string;
  date: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  date: string;
}

interface CVData {
  photo: string | null;
  fullName: string;
  jobTitle: string;
  phone: string;
  email: string;
  website: string;
  experience: Experience[];
  education: Education[];
  skills: string;
}

const initialExperience: Experience = {
  id: "exp-1",
  company: "",
  position: "",
  date: "",
  description: ""
};

const initialEducation: Education = {
  id: "edu-1",
  school: "",
  degree: "",
  date: ""
};

const initialCVData: CVData = {
  photo: null,
  fullName: "",
  jobTitle: "",
  phone: "",
  email: "",
  website: "",
  experience: [initialExperience],
  education: [initialEducation],
  skills: ""
};

export default function Home() {
  const { toast } = useToast();
  const cvRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [draftData, setDraftData] = useState<CVData>(initialCVData);
  const [previewData, setPreviewData] = useState<CVData>(initialCVData);

  const handleUpdatePreview = () => {
    setPreviewData({ ...draftData });
    toast({
      title: "Başarılı",
      description: "Önizleme güncellendi.",
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${previewData.fullName || 'CV'}_CV`,
    onAfterPrint: () => {
      toast({
        title: "Başarılı",
        description: "Yazdırma penceresi açıldı. 'PDF Olarak Kaydet' seçeneğini kullanın.",
      });
    },
  });

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraftData({ ...draftData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setDraftData({
      ...draftData,
      experience: [
        ...draftData.experience,
        { id: `exp-${Date.now()}`, company: "", position: "", date: "", description: "" }
      ]
    });
  };

  const removeExperience = (id: string) => {
    setDraftData({
      ...draftData,
      experience: draftData.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setDraftData({
      ...draftData,
      experience: draftData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addEducation = () => {
    setDraftData({
      ...draftData,
      education: [
        ...draftData.education,
        { id: `edu-${Date.now()}`, school: "", degree: "", date: "" }
      ]
    });
  };

  const removeEducation = (id: string) => {
    setDraftData({
      ...draftData,
      education: draftData.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setDraftData({
      ...draftData,
      education: draftData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Form */}
      <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] h-screen overflow-y-auto border-r border-border bg-card p-6 flex flex-col gap-6 custom-scrollbar">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">CV Oluşturucu</h1>
            <p className="text-sm text-muted-foreground">Profesyonel özgeçmişinizi hazırlayın</p>
          </div>
        </div>

        {/* Personal Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <User size={18} />
            <h2>Kişisel Bilgiler</h2>
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-24 w-24 rounded-full border-2 border-dashed border-border bg-muted flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors overflow-hidden group relative"
              data-testid="button-upload-photo"
            >
              {draftData.photo ? (
                <>
                  <img src={draftData.photo} alt="Profil" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white mb-1" size={16} />
                    <span className="text-[10px] text-white font-medium">Değiştir</span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="text-muted-foreground mb-1" size={24} />
                  <span className="text-[10px] text-muted-foreground font-medium text-center">Fotoğraf<br/>Yükle</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
              data-testid="input-photo"
            />
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input 
                  id="fullName" 
                  value={draftData.fullName} 
                  onChange={(e) => setDraftData({ ...draftData, fullName: e.target.value })} 
                  placeholder="Örn. Ahmet Yılmaz"
                  data-testid="input-fullname"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="jobTitle">Unvan</Label>
              <Input 
                id="jobTitle" 
                value={draftData.jobTitle} 
                onChange={(e) => setDraftData({ ...draftData, jobTitle: e.target.value })} 
                placeholder="Örn. Kıdemli Yazılım Mühendisi"
                data-testid="input-jobtitle"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input 
                id="phone" 
                value={draftData.phone} 
                onChange={(e) => setDraftData({ ...draftData, phone: e.target.value })} 
                placeholder="Örn. 0555 123 45 67"
                data-testid="input-phone"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email"
                value={draftData.email} 
                onChange={(e) => setDraftData({ ...draftData, email: e.target.value })} 
                placeholder="Örn. ahmet@ornek.com"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="website">LinkedIn / Web Sitesi</Label>
              <Input 
                id="website" 
                value={draftData.website} 
                onChange={(e) => setDraftData({ ...draftData, website: e.target.value })} 
                placeholder="Örn. linkedin.com/in/ahmetyilmaz"
                data-testid="input-website"
              />
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-border my-2" />

        {/* Experience */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Briefcase size={18} />
              <h2>İş Deneyimi</h2>
            </div>
            <Button onClick={addExperience} variant="outline" size="sm" className="h-8 text-xs gap-1" data-testid="button-add-experience">
              <Plus size={14} /> Ekle
            </Button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {draftData.experience.map((exp, index) => (
                <motion.div 
                  key={exp.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border/60 shadow-sm relative overflow-visible bg-card">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-3 -right-3 h-7 w-7 rounded-full shadow-sm"
                      onClick={() => removeExperience(exp.id)}
                      data-testid={`button-remove-experience-${exp.id}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                    <CardContent className="p-4 space-y-4 pt-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Şirket Adı</Label>
                          <Input 
                            value={exp.company} 
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)} 
                            placeholder="Örn. Tech Corp"
                            data-testid={`input-exp-company-${exp.id}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Tarih</Label>
                          <Input 
                            value={exp.date} 
                            onChange={(e) => updateExperience(exp.id, "date", e.target.value)} 
                            placeholder="Örn. 2020 - Halen"
                            data-testid={`input-exp-date-${exp.id}`}
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label>Pozisyon</Label>
                          <Input 
                            value={exp.position} 
                            onChange={(e) => updateExperience(exp.id, "position", e.target.value)} 
                            placeholder="Örn. Frontend Geliştirici"
                            data-testid={`input-exp-position-${exp.id}`}
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label>Açıklama</Label>
                          <Textarea 
                            value={exp.description} 
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)} 
                            placeholder="Sorumluluklarınızı ve başarılarınızı kısaca anlatın..."
                            className="resize-none min-h-[80px]"
                            data-testid={`input-exp-description-${exp.id}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {draftData.experience.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg border-border">
                Henüz deneyim eklenmemiş.
              </div>
            )}
          </div>
        </section>

        <div className="w-full h-px bg-border my-2" />

        {/* Education */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <GraduationCap size={18} />
              <h2>Eğitim</h2>
            </div>
            <Button onClick={addEducation} variant="outline" size="sm" className="h-8 text-xs gap-1" data-testid="button-add-education">
              <Plus size={14} /> Ekle
            </Button>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {draftData.education.map((edu, index) => (
                <motion.div 
                  key={edu.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border border-border/60 shadow-sm relative overflow-visible bg-card">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute -top-3 -right-3 h-7 w-7 rounded-full shadow-sm"
                      onClick={() => removeEducation(edu.id)}
                      data-testid={`button-remove-education-${edu.id}`}
                    >
                      <Trash2 size={12} />
                    </Button>
                    <CardContent className="p-4 space-y-4 pt-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <Label>Üniversite / Okul</Label>
                          <Input 
                            value={edu.school} 
                            onChange={(e) => updateEducation(edu.id, "school", e.target.value)} 
                            placeholder="Örn. İstanbul Teknik Üniversitesi"
                            data-testid={`input-edu-school-${edu.id}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Bölüm / Derece</Label>
                          <Input 
                            value={edu.degree} 
                            onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} 
                            placeholder="Örn. Bilgisayar Müh. (Lisans)"
                            data-testid={`input-edu-degree-${edu.id}`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Tarih</Label>
                          <Input 
                            value={edu.date} 
                            onChange={(e) => updateEducation(edu.id, "date", e.target.value)} 
                            placeholder="Örn. 2016 - 2020"
                            data-testid={`input-edu-date-${edu.id}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {draftData.education.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-lg border-border">
                Henüz eğitim eklenmemiş.
              </div>
            )}
          </div>
        </section>

        <div className="w-full h-px bg-border my-2" />

        {/* Skills */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <FileText size={18} />
            <h2>Yetenekler</h2>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills">Yeteneklerinizi virgül ile ayırarak yazın</Label>
            <Textarea 
              id="skills" 
              value={draftData.skills} 
              onChange={(e) => setDraftData({ ...draftData, skills: e.target.value })} 
              placeholder="Örn. JavaScript, React, Node.js, İletişim, Takım Çalışması"
              className="resize-none min-h-[100px]"
              data-testid="input-skills"
            />
          </div>
        </section>

        {/* Actions - Sticky Bottom */}
        <div className="sticky bottom-0 pt-6 pb-2 bg-card border-t border-border mt-auto flex flex-col gap-3 z-10">
          <Button onClick={handleUpdatePreview} className="w-full" variant="outline" data-testid="button-update-preview">
            <RefreshCw className="mr-2" size={16} /> Önizlemeyi Güncelle
          </Button>
          <Button 
            onClick={() => handlePrint()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            data-testid="button-download-pdf"
          >
            <Download className="mr-2" size={16} /> PDF OLUŞTUR & İNDİR
          </Button>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 h-screen bg-muted overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar">
        <div 
          id="cvPreview" 
          ref={cvRef} 
          className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-xl flex flex-col mx-auto"
          style={{ padding: '40px', boxSizing: 'border-box' }}
          data-testid="cv-preview"
        >
          {/* Header */}
          <div className="flex items-start gap-6 border-b-2 border-gray-800 pb-6 mb-6">
            {previewData.photo && (
              <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 shrink-0">
                <img src={previewData.photo} alt={previewData.fullName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 pt-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif tracking-tight">
                {previewData.fullName || "Ad Soyad"}
              </h1>
              <h2 className="text-xl text-primary font-medium mb-4">
                {previewData.jobTitle || "Unvan"}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                {previewData.phone && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">T:</span> {previewData.phone}
                  </div>
                )}
                {previewData.email && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">E:</span> {previewData.email}
                  </div>
                )}
                {previewData.website && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-800">W:</span> {previewData.website}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            {/* Experience */}
            {(previewData.experience.length > 0 && previewData.experience.some(e => e.company || e.position)) && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 font-serif uppercase tracking-wider">İş Deneyimi</h3>
                <div className="space-y-5">
                  {previewData.experience.filter(e => e.company || e.position).map(exp => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-900">{exp.position}</h4>
                        <span className="text-sm font-medium text-primary bg-primary/5 px-2 py-0.5 rounded">{exp.date}</span>
                      </div>
                      <div className="font-medium text-gray-700 text-sm">{exp.company}</div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {(previewData.education.length > 0 && previewData.education.some(e => e.school || e.degree)) && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 font-serif uppercase tracking-wider">Eğitim</h3>
                <div className="space-y-4">
                  {previewData.education.filter(e => e.school || e.degree).map(edu => (
                    <div key={edu.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-gray-900">{edu.school}</h4>
                        <span className="text-sm font-medium text-primary bg-primary/5 px-2 py-0.5 rounded">{edu.date}</span>
                      </div>
                      <div className="text-sm text-gray-700">{edu.degree}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {previewData.skills && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-1 font-serif uppercase tracking-wider">Yetenekler</h3>
                <div className="flex flex-wrap gap-2">
                  {previewData.skills.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-sm border border-gray-200"
                    >
                      {skill.trim()}
                    </span>
                  )).filter(s => s.props.children !== '')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}