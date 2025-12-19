import ConfiguratorLayout from "@/configurator/ConfiguratorLayout";

export async function generateStaticParams() {
  return [
    { model: 'bottle' },
    { model: 'spray_bottle' },
    { model: 'container' },
    { model: 'kanster' },
  ]
}

export default async function ConfiguratorPage({ params }) {
  const { model } = await params;

  return <ConfiguratorLayout modelType={model} />
}