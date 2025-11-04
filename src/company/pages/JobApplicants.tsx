

const JobApplicants: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pelamar Lowongan</h1>
        <p className="text-gray-600">Kelola pelamar untuk lowongan spesifik</p>
      </div>
      
      <div className="bg-white p-8 rounded-card border border-gray-200">
        <div className="text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Daftar Pelamar</h3>
          <p className="text-gray-600">Manajemen pelamar akan segera tersedia.</p>
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;
