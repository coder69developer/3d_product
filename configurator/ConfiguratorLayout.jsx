'use client'

import ModelRenderer from '../shared/ModelRenderer'
import useProductConfig from '../shared/useProductConfig'
import ControlsPanel from './ControlsPanel'
import ViewerCanvas from '@/components/canvas/ViewerCanvas'

const COMPANY_LOGO_URL = '/hotrega.svg'

export default function ConfiguratorLayout({ modelType }) {
  const config = useProductConfig()

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">
        {/* Viewer Canvas */}
        <div className="col-12 col-md-8 bg-light h-100">
          <ViewerCanvas>
            <ModelRenderer modelType={modelType} config={config} />
          </ViewerCanvas>
        </div>

        {/* Controls Panel */}
        <div className="col-12 col-md-4 h-100">
          <ControlsPanel config={config} />
        </div>
      </div>
    </div>
  )
}
