'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Save, X } from 'lucide-react'
import { canchaSchema, type CanchaFormInput } from '../schemas/cancha.schema'
import { DEPORTES, AMENIDADES, type Cancha } from '../types/cancha.types'
import { cn } from '@/shared/lib/cn'

interface CanchaFormProps {
  defaultValues?: Partial<CanchaFormInput>
  onSubmit: (data: CanchaFormInput) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitLabel?: string
}

export function CanchaForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel = 'Guardar cancha',
}: CanchaFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CanchaFormInput>({
    resolver: zodResolver(canchaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo_deporte: '',
      precio_por_hora: 0,
      capacidad: 1,
      ubicacion: '',
      estado: 'activa',
      amenidades: [],
      ...defaultValues,
    },
  })

  const selectedAmenidades = watch('amenidades') ?? []

  function toggleAmenidad(amenidad: string) {
    if (selectedAmenidades.includes(amenidad)) {
      setValue(
        'amenidades',
        selectedAmenidades.filter((a) => a !== amenidad),
        { shouldValidate: true }
      )
    } else {
      setValue('amenidades', [...selectedAmenidades, amenidad], { shouldValidate: true })
    }
  }

  const inputClass = (hasError?: boolean) =>
    cn(
      'w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all text-sm',
      hasError
        ? 'border-red-500/50 focus:ring-red-500/30'
        : 'border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500/50'
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Nombre de la cancha *
          </label>
          <input
            id="cancha-nombre"
            type="text"
            placeholder="Ej. Cancha Principal de Fútbol"
            className={inputClass(!!errors.nombre)}
            {...register('nombre')}
          />
          {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Deporte *
          </label>
          <select
            id="cancha-deporte"
            className={inputClass(!!errors.tipo_deporte)}
            {...register('tipo_deporte')}
          >
            <option value="">Selecciona un deporte</option>
            {DEPORTES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.tipo_deporte && (
            <p className="text-red-400 text-xs mt-1">{errors.tipo_deporte.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Estado
          </label>
          <select
            id="cancha-estado"
            className={inputClass(!!errors.estado)}
            {...register('estado')}
          >
            <option value="activa">Activa</option>
            <option value="mantenimiento">En Mantenimiento</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Precio por hora (COP) *
          </label>
          <input
            id="cancha-precio"
            type="number"
            min="0"
            step="1000"
            placeholder="50000"
            className={inputClass(!!errors.precio_por_hora)}
            {...register('precio_por_hora', { valueAsNumber: true })}
          />
          {errors.precio_por_hora && (
            <p className="text-red-400 text-xs mt-1">{errors.precio_por_hora.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Capacidad (personas) *
          </label>
          <input
            id="cancha-capacidad"
            type="number"
            min="1"
            placeholder="22"
            className={inputClass(!!errors.capacidad)}
            {...register('capacidad', { valueAsNumber: true })}
          />
          {errors.capacidad && (
            <p className="text-red-400 text-xs mt-1">{errors.capacidad.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Ubicación / Dirección
          </label>
          <input
            id="cancha-ubicacion"
            type="text"
            placeholder="Ej. Calle 50 #23-10, Medellín"
            className={inputClass(!!errors.ubicacion)}
            {...register('ubicacion')}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Descripción
          </label>
          <textarea
            id="cancha-descripcion"
            rows={3}
            placeholder="Describe la cancha, sus características, reglas..."
            className={cn(inputClass(!!errors.descripcion), 'resize-none')}
            {...register('descripcion')}
          />
          {errors.descripcion && (
            <p className="text-red-400 text-xs mt-1">{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* Amenidades */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Amenidades
        </label>
        <div className="flex flex-wrap gap-2">
          {AMENIDADES.map((amenidad) => {
            const selected = selectedAmenidades.includes(amenidad)
            return (
              <button
                key={amenidad}
                type="button"
                onClick={() => toggleAmenidad(amenidad)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-sm border transition-all',
                  selected
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                )}
              >
                {amenidad}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          id="cancha-form-submit"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-60 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> {submitLabel}</>
          )}
        </button>
      </div>
    </form>
  )
}
