'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservasService } from '../services/reservas.service'
import type { ReservaInsert, ReservaUpdate } from '../types/reserva.types'

const RESERVAS_KEY = ['reservas']

export function useReservas() {
  return useQuery({
    queryKey: RESERVAS_KEY,
    queryFn: () => reservasService.getAll(),
  })
}

export function useReserva(id: string) {
  return useQuery({
    queryKey: [...RESERVAS_KEY, id],
    queryFn: () => reservasService.getById(id),
    enabled: !!id,
  })
}

export function useReservasByDate(fecha: string) {
  return useQuery({
    queryKey: [...RESERVAS_KEY, 'fecha', fecha],
    queryFn: () => reservasService.getByDate(fecha),
    enabled: !!fecha,
  })
}

export function useCreateReserva() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ReservaInsert) => reservasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVAS_KEY })
    },
  })
}

export function useUpdateReserva() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReservaUpdate }) =>
      reservasService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: RESERVAS_KEY })
      queryClient.invalidateQueries({ queryKey: [...RESERVAS_KEY, variables.id] })
    },
  })
}

export function useCancelReserva() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reservasService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESERVAS_KEY })
    },
  })
}
