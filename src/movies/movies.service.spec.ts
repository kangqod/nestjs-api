import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { MoviesService } from './movies.service'

describe('MoviesService', () => {
  let service: MoviesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService]
    }).compile()

    service = module.get<MoviesService>(MoviesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAll()', () => {
    it('should return an array', () => {
      const result = service.getAll()
      expect(result).toBeInstanceOf(Array)
    })
  })

  describe('getOne()', () => {
    it('should return a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2022
      })
      const movie = service.getOne(1)
      expect(movie).toBeDefined()
      expect(movie.title).toEqual('Test Movie')
    })
    it('should throw 404 error', () => {
      const id = 999
      try {
        service.getOne(id)
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual(`Movie with ID ${id} not found.`)
      }
    })
  })

  describe('deleteOne', () => {
    it('deletes a movie', () => {
      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2022
      })
      const allMovies = service.getAll().length
      service.deleteOne(1)
      const afterMovies = service.getAll().length
      expect(afterMovies).toBeLessThan(allMovies)
    })
    it('should return a 404', () => {
      const id = 999
      try {
        service.deleteOne(id)
      } catch (e) {
        // expect(e).toBeInstanceOf(NotFoundException)
        expect(e.message).toEqual(`Movie with ID ${id} not found.`)
      }
    })
  })

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length
      service.create({
        title: 'Test Movie',
        year: 2022,
        genres: ['Test']
      })
      const afterCreate = service.getAll().length
      expect(afterCreate).toBeGreaterThan(beforeCreate)
    })
  })
})
