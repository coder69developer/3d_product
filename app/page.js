import Link from "next/link";

export default function Home() {
  const models = ['bottle', 'spray-bottle', 'container', 'kanster']
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">3D Product Configurator</h1>
      <p className="text-gray-600">Choose a model to start customizing:</p>

      <div className="flex flex-wrap gap-4">
        {models.map((model) => (
          <Link
            key={model}
            href={`/configurator/${model}`}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            {model.replace('-', ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}
