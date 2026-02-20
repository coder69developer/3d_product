'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useSyncExternalStore } from 'react'
import LabelCreator from '@/configurator/LabelCreator'
import {
  deleteLabel,
  getSavedLabelsServerSnapshot,
  getSavedLabelsSnapshot,
  saveLabel,
  subscribeSavedLabels,
} from '@/shared/labelStorage'

export default function LabelCreatorPage() {
  const [notice, setNotice] = useState('')

  const savedLabels = useSyncExternalStore(
    subscribeSavedLabels,
    getSavedLabelsSnapshot,
    getSavedLabelsServerSnapshot
  )

  const latestLabel = useMemo(() => savedLabels[0], [savedLabels])

  const handleSaveLabel = (label) => {
    saveLabel(label)
    setNotice(`Saved label "${label.name}".`)
  }

  const handleDelete = (labelId) => {
    deleteLabel(labelId)
  }

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Label Creation Studio</h1>
        <Link href="/" className="btn btn-outline-secondary btn-sm">Back to Home</Link>
      </div>

      <p className="text-muted">Create label designs here, save them, then open any product configurator and apply a saved label texture.</p>
      {notice && <div className="alert alert-success py-2">{notice}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card p-3 shadow-sm">
            <LabelCreator showSaveButton onSaveLabel={handleSaveLabel} />
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card p-3 shadow-sm">
            <h2 className="h5">Saved Labels ({savedLabels.length})</h2>
            {!savedLabels.length && <p className="text-muted mb-0">No labels saved yet.</p>}
            <div className="d-flex flex-column gap-3">
              {savedLabels.map((label) => (
                <div key={label.id} className="border rounded p-2">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-semibold">{label.name}</div>
                      <small className="text-muted">{new Date(label.createdAt).toLocaleString()}</small>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(label.id)}>Delete</button>
                  </div>
                  <Image src={label.image} alt={label.name} width={360} height={360} unoptimized className="img-fluid rounded mt-2 border" />
                </div>
              ))}
            </div>
            {latestLabel && (
              <Link href="/configurator/bottle" className="btn btn-primary mt-3">Open Configurator & Apply Saved Labels</Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
