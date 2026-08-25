'use client'

import Link from 'next/link'
import { MapPin, Users, DollarSign, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'
import type { Cancha } from '../types/cancha.types'
import {
  ESTADO_CANCHA_LABELS,
  ESTADO_CANCHA_COLORS,
  type EstadoCancha,
} from '../types/cancha.types'
import { formatCurrency } from '@/shared/lib/date'
import { cn } from '@/shared/lib/cn'
import { useDeleteCancha } from '../hooks/useCanchas'

interface CanchaCardProps {
  cancha: Cancha
}

export function CanchaCard({ cancha }: CanchaCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const deleteMutation = useDeleteCancha()

  const estado = cancha.estado as EstadoCancha
  const amenidades = Array.isArray(cancha.amenidades)
    ? (cancha.amenidades as string[])
    : cancha.amenidades
    ? Object.keys(cancha.amenidades as object)
    : []

  async function handleDelete() {
    await deleteMutation.mutateAsync(cancha.id)
    setConfirmDelete(false)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group">
      {/* Photo / placeholder */}
      <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {cancha.fotos_url && cancha.fotos_url.length > 0 ? (
          <img
            src={cancha.fotos_url[0]}
            alt={cancha.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-600">
            <MapPin className="w-10 h-10 mb-2" />
            <span className="text-xs">Sin foto</span>
          </div>
        )}

        {/* Estado badge */}
        <span
          className={cn(
            'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium border',
            ESTADO_CANCHA_COLORS[estado]
          )}
        >
          {ESTADO_CANCHA_LABELS[estado]}
        </span>

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <button
            id={`cancha-menu-${cancha.id}`}
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur rounded-lg text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Opciones"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                <Link
                  href={`/dashboard/canchas/${cancha.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" /> Ver detalle
                </Link>
                <Link
                  href={`/dashboard/canchas/${cancha.id}/editar`}
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 text-sm transition-colors"
                >
                  <Edit className="w-4 h-4" /> Editar
                </Link>
                <button
                  onClick={() => { setConfirmDelete(true); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-white font-semibold text-base leading-tight">{cancha.nombre}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{cancha.tipo_deporte}</p>
        </div>

        {cancha.ubicacion && (
          <p className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
            <MapPin className="w-3 h-3" />
            {cancha.ubicacion}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400 text-xs">
              <Users className="w-3.5 h-3.5" />
              {cancha.capacidad} personas
            </span>
          </div>
          <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            {formatCurrency(cancha.precio_por_hora)}/h
          </span>
        </div>

        {amenidades.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {amenidades.slice(0, 3).map((a) => (
              <span
                key={a}
                className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-full border border-slate-700"
              >
                {a}
              </span>
            ))}
            {amenidades.length > 3 && (
              <span className="px-2 py-0.5 text-slate-500 text-xs">
                +{amenidades.length - 3} más
              </span>
            )}
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-white font-semibold mb-2">¿Eliminar cancha?</h4>
            <p className="text-slate-400 text-sm mb-6">
              Esta acción no se puede deshacer. Se eliminará <strong className="text-white">{cancha.nombre}</strong> y todos sus datos asociados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                id={`confirm-delete-${cancha.id}`}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
