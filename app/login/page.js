"use client";

import { signIn } from "@/lib/auth-client";
import { Check, DoorOpen, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      toast.error("Erreur lors de la connexion avec Google");
      setIsGoogleLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }
    setIsEmailLoading(true);
    try {
      await signIn.magicLink({
        email,
        callbackURL: "/dashboard",
      });
      setIsEmailSent(true);
      toast.success("Lien magique envoyé !");
    } catch (error) {
      toast.error("Erreur lors de l'envoi du lien magique");
      setIsEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Top Left Logo */}
      <div className="p-8">
        <span className="text-2xl font-black text-gray-900 tracking-tighter">
          ManySocial
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header Section with Icon */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              <DoorOpen className="w-10 h-10 text-blue-600" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Bon retour
              </h1>
              <p className="text-gray-500 font-medium">
                Heureux de vous revoir ! Connectez-vous :)
              </p>
            </div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isEmailLoading}
            className="w-full bg-white text-gray-700 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium flex items-center justify-center gap-3 transition-all  disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continuer avec Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-medium">
                OU
              </span>
            </div>
          </div>

          {/* Magic Link Form */}
          {isEmailSent ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900 font-semibold text-lg mb-2">Vérifiez vos emails</h3>
              <p className="text-gray-500 text-sm px-8">
                Nous avons envoyé un lien magique à <span className="font-medium text-gray-900">{email}</span>
              </p>
              <button 
                onClick={() => setIsEmailSent(false)}
                className="mt-6 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Utiliser une autre adresse
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 pl-1">
                  Email
                </label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isEmailLoading || isGoogleLoading}
                    className="w-full bg-white border border-gray-200 rounded-xl h-12 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all disabled:opacity-50"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isEmailLoading || isGoogleLoading || !email}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEmailLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
        
      {/* Footer */}
      <div className="p-8 flex justify-between items-center text-xs text-gray-400">
        <p>© 2025 ManySocial Inc.</p>
        <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-gray-600 transition-colors">Politique de confidentialité</a>
        </div>
      </div>
    </div>
  );
}

