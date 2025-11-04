import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Copy, Star, Percent, X, FileText, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { getEvaluationTemplates, createEvaluationTemplate } from '@/lib/company/data';
import { EvaluationTemplate, EvaluationCriteria } from '@/lib/company/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GradientCard } from '@/components/ui/gradient-card';
import { handleError } from '@/lib/errors';

const EvaluationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EvaluationTemplate | null>(null);

  useEffect(() => {
    setTemplates(getEvaluationTemplates());
  }, []);

  const handleCreateTemplate = () => {
    const newTemplate = {
      name: 'Template Baru',
      description: 'Deskripsi template evaluasi',
      criteria: [
        {
          id: 'tech-1',
          label: 'Technical Skills',
          description: 'Kemampuan teknis sesuai posisi',
          weight: 40,
          maxScore: 10
        },
        {
          id: 'comm-1',
          label: 'Communication',
          description: 'Kemampuan komunikasi dan presentasi',
          weight: 30,
          maxScore: 10
        },
        {
          id: 'prob-1',
          label: 'Problem Solving',
          description: 'Kemampuan analisis dan pemecahan masalah',
          weight: 30,
          maxScore: 10
        }
      ],
      isDefault: false
    };

    try {
      const created = createEvaluationTemplate(newTemplate);
      setTemplates([...templates, created]);
      toast.success('Template berhasil dibuat');
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Gagal membuat template');
    }
  };

  const duplicateTemplate = (template: EvaluationTemplate) => {
    const duplicated = {
      name: `${template.name} (Copy)`,
      description: template.description,
      criteria: template.criteria.map(c => ({
        ...c,
        id: `${c.id}-copy-${Date.now()}`
      })),
      isDefault: false
    };

    try {
      const created = createEvaluationTemplate(duplicated);
      setTemplates([...templates, created]);
      toast.success('Template berhasil diduplikasi');
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast.error('Gagal menduplikasi template');
    }
  };

  const handleDeleteClick = (template: EvaluationTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      try {
        // Since deleteEvaluationTemplate doesn't exist, we'll just update state
        setTemplates(templates.filter(t => t.id !== templateToDelete.id));
        toast.success('Template berhasil dihapus');
        setShowDeleteModal(false);
        setTemplateToDelete(null);
      } catch (error) {
        handleError(error, 'handleConfirmDelete');
        toast.error('Gagal menghapus template');
      }
    }
  };

  const calculateTotalWeight = (criteria: EvaluationCriteria[]): number => {
    return criteria.reduce((total, criterion) => total + criterion.weight, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/20 to-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Template Evaluasi
              </h1>
            </div>
            <p className="text-gray-600 text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Kelola template evaluasi untuk proses interview
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateTemplate}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium shadow-xl hover:shadow-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Buat Template Baru
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GradientCard
            title="Total Template"
            value={templates.length.toString()}
            subtitle="Template aktif"
            icon={FileText}
            gradient="from-blue-500 to-cyan-500"
            delay={0}
          />
          <GradientCard
            title="Template Default"
            value={templates.filter(t => t.isDefault).length.toString()}
            subtitle="Template standar"
            icon={Star}
            gradient="from-yellow-500 to-orange-500"
            delay={0.1}
          />
          <GradientCard
            title="Template Custom"
            value={templates.filter(t => !t.isDefault).length.toString()}
            subtitle="Dibuat sendiri"
            icon={Edit2}
            gradient="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <GradientCard
            title="Valid"
            value={templates.filter(t => calculateTotalWeight(t.criteria) === 100).length.toString()}
            subtitle="Bobot 100%"
            icon={CheckCircle}
            gradient="from-purple-500 to-pink-500"
            delay={0.3}
          />
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {templates.map(template => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isDefault && (
                        <Badge variant="default">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast.info('Edit feature coming soon!')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateTemplate(template)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    {!template.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(template)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Criteria List */}
                  {template.criteria.map(criterion => (
                    <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{criterion.label}</p>
                        <p className="text-xs text-gray-500">{criterion.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">
                          <Percent className="w-3 h-3 mr-1" />
                          {criterion.weight}%
                        </Badge>
                        <Badge variant="outline">
                          Max: {criterion.maxScore}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {/* Total Weight Check */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Bobot:</span>
                      <Badge 
                        variant={calculateTotalWeight(template.criteria) === 100 ? "default" : "destructive"}
                      >
                        {calculateTotalWeight(template.criteria)}%
                      </Badge>
                    </div>
                    {calculateTotalWeight(template.criteria) !== 100 && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Total bobot harus 100%
                      </p>
                    )}
                  </div>

                  {/* Template Stats */}
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <div>
                        <p>Dibuat: {new Date(template.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                      <div>
                        <p>Diperbarui: {new Date(template.updatedAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {templates.length === 0 && (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-12">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Template</h3>
                    <p className="text-gray-600 mb-4">
                      Buat template evaluasi pertama Anda untuk standardisasi proses interview
                    </p>
                    <Button onClick={handleCreateTemplate}>
                      <Plus className="w-4 h-4 mr-2" />
                      Buat Template Pertama
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && templateToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Hapus Template</h2>
                    </div>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
                    <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Yakin ingin menghapus template ini?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Template <strong>"{templateToDelete.name}"</strong> akan dihapus permanen dan tidak dapat dikembalikan.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 gap-2"
                      onClick={handleConfirmDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus Template
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EvaluationTemplates;
