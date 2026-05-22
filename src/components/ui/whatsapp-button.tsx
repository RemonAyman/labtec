"use client"

import { MessageSquareCode } from "lucide-react"

export function WhatsAppButton() {
  const whatsappNumber = "201555664146" // Egyptian contact number
  const message = encodeURIComponent("Hello Lap Tec, I would like to inquire about your premium laptops!")
  const waUrl = `https://wa.me/${whatsappNumber}?text=${message}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-emerald-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 rtl:left-6 rtl:right-auto"
      aria-label="Chat on WhatsApp"
    >
      {/* Outer pulsing rings */}
      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40 opacity-75 duration-1000"></span>
      <span className="absolute inset-0 animate-pulse rounded-full bg-emerald-500/20 opacity-50"></span>
      
      {/* Icon */}
      <svg
        className="h-7 w-7 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.856-6.88C16.638 2.14 14.194 1.123 11.6 1.123c-5.439 0-9.865 4.373-9.87 9.733-.001 1.765.485 3.491 1.408 5.051l-.924 3.375 3.484-.914zm13.125-6.905c-.3-.15-1.777-.878-2.052-.978-.275-.1-.475-.15-.675.15-.2.3-.775.978-.95 1.178-.175.2-.35.225-.65.075-3.56-1.77-4.757-3.415-5.207-4.19-.225-.38-.04-.585.11-.735.135-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.628-.925-2.228-.244-.588-.492-.507-.675-.516-.174-.008-.374-.01-.574-.01-.2 0-.525.075-.8 1.05-.275.975-1.05 2.1-1.05 2.1s.175.35.5.55c.325.2 2.3 3.52 5.58 4.8 2.73 1.06 3.28.85 4.45.74.325-.03 1.777-.727 2.027-1.424.25-.697.25-1.3 1.777-1.424z" />
      </svg>
    </a>
  )
}
