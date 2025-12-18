import ConfiguratorLayout from "@/configurator/ConfiguratorLayout";

export default async function ConfiguratorPage({ params }) {
  const { model } = await params;

  return <ConfiguratorLayout modelType={model} />
}