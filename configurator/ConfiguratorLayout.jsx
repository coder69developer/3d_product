'use client'

import ModelRenderer from '../shared/ModelRenderer'
import useProductConfig from '../shared/useProductConfig'
import ControlsPanel from './ControlsPanel'
import ViewerCanvas from '@/components/canvas/ViewerCanvas'

export default function ConfiguratorLayout({ modelType }) {
  const config = useProductConfig()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="bg-gray-100">
        <ViewerCanvas>
          <ModelRenderer modelType={modelType} config={config} />
        </ViewerCanvas>
      </div>

      <ControlsPanel config={config} />
    </div>
  )
}
