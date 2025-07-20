"use client"

import { createContext, useContext, ReactNode } from "react"
import type { Wallet } from "@/lib/types"

interface WalletContextType {
  wallet: Wallet
}

const WalletContext = createContext<WalletContextType | null>(null)

interface WalletProviderProps {
  wallet: Wallet
  children: ReactNode
}

export function WalletProvider({ wallet, children }: WalletProviderProps) {
  return (
    <WalletContext.Provider value={{ wallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  
  return context
}

export function useWalletSafe() {
  const context = useContext(WalletContext)
  return context
}