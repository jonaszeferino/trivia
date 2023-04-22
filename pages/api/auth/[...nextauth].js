import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  // Configure um ou mais provedores de autenticação
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Adicione mais provedores aqui
  ],

  // Configure a estratégia de login
  callbacks: {
    async signIn(user, account, profile) {
      // Personalize a lógica de login aqui
      return true;
    },
  },

  // Configure a rota de redirecionamento após o login
  // Se não for definido, será usada a página atual
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
});
