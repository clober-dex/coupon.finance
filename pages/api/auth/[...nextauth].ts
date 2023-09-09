import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export function getAuthOptions(): NextAuthOptions {
  const providers = [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null
          }
          return {
            id: credentials.address,
          }
        } catch (e) {
          return null
        }
      },
      credentials: {
        address: {
          label: 'Address',
          placeholder: '0x0',
          type: 'text',
        },
      },
      name: 'Ethereum',
    }),
  ]

  return {
    callbacks: {
      async session({ session, token }) {
        // session.address = token.sub
        session.user = {
          name: token.sub,
        }
        return session
      },
    },
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
    },
    pages: {
      signIn: '/',
    },
  }
}

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authOptions = getAuthOptions()

    if (!Array.isArray(req.query.nextauth)) {
      res.status(400).send('Bad request')
      return
    }

    const isDefaultSigninPage =
      req.method === 'GET' &&
      req.query.nextauth.find((value) => value === 'signin')

    // Hide Sign-In with Ethereum from default sign page
    if (isDefaultSigninPage) {
      authOptions.providers.pop()
    }

    return NextAuth(req, res, authOptions)
  } catch (e) {
    res.json({
      error: 'An error occurred while processing the request.',
    })
  }
}
