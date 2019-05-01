import logic from '.'
import { LogicError, RequirementError, ValueError, FormatError, NotFoundError, DirectionError, NoDataError } from '../common/errors'
import userApi from '../data/user-api'
import transitApi from '../data/transit-api'
import iBusApi from '../data/ibus-api'


const { env: { REACT_APP_APP_ID, REACT_APP_APP_KEY } } = process

transitApi.APP_ID = REACT_APP_APP_ID
transitApi.APP_KEY = REACT_APP_APP_KEY

iBusApi.APP_ID = REACT_APP_APP_ID
iBusApi.APP_KEY = REACT_APP_APP_KEY


describe('logic', () => {
    describe('users', () => {
        const name = 'Manuel'
        const surname = 'Barzi'
        let email
        const password = '123'
        const password2 = '123'

        beforeEach(() => {
            email = `manuelbarzi-${Math.random()}@gmail.com`

            logic.__userId__ = null
            logic.__userToken__ = null
        })

        describe('register user', () => {
            it('should succeed on correct user data', () =>
                logic.registerUser(name, surname, email, password, password2)
                    .then(response => expect(response).toBeUndefined())
            )

            describe('on already existing user', () => {
                beforeEach(() => logic.registerUser(name, surname, email, password, password2))

                it('should fail on retrying to register', () =>
                    logic.registerUser(name, surname, email, password, password2)
                        .then(() => { throw Error('should not reach this point') })
                        .catch(error => {
                            expect(error).toBeDefined()
                            expect(error instanceof LogicError).toBeTruthy()

                            expect(error.message).toBe(`user with username \"${email}\" already exists`)
                        })
                )
            })

            it('should fail on undefined name', () => {
                const name = undefined

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(RequirementError, `name is not optional`)
            })

            it('should fail on empty name', () => {
                const name = ''

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'name is empty')
            })

            it('should fail on blank name', () => {
                const name = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'name is empty')
            })

            it('should fail on undefined surname', () => {
                const surname = undefined

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(RequirementError, `surname is not optional`)
            })

            it('should fail on empty surname', () => {
                const surname = ''

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'surname is empty')
            })

            it('should fail on blank surname', () => {
                const surname = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'surname is empty')
            })

            it('should fail on undefined email', () => {
                const email = undefined

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(RequirementError, `email is not optional`)
            })

            it('should fail on empty email', () => {
                const email = ''

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on blank email', () => {
                const email = ' \t    \n'

                expect(() => logic.registerUser(name, surname, email, password, password2)).toThrowError(ValueError, 'email is empty')
            })

            it('should fail on non-email email', () => {
                const nonEmail = 'non-email'

                expect(() => logic.registerUser(name, surname, nonEmail, password, password2)).toThrowError(FormatError, `${nonEmail} is not an e-mail`)
            })

        })

        describe('login user', () => {
            let id

            beforeEach(() =>
                userApi.create(email, password, { name, surname })
                    .then(response => id = response.data.id)
            )

            it('should succeed on correct user credential', () =>
                logic.loginUser(email, password)
                    .then(() => {
                        const { __userId__, __userToken__ } = logic

                        expect(typeof __userId__).toBe('string')
                        expect(__userId__.length).toBeGreaterThan(0)
                        expect(__userId__).toBe(id)

                        expect(typeof __userToken__).toBe('string')
                        expect(__userToken__.length).toBeGreaterThan(0)

                        const [, payloadB64,] = __userToken__.split('.')
                        const payloadJson = atob(payloadB64)
                        const payload = JSON.parse(payloadJson)

                        expect(payload.id).toBe(id)

                        expect(logic.isUserLoggedIn).toBeTruthy()
                    })
            )

            it('should fail on non-existing user', () =>
                logic.loginUser(email = 'unexisting-user@mail.com', password)
                    .then(() => { throw Error('should not reach this point') })
                    .catch(error => {
                        expect(error).toBeDefined()
                        expect(error instanceof LogicError).toBeTruthy()

                        expect(error.message).toBe(`user with username \"${email}\" does not exist`)
                    })
            )
        })

        describe('retrieve user', () => {
            let id, token

            beforeEach(() =>
                userApi.create(email, password, { name, surname })
                    .then(response => {
                        id = response.data.id

                        return userApi.authenticate(email, password)
                    })
                    .then(response => {
                        token = response.data.token

                        logic.__userId__ = id
                        logic.__userToken__ = token
                    })
            )

            it('should succeed on correct user id and token', () =>
                logic.retrieveUser()
                    .then(user => {
                        expect(user.id).toBeUndefined()
                        expect(user.name).toBe(name)
                        expect(user.surname).toBe(surname)
                        expect(user.email).toBe(email)
                        expect(user.password).toBeUndefined()
                    })
            )

            it('should fail on incorrect user id', () => {
                logic.__userId__ = '5cb9998f2e59ee0009eac02c'

                return logic.retrieveUser()
                    .then(() => { throw Error('should not reach this point') })
                    .catch(error => {
                        expect(error).toBeDefined()
                        expect(error instanceof LogicError).toBeTruthy()

                        expect(error.message).toBe(`token id \"${id}\" does not match user \"${logic.__userId__}\"`)
                    })
            })
        })

    })


    describe('retriveBusLines', () => {

        it('should succeed on correct line id', () => {
            const line_id = 123

            return logic.retrieveBusLines(line_id)
                .then(response => {

                    expect(response.length).toBe(1)

                    response.forEach(e => {
                        const {
                            line_id,
                            name_line,
                            desc_line,
                            origin_line,
                            dest_line,
                            color_line } = e

                        expect(typeof line_id == 'number').toBeTruthy()
                        expect(typeof name_line == 'string').toBeTruthy()
                        expect(typeof desc_line == 'string').toBeTruthy()
                        expect(typeof origin_line == 'string').toBeTruthy()
                        expect(typeof dest_line == 'string').toBeTruthy()
                        expect(typeof color_line == 'string').toBeTruthy()

                    });
                })
        })

        it('should succeed on undefined line id', () => {
            const line_id = undefined

            return logic.retrieveBusLines(line_id)
                .then(response => {

                    expect(response.length).toBeGreaterThan(1)

                    response.forEach(e => {
                        const {
                            line_id,
                            name_line,
                            desc_line,
                            origin_line,
                            dest_line,
                            color_line } = e

                        expect(typeof line_id == 'number').toBeTruthy()
                        expect(typeof name_line == 'string').toBeTruthy()
                        expect(typeof desc_line == 'string').toBeTruthy()
                        expect(typeof origin_line == 'string').toBeTruthy()
                        expect(typeof dest_line == 'string').toBeTruthy()
                        expect(typeof color_line == 'string').toBeTruthy()

                    });
                })
        })

        it('should fail on incorrect bus stop id', () =>
            expect(() => logic.retrieveBusLines('123es')).toThrowError(TypeError, 'line_id 123es is not a number')
        )

    })

    describe('retrieveBusLineRoute', () => {

        it('should succeed on correct line id', () => {
    
            const line_id = 123
    
            return logic.retrieveBusLineRoute(line_id)
                .then(response => {
    
                    expect(response.length).toBe(2)
    
                    response.forEach(e => {
                        const {
                            direction_id,
                            direction_name } = e
    
                        expect(direction_id === 'T' || direction_id === 'A').toBeTruthy()
                        expect(typeof direction_name == 'string').toBeTruthy()
    
    
                    })
                })
        })
    
        it('should fail on incorrect bus stop id', () =>
    
            expect(() => logic.retrieveBusLineRoute('123es')).toThrowError(TypeError, 'line_id 123es is not a number')
    
        )
    
        it('should fail on undefined line id', () => {
            const line_id = undefined
    
            expect(() => logic.retrieveBusLineRoute(line_id)).toThrowError(RequirementError, 'line_id is not optional')
            
        })
    })

    describe('retrieveBusStops', () => {

        it('should succeed on correct line id', () => {
    
            const line_id = 123
            const direction_id = 'A'
    
            return logic.retrieveBusStops(line_id,direction_id)
                .then(response => {
    
                    expect(response.length).toBeGreaterThan(1)
    
                    response.forEach(e => {
                        const {
                            stop_id,
                            stop_name } = e
    
                        expect(typeof stop_id == 'number').toBeTruthy()
                        expect(typeof stop_name == 'string').toBeTruthy()
    
    
                    })
                })
        })
    
        it('should fail on incorrect bus stop id', () =>{
            const line_id = '123a'
            const direction_id = 'A'
    
            expect(() => logic.retrieveBusStops(line_id,direction_id)).toThrowError(TypeError, 'line_id 123es is not a number')
    
        })
        it('should fail on incorrect bus direction id', () =>{
            const line_id = 123
            const direction_id = 'Z'
    
            expect(() => logic.retrieveBusStops(line_id,direction_id)).toThrowError(DirectionError, 'direction is not valid')
    
        })
        it('should fail on undefined bus stop id', () =>{
            const line_id = undefined
            const direction_id = 'A'
    
            expect(() => logic.retrieveBusStops(line_id,direction_id)).toThrowError(Error, 'line_id is not optional')
    
        })
        it('should fail on undefined bus direction id', () =>{
            const line_id = 123
            const direction_id = undefined
    
            expect(() => logic.retrieveBusStops(line_id,direction_id)).toThrowError(Error, 'direction_id is not optional')
    
        })
    
    })


    describe('upcomingBusesByStop', () => {

        it('should succeed on correct bus stop', () => {
    
            const stop_id = 1278
    
            return logic.upcomingBusesByStop(stop_id)
                .then(response => {
                    expect(response.length).toBeGreaterThan(0)
    
                    response.forEach( resp => {
                        const {
                            line, 
                            t_in_min, 
                            t_in_s, 
                            text_ca, 
                            color_line } = resp
    
                        expect(typeof line === 'string').toBeTruthy()
                        expect(typeof t_in_min === 'number').toBeTruthy()
                        expect(typeof t_in_s === 'number').toBeTruthy()
                        expect(typeof text_ca === 'string').toBeTruthy()
                        expect(typeof color_line === 'string').toBeTruthy()
                    })
                })
        }, 10000)

    })



    describe('upcomingBusesByStopAndLine', () => {

        it('should succeed on correct line and bus stop', () => {
    
            const stop_id = 1278
            const line_id = 136
        
            return logic.upcomingBusesByStopAndLine(stop_id, line_id)
                .then(response => {
                    
                    expect(response.length).toBe(1)
                    const {
                        t_in_min, 
                        t_in_s, 
                        text_ca, 
                        color_line } = response[0]

                    expect(typeof t_in_min === 'number').toBeTruthy()
                    expect(typeof t_in_s === 'number').toBeTruthy()
                    expect(typeof text_ca === 'string').toBeTruthy()
                    expect(typeof color_line === 'string').toBeTruthy()
    
                })
        }, 1000000)
    })




})