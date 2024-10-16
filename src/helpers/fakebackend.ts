export { fakeBackend }
// Importing types
import type { User as AppUser } from '../models/UserModel'
import type { JwtPayload as TokenPayload } from '../models/JwtModel'
import type { AuthRequestBody as AuthBody } from '../models/AuthReqModel'

// Storage Key and Initial Users
const localStorageKey = 'app-jwt-refresh-users'
const storedUsers: AppUser[] = JSON.parse(localStorage.getItem(localStorageKey) || '[]')

// Create sample users if none exist
const sampleUser1: AppUser = {
  id: 1,
  firstName: 'Laura',
  lastName: 'Gomez',
  userName: 'lgomez',
  password: 'mypassword1',
  isAdmin: true,
  refreshToken: []
}

const sampleUser2: AppUser = {
  id: 2,
  firstName: 'Carlos',
  lastName: 'Ramirez',
  userName: 'cramirez',
  password: 'securepass2',
  isAdmin: false,
  refreshToken: []
}

// Populate users in local storage if empty
if (!storedUsers.length) {
  storedUsers.push(sampleUser1)
  storedUsers.push(sampleUser2)
  localStorage.setItem(localStorageKey, JSON.stringify(storedUsers))
}

function fakeBackend() {
  const originalFetch = window.fetch

  window.fetch = function (url, options: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      // Simulate network latency of 1.5 seconds
      setTimeout(processRequest, 1500)

      // Route handling logic
      function processRequest() {
        if (options) {
          const { method } = options
          switch (true) {
            case url.toString().endsWith('/users/authenticate') && method === 'POST':
              return handleAuthentication()
            case url.toString().endsWith('/users/refresh-token') && method === 'POST':
              return handleTokenRefresh()
            case url.toString().endsWith('/users/revoke-token') && method === 'POST':
              return handleTokenRevoke()
            case url.toString().endsWith('/users') && method === 'GET':
              return fetchUsers()
            default:
              return originalFetch(url, options)
                .then((response) => resolve(response))
                .catch((error) => reject(error))
          }
        }
      }

      // Route handlers
      function handleAuthentication() {
        const { username, password } = parseRequestBody<AuthBody>()
        const user = storedUsers.find((u) => u.userName === username && u.password === password)

        if (!user) return respondError('Invalid username or password')

        // Assign new refresh token to user
        user.refreshToken.push(createRefreshToken())
        localStorage.setItem(localStorageKey, JSON.stringify(storedUsers))

        return respondOk({
          id: user.id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken: createJwtToken()
        })
      }

      function handleTokenRefresh() {
        const token = retrieveRefreshToken()
        if (!token) return respondUnauthorized()

        const user = storedUsers.find((u) => u.refreshToken.includes(token))
        if (!user) return respondUnauthorized()

        // Update refresh token
        user.refreshToken = user.refreshToken.filter((t) => t !== token)
        user.refreshToken.push(createRefreshToken())
        localStorage.setItem(localStorageKey, JSON.stringify(storedUsers))

        return respondOk({
          id: user.id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          jwtToken: createJwtToken()
        })
      }

      function handleTokenRevoke() {
        if (!isUserAuthenticated()) return respondUnauthorized()

        const token = retrieveRefreshToken()
        const user = storedUsers.find((u) => u.refreshToken.includes(token))

        if (user) {
          user.refreshToken = user.refreshToken.filter((t) => t !== token)
          localStorage.setItem(localStorageKey, JSON.stringify(storedUsers))
        }

        return respondOk({ message: 'Token revoked' })
      }

      function fetchUsers() {
        if (!isUserAuthenticated()) return respondUnauthorized()
        return respondOk(storedUsers)
      }

      // Helper functions
      function respondOk(data: any) {
        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(data)) } as Response)
      }

      function respondUnauthorized() {
        resolve({
          status: 401,
          text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' }))
        } as Response)
      }

      function respondError(message: string) {
        resolve({
          status: 400,
          text: () => Promise.resolve(JSON.stringify({ message }))
        } as Response)
      }

      function isUserAuthenticated(): boolean {
        const authHeader = options.headers?.['Authorization'] || ''
        if (!authHeader.startsWith('Bearer fake-jwt-token')) return false

        try {
          const decodedToken = JSON.parse(atob(authHeader.split('.')[1])) as TokenPayload
          return Date.now() <= decodedToken.exp * 1000
        } catch {
          return false
        }
      }

      function parseRequestBody<T>(): T {
        return options.body ? JSON.parse(options.body) : ({} as T)
      }

      function createJwtToken(): string {
        const payload: TokenPayload = { exp: Math.round(Date.now() / 1000 + 120) }
        return `fake-jwt-token.${btoa(JSON.stringify(payload))}`
      }

      function createRefreshToken(): string {
        const token = new Date().getTime().toString()
        const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `refreshToken=${token}; expires=${expiration}; path=/`
        return token
      }

      function retrieveRefreshToken(): string {
        return (document.cookie.split(';').find((c) => c.includes('refreshToken')) || '=').split(
          '='
        )[1]
      }
    })
  }
}
