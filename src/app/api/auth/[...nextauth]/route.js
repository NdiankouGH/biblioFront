import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        try {
          const res = await fetch("http://localhost:8082/api/auth/login", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store"
          });

          const data = await res.json();

          if (res.ok && data.token) {
            return {
              id: data.id,
              email: data.email,
              name: `${data.prenom} ${data.nom}`,
              prenom: data.prenom,
              telephone: data.telephone,
              biblioName: data.biblioName,
              nom: data.nom,
              token: data.token,
              role: data.role
            };
          }
          
          throw new Error(data.message || "Échec de la connexion");
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          throw new Error(error.message || "Une erreur s\'est produite lors de la connexion");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.prenom = user.prenom;
        token.telephone = user.telephone;
        token.nom = user.nom;
        token.biblioName = user.biblioName;
        token.token = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.prenom = token.prenom;
        session.user.nom = token.nom;
        session.user.biblioName = token.biblioName;
        session.user.telephone = token.telephone;
        session.user.token = token.token;
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 jour
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development"
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Export pour utilisation côté serveur
export async function getSession(ctx) {
  return await getServerSession(ctx.req, ctx.res, authOptions);
}