import Link from "next/link";

export default function Home() {
  const models = ['bottle', 'spray-bottle', 'container', 'spray-can']
  return (
    <div className="container my-5">
      <div className="p-5 text-center bg-body-tertiary rounded-3">
        <h1 className="text-body-emphasis">3D Product Configurator</h1>
        <p className="col-lg-8 mx-auto fs-5 text-muted">Choose a model to start customizing:</p>

        <div className="d-grid gap-5 d-sm-flex justify-content-sm-center">
          {models.map((model) => (
            <Link
              key={model}
              href={`/configurator/${model}`}
              className="btn btn-primary btn-lg px-4 gap-3"
            >
              {model.replace('-', ' ')}
            </Link>
          ))}
        </div>

        <Link
          href="/label-creator"
          className="btn btn-outline-success my-4"
        >
          Open Label Studio
        </Link>
      </div>
      </div>
     
  );
}
