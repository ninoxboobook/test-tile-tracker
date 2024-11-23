import { TestTileForm } from '@/components/forms/test-tile-form';

export default function NewTestTilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Test Tile</h1>
      <TestTileForm />
    </div>
  );
}