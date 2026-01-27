import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { AssetTable } from './components/AssetTable';
import { CompanionTab } from './components/CompanionTab';
import { InventoryView } from './components/InventoryView';
import { UploadModal } from './components/UploadModal';
import { CreateFolderModal } from './components/CreateFolderModal';
import { EditAssetModal } from './components/EditAssetModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CreateInventoryModal } from './components/CreateInventoryModal';
import { useStore } from './store/useStore';
import type { Asset, ExperienceInventory } from './types';

function MainContent() {
  const { activeTab } = useStore();
  return activeTab === 'assets' ? <AssetTable /> : <CompanionTab />;
}

function AppLayout() {
  const { modal, closeModal } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Header />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/inventory/:id" element={<InventoryView />} />
        </Routes>
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={modal.type === 'upload'}
        onClose={closeModal}
      />

      <CreateFolderModal
        isOpen={modal.type === 'create-folder'}
        onClose={closeModal}
      />

      <EditAssetModal
        isOpen={modal.type === 'edit-asset'}
        onClose={closeModal}
        asset={modal.data as Asset | ExperienceInventory | null}
      />

      <DeleteConfirmModal
        isOpen={modal.type === 'delete-asset'}
        onClose={closeModal}
        asset={modal.data as Asset | ExperienceInventory | null}
      />

      <CreateInventoryModal
        isOpen={modal.type === 'create-inventory'}
        onClose={closeModal}
      />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
