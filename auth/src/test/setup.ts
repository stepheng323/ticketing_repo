import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../app'

let mongo: any
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUrl = mongo.getUri()

  await mongoose.connect(mongoUrl)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})