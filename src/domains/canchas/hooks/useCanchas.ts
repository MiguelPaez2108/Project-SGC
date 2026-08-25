'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { canchasService } from '../services/canchas.service'
import type { CanchaInsert, CanchaUpdate } from '../types/cancha.types'

const CANCHAS_KEY = ['canchas']

export function useCanchas() {
  return useQuery({
    queryKey: CANCHAS_KEY,
    queryFn: () => canchasService.getAll(),
  })
}

export function useCancha(id: string) {
  return useQuery({
    queryKey: [...CANCHAS_KEY, id],
    queryFn: () => canchasService.getById(id),
    enabled: !!id,
  })
}

export function useCreateCancha() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CanchaInsert) => canchasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANCHAS_KEY })
    },
  })
}

export function useUpdateCancha() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CanchaUpdate }) =>
      canchasService.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CANCHAS_KEY })
      queryClient.invalidateQueries({ queryKey: [...CANCHAS_KEY, variables.id] })
    },
  })
}

export function useDeleteCancha() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => canchasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CANCHAS_KEY })
    },
  })
}
