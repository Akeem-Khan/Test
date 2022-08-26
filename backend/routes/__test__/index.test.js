const app = require('../../app');
const request = require('supertest');
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
describe('Test for API Endpoints', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
    });
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })
    describe('Notice Routes', () => {
        it('Get all Notices, Should return status 200', async () => {
            await request(app).get('/notices')
                .expect(200);
        });


        it('Get a Notice, Should return status 200', async () => {
            await request(app).get('/notices/61230927a4522c39b02fbe37')
                .expect(200);
        });
        it('Get a Notice, Should return status 500', async () => {
            await request(app).get('/notices/123')
                .expect(500);
        });
    
        it('Add a Notice, Should return status 201', async () => {
            await request(app).post('/notices/add').send({
                    title: 'Test Title',
                    text: 'Test Text',
                    category: 'Test Category',
                    author: 'Test Author',
                    flagged: {
                        is_flagged: false,
                        info: '',
                        by: ''
                    }
                })
                .expect(201);
        });
        it('Add a Notice, Should return status 400', async () => {
            await request(app).post('/notices/add').send({
                    title: '',
                    text: 'Test Text',
                    category: 'Test Category',
                    author: 'Test Author',
                    flagged: {
                        is_flagged: false,
                        info: '',
                        by: ''
                    }
                })
                .expect(400);
        });
        
    
        it('Update a Notice, Should return status 500', async () => {
            await request(app).post('/notices/update/123').send({
                    title: 'Test Title',
                    text: 'Test Text',
                    category: 'Test Category',
                    author: 'Test Author',
                    flagged: {
                        is_flagged: false,
                        info: '',
                        by: ''
                    }
                })
                .expect(500);
        });
        it('Update a Notice, Should return status 400', async () => {
            await request(app).post('/notices/update/61230927a4522c39b02fbe37').send({
                    title: '',
                    text: 'Test Text',
                    category: 'Test Category',
                    author: 'Test Author',
                    flagged: {
                        is_flagged: false,
                        info: '',
                        by: ''
                    }
                })
                .expect(400);
        });
    
        it('Delete a Notice, Should return status 500', async () => {
            await request(app).delete('/notices/update/123')
                .expect(500);
        });
    });
    
    describe('Auth Routes', () => {
        it('Register a User, Should return status 200', async () => {
            await request(app).post('/auth').send({
                    name: 'Test Name',
                    email: 'Test',
                    password: 'Test Pass',
                    passwordVerify: 'Test Pass',
                    role:'Test Role',
                })
                .expect(200);
        });
        it('Register a User, Should return status 400', async () => {
            await request(app).post('/auth').send({
                    name: 'Test Name',
                    email: 'Test',
                    password: 'Test Pas',
                    passwordVerify: 'Test Pass',
                    role:'Test Role',
                })
                .expect(400);
        });
        it('Login, Should return status 400', async () => {
            await request(app).post('/auth/login').send({
                    email: '',
                    password: 'Test Pass',
                })
                .expect(400);
        });
        it('Login, Should return status 401', async () => {
            await request(app).post('/auth/login').send({
                    email: 'Test',
                    password: 'Test Pass',
                })
                .expect(401);
        });
    });

    describe("Live Test", () => {
        it('Get all Notices, Should return status 200', async () => {
            await request('http://localhost:4000').get('/notices')
                .expect(200);
        });
    });
});
