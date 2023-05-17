import { Gym, Prisma } from '@prisma/client'

import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/utils/getDistanceBetweenCoordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create({
    id,
    latitude,
    longitude,
    title,
    description,
    phone,
  }: Prisma.GymCreateInput) {
    const gym = {
      id: id ?? randomUUID(),
      description: description ?? null,
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString()),
      title,
      phone: phone ?? null,
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((gym) => gym.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distanceInKm = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distanceInKm < 10
    })
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }
}
