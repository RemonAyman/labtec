import { LoginForm } from "@/components/auth/login-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

interface LoginPageProps {
  params: Promise<{ locale: string }>
}

export default async function LoginPage(props: LoginPageProps) {
  const { locale } = await props.params
  const session = await auth()

  if (session?.user?.id) {
    redirect(`/${locale}/dashboard`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-background to-background p-4">
      <LoginForm />
    </div>
  )
}
